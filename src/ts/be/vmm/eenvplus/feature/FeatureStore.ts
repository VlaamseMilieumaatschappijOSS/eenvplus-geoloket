///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.feature {
    'use strict';

    export interface FeatureStore {
        current:model.FeatureJSON;
        emphasized:model.FeatureJSON;
        selectedView:ol.Feature;
        selection:ol.Collection<ol.Feature>;
    }

    export module FeatureStore {
        export var NAME:string = PREFIX + 'FeatureStore';

        factory.$inject = ['epFeatureSignals'];

        function factory(signals:FeatureSignals):FeatureStore {
            var store, current, emphasized;

            return store = {
                get current():model.FeatureJSON {
                    return current;
                },
                set current(value:model.FeatureJSON) {
                    if (value === current) return;
                    signals.selecting.fire(value);
                    current = value;
                    signals.selected.fire(value);
                },
                get emphasized():model.FeatureJSON {
                    return emphasized;
                },
                set emphasized(value:model.FeatureJSON) {
                    if (value === emphasized) return;
                    emphasized = value;
                    signals.requestEmphasis.fire(value);
                },
                get selectedView():ol.Feature {
                    if (!current || !store.selection) return undefined;
                    return _.find(store.selection.getArray(), {key: current.key});
                },
                selection: undefined
            };
        }

        angular
            .module(MODULE)
            .factory(NAME, factory);
    }

}
