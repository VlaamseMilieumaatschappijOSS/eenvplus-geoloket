///ts:ref=DragBox
/// <reference path="../../../../ol/interaction/DragBox.ts"/> ///ts:ref:generated
///ts:ref=Map
/// <reference path="../../../../ol/Map.ts"/> ///ts:ref:generated
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

    /**
     * Lets the user draw a selection mask on the map.
     * The non-selected area is greyed out.
     *
     * @param $scope
     * @param $rootScope
     * @constructor
     */
    function MaskController($scope:Scope, $rootScope:ng.IScope) {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var map:ol.Map = $scope.map,
            ctx:CanvasRenderingContext2D,
            isActive = false;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        var boxInteraction = new ol.interaction.DragBox({
            style: new ol.style.Style({
                stroke: new ol.style.Stroke(style.stroke)
            })
        });

        map.once(ol.Map.EVENT.preCompose, setContext);
        $rootScope.$on(state.EVENT.change, handleStateChange);

        function setContext(event:ol.render.Event):void {
            ctx = event.context;
        }


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        /**
         * When edit mode is enabled on the map, the user can start drawing a selection mask.
         * When it is disabled, the selection mask is removed.
         *
         * @param event
         * @param editState
         */
        function handleStateChange(event:ng.IAngularEvent, editState:string):void {
            editState === state.STATE.EDIT ? activate() : deactivate();
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        /**
         * The user can start drawing a selection box.
         * Initially render a mask with no selection (overlay covers entire screen),
         * but as the user drags, render the selection.
         * When the user stops dragging, disable further interaction.
         */
        function activate():void {
            if (isActive) return;

            isActive = true;
            draw(false);

            map.addInteraction(boxInteraction);
            map.on(ol.Map.EVENT.postCompose, draw);

            boxInteraction.on(ol.interaction.DragBox.EVENT.boxEnd, stopSelecting);
        }

        /**
         * The user can no longer draw a selection box, but keep rendering it.
         * When the selection is made, automatically hide the feature layers.
         */
        function stopSelecting():void {
            boxInteraction.un(ol.interaction.DragBox.EVENT.boxEnd, stopSelecting);
            map.removeInteraction(boxInteraction);

            _(map.getLayers().getArray())
                .filter('displayInLayerManager')
                .invoke(ol.layer.Base.prototype.setVisible, false);
        }

        /**
         * Stop rendering the selection and re-render the map to remove the current selection.
         */
        function deactivate():void {
            if (!isActive) return;

            isActive = false;

            map.un(ol.Map.EVENT.postCompose, draw);
            map.render();
        }


        /* ----------------- */
        /* --- rendering --- */
        /* ----------------- */

        /**
         * Grey out the map except for the current selection box.
         * If there is no selection box, the entire map is greyed out.
         *
         * @param hasSelection
         */
        function draw(hasSelection:boolean):void {
            ctx.beginPath();
            drawRect(getMapBox().reverse());
            if (hasSelection) drawRect(getSelectionBox());
            ctx.fillStyle = 'rgba(' + style.fill.color.join(', ') + ')';
            ctx.fill();
        }

        /**
         * @returns A set of 4 Pixels describing a rectangle that covers the entire map.
         * Starting with the bottom-left corner and following clockwise.
         */
        function getMapBox():ol.Pixel[] {
            var size = map.getSize(),
                width = size[0] * ol.has.DEVICE_PIXEL_RATIO,
                height = size[1] * ol.has.DEVICE_PIXEL_RATIO;

            return [[0, 0], [0, height], [width, height], [width, 0]];
        }

        /**
         * @returns A set of 4 Pixels describing a rectangle that covers the user selection.
         * Starting with the bottom-left corner and following clockwise.
         */
        function getSelectionBox():ol.Pixel[] {
            var coordinates = boxInteraction.getGeometry().getCoordinates(),
                normalized = normalize(coordinates[0]),
                toPixel = _.bind(map.getPixelFromCoordinate, map);

            return _.map(normalized, toPixel);
        }

        /**
         * @param coordinates A set of 4 Coordinates describing a rectangle.
         * @returns The normalized version of the given set of Coordinates, meaning that whatever the order of the
         * original Coordinates the result will start with the bottom-left corner and follow clockwise.
         */
        function normalize(coordinates:ol.Coordinate[]):ol.Coordinate[] {
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

        /**
         * Draw a rectangular shape on the map's Canvas.
         *
         * @param box A set of 4 Pixels describing the rectangle.
         */
        function drawRect(box:ol.Pixel[]):void {
            var first = box.shift(),
                lineTo = _.bind(ctx.lineTo.apply, ctx.lineTo, ctx);

            ctx.moveTo(first[0], first[1]);
            box.push(first);
            _.each(box, lineTo);
            ctx.closePath();
        }

    }

    angular
        .module(Module.EDITOR)
        .directive(NAME, configure);

}
