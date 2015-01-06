module be.vmm.eenvplus.editor.validation {
    'use strict';

    export interface FeatureResult {

        key:number;
        layerBodId:string;
        valid:boolean;
        messages:Message[];

    }

}
