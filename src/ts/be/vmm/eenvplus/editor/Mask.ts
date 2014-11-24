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
            var size = map.getSize(),
                height = size[1] * ol.has.DEVICE_PIXEL_RATIO,
                width = size[0] * ol.has.DEVICE_PIXEL_RATIO,
                coordinates = boxInteraction.getGeometry().getCoordinates()[0],
                bl = map.getPixelFromCoordinate(coordinates[0]),
                tl = map.getPixelFromCoordinate(coordinates[1]),
                tr = map.getPixelFromCoordinate(coordinates[2]),
                br = map.getPixelFromCoordinate(coordinates[3]);

            ctx.beginPath();
            // Outside polygon, must be clockwise
            ctx.moveTo(0, 0);
            ctx.lineTo(width, 0);
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.lineTo(0, 0);
            ctx.closePath();
            // Inner polygon, must be counter-clockwise
            ctx.moveTo(bl[0], bl[1]);
            ctx.lineTo(tl[0], tl[1]);
            ctx.lineTo(tr[0], tr[1]);
            ctx.lineTo(br[0], br[1]);
            ctx.lineTo(bl[0], bl[1]);
            ctx.closePath();
            ctx.fillStyle = 'rgba(' + style.fill.color.join(', ') + ')';
            ctx.fill();
        }

    }

    angular
        .module(Module.EDITOR)
        .directive(NAME, configure);

}
