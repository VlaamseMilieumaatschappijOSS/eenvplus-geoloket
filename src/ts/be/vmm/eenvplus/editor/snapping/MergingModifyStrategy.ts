///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    MergingModifyStrategy.$inject = ['epModifyStrategy'];

    /**
     * A snapping strategy applied to the Modify interaction that moves ending vertices to a snapped Node.
     *
     * @param createModify
     * @constructor
     */
    function MergingModifyStrategy(createModify:ModifyStrategyFactory):void {

        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        var modify = createModify(SnappingType.MERGE, activate, deactivate);

        /**
         * Only intercept when the mouse is being dragged within snapping range of any point.
         *
         * @param monitor
         */
        function activate(monitor:SnappingMonitor):void {
            monitor.moveAtEnd.add(dragAtNode);
            monitor.moveAtStart.add(dragAtNode);
            monitor.moveOutside.add(modify.pointerDrag);
        }


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        /**
         * Replace the original Coordinate with the snappedCoordinate
         * so that Modify will place the vertex at the snapped position instead of the current mouse position.
         *
         * @param event
         */
        function dragAtNode(event:SnappingPointerEvent):void {
            event.coordinate = event.snappedCoordinate;
            modify.pointerDrag(event);
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
            monitor.moveAtEnd.remove(dragAtNode);
            monitor.moveAtStart.remove(dragAtNode);
            monitor.moveOutside.remove(modify.pointerDrag);
        }

    }

    angular
        .module(MODULE)
        .run(MergingModifyStrategy);

}
