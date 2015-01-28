///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    AddingDrawStrategy.$inject = ['epDrawStrategy'];

    /**
     * A snapping strategy that creates new segments between the current mouse position and the snapped Node.
     *
     * @param createDraw
     * @constructor
     */
    function AddingDrawStrategy(createDraw:DrawStrategyFactory):void {

        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        var draw = createDraw(SnappingType.ADD, activate, deactivate);

        /**
         * When the mouse moves within snapping range of a starting point or outside snapping range,
         * the original behaviour of the interaction is used. All other state changes are intercepted.
         *
         * @param monitor
         */
        function activate(monitor:SnappingMonitor):void {
            monitor.moveAtEnd.add(moveAtEnd);
            monitor.moveAtStart.add(draw.pointerMove);
            monitor.moveOutside.add(draw.pointerMove);
            monitor.snapInEnd.add(snapToEnd);
            monitor.snapInStart.add(snapToStart);
            monitor.snapOutEnd.add(unsnapEnd);
            monitor.snapOutStart.add(unsnapStart);
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
            draw.pointerMove(event);

            if (draw.isPristine()) {
                draw.startDrawing(event);
                draw.updateCoordinates(_.partial(createStartSegment, event.mouseCoordinate));
            }
        }

        /**
         * If no additional segments were added, discard the projected initial segment.
         */
        function unsnapStart():void {
            if (draw.numVertices() === 2) draw.abortDrawing();
        }


        /**
         * Create an end segment between the current mouseCoordinate and the snappedCoordinate.
         *
         * @param event
         */
        function snapToEnd(event:SnappingPointerEvent):void {
            draw.updateCoordinates(_.partial(createEndSegment, event.mouseCoordinate));
        }

        /**
         * Draw#handlePointerMove_ only updates the last vertex of the Feature, i.e. the one that is snapped,
         * so we need to manually keep the before-last vertex updated.
         *
         * @param event
         */
        function moveAtEnd(event:SnappingPointerEvent):void {
            event.coordinate = event.snappedCoordinate;
            draw.updateCoordinates(_.partial(updateEndSegment, event.mouseCoordinate));
            draw.pointerMove(event);
        }

        /**
         * If the Feature wasn't finished, we need to discard the projected end segment.
         */
        function unsnapEnd():void {
            draw.updateCoordinates(discardEndSegment);
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

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


        /* ------------------- */
        /* --- destruction --- */
        /* ------------------- */

        /**
         * Remove all listeners from the monitor.
         *
         * @param monitor
         */
        function deactivate(monitor:SnappingMonitor):void {
            monitor.moveAtEnd.remove(moveAtEnd);
            monitor.moveAtStart.remove(draw.pointerMove);
            monitor.moveOutside.remove(draw.pointerMove);
            monitor.snapInEnd.remove(snapToEnd);
            monitor.snapInStart.remove(snapToStart);
            monitor.snapOutEnd.remove(unsnapEnd);
            monitor.snapOutStart.remove(unsnapStart);
        }

    }

    angular
        .module(MODULE)
        .run(AddingDrawStrategy);

}
