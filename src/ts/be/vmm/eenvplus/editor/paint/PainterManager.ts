///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.paint {
    'use strict';

    PainterManager.$inject = ['epPainterStore', 'epFeatureSignals'];

    function PainterManager(store:PainterStore, featureSignals:feature.FeatureSignals) {
        featureSignals.selected.add((json:feature.model.FeatureJSON):void => {
            if (json) store.current = undefined;
        });
    }

    angular
        .module(MODULE)
        .run(PainterManager);

}
