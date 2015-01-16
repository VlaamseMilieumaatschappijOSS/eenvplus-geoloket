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
            toPixel = map.getPixelFromCoordinate.bind(map);


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        state(SnappingType.MERGE, activate, deactivate);


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        function handleMouseMove(event:ol.MapBrowserPointerEvent):void {
            event.coordinate = calculateCoordinate(event.coordinate);
            (<DrawPrivate> ol.interaction.Draw.prototype).handlePointerMove_.call(painter, event);
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        function activate() {
            painter = _.find(map.getInteractions().getArray(), isActivePainter);
            painter.handlePointerMove_ = handleMouseMove;
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

        function deactivate() {
            if (painter.handlePointerMove_ === handleMouseMove)
                painter.handlePointerMove_ = null;
            painter = null;
        }

    }

    angular
        .module(MODULE)
        .run(MergingStrategy);

}
