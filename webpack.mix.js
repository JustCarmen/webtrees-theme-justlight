/**
 * Laravel mix entry point
 *
 * Load the appropriate section
 */

if (process.env.section) {
    require(`${__dirname}/webpack.mix.${process.env.section}.js`);
}

let mix = require('laravel-mix');


mix
    // Disable mix-manifest.json (https://github.com/laravel-mix/laravel-mix/issues/580#issuecomment-919102692)
    // Prevent the distribution zip file from containing an unwanted file
    .options({
        manifest: false
    })
    // Show webpack warnings in console log
    .webpackConfig({
        stats: {
            children: true
        }
    });
