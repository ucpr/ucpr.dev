module.exports = {
 entry: './src/App.tsx',
 resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  mode: "development",
  module: {
    rules: [
      { 
        test: /\.tsx?$/,
        //exclude: "",
        use: {
          loader: "ts-loader"
        }
      }
    ]
  },

  devServer: {
    contentBase: "dist",
    open: true
  }
};