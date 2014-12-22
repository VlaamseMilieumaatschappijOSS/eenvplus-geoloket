module be.vmm.eenvplus.feature.model {
    'use strict';

    export interface FeatureProperties {

        alternatieveId?:string;
        beginLifespanVersion?:number;
        creationDate?:number;
        endLifespanVersion?:number;
        namespaceId?:number;
        userId?:number;

    }

    /* tslint:disable */
    export var FeatureProperty = {

        ALTERNATIEVE_ID: 'alternatieveId',
        BEGIN_LIFESPAN_VERSION: 'beginLifespanVersion',
        CREATION_DATE: 'creationDate',
        END_LIFESPAN_VERSION: 'endLifespanVersion',
        NAMESPACE_ID: 'namespaceId',
        USER_ID: 'userId'

    };

}
