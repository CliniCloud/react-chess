/* eslint-disable no-process-env */
'use strict'

const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: [path.join(__dirname, 'src', 'react-chess.js')],
  output: {
    library: 'reactChess',
    libraryTarget: 'umd',
    path: path.join(__dirname, 'umd'),
    filename: 'react-chess.js'
  },
  externals: {
    react: {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react'
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
}
