///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.tools.snappingTools {
    'use strict';

    export var NAME:string = PREFIX + 'SnappingTools';

    function configure():ng.IDirective {
        SnappingToolsController.$inject = ['gaBrowserSniffer'];

        return {
            restrict: 'A',
            scope: {},
            controllerAs: 'ctrl',
            controller: SnappingToolsController,
            templateUrl: 'ts/be/vmm/eenvplus/editor/tools/SnappingTools.html'
        };
    }

    class SnappingToolsController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        public useRange:boolean;
        public snapResolution:number = 5;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(browser:ga.components.BrowserSnifferService) {
            this.useRange = !browser.mobile && (!browser.msie || browser.msie > 9);
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
