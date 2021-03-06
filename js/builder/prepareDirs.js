var ncp = require("ncp").ncp;
var fs = require("fs");
var mkdirp = require("mkdirp");
var path = require("path");

//list of directories to prepare
var dirs =
[
	"{outDir}",
	"{outDir}/admin",
	"{outDir}/_media",
	"{outDir}/_img",
	"{outDir}/_plugins",
	"{themeDir}",
	"{adminDir}",
	"{pluginDir}"
];

module.exports = function prepareDirs(cb)
{
	var self = this;

	self.logger.debug("Preparing dirs");

	//loop through desired dirs, creating them
	dirs.forEach(function createDir(dir)
	{
		//replace placeholders
		var path = dir.split("{outDir}").join(self.outDir)
		              .split("{themeDir}").join(self.themeDir)
		              .split("{adminDir}").join(self.adminDir)
		              .split("{pluginDir}").join(self.pluginDir);

		//create directory
		try
		{
			//mkdirp to create parent dirs if necessary
			mkdirp.sync(path);
		}
		catch (err)
		{
			self.logger.error("Could not create "+path+".", err);
		}
	});

	//copy admin dir to {outDir}/admin asynchronously.
	++self.cbs;
	ncp(self.adminDir, self.outDir+"/admin", function copyAdminDir(err)
	{
		self.logger.error("Could not copy admin dir.", err);

		--self.cbs;
	});

	cb();
}
