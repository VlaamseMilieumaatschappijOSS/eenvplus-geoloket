///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.geometry {
    'use strict';

    export interface EditorStore {
        current:EditorType;
        selected:Trasys.Signals.ITypeSignal<EditorType>;
    }

    export module EditorStore {
        export var NAME:string = PREFIX + 'GeometryEditorStore';

        var current,
            store = {
                get current():EditorType {
                    return current;
                },
                set current(value:EditorType) {
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
