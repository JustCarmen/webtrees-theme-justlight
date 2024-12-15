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
    .copyDirectory(config.build_dir + '/css', config.dist_dir + '/resources/css')
    .copyDirectory(config.build_dir + '/js', config.dist_dir + '/resources/js')
    .copyDirectory(config.public_dir + '/fonts', config.dist_dir + '/resources/fonts')
    .copyDirectory(config.public_dir + '/lang', config.dist_dir + '/resources/lang')
    .copyDirectory(config.public_dir + '/views', config.dist_dir + '/resources/views')
    .copy('JustlightTheme.php', config.dist_dir)
    .copy('module.php', config.dist_dir)
    .copy('LICENSE.md', config.dist_dir)
    .copy('README.md', config.dist_dir)
    .clean();
