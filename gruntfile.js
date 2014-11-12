var nunjucks = require('nunjucks'),
    path = require('path');

module.exports = function (grunt) {

    /**
     * Measures the build speed.
     */
    require('time-grunt')(grunt);

    /*
     * Load NPM grunt tasks.
     */
    require('load-grunt-tasks')(grunt, {pattern: ['grunt-*']});

    function nunjucksTask() {
        var options = this.options();

        this.files.forEach(function (f) {
            var filepath = path.resolve(__dirname, f.src[0]);

            if (!grunt.file.exists(filepath)) {
                grunt.log.warn('Template`s file "' + filepath + '" not found.');
                return false;
            }

            if (!options.data) {
                grunt.log.warn('Template`s data is empty. Guess you forget to specify data option');
            }

            var data = (typeof options.preprocessData === 'function')
                ? options.preprocessData.call(f, options.data || {})
                : options.data || {};

            var template = grunt.file.read(filepath);

            nunjucks.configure(options.paths || '', options);

            var compiledHtml = nunjucks.renderString(template, data);

            grunt.file.write(f.dest, compiledHtml);
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    }

    grunt.initConfig({
        closureDepsWriter: {
            options: {
                depswriter: 'node_modules/closure-tools/closure-bin/build/depswriter.py',
                root_with_prefix: ['"src/components components"', '"src/js js"']
            },
            dev: {
                dest: 'src/deps.js'
            }
        },

        less: {
            options: {
                relativeUrls: true
            },
            dev: {
                files: {
                    'src/style/app.css': 'src/style/app.less'
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
                        "api_url": "//mf-chsdi3.dev.bgdi.ch",
                        "device": "desktop",
                        "mode": "dev"
                    }
                },
                files: {
                    'src/index.html': 'src/index.mako.html'
                }
            },
            devMobile: {
                options: {
                    data: {
                        "versionslashed": "",
                        "apache_base_path": "localhost/",
                        "api_url": "//mf-chsdi3.dev.bgdi.ch",
                        "device": "mobile",
                        "mode": "dev"
                    }
                },
                files: {
                    'src/mobile.html': 'src/index.mako.html'
                }
            }
        }
    });

    grunt.registerMultiTask('nunjucks', 'Renders nunjucks template to HTML', nunjucksTask);
    grunt.registerTask(
        'dev',
        'Builds the files required for development',
        ['closureDepsWriter:dev', 'less:dev', 'nunjucks:dev', 'nunjucks:devMobile']
    );
    grunt.registerTask('default', 'Default task: build dev environment', ['dev']);

};
