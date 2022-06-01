const path = require('path');
const ReactRefreshPlugin  = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';


module.exports = {
    mode: isDevelopment ? 'development' : 'production',
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/',
        clean: true,
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        client: {
            overlay: false,
            logging: 'warn',
        },
        open: true,
        port: 9000,
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {},
                    },
                    "css-loader",
                ],
            }
        ]
    },
    plugins: [
        isDevelopment && new ReactRefreshPlugin(),
        new MiniCssExtractPlugin({
            filename: isDevelopment ? "[name].css" : "[name].[contenthash].css",
            chunkFilename: isDevelopment ? "[id].css" : "[id].[contenthash].css",
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
    ].filter(Boolean),
    resolve: {
        extensions: ['.js', '.jsx'],
    },
}