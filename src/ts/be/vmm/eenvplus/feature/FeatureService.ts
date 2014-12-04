module be.vmm.eenvplus.feature {
    'use strict';

    export interface FeatureService {

        apiUrl:string;

        clear():ng.IPromise<void>;
        create(feature:ol.format.GeoJSONFeature):ng.IPromise<void>;
        dirty():ng.IPromise<boolean>;
        get(layerBodId:string, featureId:number):ng.IPromise<ol.format.GeoJSONFeature>;
        pull(bbox?:ol.Extent):ng.IPromise<void>;
        push():ng.IPromise<any>;
        query(layerBodId:string, extent:ol.Extent):ng.IPromise<ol.format.GeoJSONFeature[]>;
        remove(feature:ol.format.GeoJSONFeature):ng.IPromise<void>;
        test():ng.IPromise<any>;
        update(feature:ol.format.GeoJSONFeature):ng.IPromise<void>;

    }

}
