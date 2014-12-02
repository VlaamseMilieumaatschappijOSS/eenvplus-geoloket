module be.vmm.eenvplus.feature {
    'use strict';

    export interface FeatureService {

        apiUrl:string;

        clear():ng.IPromise<void>;
        create(feature:ol.Feature):ng.IPromise<void>;
        dirty():ng.IPromise<boolean>;
        get(layerBodId:string, featureId:number):ng.IPromise<ol.Feature>;
        pull(bbox?:ol.Extent):ng.IPromise<void>;
        push():ng.IPromise<any>;
        query(layerBodId:string, extent:ol.Extent):ng.IPromise<ol.Feature[]>;
        remove(feature:ol.Feature):ng.IPromise<void>;
        test():ng.IPromise<any>;
        update(feature:ol.Feature):ng.IPromise<void>;

    }

}
