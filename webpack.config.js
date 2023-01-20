module.exports = {
    entry: './server.js',
    target: 'node',
    output: {
      path: __dirname + '/build',
      filename: 'app.bundle.js'
    },
    resolve: {
        fallback: {
          crypto: require.resolve('crypto-browserify'),
          "zlib": false ,
          "querystring": false,
          "stream": false,
          "path": false,
          "http": false,
          "util": false,
          "url": false,
        },
      },
  };
  