///ts:ref=Feature
/// No file or directory matched name "Feature" ///ts:ref:generated

module be.vmm.eenvplus.feature.model {
    'use strict';

    export interface RioolLink extends FeatureProperties {

        diameter:number;
        endKoppelPuntId:string;
        label:string;
        omschrijving:string;
        pressure:number;
        rioolLinkTypeId:number;
        sewerWaterTypeId:number;
        startKoppelPuntId:string;
        statussen:Status[];
        straatId:number;

    }

}
