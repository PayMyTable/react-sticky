const path = require("path");
const webpack = require("webpack");

const isLive = process.env.NODE_ENV === "production";

module.exports = {
  mode: isLive ? "production" : "development",
  devtool: isLive ? "source-map" : "eval-cheap-source-map",
  entry: {
    demos: path.resolve("examples", "index.js")
  },
  output: {
    path: path.join(__dirname, "examples"),
    filename: "bundle.js",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "examples")
    },
    compress: true,
    port: 9000,
    historyApiFallback: true
  }
};
