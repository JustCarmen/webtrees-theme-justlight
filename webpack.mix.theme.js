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

//https://github.com/jakob101/postcss-inline-rtl
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
    .styles(config.public_dir + '/css/justlight.min.css', config.build_dir + '/justlight.min.css')
    .styles(config.public_dir + '/css/justblack.min.css', config.build_dir + '/justblack.min.css')
    .copy(config.vendor_build_dir + '/@fortawesome/fontawesome-free/webfonts/fa-solid*', config.public_dir + '/fonts')
    .copy(config.vendor_build_dir + '/@fortawesome/fontawesome-free/js/regular.min.js', config.public_dir + '/js/fa-regular.min.js')
    .copy(config.vendor_build_dir + '/@fortawesome/fontawesome-free/js/solid.min.js', config.public_dir + '/js/fa-solid.min.js')
} else {
    mix
    .setPublicPath('./')
    .sass('src/sass/justlight-theme.scss', config.public_dir + '/css/justlight.min.css')
    .sass('src/sass/justblack-theme.scss', config.public_dir + '/css/justblack.min.css')
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
