///ts:ref=angular
/// <reference path="../../../../../lib/ts/angular.d.ts"/> ///ts:ref:generated
///ts:ref=closure
/// <reference path="../../../../../lib/ts/closure.d.ts"/> ///ts:ref:generated
///ts:ref=openlayers
/// <reference path="../../../../../lib/ts/openlayers.d.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.Module {
    'use strict';

    export var EDITOR:string = PREFIX + '_editor';

    export enum Painter {
        SEWER,
        APPURTENANCE
    }

    goog.provide(EDITOR);

    angular.module(EDITOR, []);

}
