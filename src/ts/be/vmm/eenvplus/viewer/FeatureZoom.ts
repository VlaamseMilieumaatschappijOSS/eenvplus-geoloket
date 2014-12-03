///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.viewer {
    'use strict';

    export var NAME:string = PREFIX + 'FeatureZoom';

    interface Scope extends ng.IScope {
        map:ol.Map;
        zoom:() => void;
    }

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            scope: {
                map: '='
            },
            controller: FeatureZoomController,
            templateUrl: 'html/be/vmm/eenvplus/viewer/FeatureZoom.html'
        };
    }

    FeatureZoomController.$inject = ['$scope'];

    function FeatureZoomController(scope:Scope) {

        scope.zoom = zoom;

        /**
         * Zoom to the level that has most information, i.e. where all layers are visible.
         */
        function zoom() {
            var resolutions = _(scope.map.getLayers().getArray())
                .filter('displayInLayerManager')
                .invoke(ol.layer.Base.prototype.get, ol.layer.LayerProperty.MAX_RESOLUTION)
                .value();
            scope.map.getView().setResolution(Math.min.apply(null, resolutions) / 2);
        }
    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
