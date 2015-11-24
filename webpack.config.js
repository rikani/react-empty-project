'use strict';

const webpack = require('webpack');


module.exports = {
  context: __dirname + '/www/f/src',
  entry:   {
    app: './app'
  },
  output:  {
    path:          __dirname + '/www/f/assets',
    publicPath:    '/',
    filename:      '[name].bundle.js',
    library:       '[name]'
  },

  resolve: {
    extensions: ['', '.js']
  },

  module: {

    loaders: [{
      test: /\.js$/,
      include: __dirname + '/www/f/src',
      loader: 'babel?presets[]=react,presets[]=es2015'
    }, {
      test:   /\.scss$/,
      loader: 'style!css!resolve-url!sass?sourceMap'
    }, {
      test:   /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
      loader: 'file?name=[path][name].[ext]?[hash]'
    }]

  },

  devServer: {
    contentBase: __dirname + '/',
    hot: true
  }
};