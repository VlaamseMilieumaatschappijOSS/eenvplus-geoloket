///ts:ref=DragBox
/// <reference path="../../../../ol/interaction/DragBox.ts"/> ///ts:ref:generated
///ts:ref=Map
/// <reference path="../../../../ol/Map.ts"/> ///ts:ref:generated
///ts:ref=Module
/// <reference path="./Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.mask {
    'use strict';

    export var NAME:string = 'gaMask';

    export var EVENT = {
        selected: 'selected'
    };

    var style = {
        fill: {
            color: [0, 5, 25, 0.75]
        },
        stroke: {
            color: [0, 0, 0, .8],
            width: 1
        }
    };

    enum State {
        OFF,
        EMPTY,
        SELECTING,
        ON
    }

    interface Scope extends ng.IScope {
        map:ol.Map;
    }

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            controller: MaskController
        };
    }

    MaskController.$inject = ['$scope', '$rootScope'];

    /**
     * Lets the user draw a selection mask on the map.
     * The non-selected area is greyed out.
     *
     * @param scope
     * @param rootScope
     * @constructor
     */
    function MaskController(scope:Scope, rootScope:ng.IScope) {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var map:ol.Map = scope.map,
            currentState:State = State.OFF;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        var layer = new ol.layer.Vector({
            source: new ol.source.Vector()
        });

        var boxInteraction = new ol.interaction.DragBox({
            style: new ol.style.Style({
                stroke: new ol.style.Stroke(style.stroke)
            })
        });

        rootScope.$on(state.EVENT.change, handleStateChange);


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

        function handleMaskComposition(event:ol.render.Event):void {
            renderMask(event.context);
        }

        function handlePostComposition(event:ol.render.Event):void {
            event.context.restore();
        }

        function handleRasterComposition(event:ol.render.Event):void {
            clip(event.context);
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
            if (currentState !== State.OFF) return;

            currentState = State.EMPTY;

            map.addLayer(layer);
            map.addInteraction(boxInteraction);

            layer.on(ol.Map.EVENT.preCompose, handleMaskComposition);
            layer.on(ol.Map.EVENT.postCompose, handlePostComposition);

            boxInteraction.once(ol.interaction.DragBox.EVENT.boxStart, startSelecting);
            boxInteraction.once(ol.interaction.DragBox.EVENT.boxEnd, stopSelecting);
        }

        /**
         * Set the current state.
         */
        function startSelecting():void {
            currentState = State.SELECTING;
        }

        /**
         * The user can no longer draw a selection box, but keep rendering it.
         * When the selection is made, clip the raster feature layers.
         */
        function stopSelecting():void {
            currentState = State.ON;

            _(map.getLayers().getArray())
                .filter('displayInLayerManager')
                .each(startClipping);

            map.removeInteraction(boxInteraction);

            rootScope.$broadcast(EVENT.selected, boxInteraction.getGeometry().getExtent());
        }

        function startClipping(layer:ol.Observable):void {
            layer.on(ol.Map.EVENT.preCompose, handleRasterComposition);
            layer.on(ol.Map.EVENT.postCompose, handlePostComposition);
        }

        function stopClipping(layer:ol.Observable):void {
            layer.on(ol.Map.EVENT.preCompose, handleRasterComposition);
            layer.on(ol.Map.EVENT.postCompose, handlePostComposition);
        }

        /**
         * Stop rendering the selection and re-render the map to remove the current selection.
         */
        function deactivate():void {
            if (currentState === State.OFF) return;

            currentState = State.OFF;

            layer.un(ol.Map.EVENT.preCompose, handleMaskComposition);
            layer.un(ol.Map.EVENT.postCompose, handlePostComposition);

            _(map.getLayers().getArray())
                .filter('displayInLayerManager')
                .each(stopClipping);

            map.removeLayer(layer);
        }


        /* ----------------- */
        /* --- rendering --- */
        /* ----------------- */

        /**
         * Render the mask and clip the non-background raster layers when the selection is complete.
         */
        //function render():void {
        //    if (currentState === State.ON) _.each(rasterContexts, clip);
        //}

        /**
         * Grey out the map except for the current selection box.
         * If there is no selection box, the entire map is greyed out.
         *
         * @param ctx
         */
        function renderMask(ctx:CanvasRenderingContext2D) {
            drawBoxes(ctx);
            ctx.fillStyle = 'rgba(' + style.fill.color.join(', ') + ')';
            ctx.fill();
        }

        /**
         * Clip the Layer that corresponds to the given context so that it is only visible on the outside of the
         * selection mask.
         *
         * @param ctx
         */
        function clip(ctx:CanvasRenderingContext2D):void {
            drawBoxes(ctx);
            ctx.clip();
        }

        /**
         * Draw a rectangle covering the entire map counterclockwise.
         * Draw a rectangle covering the selection area clockwise.
         *
         * @param ctx
         */
        function drawBoxes(ctx:CanvasRenderingContext2D):void {
            ctx.save();
            ctx.beginPath();
            drawRect(ctx, getMapBox().reverse());
            if (currentState !== State.EMPTY) drawRect(ctx, getSelectionBox());
        }

        /**
         * Draw a rectangular shape on the map's Canvas.
         *
         * @param ctx
         * @param box A set of 4 Pixels describing the rectangle.
         */
        function drawRect(ctx:CanvasRenderingContext2D, box:ol.Pixel[]):void {
            var first = box.shift(),
                lineTo = _.bind(ctx.lineTo.apply, ctx.lineTo, ctx);

            ctx.moveTo(first[0], first[1]);
            box.push(first);
            _.each(box, lineTo);
            ctx.closePath();
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

    }

    angular
        .module(Module.EDITOR)
        .directive(NAME, configure);

}
