///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    AddingStrategy.$inject = ['epMap', 'epSnappingState', 'epSnappingStore'];

    function AddingStrategy(map:ol.Map, state:StateController<SnappingType>, store:SnappingStore):void {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var painter:DrawPrivate,
            nodes:ol.source.Vector,
            snappingStart:boolean,
            endSnapping:boolean,
            protoPainter:DrawPrivate = <DrawPrivate> ol.interaction.Draw.prototype,
            toPixel = map.getPixelFromCoordinate.bind(map);

        function setResolution(resolution:number):void {
            if (painter) painter.snapTolerance_ = resolution;
        }


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        state(SnappingType.ADD, activate, deactivate);
        store.resolutionChanged.add(setResolution);


        /* ----------------- */
        /* --- overrides --- */
        /* ----------------- */

        /**
         * Intercept the mouse Coordinate and adjust the pointer and line geometry according to snapping rules.
         *
         * @override
         * @see ol.interaction.Draw#handlePointerMove_
         */
        function handlePointerMove(event:ol.MapBrowserPointerEvent):void {
            var mouseCoordinate = _.cloneDeep(event.coordinate),
                snappedCoordinate = calculateCoordinate(event.coordinate);
            invalidateGeometrySnapping(event.coordinate, snappedCoordinate);

            event.coordinate = snappedCoordinate;
            protoPainter.handlePointerMove_.call(painter, event);

            if (goog.isNull(this.finishCoordinate_) && !ol.coordinate.equals(mouseCoordinate, snappedCoordinate)) {
                painter.startDrawing_(event);
                updateGeometryCoordinates((coordinates:ol.Coordinate[]):void => {
                    coordinates[coordinates.length - 1] = mouseCoordinate;
                });
                snappingStart = true;
            }
        }

        /**
         * Finish drawing when the user single-snap-clicks.
         *
         * @override
         * @see ol.interaction.Draw#addToDrawing_
         */
        function addToDrawing(event:ol.MapBrowserPointerEvent):void {
            protoPainter.addToDrawing_.call(painter, event);
            if (endSnapping) painter.finishDrawing_();
        }

        /**
         * Always unset `snapping` flags when the user stops painting.
         * (note: this method is called from `finishDrawing_` too)
         *
         * @override
         * @see ol.interaction.Draw#abortDrawing_
         */
        function abortDrawing():ol.Feature {
            snappingStart = endSnapping = false;
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

            painter.snapTolerance_ = store.resolution;
            painter.handlePointerMove_ = handlePointerMove;
            painter.addToDrawing_ = addToDrawing;
            painter.abortDrawing_ = abortDrawing;
            nodes = feature.getLayer(map, feature.FeatureType.NODE).getSource();
        }

        function isActivePainter(interaction:ol.interaction.Interaction):boolean {
            return interaction instanceof ol.interaction.Draw && interaction.getActive();
        }

        /**
         * Calculate the Coordinate for the endpoint to draw:
         * - we snap only to Nodes, so
         * - find the Node that is closest to the mouse,
         * - ignoring the ones that coincide with the drawings starting Coordinate;
         * - if it is within `snapTolerance` range, return its Coordinate
         * - otherwise just use the original mouse Coordinate
         *
         * @param mouseCoordinate
         * @returns {ol.Coordinate}
         */
        function calculateCoordinate(mouseCoordinate:ol.Coordinate):ol.Coordinate {
            var closestNode = nodes.getClosestFeatureToCoordinate(mouseCoordinate),
                closestNodeCoordinate = firstCoordinate(closestNode),
                startCoordinate = firstCoordinate(painter.sketchFeature_);

            // never snap to the starting Coordinate
            if (ol.coordinate.equals(closestNodeCoordinate, startCoordinate))
                return mouseCoordinate;

            var pixels = [mouseCoordinate, closestNodeCoordinate].map(toPixel),
                distance = Math.sqrt(apply(ol.coordinate.squaredDistance)(pixels));

            return distance > painter.snapTolerance_ ? mouseCoordinate : closestNodeCoordinate;

            function firstCoordinate(olFeature:ol.Feature):ol.Coordinate {
                return olFeature ?
                    (<ol.geometry.SimpleGeometry> olFeature.getGeometry()).getFirstCoordinate() :
                    [NaN, NaN];
            }
        }

        /**
         * Go into snapping mode if mouseCoordinate and snappedCoordinate are different.
         * Otherwise leave snapping mode only if necessary (i.e. if we were actually snapping before).
         *
         * @param mouseCoordinate
         * @param snappedCoordinate
         */
        function invalidateGeometrySnapping(mouseCoordinate:ol.Coordinate, snappedCoordinate:ol.Coordinate):void {
            console.log('invalidate');
            if (!painter.sketchFeature_) return;

            if (ol.coordinate.equals(mouseCoordinate, snappedCoordinate)) {
                // if (snappingStart) painter.abortDrawing_();
                /* else */ if (endSnapping) unsnap();
            }
            else snap(mouseCoordinate);
        }

        /**
         * If we just started snapping: insert the mouse Coordinate at the before-last position.
         * Otherwise: update the Coordinate at the before-last position with the current mouse Coordinate.
         * Set the `snapping` flag;
         *
         * @param mouseCoordinate
         */
        function snap(mouseCoordinate:ol.Coordinate):void {
            console.log('snap');
            updateGeometryCoordinates((coordinates:ol.Coordinate[]):void => {
                _.each(coordinates, console.log);
                if (endSnapping) coordinates[coordinates.length - 2] = mouseCoordinate;
                else coordinates.splice(coordinates.length - 1, 0, mouseCoordinate);
                _.each(coordinates, console.log);
            });

            endSnapping = true;
        }

        /**
         * Remove the Coordinate at the before-last position and unset the `snapping` flag.
         */
        function unsnap():void {
            console.log('unsnap');
            updateGeometryCoordinates((coordinates:ol.Coordinate[]):void => {
                _.each(coordinates, console.log);
                coordinates.splice(coordinates.length - 1, 1);
                _.each(coordinates, console.log);
            });

            endSnapping = false;
        }

        /**
         * Get the current Coordinate list from the LineString,
         * modify it and re-apply it so that OL is aware of the change.
         *
         * @param update The callback that will apply modifications to the Coordinates.
         */
        function updateGeometryCoordinates(update:(coordinates:ol.Coordinate[]) => void):void {
            var line = <ol.geometry.LineString> painter.sketchFeature_.getGeometry(),
                coordinates = line.getCoordinates();

            update(coordinates);
            line.setCoordinates(coordinates);
        }

        /**
         * Unset all intercepted methods so that we don't leave any accidental references in memory.
         */
        function deactivate() {
            if (!painter) return;

            if (painter.handlePointerMove_ === handlePointerMove)
                painter.handlePointerMove_ = protoPainter.handlePointerMove_.bind(painter);
            if (painter.addToDrawing_ === addToDrawing)
                painter.addToDrawing_ = protoPainter.addToDrawing_.bind(painter);
            if (painter.abortDrawing_ === abortDrawing)
                painter.abortDrawing_ = protoPainter.abortDrawing_.bind(painter);
            painter = null;
        }

    }

    angular
        .module(MODULE)
        .run(AddingStrategy);

}
