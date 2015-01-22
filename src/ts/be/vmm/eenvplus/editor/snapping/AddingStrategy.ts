///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    AddingStrategy.$inject = ['epMap', 'epSnappingState', 'epSnappingMonitor'];

    /**
     * A snapping strategy that creates new segments between the current mouse position and the snapped Node.
     *
     * @param map
     * @param state
     * @param monitor
     * @constructor
     */
    function AddingStrategy(map:ol.Map, state:StateController<SnappingType>, monitor:SnappingMonitor):void {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var painter:DrawPrivate,
            superPointerMove,
            superAddToDrawing;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        state(SnappingType.ADD, activate, deactivate);

        /**
         * Find the interaction to add snapping abilities to and set up overrides and event listeners.
         * When the mouse moves within snapping range of a starting point or outside snapping range,
         * the original behaviour of the interaction is used. All other state changes are intercepted.
         * Also turn off the original snapping behaviour by setting `snapTolerance_` to 1.
         */
        function activate() {
            painter = _.find(map.getInteractions().getArray(), isActivePainter);
            if (!painter) {
                console.log('To be implemented');
                return;
            }

            painter.snapTolerance_ = 1;
            painter.handlePointerMove_ = handlePointerMove;
            painter.addToDrawing_ = addToDrawing;

            var proto = <DrawPrivate> ol.interaction.Draw.prototype;
            superPointerMove = proto.handlePointerMove_.bind(painter);
            superAddToDrawing = proto.addToDrawing_.bind(painter);

            monitor.moveAtEnd.add(moveAtEnd);
            monitor.moveAtStart.add(superPointerMove);
            monitor.moveOutside.add(superPointerMove);
            monitor.snapInEnd.add(snapToEnd);
            monitor.snapInStart.add(snapToStart);
            monitor.snapOutEnd.add(unsnapEnd);
            monitor.snapOutStart.add(unsnapStart);
        }


        /* ----------------- */
        /* --- overrides --- */
        /* ----------------- */

        /**
         * Pass all mouse move events down to the SnappingMonitor for analysis of current snapping possibilities.
         *
         * @override
         * @see ol.interaction.Draw#handlePointerMove_
         * @see SnappingMonitor#update
         */
        function handlePointerMove(event:ol.MapBrowserPointerEvent):void {
            monitor.update(event, painter.sketchFeature_);
        }

        /**
         * Finish drawing when the user single-snap-clicks to an end point.
         *
         * @override
         * @see ol.interaction.Draw#addToDrawing_
         * @see ol.interaction.Draw#finishDrawing_
         */
        function addToDrawing(event:SnappingPointerEvent):void {
            superAddToDrawing(event);
            if (event.end) painter.finishDrawing_();
        }


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        /**
         * Start the drawing by creating a first segment between the snappedCoordinate and the mouseCoordinate.
         *
         * @param event
         * @see ol.interaction.Draw#startDrawing_
         */
        function snapToStart(event:SnappingPointerEvent):void {
            event.coordinate = event.snappedCoordinate;
            superPointerMove(event);

            if (!painter.finishCoordinate_) {
                painter.startDrawing_(event);
                updateGeometryCoordinates(_.partial(createStartSegment, event.mouseCoordinate));
            }
        }

        /**
         * If no additional segments were added, discard the projected initial segment.
         */
        function unsnapStart():void {
            if (numVertices() === 2) painter.abortDrawing_();
        }


        /**
         * Create an end segment between the current mouseCoordinate and the snappedCoordinate.
         *
         * @param event
         */
        function snapToEnd(event:SnappingPointerEvent):void {
            updateGeometryCoordinates(_.partial(createEndSegment, event.mouseCoordinate));
        }

        /**
         * Draw#handlePointerMove_ only updates the last vertex of the Feature, i.e. the one that is snapped,
         * so we need to manually keep the before-last vertex updated.
         *
         * @param event
         */
        function moveAtEnd(event:SnappingPointerEvent):void {
            event.coordinate = event.snappedCoordinate;
            updateGeometryCoordinates(_.partial(updateEndSegment, event.mouseCoordinate));
            superPointerMove(event);
        }

        /**
         * If the Feature wasn't finished, we need to discard the projected end segment.
         */
        function unsnapEnd():void {
            updateGeometryCoordinates(discardEndSegment);
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        /**
         * @param interaction
         * @returns Whether the given Interaction is a `Draw` and currently active.
         */
        function isActivePainter(interaction:ol.interaction.Interaction):boolean {
            return interaction instanceof ol.interaction.Draw && interaction.getActive();
        }

        /**
         * Create a projected start segment by replacing the last Coordinate with the current mouseCoordinate.
         * (Draw#startDrawing_ starts with a single segment that has both Coordinates at the same point)
         *
         * @param mouseCoordinate
         * @param coordinates
         */
        function createStartSegment(mouseCoordinate:ol.Coordinate, coordinates:ol.Coordinate[]):void {
            coordinates[coordinates.length - 1] = mouseCoordinate;
        }

        /**
         * Create a projected end segment by injecting the current mouseCoordinate at the before-last position.
         * (The snappedCoordinate will be at the last position)
         *
         * @param mouseCoordinate
         * @param coordinates
         */
        function createEndSegment(mouseCoordinate:ol.Coordinate, coordinates:ol.Coordinate[]):void {
            coordinates.splice(coordinates.length - 1, 0, mouseCoordinate);
        }

        /**
         * Update the end segment by keeping the vertex at the before-last position up-to-date.
         *
         * @param mouseCoordinate
         * @param coordinates
         */
        function updateEndSegment(mouseCoordinate:ol.Coordinate, coordinates:ol.Coordinate[]):void {
            coordinates[coordinates.length - 2] = mouseCoordinate;
        }

        /**
         * Discard the projected end segment by removing the vertex at the before-last position.
         * (The current mouse position will determine the last vertex again)
         *
         * @param coordinates
         */
        function discardEndSegment(coordinates:ol.Coordinate[]):void {
            coordinates.splice(coordinates.length - 1, 1);
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
         * @returns The current number of vertices in the LineString.
         */
        function numVertices():number {
            var line = <ol.geometry.LineString> painter.sketchFeature_.getGeometry();
            return line.getCoordinates().length;
        }


        /* ------------------- */
        /* --- destruction --- */
        /* ------------------- */

        /**
         * Remove all listeners and unset all overrides so that we don't leave any accidental references in memory.
         */
        function deactivate() {
            monitor.moveAtEnd.remove(moveAtEnd);
            monitor.moveAtStart.remove(superPointerMove);
            monitor.moveOutside.remove(superPointerMove);
            monitor.snapInEnd.remove(snapToEnd);
            monitor.snapInStart.remove(snapToStart);
            monitor.snapOutEnd.remove(unsnapEnd);
            monitor.snapOutStart.remove(unsnapStart);

            if (!painter) return;

            if (painter.handlePointerMove_ === handlePointerMove) painter.handlePointerMove_ = superPointerMove;
            if (painter.addToDrawing_ === addToDrawing) painter.addToDrawing_ = superAddToDrawing;
            painter = null;
        }

    }

    angular
        .module(MODULE)
        .run(AddingStrategy);

}
