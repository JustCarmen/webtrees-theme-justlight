/**
 * Laravel mix - JustLight theme
 * 
 * Output:
 * 		- dist
 *        - resources
 *          - css
 *          - fonts
 *          - views
 *        module.php
 *        LICENSE.md
 *        README.md
 *        
 */

let mix = require('laravel-mix');
let config = require('./webpack.mix.config');
require('laravel-mix-clean');

const dist_dir = 'dist/jc-theme-justlight';

//https://github.com/gregnb/filemanager-webpack-plugin
const FileManagerPlugin = require('filemanager-webpack-plugin');

mix
    .setPublicPath('./dist')
    .copyDirectory(config.public_dir, dist_dir + '/resources')
    .copy('module.php', dist_dir)
    .copy('LICENSE.md', dist_dir)
    .copy('README.md', dist_dir)
    .webpackConfig({
        plugins: [
          new FileManagerPlugin({
            onEnd: {
                archive: [
                    { source: './dist', destination: 'dist/justlight-2.0.7.zip'}
                  ]
            }
          })
        ]
    })
    .clean();
