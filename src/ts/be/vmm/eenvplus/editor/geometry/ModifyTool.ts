module be.vmm.eenvplus.editor.geometry {
    'use strict';

    export interface ModifyPrivate extends ol.interaction.Modify {
        dragSegments_:any[];
        features_:ol.Collection<ol.Feature>;
        overlay_:ol.Overlay;
        lastPixel_:ol.Pixel;
        pixelTolerance_:number;
        rBush_:ol.struct.RBush<ol.interaction.SegmentDataType>;
        snappedToVertex_:boolean;
        vertexFeature_:ol.Feature;
        vertexSegments_:SegmentMap;

        createOrUpdateVertexFeature_(vertex:ol.Coordinate):void;
        handlePointerAtPixel_(pixel:ol.Pixel):void;
        handlePointerMove_(event:ol.MapBrowserPointerEvent):void;
        removeVertex_():void;
    }

    // OL 3.1.0
    export interface ModifyPrivate {
        handlePointerDown(event:ol.MapBrowserPointerEvent):boolean;
        handlePointerDrag(event:ol.MapBrowserPointerEvent):void;
        handlePointerUp(event:ol.MapBrowserPointerEvent):boolean;
    }

    // OL 3.1.1
    export interface ModifyPrivate {
        handleDownEvent_(event:ol.MapBrowserPointerEvent):boolean;
        handleDragEvent_(event:ol.MapBrowserPointerEvent):void;
        handleUpEvent_(event:ol.MapBrowserPointerEvent):boolean;
    }

    export interface SegmentMap {
        [uid:string]: boolean;
    }


    ModifyTool.$inject = [
        'epMap', 'epGeometryEditorState', 'epGeometryActionStore',
        'epFeatureStore', 'epFeatureManager', 'epFeatureSync'
    ];

    export function ModifyTool(map:ol.Map,
                               state:StateController<EditorType>,
                               actionStore:ActionStore,
                               featureStore:feature.FeatureStore,
                               featureManager:feature.FeatureManager,
                               featureSync:feature.FeatureSync):void {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var node:feature.model.FeatureJSON,
            hasKeyModifier:boolean = false,
            protoModify:ModifyPrivate = <ModifyPrivate> ol.interaction.Modify.prototype,
            modify:ModifyPrivate = <ModifyPrivate> new ol.interaction.Modify({
                features: featureStore.selection,
                deleteCondition: goog.functions.and(ol.events.condition.altKeyOnly, ol.events.condition.singleClick)
            });

        function setNode(value:feature.model.FeatureJSON):void {
            node = value;
        }


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        state(EditorType.MODIFY, activate, deactivate);
        modify.handlePointerAtPixel_ = handlePointerAtPixel;
        modify.handlePointerDown = handleMouseDown;
        modify.handlePointerMove_ = handleMouseMove;
        modify.handlePointerUp = handleMouseUp;


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

        function handleMouseDown(event:ol.MapBrowserPointerEvent):boolean {
            var propagate = protoModify.handlePointerDown.call(modify, event);
            if (modify.vertexFeature_) {
                var geometry = <ol.geometry.SimpleGeometry> modify.vertexFeature_.getGeometry();
                invalidateNode(geometry.getFirstCoordinate());
            }
            return propagate;
        }

        function handleMouseMove(event:ol.MapBrowserPointerEvent):void {
            hasKeyModifier = ol.events.condition.altKeyOnly(event);
            modify.lastPixel_ = event.pixel;
            handlePointerAtPixel(event.pixel);

            if (node) {
                node.geometry.coordinates = event.coordinate;
                featureSync.toView(node);
            }
        }

        function handlePointerAtPixel(pixel:ol.Pixel):void {
            var pixelCoordinate = map.getCoordinateFromPixel(pixel),
                closestSegment = getClosestSegment(pixel, pixelCoordinate);
            closestSegment ? snap(pixel, pixelCoordinate, closestSegment) : unsnap();
        }

        function handleMouseUp(event:ol.MapBrowserPointerEvent):boolean {
            setNode(undefined);
            return protoModify.handlePointerUp.call(modify, event);
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

        function invalidateNode(vertex:ol.Coordinate):void {
            var geometry = <ol.geometry.SimpleGeometry> featureStore.selectedView.getGeometry(),
                properties = <feature.model.RioolLink> featureStore.current.properties,
                nodeId;

            node = null;

            if (ol.coordinate.equals(geometry.getFirstCoordinate(), vertex))
                nodeId = properties.startKoppelPuntId;
            else if (ol.coordinate.equals(geometry.getLastCoordinate(), vertex))
                nodeId = properties.endKoppelPuntId;

            if (nodeId) featureManager
                .getNode(nodeId)
                .then(featureManager.splitNode)
                .then(setNode);
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

            var geometry = <ol.geometry.SimpleGeometry> featureStore.selectedView.getGeometry(),
                isEndVertex =
                    ol.coordinate.equals(vertex, geometry.getFirstCoordinate()) ||
                    ol.coordinate.equals(vertex, geometry.getLastCoordinate());

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
