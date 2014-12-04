module be.vmm.eenvplus.feature.model {
    'use strict';

    export interface Feature {

        id:number;
        key:number;
        layerBodId:string;

        alternatieveId:string;
        beginLifeSpanVersion:number;
        creationDate:number;
        endLifeSpanVersion:number;
        namespaceId:number;
        userId:number;

    }

}
