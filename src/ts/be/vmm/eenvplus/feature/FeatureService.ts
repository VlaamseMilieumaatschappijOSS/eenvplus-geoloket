module be.vmm.eenvplus.feature {
    'use strict';

    export interface FeatureService {

        apiUrl:string;

        clear():ng.IPromise<void>;
        create(feature:ol.format.GeoJSONFeature, type:FeatureType):ng.IPromise<void>;
        dirty():ng.IPromise<boolean>;
        get(type:FeatureType, featureId:number):ng.IPromise<ol.format.GeoJSONFeature>;
        pull(bbox?:ol.Extent):ng.IPromise<void>;
        push():ng.IPromise<any>;
        query(type:FeatureType, extent:ol.Extent):ng.IPromise<ol.format.GeoJSONFeature[]>;
        remove(feature:ol.format.GeoJSONFeature, type:FeatureType):ng.IPromise<void>;
        test():ng.IPromise<any>;
        update(feature:ol.format.GeoJSONFeature, type:FeatureType):ng.IPromise<void>;

    }

}
