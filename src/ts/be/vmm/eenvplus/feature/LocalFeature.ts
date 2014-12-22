module be.vmm.eenvplus.feature {
    'use strict';

    export interface LocalFeature extends ol.Feature {

        action:string;
        key:number;
        type:FeatureType;

    }

}
