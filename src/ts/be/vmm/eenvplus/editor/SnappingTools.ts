///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snappingTools {
    'use strict';

    export var NAME:string = PREFIX + 'SnappingTools';

    interface Scope extends ng.IScope {
        useRange:boolean;
        snapResolution:number;
    }

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            scope: {},
            controller: SnappingToolsController,
            templateUrl: 'html/be/vmm/eenvplus/editor/SnappingTools.html'
        };
    }

    SnappingToolsController.$inject = ['$scope', 'gaBrowserSniffer'];

    function SnappingToolsController(scope:Scope, browser:ga.components.BrowserSnifferService) {

        scope.useRange = !browser.mobile && (!browser.msie || browser.msie > 9);
        scope.snapResolution = 5;

    }

    angular
        .module(Module.EDITOR)
        .directive(NAME, configure);

}
