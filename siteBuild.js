#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var Logger = require("logger");
var Database = require("database");
var SiteBuilder = require("siteBuilder");
var Template = require("template");

var conf;
var logger;
var db;
var builder;
var template;

//create logger instance
logger = new Logger(
{
	"log": false,
	"dir": null
});

//parse and read conf file
try
{
	conf = JSON.parse(fs.readFileSync("conf.json"));
}
catch (err)
{
	logger.error("Couldn't parse config file.", err);
}

//set logger's settings appropriately according to conf file
logger.log = conf.log;
logger.dir = conf.dir.log;

//connect to mysql database
try
{
	db = new Database(
	{
		"username": conf.sql.username,
		"password": conf.sql.password,
		"host": conf.sql.host,
		"port": conf.sql.port
	});
}
catch (err)
{
	logger.error("Couldn't connect to database.", err);
}

db.query("setup",
{
	"db": conf.sql.database
},
function(err)
{
	var templateDir = path.join(conf.dir.template, conf.template);

	template = new Template(
	{
		"path": templateDir,
		"suffix": ".html"
	});

	//create new site builder instance
	builder = new SiteBuilder(
	{
		"outDir": conf.dir.out,
		"themeDir": path.join(conf.dir.theme, conf.theme),
		"templateDir": templateDir,
		"db": db,
		"logger": logger,
		"template": template
	});

	//actually build site
	builder.build(function()
	{
		console.log("done");
	});
});
