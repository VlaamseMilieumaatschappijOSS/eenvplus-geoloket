///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    export interface SnappingStore {
        current:SnappingType;
        resolution:number;
        selected:Trasys.Signals.ITypeSignal<SnappingType>;
        resolutionChanged:Trasys.Signals.ITypeSignal<number>;
    }

    export module SnappingStore {
        export var NAME:string = PREFIX + 'SnappingStore';
        export var DEFAULT_RESOLUTION = [48, 12, 12, 12];

        var current = SnappingType.NONE,
            resolution,
            useDefaultResolution:boolean = true,
            store = {
                get current():SnappingType {
                    return current;
                },
                set current(value:SnappingType) {
                    if (value === current) return;
                    current = value;
                    updateResolution();
                    store.selected.fire(value);
                },
                get resolution():number {
                    return resolution;
                },
                set resolution(value:number) {
                    if (value === resolution) return;
                    useDefaultResolution = false;
                    resolution = value;
                    store.resolutionChanged.fire(value);
                },
                selected: new Trasys.Signals.TypeSignal(),
                resolutionChanged: new Trasys.Signals.TypeSignal()
            };

        function updateResolution():void {
            if (current !== undefined && useDefaultResolution)
                resolution = DEFAULT_RESOLUTION[current];
        }

        updateResolution();

        angular
            .module(MODULE)
            .factory(NAME, factory(store));
    }

}
