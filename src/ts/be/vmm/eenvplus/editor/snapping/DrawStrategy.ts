///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    /**
     * Creates a DrawStrategy for a given SnappingType.
     */
    export interface DrawStrategyFactory {
        (type:SnappingType,
         activate:(monitor:SnappingMonitor) => void,
         deactivate:(monitor:SnappingMonitor) => void):DrawStrategy;
    }

    /**
     * Wraps an `ol.interaction.Draw` and a `SnappingMonitor` to provide a clean interface to other snapping strategies.
     */
    export interface DrawStrategy {
        /** @see ol.interaction.Draw#abortDrawing_ */
        abortDrawing():void;
        /** @see ol.interaction.Draw#handlePointerMove_ */
        pointerMove(event:ol.MapBrowserPointerEvent):void;
        /** @see ol.interaction.Draw#startDrawing_ */
        startDrawing(event:ol.MapBrowserPointerEvent):void;

        /**
         * @returns Whether we already started drawing or not.
         */
        isPristine():boolean;
        /**
         * @returns The current number of vertices in the LineString.
         */
        numVertices():number;
        /**
         * Get the current Coordinate list from the LineString,
         * modify it and re-apply it so that OL is aware of the change.
         *
         * @param update The callback that will apply modifications to the Coordinates.
         */
        updateCoordinates(update:(coordinates:ol.Coordinate[]) => void):void;
    }

    export module DrawStrategy {
        export var NAME:string = PREFIX + 'DrawStrategy';

        factory.$inject = ['epMap', 'epSnappingState', 'epSnappingMonitor'];

        function factory(map:ol.Map, state:StateController<SnappingType>, monitor:SnappingMonitor):DrawStrategyFactory {
            return function (type:SnappingType,
                             activateMonitor:(monitor:SnappingMonitor) => void,
                             deactivateMonitor:(monitor:SnappingMonitor) => void):DrawStrategy {

                /* ------------------ */
                /* --- properties --- */
                /* ------------------ */

                var painter:DrawPrivate,
                    api = {
                        pointerMove: undefined,
                        addToDrawing: undefined,
                        abortDrawing: undefined,
                        startDrawing: undefined,
                        isPristine: isPristine,
                        updateCoordinates: updateCoordinates,
                        numVertices: numVertices
                    };


                /* -------------------- */
                /* --- construction --- */
                /* -------------------- */

                state(type, activate, deactivate);

                return api;

                /**
                 * Find the interaction to add snapping abilities to and set up overrides and event listeners.
                 * Turn off the original snapping behaviour by setting `snapTolerance_` to 1.
                 * Activate the monitor.
                 */
                function activate():void {
                    painter = _.find(map.getInteractions().getArray(), isActivePainter);
                    if (!painter) {
                        console.log('To be implemented');
                        return;
                    }

                    painter.snapTolerance_ = 1;
                    painter.handlePointerMove_ = handlePointerMove;
                    painter.addToDrawing_ = addToDrawing;

                    var proto = <DrawPrivate> ol.interaction.Draw.prototype;
                    api.pointerMove = proto.handlePointerMove_.bind(painter);
                    api.addToDrawing = proto.addToDrawing_.bind(painter);
                    api.abortDrawing = painter.abortDrawing_.bind(painter);
                    api.startDrawing = painter.startDrawing_.bind(painter);

                    activateMonitor(monitor);
                }

                /**
                 * @param interaction
                 * @returns Whether the given Interaction is a `Draw` and currently active.
                 */
                function isActivePainter(interaction:ol.interaction.Interaction):boolean {
                    return interaction instanceof ol.interaction.Draw && interaction.getActive();
                }


                /* ----------------- */
                /* --- overrides --- */
                /* ----------------- */

                /**
                 * Pass all mouse move events down to SnappingMonitor for analysis of current snapping possibilities.
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
                    api.addToDrawing(event);
                    if (event.end) painter.finishDrawing_();
                }


                /* ----------------- */
                /* --- behaviour --- */
                /* ----------------- */

                /** @see DrawStrategy#isPristine */
                function isPristine():boolean {
                    return !painter.finishCoordinate_;
                }

                /** @see DrawStrategy#updateCoordinates */
                function updateCoordinates(update:(coordinates:ol.Coordinate[]) => void):void {
                    var line = <ol.geometry.LineString> painter.sketchFeature_.getGeometry(),
                        coordinates = line.getCoordinates();

                    update(coordinates);
                    line.setCoordinates(coordinates);
                }

                /** @see DrawStrategy#numVertices */
                function numVertices():number {
                    var line = <ol.geometry.LineString> painter.sketchFeature_.getGeometry();
                    return line.getCoordinates().length;
                }


                /* ------------------- */
                /* --- destruction --- */
                /* ------------------- */

                /**
                 * Remove all listeners and unset all overrides
                 * so that we don't leave any accidental references in memory.
                 */
                function deactivate():void {
                    deactivateMonitor(monitor);
                    if (!painter) return;

                    if (painter.handlePointerMove_ === handlePointerMove) painter.handlePointerMove_ = api.pointerMove;
                    if (painter.addToDrawing_ === addToDrawing) painter.addToDrawing_ = api.addToDrawing;
                    painter = null;
                }

            };
        }

        angular
            .module(MODULE)
            .factory(NAME, factory);
    }

}
