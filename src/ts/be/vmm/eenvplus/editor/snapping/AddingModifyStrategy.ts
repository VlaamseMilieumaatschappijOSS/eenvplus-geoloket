///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    AddingModifyStrategy.$inject = ['epModifyStrategy'];

    function AddingModifyStrategy(createModify:ModifyStrategyFactory):void {

        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        var modify = createModify(SnappingType.ADD, activate, deactivate),
            snapToStart = _.partialRight(snap, getStartSegment),
            snapToEnd = _.partialRight(snap, getEndSegment);

        /**
         * When the mouse is being dragged within snapping range of a starting point or outside snapping range,
         * the original behaviour of the interaction is used. All other state changes are intercepted.
         *
         * @param monitor
         */
        function activate(monitor:SnappingMonitor):void {
            monitor.moveAtEnd.add(modify.pointerDrag);
            monitor.moveAtStart.add(modify.pointerDrag);
            monitor.moveOutside.add(modify.pointerDrag);
            monitor.snapInEnd.add(snapToEnd);
            monitor.snapInStart.add(snapToStart);
            monitor.snapOutEnd.add(unsnapEnd);
            monitor.snapOutStart.add(unsnapStart);
        }


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        /**
         * Place the dragged starting vertex at the snapping coordinate,
         * then insert a new vertex on the start segment and put it at the mouse Coordinate.
         *
         * Note: because `insertVertex()` will push the two newly created segments into `dragSegments_`,
         * we need to remove the old one (i.e. the first one in the stack).
         *
         * @param event
         * @param getSegment
         * @see Modify#handlePointerDrag
         * @see Modify#insertVertex_
         */
        function snap(event:SnappingPointerEvent, getSegment:() => ol.interaction.SegmentDataType):void {
            event.coordinate = event.snappedCoordinate;
            modify.pointerDrag(event);

            modify.insertVertex(getSegment(), event.mouseCoordinate);
            modify.dragSegments.shift();
        }

        /**
         * Remove the dragged vertex (currently the one in second position),
         * reset the `dragSegments` to their original state and call through to `pointerDrag`.
         *
         * @param event
         */
        function unsnapStart(event:SnappingPointerEvent):void {
            modify.removeVertex();
            modify.dragSegments.pop();
            modify.dragSegments[0][0] = getStartSegment();
            modify.dragSegments[0][1] = 0;
            modify.pointerDrag(event);
        }

        /**
         * Remove the dragged vertex (currently the one in before-last position),
         * reset the `dragSegments` to their original state and call through to `pointerDrag`.
         *
         * @param event
         */
        function unsnapEnd(event:SnappingPointerEvent):void {
            modify.removeVertex();
            modify.dragSegments.pop();
            modify.dragSegments[0][0] = getEndSegment();
            modify.dragSegments[0][1] = 1;
            modify.pointerDrag(event);
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        /**
         * @returns The first segment of the modified Feature.
         */
        function getStartSegment():ol.interaction.SegmentDataType {
            return getSegmentAt(modify.getGeometry().getFirstCoordinate());
        }

        /**
         * @returns The last segment of the modified Feature.
         */
        function getEndSegment():ol.interaction.SegmentDataType {
            return getSegmentAt(modify.getGeometry().getLastCoordinate());
        }

        /**
         * @param coordinate
         * @returns The segment of the modified feature that contains the given Coordinate.
         */
        function getSegmentAt(coordinate:ol.Coordinate):ol.interaction.SegmentDataType {
            var equals = _.partial(ol.coordinate.equals, coordinate);

            return modify.findSegment((segment:ol.interaction.SegmentDataType):boolean => {
                return equals(segment.segment[0]) || equals(segment.segment[1]);
            });
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
            monitor.moveAtEnd.remove(modify.pointerDrag);
            monitor.moveAtStart.remove(modify.pointerDrag);
            monitor.moveOutside.remove(modify.pointerDrag);
            monitor.snapInEnd.remove(snapToEnd);
            monitor.snapInStart.remove(snapToStart);
            monitor.snapOutEnd.remove(unsnapEnd);
            monitor.snapOutStart.remove(unsnapStart);
        }

    }

    angular
        .module(MODULE)
        .run(AddingModifyStrategy);

}
