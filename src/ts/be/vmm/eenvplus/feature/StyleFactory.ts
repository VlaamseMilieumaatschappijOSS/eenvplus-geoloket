module be.vmm.eenvplus.feature {
    'use strict';

    export interface StyleFactory {
        (type:FeatureType, mode:FeatureMode):getStyle;
    }

    export interface getStyle {
        (feature:LocalFeature): ol.style.Style[];
    }

    export module StyleFactory {
        export var NAME:string = PREFIX + 'FeatureStyleFactory';

        var statuses = ['projected', 'disused', 'functional'],
            statusFunctional = 2,
            modeColors = [
                'rgba(255,255,255,0.6)',
                'rgba(130,130,255,0.6)',
                'rgba(255,120,135,0.6)'
            ];

        module sewer {
            var style = [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#8C510A',
                        width: 2,
                        lineDash: [2, 4]
                    })
                }),
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#8C510A',
                        width: 2,
                        lineDash: [5, 2, 2, 2]
                    })
                }),
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#8C510A',
                        width: 2
                    })
                })
            ];

            var halo = _.map(modeColors, (color:string):ol.style.Style => {
                return new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: color,
                        width: 6
                    })
                });
            });

            export function createStyle(mode:FeatureMode, feature:LocalFeature):ol.style.Style[] {
                return [halo[mode], style[getStatus(feature)]];
            }
        }

        module appurtenance {
            var types = [
                'zuiveringsinstallatie', 'overstort', 'aansluiting', 'catchBasin', 'cabinet', 'pump', 'tideGate',
                'node', 'node', 'node', 'node', 'node', 'node', 'node'
            ];

            var style = _.map(statuses, (status:string):ol.style.Style[] => {
                return _.map(types, (type:string):ol.style.Style => {
                    return new ol.style.Style({
                        image: new ol.style.Icon({
                            src: 'http://o-www.vmm.be/bestanden/geoloketdata/svg/sewer_' +
                            type + (status != 'functional' ? '_' + status : '') + '.svg',
                            scale: 0.1
                        })
                    });
                });
            });

            var halo = _.map(modeColors, (color:string):ol.style.Style => {
                return new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 11,
                        fill: new ol.style.Fill({
                            color: color
                        })
                    })
                });
            });

            export function createStyle(mode:FeatureMode, feature:LocalFeature):ol.style.Style[] {
                var properties = feature.getProperties<model.RioolAppurtenance>(),
                    type = properties.rioolAppurtenanceTypeId || types.length - 1;
                // use "node" if type is still undefined
                return [halo[mode], style[getStatus(feature)][type]];
            }
        }

        module node {
            var style = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 4,
                    fill: new ol.style.Fill({
                        color: '#8C510A'
                    })
                })
            });

            var halo = _.map(modeColors, (color:string):ol.style.Style => {
                return new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: color
                        })
                    })
                });
            });

            export function createStyle(mode:FeatureMode):ol.style.Style[] {
                return [halo[mode], style];
            }
        }

        function getStatus(feature:LocalFeature):number {
            var now = new Date().getTime(),
                statuses = feature.getProperties<model.RioolBase>().statussen,
                status = _.find(statuses, notFunctional);

            return status ? status.statusId : statusFunctional;

            function notFunctional(status:model.Status):boolean {
                return (!status.geldigVanaf || status.geldigVanaf < now)
                    && (!status.geldigTot || status.geldigTot > now);
            }
        }

        function createStyle(type:FeatureType, mode:FeatureMode):getStyle {
            var typeStyleMap = [sewer, appurtenance, node];
            return _.partial(typeStyleMap[type].createStyle, mode);
        }

        angular
            .module(MODULE)
            .factory(NAME, factory(createStyle));
    }

}
