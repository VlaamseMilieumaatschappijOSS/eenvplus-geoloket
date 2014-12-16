module be.vmm.eenvplus.editor.paint {
    'use strict';

    export module PainterState {
        export var NAME:string = PREFIX + 'PainterState';
    }

    export interface PainterState {
        (type:feature.FeatureType, activate:() => void, deactivate:() => void):void;
    }

    factory.$inject = ['epPainterStore'];

    function factory(store:PainterStore):PainterState {
        return function PainterState(type:feature.FeatureType, activate:() => void, deactivate:() => void):void {
            var isActive:boolean = false;

            store.selected.add(handlePainterSelection);

            function handlePainterSelection(newType:feature.FeatureType):void {
                type === newType ? handleActivation() : handleDeactivation();
            }

            function handleActivation():void {
                if (isActive) return;

                isActive = true;
                activate();
            }

            function handleDeactivation():void {
                if (!isActive) return;

                isActive = false;
                deactivate();
            }
        };
    }

    angular
        .module(MODULE)
        .factory(PainterState.NAME, factory);

}
