module.exports = {
  entry: './static/js/entry.js',
  output: {
    path: './static/js/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }

}
