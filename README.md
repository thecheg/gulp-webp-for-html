# gulp-webp-for-html
Replaces `<img />` with `<picture />` for WebP
## Example
```html
// Input
<img src="/images/image.jpg">

// Output
<picture>
	<source srcset="/images/image.webp" type="image/webp">
	<source srcset="/images/image.jpg" type="image/jpeg">
	<img src="/images/image.jpg">
</picture>
```
### Supported extensions
- `.jpg`, `.jpeg`, `.JPG`, `.JPEG`
- `.png`, `.PNG`
- `.svg`, `.SVG`
- `.gif`, `.GIF`
- `.avif`, `.AVIF`
- `.tif`, `.tiff`, `.TIF`, `.TIFF`
- `.ico`, `.ICO`
## Install
```bash
npm i gulp-webp-for-html --save-dev
```
## Usage
```javascript
var webphtml = require('gulp-webp-for-html');
gulp.task('html',function(){
	gulp.src('./assets/**/*.html')
		.pipe(webphtml())
		.pipe(gulp.dest('./public/'))
});
```
### Options
Pass extensions array as argument to specify files for WebP supporting:
```javascript
var webphtml = require('gulp-webp-for-html');
gulp.task('html',function(){
	gulp.src('./assets/**/*.html')
		.pipe(webphtml(
			['.jpg', '.png', '.gif']
		))
		.pipe(gulp.dest('./public/'))
});
```