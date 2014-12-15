///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.drawTools {
    'use strict';

    export var NAME:string = PREFIX + 'DrawTools';

    function configure():ng.IDirective {
        DrawToolsController.$inject = ['$rootScope', 'epPainterStore'];

        return {
            restrict: 'A',
            scope: {},
            controllerAs: 'ctrl',
            controller: DrawToolsController,
            templateUrl: 'html/be/vmm/eenvplus/editor/DrawTools.html'
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

        private rootScope:ng.IScope;
        private painterStore:paint.PainterStore;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(rootScope:ng.IScope, painterStore:paint.PainterStore) {
            this.featureType = feature.FeatureType;
            this.rootScope = rootScope;
            this.painterStore = painterStore;
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        public requestEditMode():void {
            this.rootScope.$broadcast(applicationState.EVENT.modeRequest, applicationState.State.EDIT);
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
