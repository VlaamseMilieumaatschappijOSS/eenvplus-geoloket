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

        function factory():AreaStore {
            var _current,
                store = {
                    get current():ol.Extent {
                        return _current;
                    },
                    set current(value:ol.Extent) {
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
