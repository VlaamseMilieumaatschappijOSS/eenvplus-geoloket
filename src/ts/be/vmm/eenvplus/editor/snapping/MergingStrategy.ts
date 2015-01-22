///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    MergingStrategy.$inject = ['epMap', 'epSnappingState', 'epSnappingMonitor'];

    function MergingStrategy(map:ol.Map, state:StateController<SnappingType>, monitor:SnappingMonitor):void {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var painter:DrawPrivate,
            superPointerMove,
            superAddToDrawing;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        state(SnappingType.MERGE, activate, deactivate);

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

            monitor.moveAtEnd.add(moveAtPoint);
            monitor.moveAtStart.add(moveAtPoint);
            monitor.moveOutside.add(superPointerMove);
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

        function moveAtPoint(event:SnappingPointerEvent):void {
            event.coordinate = event.snappedCoordinate;
            superPointerMove(event);
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        function isActivePainter(interaction:ol.interaction.Interaction):boolean {
            return interaction instanceof ol.interaction.Draw && interaction.getActive();
        }


        /* ------------------- */
        /* --- destruction --- */
        /* ------------------- */

        function deactivate() {
            monitor.moveAtEnd.remove(moveAtPoint);
            monitor.moveAtStart.remove(moveAtPoint);
            monitor.moveOutside.remove(superPointerMove);

            if (!painter) return;

            if (painter.handlePointerMove_ === handlePointerMove) painter.handlePointerMove_ = superPointerMove;
            if (painter.addToDrawing_ === addToDrawing) painter.addToDrawing_ = superAddToDrawing;
            painter = null;
        }

    }

    angular
        .module(MODULE)
        .run(MergingStrategy);

}
