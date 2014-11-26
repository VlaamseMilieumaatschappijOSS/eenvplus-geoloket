///ts:ref=BrowserSnifferService
/// <reference path="../../../../ga/components/BrowserSnifferService.ts"/> ///ts:ref:generated
///ts:ref=Module
/// <reference path="./Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.tools {
    'use strict';

    export var NAME:string = 'gaEditorTools';

    interface Scope extends ng.IScope {
        map:ol.Map;
        useRange:boolean;
        snapResolution:number;
    }

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            scope: {
                map: '='
            },
            controller: ToolsController,
            templateUrl: 'html/be/vmm/eenvplus/editor/Tools.html'
        };
    }

    ToolsController.$inject = ['$scope', 'gaBrowserSniffer'];

    function ToolsController(scope:Scope, browser:ga.components.BrowserSnifferService) {
        scope.useRange = !browser.mobile && (!browser.msie || browser.msie > 9);
        scope.snapResolution = 5;
    }

    angular
        .module(Module.EDITOR)
        .directive(NAME, configure);

}
