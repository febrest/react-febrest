var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var commonjs = require('rollup-plugin-commonjs');

var connect = require('gulp-connect');
var path = require('path');


const src = path.resolve('./', 'examples/todomvc');

async function buildExamples() {
    var result = await rollup.rollup({
        input: path.resolve(path.resolve(src, 'index.js')),
        plugins: [
            babel({ runtimeHelpers: true }),
            commonjs(),
        ]
    });
    await result.write({
        file: path.resolve(path.resolve(src, 'index.bundle.js')),
        format: 'iife'
    })
}
async function start() {
    // await buildExamples();
    watcher = rollup.watch({
        input: path.resolve(path.resolve(src, 'index.js')),
        plugins: [
            babel({ runtimeHelpers: true }),
            commonjs(),
        ],
        output: {
            file: path.resolve(path.resolve(src, 'index.bundle.js')),
            format: 'iife'
        },
        watch: {
            include: path.resolve(path.resolve(src, '*.*')),
            exclude:path.resolve(path.resolve(src, 'index.bundle.js'))
        }
    });

    connect.server({
        root: src,// server root
        port: 3000
    });
}
start();