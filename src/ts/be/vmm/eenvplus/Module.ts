/// <reference path="editor/Module.ts"/>
/// <reference path="feature/Module.ts"/>
/// <reference path="viewer/Module.ts"/>

module be.vmm.eenvplus {
    'use strict';

    export var PREFIX:string = 'ep';
    export var MODULE:string = PREFIX + '_eenvplus';

    goog.provide(MODULE);

    angular.module(MODULE, [
        editor.MODULE,
        feature.MODULE,
        viewer.MODULE
    ]);

}
