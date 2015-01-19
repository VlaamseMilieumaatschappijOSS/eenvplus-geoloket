///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    MergingStrategy.$inject = ['epMap', 'epSnappingState'];

    function MergingStrategy(map:ol.Map, state:StateController<SnappingType>):void {

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

        state(SnappingType.MERGE, activate, deactivate);


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
            if (!painter) {
                console.log('To be implemented');
                return;
            }

            painter.handlePointerMove_ = handleMouseMove;
            painter.addToDrawing_ = addToDrawing;
            painter.abortDrawing_ = abortDrawing;
            nodes = feature.getLayer(map, feature.FeatureType.NODE).getSource();
        }

        function isActivePainter(interaction:ol.interaction.Interaction):boolean {
            return interaction instanceof ol.interaction.Draw && interaction.getActive();
        }

        function calculateCoordinate(coordinate:ol.Coordinate):ol.Coordinate {
            var closestNode = nodes.getClosestFeatureToCoordinate(coordinate),
                closestNodeCoordinate = (<ol.geometry.SimpleGeometry> closestNode.getGeometry()).getFirstCoordinate(),
                pixels = [coordinate, closestNodeCoordinate].map(toPixel),
                distance = Math.sqrt(apply(ol.coordinate.squaredDistance)(pixels));

            return distance > painter.snapTolerance_ ? coordinate : closestNodeCoordinate;
        }

        function invalidateGeometrySnapping(mouseCoordinate:ol.Coordinate, snappedCoordinate:ol.Coordinate):void {
            if (!painter.sketchFeature_) return;

            if (ol.coordinate.equals(mouseCoordinate, snappedCoordinate)) {
                if (snapping) snapping = false;
            }
            else snapping = true;
        }

        function deactivate() {
            if (!painter) return;

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
        .run(MergingStrategy);

}
