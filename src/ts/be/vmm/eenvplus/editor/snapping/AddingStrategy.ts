///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    AddingStrategy.$inject = ['epMap', 'epSnappingState'];

    function AddingStrategy(map:ol.Map, state:StateController<SnappingType>):void {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var painter:DrawPrivate,
            nodes:ol.source.Vector,
            snapping:boolean,
            protoPainter:DrawPrivate = <DrawPrivate> ol.interaction.Draw.prototype,
            toPixel = map.getPixelFromCoordinate.bind(map);


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        state(SnappingType.ADD, activate, deactivate);


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        function handleMouseMove(event:ol.MapBrowserPointerEvent):void {
            var snappedCoordinate = calculateCoordinate(event.coordinate);
            invalidateGeometrySnapping(event.coordinate, snappedCoordinate);

            event.coordinate = snappedCoordinate;
            protoPainter.handlePointerMove_.call(painter, event);
        }

        function addToDrawing(event:ol.MapBrowserPointerEvent):void {
            protoPainter.addToDrawing_.call(painter, event);
            if (snapping) painter.finishDrawing_();
        }

        function abortDrawing():ol.Feature {
            snapping = false;
            return protoPainter.abortDrawing_.call(painter);
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        function activate() {
            painter = _.find(map.getInteractions().getArray(), isActivePainter);
            painter.snapTolerance_ = 24;
            painter.handlePointerMove_ = handleMouseMove;
            painter.addToDrawing_ = addToDrawing;
            painter.abortDrawing_ = abortDrawing;
            nodes = feature.getLayer(map, feature.FeatureType.NODE).getSource();
        }

        function isActivePainter(interaction:ol.interaction.Interaction):boolean {
            return interaction instanceof ol.interaction.Draw && interaction.getActive();
        }

        /**
         * Calculate the Coordinate for the endpoint to draw:
         * - we snap only to Nodes, so
         * - find the Node that is closest to the mouse
         * - if it is within `snapTolerance` range, return its Coordinate
         * - otherwise just use the original mouse Coordinate
         *
         * @param mouseCoordinate
         * @returns {ol.Coordinate}
         */
        function calculateCoordinate(mouseCoordinate:ol.Coordinate):ol.Coordinate {
            var closestNode = nodes.getClosestFeatureToCoordinate(mouseCoordinate),
                closestNodeCoordinate = (<ol.geometry.SimpleGeometry> closestNode.getGeometry()).getFirstCoordinate(),
                pixels = [mouseCoordinate, closestNodeCoordinate].map(toPixel),
                distance = Math.sqrt(apply(ol.coordinate.squaredDistance)(pixels));

            return distance > painter.snapTolerance_ ? mouseCoordinate : closestNodeCoordinate;
        }

        /**
         * Go into snapping mode if mouseCoordinate and snappedCoordinate are different.
         * Otherwise leave snapping mode only if necessary (i.e. if we were actually snapping before).
         *
         * @param mouseCoordinate
         * @param snappedCoordinate
         */
        function invalidateGeometrySnapping(mouseCoordinate:ol.Coordinate, snappedCoordinate:ol.Coordinate):void {
            if (!painter.sketchFeature_) return;

            if (ol.coordinate.equals(mouseCoordinate, snappedCoordinate)) {
                if (snapping) unsnap();
            }
            else snap(mouseCoordinate);
        }

        /**
         * If we just started snapping: insert the mouse Coordinate at the before-last position.
         * Otherwise: update the Coordinate at the before-last position with the current mouse Coordinate.
         * Set the `snapping` flag;
         *
         * @param mouseCoordinate
         */
        function snap(mouseCoordinate:ol.Coordinate):void {
            updateGeometryCoordinates((coordinates:ol.Coordinate[]):void => {
                if (snapping) coordinates[coordinates.length - 2] = mouseCoordinate;
                else coordinates.splice(coordinates.length - 1, 0, mouseCoordinate);
            });

            snapping = true;
        }

        /**
         * Remove the Coordinate at the before-last position and unset the `snapping` flag.
         */
        function unsnap():void {
            updateGeometryCoordinates((coordinates:ol.Coordinate[]):void => {
                coordinates.splice(coordinates.length - 1, 1);
            });

            snapping = false;
        }

        /**
         * Get the current Coordinate list from the LineString,
         * modify it and re-apply it so that OL is aware of the change.
         *
         * @param update The callback that will apply modifications to the Coordinates.
         */
        function updateGeometryCoordinates(update:(coordinates:ol.Coordinate[]) => void):void {
            var line = <ol.geometry.LineString> painter.sketchFeature_.getGeometry(),
                coordinates = line.getCoordinates();

            update(coordinates);
            line.setCoordinates(coordinates);
        }

        /**
         * Unset all intercepted methods so that we don't leave any accidental references in memory.
         */
        function deactivate() {
            if (painter.handlePointerMove_ === handleMouseMove)
                painter.handlePointerMove_ = null;
            if (painter.addToDrawing_ === addToDrawing)
                painter.addToDrawing_ = null;
            if (painter.abortDrawing_ === abortDrawing)
                painter.abortDrawing_ = null;
            painter = null;
        }

    }

    angular
        .module(MODULE)
        .run(AddingStrategy);

}
