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

        factory.$inject = ['epFeatureStore'];

        function factory(feature:feature.FeatureStore):PainterStore {
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

            feature.selected.add((json:feature.model.FeatureJSON):void => {
                if (!json) store.current = json;
            });

            return store;
        }

        angular
            .module(MODULE)
            .factory(NAME, factory);
    }

}

