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
            toPixel = map.getPixelFromCoordinate.bind(map);


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        state(SnappingType.ADD, activate, deactivate);


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        function handleMouseMove(event:ol.MapBrowserPointerEvent):void {
            var snappedCoordinate = calculateCoordinate(event.coordinate),
                snapped = !ol.coordinate.equals(event.coordinate, snappedCoordinate);

            if (painter.sketchFeature_) {
                if (snapped) {
                    var line = <ol.geometry.LineString> painter.sketchFeature_.getGeometry(),
                        coordinates = line.getCoordinates();

                    // insert at before-last position
                    if (snapping) coordinates[coordinates.length - 2] = event.coordinate;
                    else coordinates.splice(coordinates.length - 1, 0, event.coordinate);

                    line.setCoordinates(coordinates);
                    snapping = true;
                }
                else {
                    //coordinates.
                    snapping = false;
                }
            }

            event.coordinate = snappedCoordinate;
            (<DrawPrivate> ol.interaction.Draw.prototype).handlePointerMove_.call(painter, event);
        }

        function addToDrawing(event:ol.MapBrowserPointerEvent):void {
            (<DrawPrivate> ol.interaction.Draw.prototype).addToDrawing_.call(painter, event);
            if (snapping) painter.finishDrawing_();
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        function activate() {
            painter = _.find(map.getInteractions().getArray(), isActivePainter);
            painter.snapTolerance_ = 24;
            painter.handlePointerMove_ = handleMouseMove;
            painter.addToDrawing_ = addToDrawing;
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
            if (painter.addToDrawing_ === addToDrawing)
                painter.addToDrawing_ = null;
            painter = null;
        }

    }

    angular
        .module(MODULE)
        .run(AddingStrategy);

}
