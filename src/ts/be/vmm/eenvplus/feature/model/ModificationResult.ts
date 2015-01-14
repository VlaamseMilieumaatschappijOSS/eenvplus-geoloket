module be.vmm.eenvplus.feature.model {
    'use strict';

    export interface ModificationResult {
        layerBodId:string;
        key:number;
        action:string;
        feature:FeatureJSON;
    }

}
