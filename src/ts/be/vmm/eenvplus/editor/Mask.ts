///ts:ref=Module
/// <reference path="./Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.mask {
    'use strict';

    export var NAME:string = 'gaMask';

    var style = {
        fill: {
            color: [0, 5, 25, 0.75]
        },
        stroke: {
            color: [0, 0, 0, .8],
            width: 1
        }
    };

    interface Scope extends ng.IScope {
        map:ol.Map;
    }

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            controller: MaskController
        };
    }

    function MaskController($scope:Scope) {

        var map:ol.Map = $scope.map,
            drawMask:boolean = false;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        var boxInteraction = new ol.interaction.DragBox({
            style: new ol.style.Style({
                stroke: new ol.style.Stroke(style.stroke)
            })
        });
        boxInteraction.on('boxstart', toggleSelectionMode);
        boxInteraction.on('boxend', toggleSelectionMode);

        map.addInteraction(boxInteraction);
        map.on('postcompose', handleComposition);


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        function handleComposition(event):void {
            if (drawMask) draw(event.context);
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        function toggleSelectionMode() {
            drawMask = !drawMask;
        }

        function draw(ctx:CanvasRenderingContext2D):void {
            ctx.beginPath();
            drawRect(ctx, getScreenBox().reverse());
            drawRect(ctx, getSelectionBox());
            ctx.fillStyle = 'rgba(' + style.fill.color.join(', ') + ')';
            ctx.fill();
        }

        function getScreenBox() {
            var size = map.getSize(),
                width = size[0] * ol.has.DEVICE_PIXEL_RATIO,
                height = size[1] * ol.has.DEVICE_PIXEL_RATIO;

            return [[0, 0], [0, height], [width, height], [width, 0]];
        }

        function getSelectionBox() {
            var coordinates = boxInteraction.getGeometry().getCoordinates(),
                normalized = normalize(coordinates[0]),
                toPixel = _.bind(map.getPixelFromCoordinate, map);

            return _.map(normalized, toPixel);
        }

        function normalize(coordinates) {
            return [
                [Math.min, Math.max],
                [Math.min, Math.min],
                [Math.max, Math.min],
                [Math.max, Math.max]
            ].map((fns) => {
                    return fns.map((fn, xy) => {
                        return fn.apply(null, _.map(coordinates, xy));
                    });
                });
        }

        function drawRect(ctx:CanvasRenderingContext2D, coordinates:ol.Coordinate[]):void {
            var first = coordinates.shift(),
                lineTo = _.bind(ctx.lineTo.apply, ctx.lineTo, ctx);

            ctx.moveTo(first[0], first[1]);
            coordinates.push(first);
            _.each(coordinates, lineTo);
            ctx.closePath();
        }

    }

    angular
        .module(Module.EDITOR)
        .directive(NAME, configure);

}
