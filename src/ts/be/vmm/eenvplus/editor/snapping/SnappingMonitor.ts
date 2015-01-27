///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    /** Determines snapping possibilities of the current mouse position and signals changes in this information. */
    export interface SnappingMonitor {
        /** Fires as long as the mouse moves within snapping range of an end point. */
        moveAtEnd:Trasys.Signals.ITypeSignal<SnappingPointerEvent>;
        /** Fires as long as the mouse moves within snapping range of a starting point. */
        moveAtStart:Trasys.Signals.ITypeSignal<SnappingPointerEvent>;
        /** Fires as long as the mouse moves outside of snapping range of any point. */
        moveOutside:Trasys.Signals.ITypeSignal<SnappingPointerEvent>;
        /** Fires when the mouse moves into snapping range of an end point. */
        snapInEnd:Trasys.Signals.ITypeSignal<SnappingPointerEvent>;
        /** Fires when the mouse moves into snapping range of a starting point. */
        snapInStart:Trasys.Signals.ITypeSignal<SnappingPointerEvent>;
        /** Fires when the mouse moves out of snapping range of an end point. */
        snapOutEnd:Trasys.Signals.ITypeSignal<SnappingPointerEvent>;
        /** Fires when the mouse moves out of snapping range of a starting point. */
        snapOutStart:Trasys.Signals.ITypeSignal<SnappingPointerEvent>;

        /**
         * Reset the monitor to its initial state.
         * This is necessary because we use a single instance of SnappingMonitor in multiple snapping
         * strategy instances. When a strategy is activated, we need to be sure that we don't start with the state of
         * the previously used strategy.
         */
        reset():void;
        /**
         * A filter function that is used to exclude some Nodes when scanning for the closest one.
         *
         * @param fn If this function returns false, the given Node will be excluded from the search.
         */
        setFilter(fn:(node:ol.Feature) => boolean):void;
        /**
         * Pass mouse move events into the monitor for analysis.
         *
         * @param event
         * @param sketchFeature
         */
        update(event:ol.MapBrowserPointerEvent, sketchFeature:ol.Feature):ol.Coordinate;
    }

    /** Contains information pertaining to snapping possibilities of the current mouse position. */
    interface SnappingInfo {
        /** A clone of the original `MapBrowserPointerEvent#coorindate` */
        mouseCoordinate:ol.Coordinate;
        /** The calculated Coordinate to snap to. */
        snappedCoordinate:ol.Coordinate;
        /** Whether the mouse is in snapping range of a starting point. */
        start:boolean;
        /** Whether the mouse is in snapping range of an end point. */
        end:boolean;
    }

    /** An `ol.MapBrowserPointerEvent` enriched with the information from SnappingInfo.*/
    export interface SnappingPointerEvent extends ol.MapBrowserPointerEvent, SnappingInfo {
    }

    export module SnappingMonitor {
        export var NAME:string = PREFIX + 'SnappingMonitor';

        factory.$inject = ['epMap', 'epSnappingStore'];

        function factory(map:ol.Map, store:SnappingStore):SnappingMonitor {
            var nodes:ol.source.Vector,
                toPixel = map.getPixelFromCoordinate.bind(map),
                inStartRange:boolean = false,
                inEndRange:boolean = false,
                filter:(node:ol.Feature) => boolean;

            var signal = {
                moveAtStart: new Trasys.Signals.TypeSignal(),
                moveAtEnd: new Trasys.Signals.TypeSignal(),
                moveOutside: new Trasys.Signals.TypeSignal(),
                snapInStart: new Trasys.Signals.TypeSignal(),
                snapOutStart: new Trasys.Signals.TypeSignal(),
                snapInEnd: new Trasys.Signals.TypeSignal(),
                snapOutEnd: new Trasys.Signals.TypeSignal()
            };

            return _.merge({
                update: update,
                setFilter: setFilter,
                reset: reset
            }, signal);

            /** @see SnappingMonitor#reset */
            function reset():void {
                inStartRange = inEndRange = false;
            }

            /** @see SnappingMonitor#setFilter */
            function setFilter(fn:(node:ol.Feature) => boolean):void {
                filter = fn || _.constant(true);
            }

            /** @see SnappingMonitor#update */
            function update(event:ol.MapBrowserPointerEvent, sketchFeature:ol.Feature):void {
                if (!nodes) nodes = feature.getLayer(map, feature.FeatureType.NODE).getSource();

                var snappingInfo = getSnappingInfo(event.coordinate, sketchFeature);
                invalidateState(snappingInfo, event);
            }

            /**
             * Calculate the snapping information for the current mouse Coordinate:
             * we snap only to Nodes, so find the Node that is closest to the mouse,
             * ignoring the ones that coincide with the drawing's starting Coordinate,
             * and compare its distance to the snapping resolution.
             *
             * @param mouseCoordinate
             * @param sketchFeature
             * @returns An object with snapping information.
             */
            function getSnappingInfo(mouseCoordinate:ol.Coordinate, sketchFeature:ol.Feature):SnappingInfo {
                var closestNode = getClosestNode(mouseCoordinate),
                    closestNodeCoordinate = firstCoordinate(closestNode),
                    startCoordinate = firstCoordinate(sketchFeature),
                    atStart = !sketchFeature || ol.coordinate.equals(closestNodeCoordinate, startCoordinate),
                    pixels = [mouseCoordinate, closestNodeCoordinate].map(toPixel),
                    distance = Math.sqrt(apply(ol.coordinate.squaredDistance)(pixels)),
                    snapping = distance <= store.resolution;

                return {
                    mouseCoordinate: _.clone(mouseCoordinate),
                    snappedCoordinate: snapping ? closestNodeCoordinate : mouseCoordinate,
                    start: atStart && snapping,
                    end: !atStart && snapping
                };
            }

            /**
             * A copy of `ol.source.Vector#getClosestFeatureToCoordinate` that adds the ability to filter out
             * some Features while scanning.
             *
             * @param coordinate
             * @returns {ol.Feature}
             * @see ol.source.Vector#getClosestFeatureToCoordinate
             */
            function getClosestNode(coordinate:ol.Coordinate):ol.Feature {
                var x = coordinate[0],
                    y = coordinate[1],
                    closestNode:ol.Feature = null,
                    closestPoint = <ol.Coordinate> [NaN, NaN],
                    minSquaredDistance = Infinity,
                    extent = <ol.Coordinate> [-Infinity, -Infinity, Infinity, Infinity];

                nodes.forEachFeatureInExtent(extent, (node:ol.Feature):void => {
                    if (!filter(node)) return;

                    var geometry = node.getGeometry(),
                        previousMinSquaredDistance = minSquaredDistance;

                    minSquaredDistance = geometry.closestPointXY(x, y, closestPoint, minSquaredDistance);

                    if (minSquaredDistance < previousMinSquaredDistance) {
                        closestNode = node;

                        var minDistance = Math.sqrt(minSquaredDistance);
                        extent[0] = x - minDistance;
                        extent[1] = y - minDistance;
                        extent[2] = x + minDistance;
                        extent[3] = y + minDistance;
                    }
                });

                return closestNode;
            }

            /**
             * Determine the current state based on the given SnappingInfo and signal changes to all listeners.
             *
             * @param snappingInfo
             * @param originalEvent
             */
            function invalidateState(snappingInfo:SnappingInfo, originalEvent:ol.MapBrowserPointerEvent):void {
                var event = _.merge(originalEvent, snappingInfo);

                if (inStartRange && !snappingInfo.start) {
                    signal.snapOutStart.fire(event);
                    inStartRange = false;
                }
                else if (inEndRange && !snappingInfo.end) {
                    signal.snapOutEnd.fire(event);
                    inEndRange = false;
                }

                if (snappingInfo.start) {
                    if (!inStartRange) {
                        signal.snapInStart.fire(event);
                        inStartRange = true;
                    }
                    signal.moveAtStart.fire(event);
                }
                else if (snappingInfo.end) {
                    if (!inEndRange) {
                        signal.snapInEnd.fire(event);
                        inEndRange = true;
                    }
                    signal.moveAtEnd.fire(event);
                }
                else signal.moveOutside.fire(event);
            }

            /**
             * @param olFeature
             * @returns The first Coordinate of te given Feature. A NaN Coordinate if the Feature is undefined.
             */
            function firstCoordinate(olFeature:ol.Feature):ol.Coordinate {
                return olFeature ?
                    (<ol.geometry.SimpleGeometry> olFeature.getGeometry()).getFirstCoordinate() :
                    [NaN, NaN];
            }

        }

        angular
            .module(MODULE)
            .factory(NAME, factory);
    }

}
