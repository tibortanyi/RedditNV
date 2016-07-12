var webpack = require("webpack");

module.exports = {
    entry: {
        app: './src/main.js',
        vendor: ['vue', 'vue-router', 'vue-resource']
    },

    output: {
        path: './dist',
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue',
                exclude: /node_modules/   
            },
            
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
        ]
    },

    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
    ]
}