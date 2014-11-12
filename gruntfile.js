module.exports = function (grunt) {

    /**
     * Measures the build speed.
     */
    require('time-grunt')(grunt);

    /*
     * Load NPM grunt tasks.
     */
    require('load-grunt-tasks')(grunt, {pattern: ['grunt-*']});

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
        }
    });

    grunt.registerTask(
        'dev',
        'Builds the files required for development',
        ['closureDepsWriter:dev', 'less:dev']
    );
    grunt.registerTask('default', 'Default task: build dev environment', ['dev']);

};
