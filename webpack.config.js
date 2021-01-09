const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {

    mode: "development",
    devtool: "source-map",

    resolve: {
        extensions: [".ts",".js"],
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
            {
              test: /\.js$/,
              loader: "ts-loader",
              exclude: /node_modules/,
          },
        ],
    },

    entry: {
        main: path.resolve(__dirname, './src/index.ts'),
    },


    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
    },


    plugins: [
        new HtmlWebpackPlugin({
            title: 'JavaScript-инженер',
            template: path.resolve(__dirname, './index.html'), // шаблон
            filename: 'index.html', // название выходного файла
        }),
    ],
}