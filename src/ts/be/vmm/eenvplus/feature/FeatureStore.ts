///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.feature {
    'use strict';

    export interface FeatureStore {
        current:model.FeatureJSON;
        emphasized:model.FeatureJSON;
        selectedView:ol.Feature;
        selection:ol.Collection<ol.Feature>;
        selected:Trasys.Signals.ITypeSignal<model.FeatureJSON>;
        selecting:Trasys.Signals.ITypeSignal<model.FeatureJSON>;
        emphasize:Trasys.Signals.ITypeSignal<model.FeatureJSON>;
    }

    export module FeatureStore {
        export var NAME:string = PREFIX + 'FeatureStore';

        var current,
            emphasized,
            store = {
                get current():model.FeatureJSON {
                    return current;
                },
                set current(value:model.FeatureJSON) {
                    if (value === current) return;
                    store.selecting.fire(value);
                    current = value;
                    store.selected.fire(value);
                },
                get emphasized():model.FeatureJSON {
                    return emphasized;
                },
                set emphasized(value:model.FeatureJSON) {
                    if (value === emphasized) return;
                    emphasized = value;
                    store.emphasize.fire(value);
                },
                get selectedView():ol.Feature {
                    if (!store.current || !store.selection) return undefined;
                    return _.find(store.selection.getArray(), {key: current.key});
                },
                selection: undefined,
                selected: new Trasys.Signals.TypeSignal(),
                selecting: new Trasys.Signals.TypeSignal(),
                emphasize: new Trasys.Signals.TypeSignal()
            };

        angular
            .module(MODULE)
            .factory(NAME, factory(store));
    }

}
