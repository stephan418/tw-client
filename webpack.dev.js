const [commonReactConfig] = require('./webpack.common');
const { merge } = require('webpack-merge');

const reactConfig = merge(commonReactConfig, {
    mode: 'development',
    devServer: {
        historyApiFallback: true,
    },
});

module.exports = [reactConfig];
