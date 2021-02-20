const [commonReactConfig] = require('./webpack.common');
const { merge } = require('webpack-merge');

const reactConfig = merge(commonReactConfig, {
    mode: 'production',
    output: {
        publicPath: './',
    }
});

module.exports = [reactConfig];
