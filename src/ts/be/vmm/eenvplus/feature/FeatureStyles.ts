module be.vmm.eenvplus.feature {
    'use strict';

    var STATUSSEN = ["projected", "disused", "functional"];
    var FUNCTIONAL = 2;
    var COLORS = [
        "rgba(255,255,255,0.6)",
        "rgba(130,130,255,0.6)",
        "rgba(255,120,135,0.6)"
    ];

    var RIOOLAPPURTENANCE_TYPES = [
        "zuiveringsinstallatie", "overstort", "aansluiting", "catchBasin", "cabinet", "pump", "tideGate",
        "node", "node", "node", "node", "node", "node", "node"
    ];

    var KOPPELPUNT_HALO_STYLES =
        _.map(COLORS, (color:string):ol.style.Style => {
            return new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: color
                    })
                })
            });
        });

    var KOPPELPUNT_STYLE = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 4,
            fill: new ol.style.Fill({
                color: '#8C510A'
            })
        })
    });

    var RIOOLLINK_HALO_STYLES =
        _.map(COLORS, (color:string):ol.style.Style => {
            return new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: color,
                    width: 6
                })
            });
        });

    var RIOOLLINK_STYLES = [
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

    var RIOOLAPPURTENANCE_HALO_STYLES =
        _.map(COLORS, (color:string):ol.style.Style => {
            return new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 11,
                    fill: new ol.style.Fill({
                        color: color
                    })
                })
            });
        });

    var RIOOLAPPURTENANCE_STYLES =
        _.map(STATUSSEN, (status:string):ol.style.Style[] => {
            return _.map(RIOOLAPPURTENANCE_TYPES, (type:string):ol.style.Style => {
                return new ol.style.Style({
                    image: new ol.style.Icon({
                        src: 'http://o-www.vmm.be/bestanden/geoloketdata/svg/sewer_' + type + (status != "functional" ? '_' + status : '') + '.svg',
                        scale: 0.1
                    })
                });
            });
        });

    export interface getStyle {
        (feature:LocalFeature): ol.style.Style[];
    }

    export function createStyle(type:FeatureType, mode:FeatureMode):getStyle {
        switch (type) {
            case FeatureType.SEWER:
                return (feature) => {
                    return [RIOOLLINK_HALO_STYLES[mode], RIOOLLINK_STYLES[getStatus(feature)]];
                };
            case FeatureType.APPURTENANCE:
                return (feature) => {
                    var properties = feature.getProperties<model.RioolAppurtenance>();
                    return [
                        RIOOLAPPURTENANCE_HALO_STYLES[mode],
                        RIOOLAPPURTENANCE_STYLES[getStatus(feature)][properties.rioolAppurtenanceTypeId]
                    ];
                };
            case FeatureType.NODE:
                return () => {
                    return [KOPPELPUNT_HALO_STYLES[mode], KOPPELPUNT_STYLE];
                };
        }
    }

    function getStatus(feature:LocalFeature):number {
        var now = new Date().getTime(),
            statuses = feature.getProperties<model.RioolBase>().statussen,
            status = _.find(statuses, notFunctional);

        return status ? status.statusId : FUNCTIONAL;

        function notFunctional(status:model.Status):boolean {
            return (!status.geldigVanaf || status.geldigVanaf < now)
                && (!status.geldigTot || status.geldigTot > now);
        }
    }

}
