module be.vmm.eenvplus.editor.geometry {
    'use strict';

    ModifyTool.$inject = ['epMap', 'epGeometryEditorState', 'epFeatureStore'];

    interface ModifyPrivate extends ol.interaction.Modify {
        overlay_:ol.Overlay;
        pixelTolerance_:number;
        rBush_:ol.struct.RBush<ol.interaction.SegmentDataType>;
        snappedToVertex_:boolean;
        vertexFeature_:ol.Feature;
        vertexSegments_:SegmentMap;

        createOrUpdateVertexFeature_(vertex:ol.Coordinate):void;
        handlePointerAtPixel_(pixel:ol.Pixel):void;
    }

    interface SegmentMap {
        [uid:string]: boolean;
    }

    export function ModifyTool(map:ol.Map, state:StateController<EditorType>, featureStore:feature.FeatureStore):void {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var modify:ModifyPrivate = <ModifyPrivate> new ol.interaction.Modify({
            features: featureStore.selection
        });


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        state(EditorType.MODIFY, activate, deactivate);
        modify.handlePointerAtPixel_ = handlePointerAtPixel;


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        function handlePointerAtPixel(pixel:ol.Pixel):void {
            var pixelCoordinate = map.getCoordinateFromPixel(pixel),
                closestSegment = getClosestSegment(pixel, pixelCoordinate);
            closestSegment ? snap(pixel, pixelCoordinate, closestSegment) : unsnap();
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        function activate():void {
            map.addInteraction(modify);
        }

        function getClosestSegment(pixel:ol.Pixel, coordinate:ol.Coordinate):ol.Coordinate[] {
            var tolerance:number = modify.pixelTolerance_,
                lowerLeft = map.getCoordinateFromPixel([pixel[0] - tolerance, pixel[1] + tolerance]),
                upperRight = map.getCoordinateFromPixel([pixel[0] + tolerance, pixel[1] - tolerance]),
                box = ol.extent.boundingExtent([lowerLeft, upperRight]),
                nodes = modify.rBush_.getInExtent(box),
                dist = ol.coordinate.squaredDistanceToSegment;
            if (!nodes.length) return null;

            return _.reduce(_.map(nodes, 'segment'), (prev:ol.Coordinate[], curr:ol.Coordinate[]):ol.Coordinate[] => {
                return dist(coordinate, prev) < dist(coordinate, curr) ? prev : curr;
            });
        }

        function snap(mousePixel:ol.Pixel, mouseCoordinate:ol.Coordinate, segment:ol.Coordinate[]):void {
            var vertex = ol.coordinate.closestOnSegment(mouseCoordinate, segment),
                vertexPixel = map.getPixelFromCoordinate(vertex);
            if (Math.sqrt(ol.coordinate.squaredDistance(mousePixel, vertexPixel)) > modify.pixelTolerance_) return;

            var pixel1 = map.getPixelFromCoordinate(segment[0]),
                pixel2 = map.getPixelFromCoordinate(segment[1]),
                squaredDist1 = ol.coordinate.squaredDistance(vertexPixel, pixel1),
                squaredDist2 = ol.coordinate.squaredDistance(vertexPixel, pixel2),
                dist = Math.sqrt(Math.min(squaredDist1, squaredDist2));

            modify.snappedToVertex_ = dist <= modify.pixelTolerance_;
            if (modify.snappedToVertex_) vertex = squaredDist1 > squaredDist2 ? segment[1] : segment[0];

            modify.createOrUpdateVertexFeature_(vertex);
            modify.vertexSegments_ = {};
            modify.vertexSegments_[goog.getUid(segment)] = true;
        }

        function unsnap():void {
            if (!goog.isNull(modify.vertexFeature_)) {
                modify.overlay_.removeFeature(modify.vertexFeature_);
                modify.vertexFeature_ = null;
            }
        }

        function deactivate():void {
            map.removeInteraction(modify);
        }

    }

    angular
        .module(MODULE)
        .run(ModifyTool);

}
