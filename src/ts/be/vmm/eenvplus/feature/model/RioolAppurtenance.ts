///ts:ref=Feature
/// <reference path="./Feature.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.feature.model {
    'use strict';

    export interface RioolAppurtenance extends Feature {

        koppelPuntId:number;
        label:string;
        omschrijving:string;
        rioolAppurtenanceTypeId:number;
        statussen:Status[];
        vhaSegmentId:number;

    }

}
