///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.geometry {
    'use strict';

    export interface ActionStore {
        current:Action;
        selected:Trasys.Signals.ITypeSignal<Action>;
    }

    export module ActionStore {
        export var NAME:string = PREFIX + 'GeometryActionStore';

        var current,
            store = {
                get current():Action {
                    return current;
                },
                set current(value:Action) {
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
