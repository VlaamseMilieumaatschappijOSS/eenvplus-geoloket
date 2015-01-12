///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.tools.snappingTools {
    'use strict';

    export var NAME:string = PREFIX + 'SnappingTools';

    function configure():ng.IDirective {
        SnappingToolsController.$inject = ['epSnappingStore', 'gaBrowserSniffer'];

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

        constructor(store:snapping.SnappingStore, browser:ga.components.BrowserSnifferService) {
            this.useRange = !browser.mobile && (!browser.msie || browser.msie > 9);

            this.selectNoSnapping = _.partial(select, snapping.SnappingType.NONE);
            this.selectMergeMode = _.partial(select, snapping.SnappingType.MERGE);
            this.selectAddMode = _.partial(select, snapping.SnappingType.ADD);
            this.selectInteractiveMode = _.partial(select, snapping.SnappingType.INTERACTIVE);

            this.noneSelected = _.partial(isSelected, snapping.SnappingType.NONE);
            this.mergeSelected = _.partial(isSelected, snapping.SnappingType.MERGE);
            this.addSelected = _.partial(isSelected, snapping.SnappingType.ADD);
            this.interactiveSelected = _.partial(isSelected, snapping.SnappingType.INTERACTIVE);

            function select(type:snapping.SnappingType):void {
                store.current = isSelected(type) ? undefined : type;
            }

            function isSelected(type:snapping.SnappingType):boolean {
                return store.current === type;
            }
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        public selectNoSnapping:() => void;
        public selectMergeMode:() => void;
        public selectAddMode:() => void;
        public selectInteractiveMode:() => void;

        public noneSelected:() => boolean;
        public mergeSelected:() => boolean;
        public addSelected:() => boolean;
        public interactiveSelected:() => boolean;

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
