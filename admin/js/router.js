(function()
{
	window.Router = function(element)
	{
		this._panels = {};
		this._panel = "";
		this._element = element;
		this._enabled = true;
		this._ready = true;

		this._callbacks = {};

		window.addEventListener("load", function(e)
		{
			if (this._enabled)
				this.load();
		}.bind(this));

		window.addEventListener("hashchange", function(e)
		{
			this.load();
			this._panel = this.path.split("/")[0];
		}.bind(this));
	}

	window.Router.prototype =
	{
		get path()
		{
			return location.hash.substring(1);
		},

		set path(path)
		{
			if (!this._enabled || !this._ready) return false;

			if (path[0] === "/")
			{
				window.location = path;
			}
			else
			{
				this._panel = path.split("/")[0];
				location.hash = path;
			}
		},

		get element()
		{
			return this._element;
		},

		get panel()
		{
			return this._panel || location.hash.split("/")[0].substring(1);
		},

		"disable": function()
		{
			this._enabled = false;
		},

		"enable": function()
		{
			this._enabled = true;
		},

		"addPanel": function(name, f)
		{
			this._panels[name] = f;
		},

		"load": function(first)
		{
			if (this._ready)
			{
				this._ready = false;

				var path = location.hash.substring(1);

				var sections = path.split("/");
				var panel = sections[0];

				//prepare element
				this._element.className = path.replace(/\//g, " ");
				this._element.innerHTML = "";

				console.log("loading '"+panel+"'");
				this._emit("load", [first || false]);

				//execute page script
				this._panels[panel](sections);
			}
		},

		"ready": function()
		{
			this._emit("loaded");
			this._ready = true;
		},

		"on": function(e, func)
		{
			if (this._callbacks[e] === undefined)
				this._callbacks[e] = [];

			this._callbacks[e].push(func);
		},

		"_emit": function(e, args)
		{
			if (this._callbacks[e] !== undefined)
			{
				this._callbacks[e].forEach(function(func)
				{
					func.apply(null, args || []);
				});
			}
		}
	}
})();
