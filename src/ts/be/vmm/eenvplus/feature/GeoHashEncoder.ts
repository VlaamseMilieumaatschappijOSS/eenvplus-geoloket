module be.vmm.eenvplus.feature {
    'use strict';

    export interface GeoHashEncoder {

        encodePoint(bbox:ol.Extent, point:ol.Coordinate, precision:number):string;

    }

}
