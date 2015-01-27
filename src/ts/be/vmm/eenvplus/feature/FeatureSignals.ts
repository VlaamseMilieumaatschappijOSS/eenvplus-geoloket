///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

import signal = Trasys.Signals;

module be.vmm.eenvplus.feature {
    'use strict';

    export interface FeatureSignals {
        created:signal.ITypeSignal<model.FeatureJSON>;
        loaded:signal.ISignal;
        pushed:signal.ITypeSignal<model.ModificationReport>;
        removed:signal.ITypeSignal<model.FeatureJSON>;
        requestEmphasis:signal.ITypeSignal<model.FeatureJSON>;
        selected:signal.ITypeSignal<model.FeatureJSON>;
        selecting:signal.ITypeSignal<model.FeatureJSON>;
        updated:signal.ITypeSignal<model.FeatureJSON>;
        validated:signal.ITypeSignal<editor.validation.ValidationResult>;
    }

    export module FeatureSignals {
        export var NAME:string = PREFIX + 'FeatureSignals';

        var signals = {
            created: new signal.TypeSignal<model.FeatureJSON>(),
            loaded: new signal.Signal(),
            pushed: new signal.TypeSignal<model.ModificationReport>(),
            removed: new signal.TypeSignal<model.FeatureJSON>(),
            requestEmphasis: new signal.TypeSignal(),
            selected: new signal.TypeSignal(),
            selecting: new signal.TypeSignal(),
            updated: new signal.TypeSignal<model.FeatureJSON>(),
            validated: new signal.TypeSignal<editor.validation.ValidationResult>()
        };

        angular
            .module(MODULE)
            .factory(NAME, factory(signals));
    }

}
