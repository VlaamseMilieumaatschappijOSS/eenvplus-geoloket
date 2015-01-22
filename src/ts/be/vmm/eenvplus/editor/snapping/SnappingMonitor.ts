///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    export interface SnappingMonitor {
        moveAtStart:Trasys.Signals.ISignal;
        moveAtEnd:Trasys.Signals.ISignal;
        moveOutside:Trasys.Signals.ISignal;
        snapInStart:Trasys.Signals.ISignal;
        snapOutStart:Trasys.Signals.ISignal;
        snapInEnd:Trasys.Signals.ISignal;
        snapOutEnd:Trasys.Signals.ISignal;

        update(mouseCoordinate:ol.Coordinate, sketchFeature:ol.Feature):ol.Coordinate;
    }

    interface SnappingInfo {
        coordinate:ol.Coordinate;
        start:boolean;
        end:boolean;
    }

    export module SnappingMonitor {
        export var NAME:string = PREFIX + 'SnappingMonitor';

        factory.$inject = ['epMap', 'epSnappingStore'];

        function factory(map:ol.Map, store:SnappingStore):SnappingMonitor {
            var nodes:ol.source.Vector,
                toPixel = map.getPixelFromCoordinate.bind(map),
                inStartRange:boolean = false,
                inEndRange:boolean = false;

            var signal = {
                moveAtStart: new Trasys.Signals.Signal(),
                moveAtEnd: new Trasys.Signals.Signal(),
                moveOutside: new Trasys.Signals.Signal(),
                snapInStart: new Trasys.Signals.Signal(),
                snapOutStart: new Trasys.Signals.Signal(),
                snapInEnd: new Trasys.Signals.Signal(),
                snapOutEnd: new Trasys.Signals.Signal()
            };

            return _.merge({update: update}, signal);

            function update(mouseCoordinate:ol.Coordinate, sketchFeature:ol.Feature):ol.Coordinate {
                if (!nodes) nodes = feature.getLayer(map, feature.FeatureType.NODE).getSource();

                var snappingInfo = getSnappingInfo(mouseCoordinate, sketchFeature);
                invalidateState(snappingInfo);
                return snappingInfo.coordinate;
            }

            function invalidateState(snappingInfo:SnappingInfo):void {
                if (inStartRange && !snappingInfo.start) {
                    signal.snapOutStart.fire();
                    inStartRange = false;
                }
                else if (inEndRange && !snappingInfo.end) {
                    signal.snapOutEnd.fire();
                    inEndRange = false;
                }

                if (snappingInfo.start) {
                    if (!inStartRange) {
                        signal.snapInStart.fire();
                        inStartRange = true;
                    }
                    signal.moveAtStart.fire();
                }
                else if (snappingInfo.end) {
                    if (!inEndRange) {
                        signal.snapInEnd.fire();
                        inEndRange = true;
                    }
                    signal.moveAtEnd.fire();
                }
                else signal.moveOutside.fire();
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
             * @param sketchFeature
             * @returns An object with snapping information.
             */
            function getSnappingInfo(mouseCoordinate:ol.Coordinate, sketchFeature:ol.Feature):SnappingInfo {
                var closestNode = nodes.getClosestFeatureToCoordinate(mouseCoordinate),
                    closestNodeCoordinate = firstCoordinate(closestNode),
                    startCoordinate = firstCoordinate(sketchFeature),
                    pixels = [mouseCoordinate, closestNodeCoordinate].map(toPixel),
                    distance = Math.sqrt(apply(ol.coordinate.squaredDistance)(pixels)),
                    snapping = distance <= store.resolution;

                if (ol.coordinate.equals(closestNodeCoordinate, startCoordinate))
                    return {
                        coordinate: mouseCoordinate,
                        start: snapping,
                        end: false
                    };

                return {
                    coordinate: snapping ? closestNodeCoordinate : mouseCoordinate,
                    start: false,
                    end: sketchFeature && snapping
                };
            }

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
