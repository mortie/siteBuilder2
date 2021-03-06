(function()
{
	window.lib = {};

	lib.template = new Template(
	{
		"element": document.getElementById("panel")
	});

	lib.apiToken = "";

	lib.callAPI = function(method, args, cb)
	{
		if (lib.apiToken)
			args.token = lib.apiToken;

		var json = JSON.stringify(args);

		var xhr = new XMLHttpRequest();
		xhr.open("post", "api/?method="+method);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.send(json);

		xhr.onload = function()
		{
			if (xhr.responseText && cb)
			{
				try
				{
					var obj = JSON.parse(xhr.responseText);
					if (!obj.success)
						console.log("Error!", xhr.responseText);
					if (cb)
						cb(obj);
				}
				catch (e)
				{
					console.log(e, xhr.responseText);
				}
			}
			else if (cb)
			{
				cb(false);
			}
		}
	}

	lib.getCookie = function(name)
	{
		if (window.localStorage !== undefined)
		{
			return localStorage.getItem(name);
		}
		else
		{
			if (document.cookie.length === 0)
				return false;

			var cookies = document.cookie.split(/\s*;\s*/);
			var cookie = cookies.filter(function(cookie)
			{
				return cookie.split("=")[0] === name?true:false
			});

			if (cookie[0])
				return cookie[0].split("=")[1];
			else
				return false;
		}
	}

	lib.setCookie = function(name, val)
	{
		if (window.localStorage !== undefined)
			localStorage.setItem(name, val);
		else
			document.cookie = name+"="+val;
	}

	lib.editor = function(element)
	{
		var contentArea = document.getElementById("content");
		var submitButton = document.getElementById("submit");
		var titleField = document.getElementById("title");
		var slugField = document.getElementById("slug");

		var editor = new Editor(
		{
			"element": contentArea,
			"toolbar": [
				{name: 'bold', action: Editor.toggleBold},
				{name: 'italic', action: Editor.toggleItalic},
				'|',

				{name: 'quote', action: Editor.toggleBlockquote},
				{name: 'unordered-list', action: Editor.toggleUnOrderedList},
				{name: 'ordered-list', action: Editor.toggleOrderedList},
				'|',

				{name: 'link', action: Editor.drawLink},
				{name: 'image', action: function()
				{
					gui.mediaSelect(function(fileName, title)
					{
						editor.codemirror.doc.replaceSelection("!["+title+"](/_media/"+fileName+")");
					});
				}},
				'|',

				{name: 'info', action: 'http://lab.lepture.com/editor/markdown'},
				{name: 'preview', action: Editor.togglePreview},
				{name: 'fullscreen', action: Editor.toggleFullScreen}
			]
		});

		editor.title = titleField;
		editor.slug = slugField;

		submitButton.addEventListener("click", function()
		{
			if (typeof editor.onsubmit === "function")
				editor.onsubmit();
		});

		return editor;
	}

	lib.fileUpload = function(form, cb)
	{
		var action_url = "api/?form=uploadMedia";

		// Create the iframe...
		var iframe = document.createElement("iframe");
		iframe.setAttribute("id", "upload_iframe");
		iframe.setAttribute("name", "upload_iframe");
		iframe.setAttribute("width", "0");
		iframe.setAttribute("height", "0");
		iframe.setAttribute("border", "0");
		iframe.setAttribute("style", "width: 0; height: 0; border: none;");

		// Add to document...
		form.parentNode.appendChild(iframe);
		window.frames['upload_iframe'].name = "upload_iframe";

		iframeId = document.getElementById("upload_iframe");

		// Add event...
		var eventHandler = function()
		{
			if (iframeId.detachEvent) iframeId.detachEvent("onload", eventHandler);
			else iframeId.removeEventListener("load", eventHandler, false);

			// Message from server...
			if (iframeId.contentDocument)
				content = iframeId.contentDocument.body.innerHTML;
			else if (iframeId.contentWindow)
				content = iframeId.contentWindow.document.body.innerHTML;
			else if (iframeId.document)
				content = iframeId.document.body.innerHTML;

			cb(content);

			// Del the iframe...
			setTimeout('iframeId.parentNode.removeChild(iframeId)', 250);
		}

		if (iframeId.addEventListener)
			iframeId.addEventListener("load", eventHandler, true);
		if (iframeId.attachEvent)
			iframeId.attachEvent("onload", eventHandler);

		// Set properties of form...
		form.setAttribute("target", "upload_iframe");
		form.setAttribute("action", action_url);
		form.setAttribute("method", "post");
		form.setAttribute("enctype", "multipart/form-data");
		form.setAttribute("encoding", "multipart/form-data");

		// Submit the form...
		form.submit();
	}

	lib.slugify = function(title)
	{
		return title.toLowerCase()
		            .replace(/[^a-zA-Z0-9\s]/g, "")
		            .replace(/\s+/g, "-");
	}

	lib.Async = function(times, f)
	{
		return function()
		{
			if (times > 1)
				--times;
			else
				f();
		}
	}
})();
