///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated
///ts:ref=Mask
/// <reference path="./Mask.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.area.areaZoom {
    'use strict';

    export var NAME:string = PREFIX + 'AreaZoom';

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            controller: AreaZoomController
        };
    }

    AreaZoomController.$inject = ['$scope', 'epMap'];

    function AreaZoomController(scope:ApplicationScope, map:ol.Map):void {

        var view = map.getView(),
            center = _.compose(view.setCenter.bind(view), getCenter),
            zoom = _.compose(view.setResolution.bind(view), getResolution);

        scope.$on(mask.EVENT.selected, handle(centerAndZoom));

        function centerAndZoom(extent:ol.Extent):void {
            center(extent);
            zoom(extent);
        }

        function getCenter(extent:ol.Extent):ol.Coordinate {
            return <ol.Coordinate>[
                avg(extent[0], extent[2]),
                avg(extent[1], extent[3])
            ];
        }

        function getResolution(extent:ol.Extent):number {
            var size = map.getSize(),
                xResolution = (extent[2] - extent[0]) / size[0],
                yResolution = (extent[3] - extent[1]) / size[1],
                resolution = Math.max(xResolution, yResolution);
            return view.constrainResolution(resolution, 0, 1);
        }

        function avg(a:number, b:number):number {
            return (a + b) / 2;
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
