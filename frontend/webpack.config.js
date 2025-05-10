// const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");

// module.exports = {
//   // Entry point of the application
//   entry: "./src/index.js", // Adjust the path to your entry file

//   // Output configuration
//   output: {
//     path: path.resolve(__dirname, "dist"), // Output directory
//     filename: "bundle.js", // Output file
//     clean: true, // Clean the output directory before each build
//   },

//   // Module rules to handle different types of files
//   module: {
//     rules: [
//       {
//         test: /\.jsx?$/, // Matches .js and .jsx files
//         exclude: /node_modules/,
//         use: {
//           loader: "babel-loader",
//           options: {
//             presets: ["@babel/preset-env", "@babel/preset-react"], // React and modern JS support
//           },
//         },
//       },
//       {
//         test: /\.css$/, // Matches .css files
//         use: ["style-loader", "css-loader"], // Injects styles into the DOM
//       },
//     ],
//   },

//   // Resolve file extensions
//   resolve: {
//     extensions: [".js", ".jsx"], // Tell Webpack to resolve these extensions
//   },

//   // Configuration for development server (optional)
//   devServer: {
//     contentBase: path.join(__dirname, "dist"),
//     compress: true,
//     port: 3000, // You can choose a different port if needed
//     hot: true, // Enable hot module replacement
//   },

//   // Plugins configuration
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: "./public/index.html", // The HTML template for the app
//     }),
//   ],

//   // Development mode (fast builds with source maps)
//   mode: "development", // Change to 'production' for optimized builds
// };
const webpack = require("webpack");

module.exports = {
  // Your other Webpack configuration
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ],
};
