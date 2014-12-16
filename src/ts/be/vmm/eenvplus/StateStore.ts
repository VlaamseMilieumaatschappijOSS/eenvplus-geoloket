///ts:ref=Module
/// <reference path="./Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus {
    'use strict';

    export interface StateStore {
        current:applicationState.State[];
        currentMode:applicationState.State;
        currentLevel:applicationState.State;
        featureSelected:applicationState.State;
        modeChanged:Trasys.Signals.ITypeSignal<applicationState.State>;
        levelChanged:Trasys.Signals.ITypeSignal<applicationState.State>;
    }

    export module StateStore {
        export var NAME:string = PREFIX + 'StateStore';

        factory.$inject = [];

        function factory():StateStore {
            var _currentMode = applicationState.State.VIEW,
                _currentLevel = applicationState.State.OVERVIEW,
                store = {
                    get current():applicationState.State[] {
                        return [_currentMode, _currentLevel, store.featureSelected];
                    },
                    get currentMode():applicationState.State {
                        return _currentMode;
                    },
                    set currentMode(value:applicationState.State) {
                        if (value === _currentMode) return;
                        _currentMode = value;
                        store.modeChanged.fire(value);
                    },
                    get currentLevel():applicationState.State {
                        return _currentLevel;
                    },
                    set currentLevel(value:applicationState.State) {
                        if (value === _currentLevel) return;
                        _currentLevel = value;
                        store.levelChanged.fire(value);
                    },
                    featureSelected: applicationState.State,
                    modeChanged: new Trasys.Signals.TypeSignal(),
                    levelChanged: new Trasys.Signals.TypeSignal()
                };

            return store;
        }

        angular
            .module(MODULE)
            .factory(NAME, factory);
    }

}
