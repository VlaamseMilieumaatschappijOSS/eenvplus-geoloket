module be.vmm.eenvplus.editor.validation {
    'use strict';

    export interface ValidationResult {

        layerBodId:string;
        results:FeatureResult[];
        valid:boolean;

    }

}
