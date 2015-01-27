module.exports = function (config) {
    config.set({
        files: [
            'src/lib/jquery-2.0.3.js',
            'src/lib/angular/angular.js',
            'src/lib/angular-animate/angular-animate.js',
            'src/lib/angular-resource/angular-resource.js',
            'src/lib/angular-translate-1.1.1.js',
            'src/lib/angular-translate-loader-static-files-0.1.5.js',
            'src/lib/ol-debug.js',
            'src/lib/lodash.js',
            'src/lib/signals/trasys.signals.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'test/mock/*.js',
            'test/specs/src/ts/be/vmm/eenvplus/Prefix.js',
            'test/specs/src/ts/be/vmm/eenvplus/config/Module.js',
            'test/specs/src/ts/be/vmm/eenvplus/editor/area/Module.js',
            'test/specs/src/ts/be/vmm/eenvplus/editor/form/Module.js',
            'test/specs/src/ts/be/vmm/eenvplus/editor/geometry/Module.js',
            'test/specs/src/ts/be/vmm/eenvplus/editor/paint/Module.js',
            'test/specs/src/ts/be/vmm/eenvplus/editor/snapping/Module.js',
            'test/specs/src/ts/be/vmm/eenvplus/editor/tools/Module.js',
            'test/specs/src/ts/be/vmm/eenvplus/editor/validation/Module.js',
            'test/specs/src/ts/be/vmm/eenvplus/editor/Module.js',
            'test/specs/src/ts/be/vmm/eenvplus/feature/Module.js',
            'test/specs/src/ts/be/vmm/eenvplus/label/Module.js',
            'test/specs/src/ts/be/vmm/eenvplus/state/Module.js',
            'test/specs/src/ts/be/vmm/eenvplus/user/Module.js',
            'test/specs/src/ts/be/vmm/eenvplus/viewer/Module.js',
            'test/specs/src/ts/be/vmm/eenvplus/Module.js',
            'test/specs/src/**/*.js',
            'test/specs/test/**/*.js',
            {
                pattern: 'src/ts/**/*.ts',
                included: false
            },
            {
                pattern: 'test/specs/src/**/*.js.map',
                included: false
            },
            {
                pattern: 'test/specs/test/**/*.js.map',
                included: false
            }
        ],
        basePath: '../',
        exclude: [],
        autoWatch: true,
        frameworks: ['mocha', 'chai', 'sinon'],
        browsers: ['PhantomJS'],
        preprocessors: {
            'test/specs/src/*.js': ['coverage']
        },
        coverageReporter: {
            type: 'text-summary'
        },
        reporters: ['progress', 'coverage']
    })
};
