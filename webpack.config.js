const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production"

  return {
    entry: "./src/index.tsx",
    output: {
      path: path.resolve(__dirname, "build"),
      filename: isProduction ? "bundle.[contenthash].js" : "bundle.js",
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        favicon: "./public/favicon.ico",
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, "public"),
      },
      compress: true,
      port: 3000,
      hot: true,
      open: true,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
  }
}
