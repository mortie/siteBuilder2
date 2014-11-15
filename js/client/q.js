window.q = function(str, elem)
{
	if (str)
		return new QElementList((elem || document).querySelectorAll(str));
	else
		return new QElement(document);
}

window.q.caches = {};

window.q.widgetify = function(name, cb)
{
	caches = window.q.caches;

	//get widgets and cache them if they aren't yet
	if (!caches.widgets)
	{
		caches.widgets = {};

		var widgets = document.querySelectorAll("x-widget");
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
		vals = w.innerHTML.split(/\s+/g).map(function(v)
		{
			return v.trim();
		});

		cb(w, vals);
	});
}

var QElement = function(element)
{
	this.element = element;
}

QElement.prototype =
{
	"on": function(event, cb)
	{
		if (event == "tap")
		{
			shouldTap = false;

			this.element.addEventListener("touchstart", function()
			{
				shouldTap = true;
			}, false);

			this.element.addEventListener("touchmove", function()
			{
				shouldTap = false;
			}, false);

			this.element.addEventListener("touchend", function()
			{
				if (shouldTap)
					cb()
			}, false);
		}
		else
		{
			this.element.addEventListener(event, cb, false);
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

	"add": function(key, val)
	{
		this.element[key] += val;
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
	for (element in elementList)
	{
		this.elements.push(new QElement(element));
	}
}

QElementList.prototype =
{
	"on": function(e, cb)
	{
		this.elements.forEach(function(element){ element.on(e, cb) });
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

	"add": function(key, val)
	{
		this.elements.forEach(function(element){ element.add(key, val) });
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
