///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    export interface SnappingStore {
        current:SnappingType;
        selected:Trasys.Signals.ITypeSignal<SnappingType>;
    }

    export module SnappingStore {
        export var NAME:string = PREFIX + 'SnappingStore';

        var current = SnappingType.NONE,
            store = {
                get current():SnappingType {
                    return current;
                },
                set current(value:SnappingType) {
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
