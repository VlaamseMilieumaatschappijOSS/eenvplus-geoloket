///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.paint {
    'use strict';

    PainterManager.$inject = ['epPainterStore', 'epFeatureStore'];

    function PainterManager(store:PainterStore, feature:feature.FeatureStore) {
        feature.selected.add((json:feature.model.FeatureJSON):void => {
            if (!json) store.current = undefined;
        });
    }

    angular
        .module(MODULE)
        .run(PainterManager);

}
