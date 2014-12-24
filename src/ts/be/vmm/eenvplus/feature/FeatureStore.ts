///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.feature {
    'use strict';

    export interface FeatureStore {
        current:model.FeatureJSON;
        selected:Trasys.Signals.ITypeSignal<model.FeatureJSON>;
        selection:ol.Collection<ol.Feature>;
    }

    export module FeatureStore {
        export var NAME:string = PREFIX + 'FeatureStore';

        var current,
            store = {
                get current():model.FeatureJSON {
                    return current;
                },
                set current(value:model.FeatureJSON) {
                    if (value === current) return;
                    current = value;
                    store.selected.fire(value);
                },
                selected: new Trasys.Signals.TypeSignal(),
                selection: undefined
            };

        angular
            .module(MODULE)
            .factory(NAME, factory(store));
    }

}
