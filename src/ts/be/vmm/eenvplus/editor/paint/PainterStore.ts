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

        function factory():PainterStore {
            var _current,
                store = {
                    get current():feature.FeatureType {
                        return _current;
                    },
                    set current(value:feature.FeatureType) {
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

