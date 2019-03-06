var path = require("path");
var htmlwebpackplugin = require("html-webpack-plugin");
var webpack = require("webpack");

const dev = Boolean(process.env.WEBPACK_SERVE);

module.exports = {
    entry: {
        index: ["./public/src/root/index.js"],
        person:["./public/src/root/person.js"],
        register:["./public/src/root/register.js"],
        login:["./public/src/root/login.js"],
        registermobile: ["./public/mobile/root/register.js"],
        loginmobile: ["./public/mobile/root/login.js"],
        reservationmobile: ["./public/mobile/root/reservation.js"]
    },
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        // filename: "js/[name]-[chunkhash].js",
        filename: "js/[name].bundle.js"
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: path.resolve(__dirname, "node_modules"),
                include: path.resolve(__dirname, "public"),
                loader: "babel-loader",
                query: { //babel参数配置
                    "presets": ["env", "react"]
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?importLoaders=1!postcss-loader'
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!postcss-loader!sass-loader'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(jpg|png|gif|svg|mp3|ico)$/i,
                loader: 'url-loader',
                query: {
                    limit: 20000,
                    name: '[name]-[hash:5].[ext]',
                    outputPath: 'images/'
                }
            }
        ]
    },
    plugins: [
        new htmlwebpackplugin({
            filename: 'register-mobile.html',
            template: './public/src/index-mobile.html',
            chunks: ['registermobile'],
            favicon: './public/src/20181101101247273_easyicon_net_32.ico',
            outputPath: 'images/',
        }),
        new htmlwebpackplugin({
            filename: 'login-mobile.html',
            template: './public/src/index-mobile.html',
            chunks: ['loginmobile'],
            favicon: './public/src/20181101101247273_easyicon_net_32.ico',
            outputPath: 'images/',
        }),
        new htmlwebpackplugin({
            filename: 'reservation-mobile.html',
            template: './public/src/index-mobile.html',
            chunks: ['reservationmobile'],
            favicon: './public/src/20181101101247273_easyicon_net_32.ico',
            outputPath: 'images/',
        }),
        new htmlwebpackplugin({
            filename: 'login.html',
            template: './public/src/index.html',
            chunks: ['login'],
            favicon: './public/src/20181101101247273_easyicon_net_32.ico',
            outputPath: 'images/',
        }),
        new htmlwebpackplugin({
            filename: 'index.html',
            template: './public/src/index.html',
            chunks: ['index'],
            favicon: './public/src/20181101101247273_easyicon_net_32.ico',
            outputPath: 'images/',
        }),
        new htmlwebpackplugin({
            filename: 'register.html',
            template: './public/src/index.html',
            chunks: ['register'],
            favicon: './public/src/20181101101247273_easyicon_net_32.ico',
            outputPath: 'images/',
        }),
        new htmlwebpackplugin({
            filename: 'person.html',
            template: './public/src/index.html',
            chunks: ['person'],
            favicon: './public/src/20181101101247273_easyicon_net_32.ico',
            outputPath: 'images/',
        }),
        new webpack.ProvidePlugin({
            // 'polyfill': 'raf/polyfill',
            'React': 'react',
            '$':'jquery'
        })
    ],
    mode: 'development',
    // mode: 'production',
    stats: {
        colors: true,
        // assets: false,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port: 8080,
        overlay: true
    },
}