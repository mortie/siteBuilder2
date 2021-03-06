window.q = function(str, elem)
{
	elem = elem || {};
	if (str)
		return new QElementList((elem.element || document).querySelectorAll(str));
	else
		return new QElement(window);
}

window.q.caches = {};

window.q.ajax = function(method, url, content, cb)
{
	var xhr = new XMLHttpRequest();
	xhr.open(method, url);
	xhr.send(content);

	xhr.onload = function()
	{
		cb(xhr.responseText);
	}
}

window.q.get = function(url, cb)
{
	window.q.ajax("get", url, "", cb);
}

window.q.post = function(url, content, cb)
{
	window.q.ajax("post", url, content, cb);
}

window.q.widgetify = function(name, cb)
{
	caches = window.q.caches;

	//get widgets and cache them if they aren't yet
	if (!caches.widgets)
	{
		caches.widgets = {};

		var widgets = document.getElementsByTagName("x-widget");
		for (var i in widgets)
		{
			var w = widgets[i];
			if (!caches.widgets[w.className])
				caches.widgets[w.className] = [];

			caches.widgets[w.className].push(w);
		}
	}

	caches.widgets[name].forEach(function(w)
	{
		vals = w.innerHTML.split(/\,/g).map(function(v)
		{
			return v.trim();
		});

		cb(new QElementList([w]), vals);
	});
}

var QElement = function(element)
{
	this.element = element;
}

QElement.prototype =
{
	"on": function(evt, cb)
	{
		if (evt == "tap")
		{
			var startX;
			var startY;

			this.element.addEventListener("touchstart", function(e)
			{
				startX = e.pageX;
				startY = e.pageY;
			}, false);


			this.element.addEventListener("touchend", function(e)
			{
				if ((Math.abs(startX - e.pageX) < 32)
				||  (Math.abs(startY - e.pageY) < 32))
				{
					cb(e);
				}
			}, false);
		}
		else
		{
			this.element.addEventListener(evt, cb, false);
		}
	},

	"delete": function()
	{
		deleteElement(this.element);
	},

	"get": function(key)
	{
		return this.element[key]
	},

	"set": function(key, val)
	{
		this.element[key] = val;
	},

	"data": function(key, val)
	{
		if (val === undefined)
		{
			return this.element.getAttribute("data-"+key);
		}
		else
		{
			this.element.setAttribute("data-"+key, val);
		}
	}
}

var QElementList = function(elementList)
{
	this.elements = [];
	for (var i=0; i<elementList.length; ++i)
	{
		this.elements.push(new QElement(elementList[i]));
	}
}

QElementList.prototype =
{
	"on": function(evt, cb)
	{
		this.elements.forEach(function(element){
			element.on(evt, function(e)
			{
				cb(e, element);
			});
		});
	},

	"delete": function()
	{
		this.elements.forEach(function(element){ element.delete() });
	},

	"get": function(key)
	{
		var vals = [];
		this.elements.forEach(function(element){ vals.push(element.get(key)) });
		if (vals.length === 1)
			return vals[0];
		else
			return vals;
	},

	"set": function(key, val)
	{
		this.elements.forEach(function(element){ element.set(key, val) });
	},

	"data": function(key, val)
	{
		var vals = [];
		this.elements.forEach(function(element){ vals.push(element.data(key, val)) });
		if (val !== undefined)
		{
			if (vals.length == 1)
				return vals[0];
			else
				return vals;
		}
	},

	"forEach": function(cb)
	{
		Array.prototype.forEach.call(this.elements, cb);
	}
}

function deleteElement(element)
{
	while (this.element.firstChild)
	{
		deleteElement(this.element.firstChild);
	}
	element.parentNode.removeChild(element);
}
