/// <reference path="editor/Module.ts"/>
/// <reference path="viewer/Module.ts"/>

module be.vmm.eenvplus {
    'use strict';

    export var PREFIX:string = 'ep';

    export module Module {
        export var EENVPLUS:string = PREFIX + '_eenvplus';

        goog.provide(EENVPLUS);

        angular.module(EENVPLUS, [
            editor.Module.EDITOR,
            viewer.Module.VIEWER
        ]);
    }

}
