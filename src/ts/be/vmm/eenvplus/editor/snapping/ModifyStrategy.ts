///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    /**
     * Creates a ModifyStrategy for a given SnappingType.
     */
    export interface ModifyStrategyFactory {
        (type:SnappingType,
         activate:(monitor:SnappingMonitor) => void,
         deactivate:(monitor:SnappingMonitor) => void):ModifyStrategy;
    }

    /**
     * Wraps an `ol.interaction.Modify` and a `SnappingMonitor`
     * to provide a clean interface to other snapping strategies.
     */
    export interface ModifyStrategy {
        /** @see ol.interaction.Modify#dragSegments_ */
        dragSegments:any[];
        /** @see ol.interaction.Modify#insertVertex_ */
        insertVertex(segmentData:ol.interaction.SegmentDataType, vertex:ol.Coordinate):void;
        /** @see ol.interaction.Modify#handlePointerMove_ */
        pointerDrag(event:ol.MapBrowserPointerEvent):void;
        /** @see ol.interaction.Modify#removeVertex_ */
        removeVertex():void;

        /**
         * @param filter A filter function.
         * @returns The first segment for which the given filter function returns true.
         */
        findSegment(filter:(segmentData:ol.interaction.SegmentDataType) => boolean):ol.interaction.SegmentDataType;
        /**
         * @returns A type-safe instance of the sketch feature's Geometry.
         */
        getGeometry():ol.geometry.SimpleGeometry;
    }

    export module ModifyStrategy {
        export var NAME:string = PREFIX + 'ModifyStrategy';

        factory.$inject = ['epMap', 'epSnappingState', 'epSnappingMonitor'];

        function factory(map:ol.Map,
                         state:StateController<SnappingType>,
                         monitor:SnappingMonitor):ModifyStrategyFactory {

            return function (type:SnappingType,
                             activateMonitor:(monitor:SnappingMonitor) => void,
                             deactivateMonitor:(monitor:SnappingMonitor) => void):ModifyStrategy {

                /* ------------------ */
                /* --- properties --- */
                /* ------------------ */

                var modify:geometry.ModifyPrivate,
                    moddedFeature:ol.Feature,
                    updateMonitor,
                    stopDragging,
                    superPointerUp,
                    api = {
                        pointerDrag: undefined,
                        findSegment: findSegment,
                        insertVertex: undefined,
                        removeVertex: undefined,
                        getGeometry: getGeometry,
                        get dragSegments():any[] {
                            return modify.dragSegments_;
                        }
                    };


                /* -------------------- */
                /* --- construction --- */
                /* -------------------- */

                state(type, activate, deactivate, canActivate);

                return api;

                /**
                 * Find the interaction to add snapping abilities to and set up overrides and event listeners.
                 * We call `monitor.update` only when the pointer is being dragged, not when it's simply moved.
                 * When the drag stops, the monitor must also be reset.
                 */
                function activate():void {
                    moddedFeature = modify.features_.item(0);

                    var proto = <geometry.ModifyPrivate> ol.interaction.Modify.prototype;
                    api.pointerDrag = proto.handlePointerDrag.bind(modify);
                    superPointerUp = proto.handlePointerUp.bind(modify);

                    api.insertVertex = modify.insertVertex_.bind(modify);
                    api.removeVertex = modify.removeVertex_.bind(modify);

                    var atStart = _.compose(atIndex, _.constant(0)),
                        atEnd = _.compose(atIndex, () => {
                            return numVertices() - 1;
                        });
                    modify.handlePointerDrag = updateMonitor = _.partialRight(monitor.update, atStart, atEnd);
                    modify.handlePointerUp = stopDragging = _.compose(monitor.reset, superPointerUp);

                    monitor.reset();
                    activateMonitor(monitor);
                }

                /**
                 * Find and set the currently active Modify interaction.
                 *
                 * @returns Whether there's an active Modify interaction.
                 */
                function canActivate():boolean {
                    modify = _.find(map.getInteractions().getArray(), isActiveModify);
                    return !!modify;
                }

                /**
                 * @param interaction
                 * @returns Whether the given Interaction is a `Modify` and currently active.
                 */
                function isActiveModify(interaction:ol.interaction.Interaction):boolean {
                    return interaction instanceof ol.interaction.Modify && interaction.getActive();
                }


                /* ----------------- */
                /* --- overrides --- */
                /* ----------------- */

                /** @see ModifyStrategy#findSegment */
                function findSegment(filter:Function):ol.interaction.SegmentDataType {
                    return _.find(modify.rBush_.getAll(), filter);
                }

                /**
                 * @param index
                 * @returns Whether we're dragging the vertex at the given index.
                 */
                function atIndex(index:number):boolean {
                    if (modify.dragSegments_.length !== 1) return false;

                    var dragSegment = modify.dragSegments_[0],
                        dragIndex = dragSegment[0].index + dragSegment[1];

                    return dragIndex === index;
                }

                /** @see ModifyStrategy#getGeometry */
                function getGeometry():ol.geometry.SimpleGeometry {
                    return moddedFeature ? <ol.geometry.SimpleGeometry> moddedFeature.getGeometry() : undefined;
                }

                /**
                 * @returns The current number of vertices in the LineString.
                 */
                function numVertices():number {
                    var line = <ol.geometry.LineString> getGeometry();
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
                    if (!modify) return;

                    if (modify.handlePointerDrag === updateMonitor) modify.handlePointerDrag = api.pointerDrag;
                    if (modify.handlePointerUp === stopDragging) modify.handlePointerUp = superPointerUp;
                    modify = null;
                }

            }
        }

        angular
            .module(MODULE)
            .factory(NAME, factory);
    }

}
