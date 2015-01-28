///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    MergingDrawStrategy.$inject = ['epDrawStrategy'];

    /**
     * A snapping strategy that moves the projected vertex to the snapped Node.
     *
     * @param createDraw
     * @constructor
     */
    function MergingDrawStrategy(createDraw:DrawStrategyFactory):void {

        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        var draw = createDraw(SnappingType.MERGE, activate, deactivate);

        /**
         * Only intercept when the mouse is moving within snapping range of any point.
         *
         * @param monitor
         */
        function activate(monitor:SnappingMonitor):void {
            monitor.moveAtEnd.add(moveAtPoint);
            monitor.moveAtStart.add(moveAtPoint);
            monitor.moveOutside.add(draw.pointerMove);
        }


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        /**
         * Replace the original Coordinate with the snappedCoordinate
         * so that Draw will place the vertex at the snapped position instead of the current mouse position.
         *
         * @param event
         */
        function moveAtPoint(event:SnappingPointerEvent):void {
            event.coordinate = event.snappedCoordinate;
            draw.pointerMove(event);
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
            monitor.moveAtEnd.remove(moveAtPoint);
            monitor.moveAtStart.remove(moveAtPoint);
            monitor.moveOutside.remove(draw.pointerMove);
        }

    }

    angular
        .module(MODULE)
        .run(MergingDrawStrategy);

}
