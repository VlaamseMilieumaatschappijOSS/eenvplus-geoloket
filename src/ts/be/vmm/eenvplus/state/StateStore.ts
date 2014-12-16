///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

import State = be.vmm.eenvplus.applicationState.State;
import signal = Trasys.Signals;

module be.vmm.eenvplus {
    'use strict';

    export interface StateStore {
        current:State[];
        currentMode:State;
        currentLevel:State;
        featureSelected:State;
        modeChanged:signal.ITypeSignal<State>;
        levelChanged:signal.ITypeSignal<State>;
    }

    export module StateStore {
        export var NAME:string = PREFIX + 'StateStore';

        var _currentMode = State.VIEW,
            _currentLevel = State.OVERVIEW,
            store = {
                get current():State[] {
                    return [_currentMode, _currentLevel, store.featureSelected];
                },
                get currentMode():State {
                    return _currentMode;
                },
                set currentMode(value:State) {
                    if (value === _currentMode) return;
                    _currentMode = value;
                    store.modeChanged.fire(value);
                },
                get currentLevel():State {
                    return _currentLevel;
                },
                set currentLevel(value:State) {
                    if (value === _currentLevel) return;
                    _currentLevel = value;
                    store.levelChanged.fire(value);
                },
                featureSelected: State,
                modeChanged: new signal.TypeSignal(),
                levelChanged: new signal.TypeSignal()
            };

        factory.$inject = ['epMap', 'epFeatureStore'];

        function factory():StateStore {
            return store;
        }

        angular
            .module(MODULE)
            .factory(NAME, factory);
    }

}
