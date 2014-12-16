///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.feature {
    'use strict';

    export interface FeatureStore {
        current:model.FeatureJSON;
        selected:Trasys.Signals.ITypeSignal<model.FeatureJSON>;
    }

    export module FeatureStore {
        export var NAME:string = PREFIX + 'FeatureStore';

        function factory():FeatureStore {
            var _current,
                store = {
                    get current():model.FeatureJSON {
                        return _current;
                    },
                    set current(value:model.FeatureJSON) {
                        if (value === _current) return;
                        _current = value;
                        store.selected.fire(value);
                    },
                    selected: new Trasys.Signals.TypeSignal()
                };

            return store;
        }

        angular
            .module(MODULE)
            .factory(NAME, factory);
    }

}
