///ts:ref=ApplicationState
/// <reference path="../../ApplicationState.ts"/> ///ts:ref:generated
///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.area.mask {
    'use strict';

    export var NAME:string = PREFIX + 'Mask';

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

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            controller: MaskController
        };
    }

    MaskController.$inject = ['$scope'];

    /**
     * Lets the user draw a selection mask on the map.
     * The non-selected area is greyed out.
     *
     * @param scope
     * @constructor
     */
    function MaskController(scope:ApplicationScope) {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var map:ol.Map = scope.map,
            currentState:State = State.OFF;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        var maskLayer = new ol.layer.Vector({
            source: new ol.source.Vector()
        });

        var boxInteraction = new ol.interaction.DragBox({
            style: new ol.style.Style({
                stroke: new ol.style.Stroke(style.stroke)
            })
        });

        scope.$on(applicationState.EVENT.modeChange, handleModeChange);


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        /**
         * When edit mode is enabled on the map, the user can start drawing a selection mask.
         * When it is disabled, the selection mask is removed.
         *
         * @param event
         * @param editMode
         */
        function handleModeChange(event:ng.IAngularEvent, editMode:applicationState.State):void {
            editMode === applicationState.State.EDIT ? activate() : deactivate();
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

            map.addLayer(maskLayer);
            map.addInteraction(boxInteraction);

            maskLayer.on(ol.render.EventType.PRECOMPOSE, handleMaskComposition);
            maskLayer.on(ol.render.EventType.POSTCOMPOSE, handlePostComposition);

            boxInteraction.once(ol.DragBoxEventType.BOXSTART, startSelecting);
            boxInteraction.once(ol.DragBoxEventType.BOXEND, stopSelecting);
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

            scope.$broadcast(EVENT.selected, boxInteraction.getGeometry().getExtent());
        }

        function startClipping(layer:ol.Observable):void {
            layer.on(ol.render.EventType.PRECOMPOSE, handleRasterComposition);
            layer.on(ol.render.EventType.POSTCOMPOSE, handlePostComposition);
        }

        function stopClipping(layer:ol.Observable):void {
            layer.un(ol.render.EventType.PRECOMPOSE, handleRasterComposition);
            layer.un(ol.render.EventType.POSTCOMPOSE, handlePostComposition);
        }

        /**
         * Stop rendering the selection and re-render the map to remove the current selection.
         */
        function deactivate():void {
            if (currentState === State.OFF) return;

            currentState = State.OFF;

            maskLayer.un(ol.render.EventType.PRECOMPOSE, handleMaskComposition);
            maskLayer.un(ol.render.EventType.POSTCOMPOSE, handlePostComposition);

            _(map.getLayers().getArray())
                .filter('displayInLayerManager')
                .each(stopClipping);

            map.removeLayer(maskLayer);
        }


        /* ----------------- */
        /* --- rendering --- */
        /* ----------------- */

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
            ].map((fns:Function[]):ol.Coordinate => {
                    return _.map(fns, (fn:Function, xy:number):number => {
                        return fn.apply(null, _.map(coordinates, xy));
                    });
                });
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
