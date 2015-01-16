///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.tools.drawTools {
    'use strict';

    export var NAME:string = PREFIX + 'DrawTools';

    function configure():ng.IDirective {
        DrawToolsController.$inject = ['epUser', 'epStateStore', 'epAreaStore', 'epPainterStore'];

        return {
            restrict: 'A',
            scope: {},
            controllerAs: 'ctrl',
            controller: DrawToolsController,
            templateUrl: 'ts/be/vmm/eenvplus/editor/tools/DrawTools.html'
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

        public get hasArea():boolean {
            return !!this.areaStore.current;
        }

        public get hasPermission():boolean {
            return this.user.authenticated;
        }


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(private user:user.User,
                    private state:state.StateStore,
                    private areaStore:area.AreaStore,
                    private painterStore:paint.PainterStore) {

            this.featureType = feature.FeatureType;
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
