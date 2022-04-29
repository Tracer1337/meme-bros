const path = require("path")
const webpack = require("webpack")
const { getWebpackTools } = require("react-native-monorepo-tools")
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const monorepoWebpackTools = getWebpackTools();

module.exports = {
  babel: {
    presets: ["module:metro-react-native-babel-preset", "@babel/preset-react"]
  },
  webpack: {
    configure: (webpackConfig) => {
      // Allow importing from external workspaces.
      monorepoWebpackTools.enableWorkspacesResolution(webpackConfig);
      // Ensure nohoisted libraries are resolved from this workspace.
      monorepoWebpackTools.addNohoistAliases(webpackConfig);
      // Enable support for .web.tsx components
      webpackConfig.resolve.extensions.unshift("web.ts", "web.tsx")
      webpackConfig.module.rules.push(
        // Enable font import
        {
          test: /\.ttf$/,
          loader: 'file-loader',
          include: path.resolve(__dirname, './static/media/[name].[ext]'),
        },
      );
      webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin())
      return webpackConfig;
    },
    alias: {
      "react-native-fast-image": "react-native-scalable-image"
    },
    plugins: [
      // Inject the React Native "__DEV__" global variable.
      new webpack.DefinePlugin({
        __DEV__: process.env.NODE_ENV !== "production",
      }),
      // Make ``import React from 'react'`` optional
      new webpack.ProvidePlugin({
        React: 'react',
      }),
    ],
  },
};
