var nunjucks = require('nunjucks'),
    path = require('path');

var dir = {
        build: 'src/',
        comp: 'src/components/',
        html: 'src/',
        js: 'src/js/',
        less: 'src/style/',
        lib: 'src/lib/',
        ts: 'src/ts/',
        test: {
            js: 'test/specs/',
            ts: 'test/ts/'
        }
    },
    file = {
        dependency: dir.build + 'deps.js',
        depsWriter: 'node_modules/closure-tools/closure-bin/build/depswriter.py',
        htmlIn: dir.html + 'index.mako.html',
        htmlOut: dir.build + 'index.html',
        htmlOutMobile: dir.build + 'mobile.html',
        lessIn: dir.less + 'app.less',
        lessOut: dir.build + 'style/app.css',
        tsOut: dir.build + 'eenvplus.js'
    },
    src = {
        html: file.htmlIn,
        js: [dir.js + '**/*.js', dir.comp + '**/*.js'],
        less: [dir.less + '**/*.less', dir.ts + '**/*.less', dir.comp + '**/*.less'],
        ts: [dir.ts + '**/*.ts'],
        typeDefs: [dir.lib + '**/*.d.ts']
    },
    testSrc = {
        js: [dir.test.js + 'src/**/*.js', dir.test.js + 'test/**/*.js'],
        ts: [dir.test.ts + '**/*.ts']
    };


module.exports = function (grunt) {

    /**
     * Measures the build speed.
     */
    require('time-grunt')(grunt);

    /*
     * Load all NPM grunt tasks.
     */
    require('load-grunt-tasks')(grunt, {pattern: ['grunt-*']});

    function nunjucksTask() {
        var options = this.options();

        this.files.forEach(function (file) {
            var filepath = path.resolve(__dirname, file.src[0]);

            if (!grunt.file.exists(filepath)) {
                grunt.log.warn('Template\'s file "' + filepath + '" not found.');
                return false;
            }

            if (!options.data) grunt.log.warn('Template\'s data is empty. Guess you forget to specify data option');

            var data = options.data || {},
                process = options.preprocessData;
            if (typeof process === 'function') data = process.call(file, data);

            var template = grunt.file.read(filepath),
                compiledHtml = nunjucks
                    .configure(options.paths || '', options)
                    .renderString(template, data);

            grunt.file.write(file.dest, compiledHtml);
            grunt.log.writeln('File "' + file.dest + '" created.');
        });
    }

    grunt.initConfig({
        dir: dir,
        file: file,
        src: src,

        clean: {
            dev: [file.dependency, file.tsOut + '*', file.htmlOut, file.htmlOutMobile, file.lessOut]
        },

        closureDepsWriter: {
            options: {
                depswriter: file.depsWriter,
                root_with_prefix: [
                    '"' + dir.comp + ' components"',
                    '"' + dir.js + ' js"'
                ]
            },
            dev: {
                dest: file.dependency
            }
        },

        connect: {
            dev: {
                options: {
                    port: 9000,
                    base: './src'
                }
            }
        },

        karma: {
            test: {
                configFile: 'test/karma.conf.js'
            }
        },

        less: {
            options: {
                relativeUrls: true
            },
            dev: {
                files: {
                    '<%= file.lessOut %>': file.lessIn
                }
            }
        },

        nunjucks: {
            options: {
                tags: {
                    variableStart: '${',
                    variableEnd: '}'
                }
            },
            dev: {
                options: {
                    data: {
                        "versionslashed": "",
                        "apache_base_path": "localhost/",
                        "api_url": "//localhost:8080/eenvplus-sdi-services",
                        "wmts_url": "//geo.api.agiv.be/geodiensten/raadpleegdiensten/geocache/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER={Layer}&STYLE=default&FORMAT={Format}&TILEMATRIXSET=BPL72VL&TILEMATRIX={TileMatrix}&TILEROW={TileRow}&TILECOL={TileCol}",
                        "device": "desktop",
                        "mode": "dev"
                    }
                },
                files: {
                    '<%= file.htmlOut %>': file.htmlIn
                }
            },
            devMobile: {
                options: {
                    data: {
                        "versionslashed": "",
                        "apache_base_path": "localhost/",
                        "api_url": "//localhost:8080/eenvplus-sdi-services",
                        "wmts_url": "//geo.api.agiv.be/geodiensten/raadpleegdiensten/geocache/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER={Layer}&STYLE=default&FORMAT={Format}&TILEMATRIXSET=BPL72VL&TILEMATRIX={TileMatrix}&TILEROW={TileRow}&TILECOL={TileCol}",
                        "device": "mobile",
                        "mode": "dev"
                    }
                },
                files: {
                    '<%= file.htmlOutMobile %>': file.htmlIn
                }
            }
        },

        ts: {
            dev: {
                src: [src.typeDefs, src.ts],
                out: file.tsOut,
                options: {
                    removeComments: false,
                    sourceMap: true
                }
            },
            test: {
                src: [src.typeDefs, src.ts, testSrc.ts],
                outDir: dir.test.js,
                options: {
                    fast: 'never'
                }
            }
        },

        tslint: {
            options: {
                configuration: grunt.file.readJSON('.tslintrc')
            },
            files: {
                src: [src.ts]
            }
        },

        watch: {
            options: {
                spawn: false
            },
            html: {
                files: src.html,
                tasks: ['nunjucks:dev', 'nunjucks:devMobile']
            },
            js: {
                files: src.js,
                tasks: ['closureDepsWriter:dev']
            },
            less: {
                files: src.less,
                tasks: ['less:dev']
            },
            ts: {
                files: src.ts,
                tasks: ['ts:dev']
            },
            tsTest: {
                files: [src.ts, testSrc.ts],
                tasks: ['ts:test']
            }
        }
    });

    grunt.registerMultiTask('nunjucks', 'Renders nunjucks template to HTML', nunjucksTask);
    grunt.registerTask(
        'build-dev',
        'Builds the files required for development',
        ['ts:dev', 'closureDepsWriter:dev', 'less:dev', 'nunjucks:dev', 'nunjucks:devMobile']
    );
    grunt.registerTask('http', 'Run an http server on development files.', ['connect:dev:keepalive']);
    grunt.registerTask(
        'dev',
        'Monitors source html, js and less files and executes their corresponding dev build tasks when needed',
        ['build-dev', 'ts:test', 'watch']
    );
    grunt.registerTask('default', 'Default task: build dev environment', ['dev']);

};
