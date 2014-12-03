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

    AreaZoomController.$inject = ['$scope'];

    function AreaZoomController(scope:ApplicationScope):void {

        var map:ol.Map = scope.map;
        scope.$on(mask.EVENT.selected, centerAndZoom);

        function centerAndZoom(event:ng.IAngularEvent, extent:ol.Extent):void {
            center(extent);
        }

        function center(extent:ol.Extent):void {
            map.getView().setCenter(<ol.Coordinate>[
                avg(extent[0], extent[2]),
                avg(extent[1], extent[3])
            ]);
        }

        function zoom(extent:ol.Extent):void {

        }

        function avg(a:number, b:number):number {
            return (a + b) / 2;
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
