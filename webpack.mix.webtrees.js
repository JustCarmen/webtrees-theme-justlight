/**
 * Laravel mix - Mainstream webtrees base
 *
 * Output:
 *    	- webtrees.base.css
 *      - webtrees.colorbox.css
 *      - webtrees.vendor.css
 *
 */

let mix = require('laravel-mix');
let config = require('./webpack.mix.config');

//https://github.com/bezoerb/postcss-image-inliner
const postcssImageInliner = require('postcss-image-inliner')({
    assetPaths: [config.webtrees_css_dir, config.vendor_build_dir + '/jquery-colorbox/example1/'],
    maxFileSize: 0
});

//https://www.npmjs.com/package/postcss-discard-comments
const postcssDiscardComments = require("postcss-discard-comments")();

//https://github.com/gregnb/filemanager-webpack-plugin
const FileManagerPlugin = require('filemanager-webpack-plugin');

// see: webtrees - resources/css/vendor.css.
// We need to compile it again because we don't want bootstrap inside this package.
// run npm install in vendor/fisharebest/webtrees to install dependencies.
mix
    .setPublicPath(config.css_dir)
    .styles([
        config.vendor_build_dir + '/datatables.net-bs5/css/dataTables.bootstrap5.css',
        config.webtrees_css_dir + '/begin-ignore-rtl.css',
        config.vendor_build_dir + '/tom-select/dist/css/tom-select.min.css',
        config.vendor_build_dir + '/tom-select/dist/css/tom-select.bootstrap5.min.css',
        config.webtrees_css_dir + '/end-ignore-rtl.css',
        config.vendor_build_dir + '/typeahead.js-bootstrap4-css/typeaheadjs.css',
        config.vendor_build_dir + '/leaflet/dist/leaflet.css',
        config.vendor_build_dir + '/beautifymarker/leaflet-beautify-marker-icon.css',
        config.vendor_build_dir + '/leaflet-control-geocoder/dist/Control.Geocoder.css',
        config.vendor_build_dir + '/leaflet.markercluster/dist/MarkerCluster.Default.css',
        config.vendor_build_dir + '/leaflet.markercluster/dist/MarkerCluster.css',
        config.vendor_build_dir + '/leaflet.control.layers.tree/L.Control.Layers.Tree.css',
        config.webtrees_css_dir + '/_vendor-patches.css'
    ], config.css_dir + '/webtrees.vendor.css')
    .postCss(config.vendor_build_dir + '/jquery-colorbox/example1/colorbox.css', config.css_dir + '/webtrees.colorbox.css')
    .postCss(config.webtrees_css_dir + '/_base.tmp.css', config.css_dir + '/webtrees.base.css')
    .options({
        processCssUrls: false,
        postCss: [
            postcssImageInliner,
            postcssDiscardComments
        ]
    })
    .webpackConfig({
        plugins: [
            new FileManagerPlugin({
                events: {
                    onEnd: {
                        delete: [
                            __dirname + '/' + config.webtrees_css_dir + '/_base.tmp.css'
                        ]
                    }
                }
            })
        ]
    });
