///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.area {
    'use strict';

    export interface AreaStore {
        current:ol.Extent;
        selected:Trasys.Signals.ITypeSignal<ol.Extent>;
    }

    export module AreaStore {
        export var NAME:string = PREFIX + 'AreaStore';

        var current,
            store = {
                get current():ol.Extent {
                    return current;
                },
                set current(value:ol.Extent) {
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
