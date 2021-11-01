/** @type {import('next').NextConfig} */

const ESLintPlugin = require("eslint-webpack-plugin");
const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `@import "variables.scss";`,
  },
  webpack(config) {
    config.plugins.push(
      new ESLintPlugin({
        // Plugin options
        extensions: ["js", "jsx", "ts", "tsx"],
        eslintPath: require.resolve("eslint"),
      })
    );

    return config;
  },
};
