const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");


const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: {
    main: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'docs'),
    // filename: '[name].[extension]',
    clean: true,
  },
  watch: true,
  devServer: {
    static: './docs',
    host: 'localhost',
    port: 8082,
    //host: '0.0.0.0',
    // open: true,
    hot: true,
  },
  plugins: [
    new FaviconsWebpackPlugin({
      logo: './src/favicon.png',
      cache: true,
      inject: true,
    }),
    new MiniCssExtractPlugin({
      // filename: isProduction ? 'bundle.[fullhash].min.css' : '[name].css',
      filename: 'bundle.[fullhash].min.css',
    }),
    new CopyPlugin({
      patterns: [
        { from: "./src/assets", to: "assets" },
        { from: "./src/css", to: "css" },
        { from: "./src/fonts", to: "fonts" },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    // new WorkboxWebpackPlugin.GenerateSW(),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        include: path.resolve(__dirname, 'src'),
        exclude: ['/node_modules/'],
        options: {
            transpileOnly: true,
          },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: '/node_modules/',
      }
    ],
  },
  resolve: {
    // fallback: {
    //   zlib: require.resolve('browserify-zlib'),
    //   querystring: require.resolve("querystring-es3"),
    //   url: require.resolve("url/"),
    //   stream: require.resolve("stream-browserify"),
    //   util: require.resolve("util/"),
    //   path: require.resolve("path-browserify"),
    //   fs: require.resolve('browserify-fs'),
    //   assert: require.resolve("assert/"),
    //   https: require.resolve("https-browserify"),
    //   http: require.resolve("stream-http"),
    //   child_process: false,
    // },
    plugins: [new TsconfigPathsPlugin({
      // configFile: './tsconfig.json',
      extensions: [".js", ".jsx", ".ts", ".tsx", ".map"],
    })],
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
    minimize: true,
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
