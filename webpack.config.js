const path = require('path');
module.exports = {
  entry: './public/index.js',
  output: {
    path: path.join(__dirname, '/static'),
    publicPath: '/static',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ["es2015", "react"]
        }
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ["es2015", "react"]
        }
      }
    ]
  }
};