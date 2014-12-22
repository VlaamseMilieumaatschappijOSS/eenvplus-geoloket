module be.vmm.eenvplus.feature.model {
    'use strict';

    export interface RioolBase extends FeatureProperties {

        label:string;
        omschrijving:string;
        statussen:Status[];

    }

}
