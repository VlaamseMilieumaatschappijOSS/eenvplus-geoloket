///ts:ref=Module
/// <reference path="./Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus {
    'use strict';

    export module MapFactory {
        export var NAME:string = PREFIX + 'Map';

        factory.$inject = ['MAP_CONFIG', 'gaSRSName'];

        function factory(config, srsName):ol.Map {
            var toolBar = $('#zoomButtons')[0];
            var controls = ol.control.defaults({
                attribution: false,
                rotate: false,
                zoomOptions: {
                    target: toolBar,
                    zoomInLabel: '',
                    zoomOutLabel: '',
                    zoomInTipLabel: '',
                    zoomOutTipLabel: ''
                }
            });

            var interactions = ol.interaction.defaults({
                altShiftDragRotate: true,
                touchRotate: false,
                keyboard: false
            }).extend([
                new ol.interaction.DragZoom()
            ]);

            var projection = ol.proj.get(srsName.default.code);
            projection.setExtent(config.extent);

            var view = new ol.View({
                projection: projection,
                center: ol.extent.getCenter(config.extent),
                extent: config.extent,
                resolution: config.resolution,
                resolutions: config.resolutions
            });

            var map = new ol.Map({
                controls: controls,
                interactions: interactions,
                renderer: 'canvas',
                view: view,
                logo: false
            });

            map.addControl(new ol.control.ZoomToExtent({
                target: toolBar,
                tipLabel: ''
            }));

            var dragClass = 'ga-dragging';
            var viewport = $(map.getViewport());
            map.on('dragstart', function () {
                viewport.addClass(dragClass);
            });
            map.on('dragend', function () {
                viewport.removeClass(dragClass);
            });

            return map;
        }

        angular
            .module(MODULE)
            .factory(NAME, factory);
    }

}
