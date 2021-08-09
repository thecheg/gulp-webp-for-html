"use strict";
/* gulp-webp-for-html */
/*!
* index.js
*
* Inspired by gulp-webp-html & gulp-xv-webp-html
*/

const pluginName = 'gulp-webp-for-html'

const gutil = require('gulp-util')
const PluginError = gutil.PluginError

const through = require('through2')


module.exports = function (extensions) {
	// support extensions in lower/upper case
	var extensions = extensions || ['.jpg', '.png', '.gif', '.jpeg','.avif', '.svg', '.tif', '.tiff', '.ico', '.JPG', '.PNG', '.GIF', '.JPEG', '.AVIF', '.SVG', '.TIF', '.TIFF', '.ICO'];
	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file)
			return
		}

		if (file.isStream()) {
			cb(new PluginError(pluginName, 'Streaming not supported'))
			return
		}

		try {
			var inPicture = false

			const data = file.contents
				.toString()
				.split('\n')
				.map(function (line) {
					/* inside/outside of tag <picture> ? */
					if (line.indexOf('<picture') + 1) inPicture = true
					if (line.indexOf('</picture') + 1) inPicture = false

					/* check image tag <img> */
					if (line.indexOf('<img') + 1 && !inPicture) {
						/* extract each image src */
						var Re =  /<img([^>]+)src=[\"\'](\S+)[\"\']([^>\/]+)\/?>/gi
						var regexpArray = Re.exec(line)
						var imgTag = regexpArray[0]     // orig image tag
						var srcImage = regexpArray[2]   // src URL
						var newWebpUrl = srcImage       // for new URL
						var mime = '';

						/* exit if in URL .webp */
						if (srcImage.indexOf('.webp') + 1) return line

						extensions.forEach(ext => {
							if ( srcImage.indexOf(ext) == -1 ) {
								// doesn't require replacement
								return line;

							} else {
								/* replace all occurrences of the extensions */
								// console.log(newWebpUrl + ' <---REPLACE');
								newWebpUrl = newWebpUrl.replace(ext, '.webp')

								/* switch MIME types */
								switch (ext) {
									case '.jpg':
									case '.jpeg':
									case '.JPG':
									case '.JPEG':
										mime = 'image/jpeg';
										break;

									case '.png':
									case '.PNG':
										mime = 'image/png';
										break;

									case '.svg':
									case '.SVG':
										mime = 'image/svg+xml';
										break;

									case '.avif':
									case '.AVIF':
										mime = 'image/avif';
										break;

									case '.gif':
									case '.GIF':
										mime = 'image/gif';
										break;

									case '.ico':
									case '.ICO':
										mime = 'image/vnd.microsoft.icon';
										break;

									case '.tif':
									case '.tiff':
									case '.TIF':
									case '.TIFF':
										mime = 'image/tiff';
										break;
	
									default:
										mime = 'image/jpeg';
								}

								line = `
									<picture>
										<source srcset="${newWebpUrl}" type="image/webp">
										<source srcset="${srcImage}" type="${mime}">
										${imgTag}
									</picture>
								`
							}
						});

						return line
					}
					return line
				})
				.join('\n')

			file.contents = new Buffer.from(data)

			this.push(file)
		} catch (err) {
			this.emit('error', new PluginError(pluginName, err))
		}

		cb()
	})
}
