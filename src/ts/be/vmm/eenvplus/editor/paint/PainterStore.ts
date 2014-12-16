///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.paint {
    'use strict';

    export interface PainterStore {
        current:feature.FeatureType;
        selected:Trasys.Signals.ITypeSignal<feature.FeatureType>;
    }

    export module PainterStore {
        export var NAME:string = PREFIX + 'PainterStore';

        var current,
            store = {
                get current():feature.FeatureType {
                    return current;
                },
                set current(value:feature.FeatureType) {
                    if (value === current) return;
                    current = value;
                    store.selected.fire(value);
                },
                selected: new Trasys.Signals.TypeSignal()
            };

        angular
            .module(MODULE)
            .factory(NAME, factory(store));

    }

}

