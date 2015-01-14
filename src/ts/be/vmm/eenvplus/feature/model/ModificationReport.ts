module be.vmm.eenvplus.feature.model {
    'use strict';

    export interface ModificationReport {
        completed:boolean;
        validation:editor.validation.ValidationResult;
        results:ModificationResult[];
    }

}
