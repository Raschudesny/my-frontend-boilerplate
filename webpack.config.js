const path = require('path');
const webpack = require('webpack');

// all used webpack plugins
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const {DuplicatesPlugin} = require('inspectpack/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// directories
const FRONTEND_SRC_DIR = path.join(__dirname, 'src');
const BUNDLE_OUTPUT_DIR = path.join(__dirname, 'dist');
const NODE_MODULES_DIR = path.join(__dirname, 'node_modules');
const PUBLIC_DIR = path.join(__dirname, 'public');

//so this is an object which module.exports should return
const config = {
  target: 'web',
  context: FRONTEND_SRC_DIR,
  entry: {
    'app_entry': [path.join(FRONTEND_SRC_DIR, 'index.tsx')],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(svg|png)$/,
        use: [
          'file-loader',
        ],
      }
    ],
  },
  plugins: [
    new WebpackBar(),
    new HtmlWebpackPlugin({
      template: path.join(PUBLIC_DIR, '/index.html')
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    sourceMapFilename: 'assets/[file].map[query]',
    path: path.resolve(BUNDLE_OUTPUT_DIR),
  },
  optimization: {
    chunkIds: 'named',
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -20,
          chunks: 'all',
        },
      },
    },
  },
};



module.exports = (env, argv = {mode: 'development'}) => {
  config.mode = argv.mode;

  if (argv.mode === 'development') {
  	// source map turn on
  	config.devtool = 'eval-source-map';

  	// watch source files
    config.watch = true;
    config.watchOptions = {
      aggregateTimeout: 2000,
    };

    config.devServer = {
      contentBase: FRONTEND_SRC_DIR,
      watchContentBase: true,
      open: true,
      port: 9000,
      compress: true,
      overlay: {
        warnings: true,
        errors: true
      },
    };

  } else if (argv.mode === 'production') {
  	 process.env.NODE_ENV = 'production';

    if (argv.analyze) {
      // pushing webpack bundle analyzing plugins
      config.plugins.push(new DuplicatesPlugin());
      config.plugins.push(new BundleAnalyzerPlugin());
    }
    config.plugins.push(new CleanWebpackPlugin());
  }
  return config;
};
