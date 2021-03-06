(function()
{
	window.nav = {};

	nav.load = function()
	{
		populateDropdowns(function()
		{
			draw();
		});
	}

	var template = new Template(
	{
		"element": document.getElementById("nav")
	});

	var navElement = document.getElementById("nav");

	var panels =
	[
		["Pages", "pages"],
		["New", [], "new"],
		["Posts", [], "posts"],
		["Media", "media"],
		["Settings", "settings"],
		["Plugins", "plugins"],
		["Build", "build"],
		["Update", "update"],
		["Log Out", "logout"]
	]

	var wrapper = document.getElementById("nav-wrapper");

	var async = new lib.Async(3, draw);

	populateDropdowns(async);

	template.load(
	[
		"navEntry",
		"navEntryDropdown",
		"navEntryDropdownChild"
	], async)

	router.on("load", function(first)
	{
		async();
	});

	function draw()
	{
		navElement.innerHTML = "";
		panels.forEach(function(panel)
		{
			if (typeof panel[1] === "string")
				drawWithoutDropdown(panel);
			else
				drawWithDropdown(panel);
		});

		//horrible hack to circumvent CSS limitations
		gui.on(".navEntry", ["mouseover", "mouseout", "touchstart", "touchend"], function()
		{
			wrapper.style.width = navElement.scrollWidth+20+"px";
		});

		wrapper.style.width = navElement.scrollWidth+20+"px";

		gui.on("#nav .navLink", "click", function(elem)
		{
			var targetPath = elem.getAttribute("data-targetPath");
			if (targetPath)
				router.path = targetPath;
		});
	}

	function drawWithoutDropdown(panel)
	{
		if (router.panel === panel[1])
			var current = "current";
		else
			var current = "";

		template("navEntry",
		{
			"name": panel[0],
			"current": current,
			"targetPath": panel[1]
		});
	}

	//I'm sorry...
	function drawWithDropdown(panel)
	{
		if (router.panel === panel[2])
			var current = "current";
		else
			var current = "";

		var dropdown = "";

		if (panel[1])
		{
			var children = [];
			panel[1].forEach(function(p)
			{
				var parentId = p.parent_page_id;

				if (parentId)
				{
					if (router.panel === panel[2] && router.path.split("/")[1] === p.id)
						var current = "current";
					else
						var current = "";

					if (!children[parentId])
						children[parentId] = "";

					children[parentId] += template("navEntryDropdownChild",
					{
						"name": p.title,
						"current": current,
						"targetPath": panel[2]+"/"+p.id
					}, false);
				}
			});

			panel[1].forEach(function(p)
			{
				if (!p.parent_page_id)
				{
					if (router.panel === panel[2] && router.path.split("/")[1] === p.id)
						var current = "current";
					else
						var current = "";

					dropdown += template("navEntryDropdown",
					{
						"name": p.title,
						"current": current,
						"targetPath": panel[2]+"/"+p.id
					}, false);

					dropdown += children[p.id] || "";
				}
			});
		}

		template("navEntry",
		{
			"name": panel[0],
			"current": current,
			"dropdown": dropdown,
			"hasDropdown": "hasDropdown"
		});
	}

	function populateDropdowns(cb)
	{
		lib.callAPI("getPages", {}, function(result)
		{
			panels = panels.map(function(p)
			{
				if (typeof p[1] === "string")
				{
					return p;
				}
				else
				{
					p[1] = result.pages;
					return p;
				}
			});
			cb();
		});
	}
})();
