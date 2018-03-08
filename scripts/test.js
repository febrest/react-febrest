var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var commonjs = require('rollup-plugin-commonjs');
var resolve = require('rollup-plugin-node-resolve');

var connect = require('gulp-connect');
var path = require('path');


const src = path.resolve('./', 'examples/todomvc');

var plugins = [
    resolve({
        // pass custom options to the resolve plugin
        customResolveOptions: {
            moduleDirectory: './../node_modules'
        }
    }),
    commonjs(),
    babel({ runtimeHelpers: true }),

];
var input = path.resolve(path.resolve(src, 'index.js'));
var outputOptions = {
    file: path.resolve(path.resolve(src, 'index.bundle.js')),
    format: 'iife'
};
async function buildExamples() {
    var result = await rollup.rollup({
        input: input,
        plugins: plugins
    });
    await result.write(outputOptions);
}
async function start() {
    await buildExamples();
    watcher = rollup.watch({
        input: input,
        plugins: plugins,
        output:outputOptions,
        watch: {
            include: path.resolve(path.resolve(src, '*.*')),
            exclude: path.resolve(path.resolve(src, 'index.bundle.js'))
        }
    });

    connect.server({
        root: src,// server root
        port: 3000
    });
}
start();