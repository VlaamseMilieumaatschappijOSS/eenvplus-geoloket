///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.drawTools {
    'use strict';

    export var NAME:string = PREFIX + 'DrawTools';

    function configure():ng.IDirective {
        DrawToolsController.$inject = ['$scope', '$rootScope', 'epPainterStore'];

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

        public selectedItem:feature.FeatureType;

        private scope:ng.IScope;
        private rootScope:ng.IScope;
        private painterStore:paint.PainterStore;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(scope:ng.IScope, rootScope:ng.IScope, painterStore:paint.PainterStore) {
            _.bindAll(this);
            this.scope = scope;
            this.rootScope = rootScope;
            this.painterStore = painterStore;

            this.requestSewerPainter = _.partial(this.selectPainter, feature.FeatureType.SEWER);
            this.requestAppurtenancePainter = _.partial(this.selectPainter, feature.FeatureType.APPURTENANCE);

            scope.$on(feature.EVENT.selected, _.partial(this.selectPainter, undefined));
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        public requestEditMode():void {
            this.rootScope.$broadcast(applicationState.EVENT.modeRequest, applicationState.State.EDIT);
        }

        public requestSewerPainter:() => void;
        public requestAppurtenancePainter:() => void;

        public selectPainter(painter:feature.FeatureType):void {
            this.selectedItem = this.selectedItem === painter ? undefined : painter;
            this.painterStore.current = this.selectedItem;
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
