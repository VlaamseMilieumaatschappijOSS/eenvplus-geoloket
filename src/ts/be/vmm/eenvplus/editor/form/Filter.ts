///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated
///ts:ref=Format
/// <reference path="./Format.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.Filter {
    'use strict';

    ['FeatureLabel', 'UserName'].forEach(createFilter);

    function createFilter(name:string):void {
        var fn = (format:Format):Function => {
            return format['to' + name];
        };
        fn.$inject = ['epFormat'];

        angular
            .module(MODULE)
            .filter(PREFIX + name, fn);
    }

}
