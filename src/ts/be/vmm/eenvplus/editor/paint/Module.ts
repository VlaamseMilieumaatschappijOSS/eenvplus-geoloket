module be.vmm.eenvplus.editor.paint {
    'use strict';

    export var MODULE:string = PREFIX + '_paint';

    export enum FeatureType {
        SEWER,
        APPURTENANCE
    }

    goog.provide(MODULE);

    angular.module(MODULE, []);

}
