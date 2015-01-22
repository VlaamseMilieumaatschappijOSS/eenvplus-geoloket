///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    AddingStrategy.$inject = ['epMap', 'epSnappingState', 'epSnappingStore', 'epSnappingMonitor'];

    function AddingStrategy(map:ol.Map, state:StateController<SnappingType>, store:SnappingStore, monitor:SnappingMonitor):void {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var painter:DrawPrivate,
            snappingStart:boolean,
            endSnapping:boolean,
            protoPainter:DrawPrivate = <DrawPrivate> ol.interaction.Draw.prototype;

        function setResolution(resolution:number):void {
            if (painter) painter.snapTolerance_ = resolution;
        }


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        state(SnappingType.ADD, activate, deactivate);
        store.resolutionChanged.add(setResolution);
        monitor.moveAtStart.add(_.partial(console.log, 'moveAtStart'));
        monitor.moveAtEnd.add(_.partial(console.log, 'moveAtEnd'));
        monitor.moveOutside.add(_.partial(console.log, 'moveOutside'));
        monitor.snapInStart.add(_.partial(console.log, 'snapInStart'));
        monitor.snapOutStart.add(_.partial(console.log, 'snapOutStart'));
        monitor.snapInEnd.add(_.partial(console.log, 'snapInEnd'));
        monitor.snapOutEnd.add(_.partial(console.log, 'snapOutEnd'));

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
                snappedCoordinate = monitor.update(event.coordinate, painter.sketchFeature_);
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
        }

        function isActivePainter(interaction:ol.interaction.Interaction):boolean {
            return interaction instanceof ol.interaction.Draw && interaction.getActive();
        }

        /**
         * Go into snapping mode if mouseCoordinate and snappedCoordinate are different.
         * Otherwise leave snapping mode only if necessary (i.e. if we were actually snapping before).
         *
         * @param mouseCoordinate
         * @param snappedCoordinate
         */
        function invalidateGeometrySnapping(mouseCoordinate:ol.Coordinate, snappedCoordinate:ol.Coordinate):void {
            if (!painter.sketchFeature_) return;

            if (ol.coordinate.equals(mouseCoordinate, snappedCoordinate)) {
                // if (snappingStart) painter.abortDrawing_();
                /* else */
                if (endSnapping) unsnap();
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
            updateGeometryCoordinates((coordinates:ol.Coordinate[]):void => {
                if (endSnapping) coordinates[coordinates.length - 2] = mouseCoordinate;
                else coordinates.splice(coordinates.length - 1, 0, mouseCoordinate);
            });

            endSnapping = true;
        }

        /**
         * Remove the Coordinate at the before-last position and unset the `snapping` flag.
         */
        function unsnap():void {
            updateGeometryCoordinates((coordinates:ol.Coordinate[]):void => {
                coordinates.splice(coordinates.length - 1, 1);
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
