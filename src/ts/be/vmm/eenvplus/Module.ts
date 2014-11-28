/// <reference path="editor/Module.ts"/>
/// <reference path="viewer/Module.ts"/>

module be.vmm.eenvplus.Module {
    'use strict';

    export var EENVPLUS:string = 'ga_eenvplus';

    goog.provide(EENVPLUS);

    angular.module(EENVPLUS, [
        editor.Module.EDITOR,
        viewer.Module.VIEWER
    ]);

}
