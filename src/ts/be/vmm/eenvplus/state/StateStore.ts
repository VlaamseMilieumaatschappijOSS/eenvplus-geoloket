///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.state {
    'use strict';

    export interface StateStore {
        current:State[];
        currentMode:State;
        currentLevel:State;
        featureSelected:State;
        invalid:State;
        modeChanged:Trasys.Signals.ITypeSignal<State>;
        levelChanged:Trasys.Signals.ITypeSignal<State>;
    }

    export module StateStore {
        export var NAME:string = PREFIX + 'StateStore';

        var currentMode = State.VIEW,
            currentLevel = State.OVERVIEW,
            store = {
                get current():State[] {
                    return [currentMode, currentLevel, store.featureSelected, store.invalid];
                },
                get currentMode():State {
                    return currentMode;
                },
                set currentMode(value:State) {
                    if (value === currentMode) return;
                    if (value === State.VIEW) store.invalid = State;
                    currentMode = value;
                    store.modeChanged.fire(value);
                },
                get currentLevel():State {
                    return currentLevel;
                },
                set currentLevel(value:State) {
                    if (value === currentLevel) return;
                    currentLevel = value;
                    store.levelChanged.fire(value);
                },
                featureSelected: State,
                invalid: State,
                modeChanged: new Trasys.Signals.TypeSignal(),
                levelChanged: new Trasys.Signals.TypeSignal()
            };

        angular
            .module(MODULE)
            .factory(NAME, factory(store));
    }

}
