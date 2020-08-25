/**
 * Laravel mix entry point
 *
 * Load the appropriate section
 */

if (process.env.section) {
    require(`${__dirname}/webpack.mix.${process.env.section}.js`);
}