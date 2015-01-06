module be.vmm.eenvplus.editor.geometry {
    'use strict';

    interface ModifyPrivate extends ol.interaction.Modify {
        dragSegments_:any[];
        overlay_:ol.Overlay;
        lastPixel_:ol.Pixel;
        pixelTolerance_:number;
        rBush_:ol.struct.RBush<ol.interaction.SegmentDataType>;
        snappedToVertex_:boolean;
        vertexFeature_:ol.Feature;
        vertexSegments_:SegmentMap;

        createOrUpdateVertexFeature_(vertex:ol.Coordinate):void;
        handleDownEvent_(event:ol.MapBrowserEvent):void;
        handlePointerAtPixel_(pixel:ol.Pixel):void;
        handlePointerMove_(event:ol.MapBrowserEvent):void;
        handleUpEvent_(event:ol.MapBrowserEvent):void;
        removeVertex_():void;
    }

    interface SegmentMap {
        [uid:string]: boolean;
    }


    ModifyTool.$inject = ['epMap', 'epGeometryEditorState', 'epGeometryActionStore', 'epFeatureStore'];

    export function ModifyTool(map:ol.Map,
                               state:StateController<EditorType>,
                               actionStore:ActionStore,
                               featureStore:feature.FeatureStore):void {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var hasKeyModifier:boolean = false,
            modify:ModifyPrivate = <ModifyPrivate> new ol.interaction.Modify({
                features: featureStore.selection,
                deleteCondition: goog.functions.and(ol.events.condition.altKeyOnly, ol.events.condition.singleClick)
            });


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        state(EditorType.MODIFY, activate, deactivate);
        modify.handlePointerMove_ = handleMouseMove;
        modify.handlePointerAtPixel_ = handlePointerAtPixel;


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        function handleKey(event:KeyboardEvent):void {
            hasKeyModifier = event.altKey;

            if (modify.vertexFeature_) {
                var vertex = <ol.geometry.Point> modify.vertexFeature_.getGeometry();
                actionStore.current = determineAction(vertex.getCoordinates());
            }
            else actionStore.current = Action.NONE;
        }

        function handleMouseMove(event:ol.MapBrowserEvent):void {
            hasKeyModifier = ol.events.condition.altKeyOnly(event);
            modify.lastPixel_ = event.pixel;
            handlePointerAtPixel(event.pixel);
        }

        function handlePointerAtPixel(pixel:ol.Pixel):void {
            var pixelCoordinate = map.getCoordinateFromPixel(pixel),
                closestSegment = getClosestSegment(pixel, pixelCoordinate);
            closestSegment ? snap(pixel, pixelCoordinate, closestSegment) : unsnap();
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        function activate():void {
            document.onkeydown = handleKey;
            document.onkeyup = handleKey;
            map.addInteraction(modify);
        }

        function getClosestSegment(pixel:ol.Pixel, coordinate:ol.Coordinate):ol.Coordinate[] {
            var tolerance:number = modify.pixelTolerance_,
                lowerLeft = map.getCoordinateFromPixel(<any> [pixel[0] - tolerance, pixel[1] + tolerance]),
                upperRight = map.getCoordinateFromPixel(<any> [pixel[0] + tolerance, pixel[1] - tolerance]),
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
            if (modify.snappedToVertex_)
                vertex = squaredDist1 > squaredDist2 ? segment[1] : segment[0];

            actionStore.current = determineAction(vertex);
            modify.createOrUpdateVertexFeature_(vertex);
            modify.vertexSegments_ = {};
            modify.vertexSegments_[goog.getUid(segment)] = true;
        }

        /**
         * Determine the action to take based on the snapped vertex:
         * - if it's on a segment, we can add a vertex
         * - if it's on a vertex, we can move it around
         * - if it's on a vertex with the Alt key pressed, we can delete it,
         * unless it's the start/end vertex of the geometry
         *
         * @param vertex
         * @returns The action to take.
         */
        function determineAction(vertex:ol.Coordinate):Action {
            if (!modify.snappedToVertex_) return Action.ADD;

            var featureCoordinates = featureStore.current.geometry.coordinates,
                isEndVertex =
                    ol.coordinate.equals(vertex, _.first(featureCoordinates)) ||
                    ol.coordinate.equals(vertex, _.last(featureCoordinates));

            return isEndVertex || !hasKeyModifier ? Action.MOVE : Action.REMOVE;
        }

        function unsnap():void {
            if (!goog.isNull(modify.vertexFeature_)) {
                modify.overlay_.removeFeature(modify.vertexFeature_);
                modify.vertexFeature_ = null;
                actionStore.current = Action.NONE;
            }
        }

        function deactivate():void {
            map.removeInteraction(modify);
            document.onkeydown = document.onkeyup = null;
        }

    }

    angular
        .module(MODULE)
        .run(ModifyTool);

}
