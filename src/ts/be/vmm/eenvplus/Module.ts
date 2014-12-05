/// <reference path="editor/Module.ts"/>
/// <reference path="feature/Module.ts"/>
/// <reference path="label/Module.ts"/>
/// <reference path="viewer/Module.ts"/>

module be.vmm.eenvplus {
    'use strict';

    export var PREFIX:string = 'ep';
    export var MODULE:string = PREFIX + '_eenvplus';

    export function changeEvent(propertyName:string):string {
        return 'change:' + propertyName;
    }

    export function handle(handler:Function, stop:boolean = false):(event:ng.IAngularEvent, ...args:any[]) => any {
        return function handleEvent(event:ng.IAngularEvent, ...args:any[]):any {
            if (stop) {
                event.preventDefault();
                event.stopPropagation();
            }
            handler.apply(null, Array.prototype.slice.call(arguments, 1));
        }
    }

    goog.provide(MODULE);

    angular.module(MODULE, [
        editor.MODULE,
        feature.MODULE,
        label.MODULE,
        viewer.MODULE,
        'ngResource'
    ]);

}
