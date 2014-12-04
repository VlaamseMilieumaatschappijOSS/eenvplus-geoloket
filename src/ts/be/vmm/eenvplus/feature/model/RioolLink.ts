///ts:ref=Feature
/// <reference path="./Feature.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.feature.model {
    'use strict';

    export interface RioolLink extends Feature {

        diameter:number;
        endKoppelPuntId:number;
        label:string;
        omschrijving:string;
        pressure:number;
        rioolLinkTypeId:number;
        sewerWaterTypeId:number;
        startKoppelPuntId:number;
        statussen:Status[];
        straatId:number;

    }

}
