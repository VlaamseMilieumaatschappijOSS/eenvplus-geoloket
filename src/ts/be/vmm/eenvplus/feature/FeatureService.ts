module be.vmm.eenvplus.feature {
    'use strict';

    export interface FeatureService {

        apiUrl:string;

        clear():ng.IPromise<void>;
        create(feature:ol.format.GeoJSONFeature):ng.IPromise<number>;
        dirty():ng.IPromise<boolean>;
        get(layerBodId:string, key:number):ng.IPromise<ol.format.GeoJSONFeature>;
        getById(layerBodId:string, id:number):ng.IPromise<ol.format.GeoJSONFeature>;
        pull(bbox?:ol.Extent):ng.IPromise<void>;
        push():ng.IPromise<any>;
        query(layerBodId:string, extent:ol.Extent):ng.IPromise<ol.format.GeoJSONFeature[]>;
        query(layerBodId:string, filter:filterFeature):ng.IPromise<ol.format.GeoJSONFeature[]>;
        query(layerBodId:string, extent:ol.Extent, filter:filterFeature):ng.IPromise<ol.format.GeoJSONFeature[]>;
        remove(feature:ol.format.GeoJSONFeature):ng.IPromise<ol.format.GeoJSONFeature>;
        test():ng.IPromise<any>;
        update(feature:ol.format.GeoJSONFeature):ng.IPromise<void>;

    }

    export interface filterFeature {
        (json:feature.model.FeatureJSON):boolean;
    }

}
