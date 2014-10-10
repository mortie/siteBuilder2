var path = require("path");
var fs = require("fs");

module.exports = function(cb)
{
	var self = this;

	++self.cbs
	self.db.query("getMedia", function(err, result)
	{
		self.logger.error("Couldn't get media!", err);

		result.forEach(function(media)
		{
			var fileName = path.join(
				self.outDir,
				"_media",
				media.id+"."+media.extension
			);

			self.logger.info("Writing media file '"+media.title+"'...");

			++self.cbs;
			fs.writeFile(fileName, media.content, function(err)
			{
				self.logger.error("Coludn't write media file!", err);

				--self.cbs;
			});
		});
		--self.cbs;
	});

	cb();
}
