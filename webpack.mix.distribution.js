/**
 * Laravel mix - JustLight theme
 *
 * Output:
 * 		- dist
 *      - jc-theme-justlight
 *        - resources
 *          - css (minified)
 *          - fonts
 *          - views
 *        module.php
 *        LICENSE.md
 *        README.md
 *      - justlight-x.zip
 *
 */

let mix = require('laravel-mix');
let config = require('./webpack.mix.config');
require('laravel-mix-clean');

//https://github.com/gregnb/filemanager-webpack-plugin
const FileManagerPlugin = require('filemanager-webpack-plugin');

mix
    .setPublicPath('./dist')
    .copyDirectory(config.public_dir + '/fonts', config.dist_dir + '/resources/fonts')
    .copyDirectory(config.public_dir + '/views', config.dist_dir + '/resources/views')
    .copy(config.build_dir + '/justlight.min.css', config.dist_dir + '/resources/css/justlight.min.css')
    .copy('module.php', config.dist_dir)
    .copy('LICENSE.md', config.dist_dir)
    .copy('README.md', config.dist_dir)
    .clean();
