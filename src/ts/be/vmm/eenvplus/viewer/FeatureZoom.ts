///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.viewer {
    'use strict';

    export var NAME:string = PREFIX + 'FeatureZoom';

    interface Scope extends ng.IScope {
        map:ol.Map;
    }

    function configure():ng.IDirective {
        FeatureZoomController.$inject = ['$scope'];

        return {
            restrict: 'A',
            scope: {
                map: '='
            },
            controllerAs: 'ctrl',
            controller: FeatureZoomController,
            templateUrl: 'html/be/vmm/eenvplus/viewer/FeatureZoom.html'
        };
    }

    class FeatureZoomController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        private map:ol.Map;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(scope:Scope) {
            this.map = scope.map;
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        /**
         * Zoom to the level that has most information, i.e. where all layers are visible.
         */
        public zoom() {
            var resolutions = _(this.map.getLayers().getArray())
                .filter('displayInLayerManager')
                .invoke(ol.layer.Base.prototype.get, ol.layer.LayerProperty.MAX_RESOLUTION)
                .value();
            this.map.getView().setResolution(Math.min.apply(null, resolutions) / 2);
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
