/// <reference path="editor/Module.ts"/>
/// <reference path="feature/Module.ts"/>
/// <reference path="viewer/Module.ts"/>

module be.vmm.eenvplus {
    'use strict';

    export var PREFIX:string = 'ep';
    export var MODULE:string = PREFIX + '_eenvplus';

    export function changeEvent(propertyName:string):string {
        return 'change:' + propertyName;
    }

    goog.provide(MODULE);

    angular.module(MODULE, [
        editor.MODULE,
        feature.MODULE,
        viewer.MODULE
    ]);

}
