module be.vmm.eenvplus {
    'use strict';

    export interface ApplicationScope extends ng.IScope {

        /** geo-admin */
        globals:any;
        map:ol.Map;

        /** eenvplus */
        state:string;

    }

}
