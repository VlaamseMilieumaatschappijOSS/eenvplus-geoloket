///ts:ref=Prefix
/// <reference path="../Prefix.ts"/> ///ts:ref:generated
///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor {
    'use strict';

    export interface StateController<T> {
        (type:T, activate:() => void, deactivate:() => void, condition?:() => boolean):void;
    }

    export module StateController {
        ['Painter', 'GeometryEditor', 'Snapping'].forEach(createFactory);

        export function factory<T>(store:any):StateController<T> {
            return function StateController<T>(type:T,
                                               activate:() => void,
                                               deactivate:() => void,
                                               condition?:() => boolean):void {

                var isActive:boolean = false;

                store.selected.add(handleSelection);

                function handleSelection(newType:T):void {
                    type === newType ? handleActivation() : handleDeactivation();
                }

                function handleActivation():void {
                    if (isActive || (condition && !condition())) return;

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

        function createFactory(name:string):void {
            var fn = (store:any):StateController<any> => {
                return factory(store);
            };
            fn.$inject = [PREFIX + name + 'Store'];

            angular
                .module(MODULE)
                .factory(PREFIX + name + 'State', fn);
        }

    }

}
