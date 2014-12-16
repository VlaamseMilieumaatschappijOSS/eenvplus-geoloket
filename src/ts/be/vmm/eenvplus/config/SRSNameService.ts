///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.config {
    'use strict';

    export interface SRSNameService {
        default:SRSName;
        byId(srid:number):SRSName;
    }

    export interface SRSName {
        authority:string;
        code:string;
        label:string;
        srid:number;
    }

    export var SRID = {
        LAMBERT72: 31370,
        WGS84: 4326,
        UTM: 32631
    };

    export var AUTHORITY:string = 'EPSG';

    export module SRSNameService {
        export var NAME:string = PREFIX + 'SRSName';

        var srsNames = [
            {srid: SRID.LAMBERT72, label: 'Lambert 72'},
            {srid: SRID.WGS84, label: 'WGS 84 (lat/lon)'},
            {srid: SRID.UTM, label: 'UTM'}
        ];

        srsNames.forEach(setCode);

        function factory():SRSNameService {
            return {
                default: byId(SRID.LAMBERT72),
                byId: byId
            };
        }

        function setCode(srsName:SRSName):void {
            srsName.authority = AUTHORITY;
            srsName.code = AUTHORITY + ':' + srsName.srid
        }

        function byId(srid:number):SRSName {
            return _.find(srsNames, {srid: srid});
        }

        angular
            .module(MODULE)
            .constant('AUTHORITY', AUTHORITY)
            .constant('SRID', SRID)
            .factory(NAME, factory);

    }

}
