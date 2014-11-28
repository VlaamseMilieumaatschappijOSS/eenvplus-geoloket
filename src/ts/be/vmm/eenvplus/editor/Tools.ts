///ts:ref=BrowserSnifferService
/// <reference path="../../../../ga/components/BrowserSnifferService.ts"/> ///ts:ref:generated
///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.tools {
    'use strict';

    export var NAME:string = PREFIX + 'EditorTools';

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            scope: {
                map: '='
            },
            templateUrl: 'html/be/vmm/eenvplus/editor/Tools.html'
        };
    }

    angular
        .module(Module.EDITOR)
        .directive(NAME, configure);

}
