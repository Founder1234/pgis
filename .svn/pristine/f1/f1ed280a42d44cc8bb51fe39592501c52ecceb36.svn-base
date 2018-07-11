var debug = process.env.NODE_ENV.trim() !== "production";
var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: __dirname,
    devtool: debug ? "inline-sourcemap" : null,
    entry: "./main.js",
    // entry: {
    //     component: "./index.js",
    //     lodash: ['lodash'],
    //     react: ['react'],
    //     jquery: ['jquery']
    // },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['react', 'es2015', 'stage-0']
            }
        }]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "bundle.min.js"
            //filename: "[name].min.js"
    },
    plugins: debug ? [] : [
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: ['jquery', 'react', 'lodash'],
        //     minChunks: Infinity
        // }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            mangle: false,
            sourcemap: false
        })
    ]
};