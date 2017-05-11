const webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: [
        './src/app'
    ],

    output: {
        path: path.join(__dirname, '/dist'),
        publicPath: '/',
        filename: 'bundle.js'
    },

    devtool: 'source-map',

    plugins: [],

    resolve:{
        extensions: ['.js', '.jsx'],
        enforceExtension: false
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: ['transform-decorators-legacy'],
                        presets: ['es2015', 'react', 'stage-0']
                    }
                }
            },
            {
                test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
                loader: 'url-loader'
            }
        ]
    }

};
