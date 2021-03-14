/**
 * Laravel mix - JustLight theme
 *
 * Output:
 * 		- justlight-x.zip
 *
 */

let mix = require('laravel-mix');

//https://github.com/gregnb/filemanager-webpack-plugin
const FileManagerPlugin = require('filemanager-webpack-plugin');

mix.webpackConfig({
    plugins: [
        new FileManagerPlugin({
            events: {
                onEnd: {
                    archive: [{
                        source: './dist',
                        destination: 'dist/justlight-' + config.version + '.zip'
                    }]
                }
            }
        })
    ]
});
