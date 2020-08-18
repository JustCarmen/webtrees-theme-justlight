/**
 * Laravel mix - Mainstream webtrees base preparation
 * 
 * Output:
 * 		- vendor/fisharebest/webtrees/resources/css/_base.tmp.css
 */

let mix = require('laravel-mix');
let config = require('./webpack.mix.config');

//https://github.com/webpack-contrib/copy-webpack-plugin
const CopyPlugin = require('copy-webpack-plugin');

// This code needs to run before mainstream webtrees build
// It's purpose is to prevent the webtrees colorbox css from loading
mix.webpackConfig({
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: __dirname + '/' + config.webtrees_css_dir + '/_base.css',
            to: __dirname + '/' + config.webtrees_css_dir + '/_base.tmp.css',
            transform(content) {
                return content
                  .toString()
                  .replace('@import "_colorbox.css";', '/* @import "_colorbox.css"; */')
            },
          },
        ],
      }),
    ],
})