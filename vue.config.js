const EnvironmentPlugin = require('./webpack_plugin/environment-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    // 基本路径
    publicPath: process.env.NODE_ENV === 'production' ? '././' : '/',
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    // 服务器端口号
    devServer: {
        host: 'localhost',
        port: 8092,
        hotOnly: false,
        open: true,
    },
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        // 默认: 生产环境下是 true，开发环境下是 false
        // extract: true,

        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {},
        // 启用 CSS modules for all css / pre-processor files.
        modules: false
    },
    parallel: require('os').cpus().length > 1,

    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('prefetch');
        config.plugins.delete('preload');
    },

    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            config.plugins.push(new EnvironmentPlugin({
                filename: "index.html",
                envs: ["BASE_API_URL"],
            }));
        }
    }
};