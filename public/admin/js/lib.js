(function()
{
	window.lib = {};

	lib.template = new Template(
	{
		"element": document.getElementById("page")
	});

	lib.apiToken = "";

	lib.callAPI = function(method, args, cb)
	{
		if (lib.apiToken)
			args.token = lib.apiToken;
		args.m = method;

		var json = JSON.stringify(args);

		var xhr = new XMLHttpRequest();
		xhr.open("post", "api/");
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.send(json);

		xhr.onload = function()
		{
			if (xhr.responseText && cb)
				cb(JSON.parse(xhr.responseText));
			else if (cb)
				cb(false);
		}
	}

	lib.getCookie = function(name)
	{
		if (document.cookie.length === 0)
			return false;

		var cookies = document.cookie.split(";");
		var cookie = cookies.filter(function(cookie)
		{
			return cookie.split("=")[0] === name?true:false
		});

		return cookie[0].split("=")[1];
	}

	lib.setCookie = function(name, val)
	{
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
			"element": contentArea
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
})();
