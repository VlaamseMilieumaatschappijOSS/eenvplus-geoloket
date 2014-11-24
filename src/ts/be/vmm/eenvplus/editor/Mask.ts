///ts:ref=Module
/// <reference path="./Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.mask {
    'use strict';

    export var NAME:string = 'gaMask';

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            scope: {},
            controller: MaskController
        };
    }

    export class MaskController {

        constructor() {
            console.log('HELLO');
        }

    }

    angular
        .module(Module.EDITOR)
        .directive(NAME, configure);

}
