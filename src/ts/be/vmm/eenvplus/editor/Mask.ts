///ts:ref=Module
/// <reference path="./Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.mask {
    'use strict';

    goog.provide(Module.MASK);

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            scope: {},
            controller: MaskController
        };
    }

    export class MaskController {

    }

    angular
        .module(Module.MASK, [])
        .directive(Directive.MASK, configure);

}
