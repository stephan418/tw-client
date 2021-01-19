const [commonReactConfig] = require('./webpack.common');
const merge = require('webpack-merge');

const reactConfig = merge(commonReactConfig, {
    mode: 'production',
});

module.exports = [reactConfig];
