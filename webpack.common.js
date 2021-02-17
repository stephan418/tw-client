const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const reactConfig = {
    entry: './src/app.tsx',
    resolve: {
        alias: {
            ['@']: path.resolve(__dirname),
            '#': path.resolve(__dirname, 'src'),
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                include: /src/,
                use: [{ loader: 'ts-loader' }],
            },
            {
                test: /.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
        ],
    },
    output: {
        path: __dirname + '/dist',
        filename: 'app.js',
        publicPath: '/',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],
};

module.exports = [reactConfig];
