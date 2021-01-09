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
const postcss_autoprefixer = require("autoprefixer")();

//https://github.com/jakob101/postcss-inline-rtl
const postcss_rtl = require("postcss-rtl")();

//https://github.com/gridonic/postcss-replace
const postcss_replace = require("postcss-replace")({
    data : {
        webtrees: config.webtrees_css_dir
    }
});

//https://github.com/bezoerb/postcss-image-inliner
const postcss_image_inliner = require("postcss-image-inliner")({
    assetPaths: [config.images_dir],
    maxFileSize: 0,
});

//https://github.com/postcss/postcss-custom-properties
//Enable CSS variables in IE
const postcss_custom_properties = require("postcss-custom-properties")();

if(process.env.NODE_ENV === 'production') {
    mix.styles(config.public_dir + '/css/justlight.min.css', config.build_dir + '/justlight.min.css')
} else {
    mix
    .setPublicPath('./')
    .sass('src/sass/theme.scss', config.public_dir + '/css/justlight.min.css')
    .options({
        processCssUrls: false,
        postCss: [
            postcss_replace,
            postcss_rtl,
            postcss_autoprefixer,
            postcss_image_inliner,
            postcss_custom_properties,
        ]
    })
    .webpackConfig({
        resolve: {
            alias: {
                '~build': path.resolve(config.build_dir)
            }
        }
    });
}
