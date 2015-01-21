module be.vmm.eenvplus.feature.model {
    'use strict';

    export interface FeatureJSON extends ol.format.GeoJSONFeature {

        featureId?:number;
        id?:number;
        key?:number;
        layerBodId:string;
        modified?:string;
        action?:string;

        properties?:FeatureProperties;

    }

}
