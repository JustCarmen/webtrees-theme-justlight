/**
 * Laravel mix - JustLight theme
 *
 * Output:
 * 		- justlight-x.zip
 *
 */

let mix = require('laravel-mix');

const version = '2.0.11';

//https://github.com/gregnb/filemanager-webpack-plugin
const FileManagerPlugin = require('filemanager-webpack-plugin');

mix.webpackConfig({
    plugins: [
        new FileManagerPlugin({
            events: {
                onEnd: {
                    archive: [{
                        source: './dist',
                        destination: 'dist/justlight-' + version + '.zip'
                    }]
                }
            }
        })
    ]
});
