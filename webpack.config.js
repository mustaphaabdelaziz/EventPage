// const path = require("path");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const TerserPlugin = require("terser-webpack-plugin");
// const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// module.exports = {
//   entry: {
//     main: "./src/js/main.js",
//     styles: "./src/css/styles.js",
//   },
//   output: {
//     filename: "[name].bundle.js",
//     path: path.resolve(__dirname, "public/dist"),
//   },
//   module: {
//     rules: [
//       {
//         test: /\.css$/,
//         use: ["style-loader", "css-loader"],
//       },
//       {
//         test: /\.(png|jpe?g|gif|svg)$/i,
//         type: "asset/resource",
//         generator: {
//           filename: "assets/[hash][ext][query]",
//         },
//       },
//     ],
//   },
//   plugins: [
//     new MiniCssExtractPlugin({
//       filename: "[name].bundle.css",
//     }),
//   ],
//   optimization: {
//     minimize: true, // Enable minification
//   },
//   devServer: {
//     static: {
//       directory: path.join(__dirname, "public"),
//     },
//     compress: true,
//   },
// };
