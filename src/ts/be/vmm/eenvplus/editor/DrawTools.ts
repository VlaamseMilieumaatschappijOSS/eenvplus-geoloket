///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.drawTools {
    'use strict';

    export var NAME:string = PREFIX + 'DrawTools';

    function configure():ng.IDirective {
        DrawToolsController.$inject = ['epStateStore', 'epPainterStore'];

        return {
            restrict: 'A',
            scope: {},
            controllerAs: 'ctrl',
            controller: DrawToolsController,
            templateUrl: 'ts/be/vmm/eenvplus/editor/DrawTools.html'
        };
    }

    class DrawToolsController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        public featureType:any;

        public get selectedItem():feature.FeatureType {
            return this.painterStore.current;
        }

        public set selectedItem(value:feature.FeatureType) {
            this.painterStore.current = value;
        }

        private state:state.StateStore;
        private painterStore:paint.PainterStore;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(state:state.StateStore, painterStore:paint.PainterStore) {
            this.featureType = feature.FeatureType;
            this.state = state;
            this.painterStore = painterStore;
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        public requestEditMode():void {
            this.state.currentMode = state.State.EDIT;
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
