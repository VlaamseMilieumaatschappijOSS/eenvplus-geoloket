module be.vmm.eenvplus.feature.model {
    'use strict';

    export interface FeatureProperties {

        alternatieveId:string;
        beginLifeSpanVersion:number;
        creationDate:number;
        endLifeSpanVersion:number;
        namespaceId:number;
        userId:number;

    }

    /* tslint:disable */
    export var FeatureProperty = {

        ALTERNATIEVE_ID: 'alternatieveId',
        BEGIN_LIFESPAN_VERSION: 'beginLifeSpanVersion',
        CREATION_DATE: 'creationDate',
        END_LIFESPAN_VERSION: 'endLifeSpanVersion',
        NAMESPACE_ID: 'namespaceId',
        USER_ID: 'userId'

    };

}
