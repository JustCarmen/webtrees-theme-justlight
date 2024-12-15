/**
 * Laravel mix - JustLight theme
 *
 * Output:
 * 		- justlight.min.css
 */

let mix = require('laravel-mix');
let config = require('./webpack.mix.config');
const path = require("path");

//https://github.com/postcss/autoprefixer
const postcssAutoprefixer = require("autoprefixer")();

// https://github.com/elchininet/postcss-rtlcss
const postcssRTLCSS = require('postcss-rtlcss')({safeBothPrefix: true});

//https://github.com/bezoerb/postcss-image-inliner
const postcssImageInliner = require('postcss-image-inliner')({
    assetPaths: [config.images_dir, config.webtrees_css_dir],
    maxFileSize: 0,
});

// https://github.com/postcss/postcss-custom-properties
// Enable CSS variables in IE
const postcssCustomProperties = require('postcss-custom-properties')();

if(process.env.NODE_ENV === 'production') {
    mix
    .styles(config.public_dir + '/css/justlight.min.css', config.build_dir + '/css/justlight.min.css')
    .styles(config.public_dir + '/css/justblack.min.css', config.build_dir + '/css/justblack.min.css')
    .minify(config.public_dir + '/js/vendor.min.js', config.build_dir + '/js/vendor.min.js')
} else {
    mix
    .setPublicPath('./')
    .sass('src/sass/justlight-theme.scss', config.public_dir + '/css/justlight.min.css')
    .sass('src/sass/justblack-theme.scss', config.public_dir + '/css/justblack.min.css')
    .js('src/js/vendor.js', config.public_dir + '/js/vendor.min.js')
    .options({
        processCssUrls: false,
        postCss: [
            postcssRTLCSS,
            postcssAutoprefixer,
            postcssImageInliner,
            postcssCustomProperties
        ]
    })
    .webpackConfig({
        resolve: {
            alias: {
                'build': path.resolve(config.css_dir)
            }
        }
    });
}
