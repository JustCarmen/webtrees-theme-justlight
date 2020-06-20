/**
 * Laravel mix - Mainstream webtrees base
 * 
 * Output:
 * 		- webtrees.base.css
 */

let mix = require('laravel-mix');
let config = require('./webpack.mix.config');

//https://github.com/bezoerb/postcss-image-inliner
const postcss_image_inliner = require("postcss-image-inliner")({
    assetPaths: [config.webtrees_css_dir],
    maxFileSize: 0,
});

// see: webtrees - resources/css/vendor.css. 
// We need to compile it again because we don't want bootstrap inside this package.
mix.styles([
    config.webtrees_npm_dir + '/datatables.net-bs4/css/dataTables.bootstrap4.css',
    config.webtrees_css_dir + '/begin-ignore-rtl.css',
    config.webtrees_npm_dir + '/select2/dist/css/select2.min.css',
    config.webtrees_css_dir + '/end-ignore-rtl.css',
    config.webtrees_npm_dir + '/typeahead.js-bootstrap4-css/typeaheadjs.css',
    config.webtrees_npm_dir + '/leaflet/dist/leaflet.css',
    config.webtrees_npm_dir + '/beautifymarker/leaflet-beautify-marker-icon.css',
    config.webtrees_npm_dir + '/leaflet-control-geocoder/dist/Control.Geocoder.css',
    config.webtrees_npm_dir + '/leaflet.markercluster/dist/MarkerCluster.Default.css',
    config.webtrees_npm_dir + '/leaflet.markercluster/dist/MarkerCluster.css',
    config.webtrees_css_dir + '/_vendor-patches.css'
], config.webtrees_css_dir + '/webtrees.vendor.css');

mix
    .setPublicPath(config.build_dir)
    .postCss(config.webtrees_css_dir + '/_base.css' ,  config.build_dir + '/webtrees.base.css')
    .postCss(config.build_dir + '/webtrees.vendor.css' ,  config.build_dir + '/webtrees.vendor.css')    
    .options({
        processCssUrls: false,
        postCss: [
            postcss_image_inliner,
        ]
    });
