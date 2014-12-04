module be.vmm.eenvplus.editor.paint {
    'use strict';

    export module PainterState {
        export var NAME:string = PREFIX + 'PainterState';
    }

    export interface PainterState {
        (type:feature.FeatureType, activate:() => void, deactivate:() => void):void;
    }

    factory.$inject = ['$rootScope'];

    function factory(app:ApplicationScope):PainterState {
        return function PainterState(type:feature.FeatureType, activate:() => void, deactivate:() => void):void {
            var isActive:boolean = false;

            app.$on(EVENT.selected, handle(handlePainterSelection));

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
