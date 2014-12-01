///ts:ref=angular
/// <reference path="../../../../../lib/ts/angular.d.ts"/> ///ts:ref:generated
///ts:ref=closure
/// <reference path="../../../../../lib/ts/closure.d.ts"/> ///ts:ref:generated
///ts:ref=openlayers
/// <reference path="../../../../../lib/ts/openlayers.d.ts"/> ///ts:ref:generated
/// <reference path="paint/Module.ts"/>

module be.vmm.eenvplus.editor {
    'use strict';

    export var MODULE:string = PREFIX + '_editor';

    goog.provide(MODULE);

    angular.module(MODULE, [
        paint.MODULE
    ]);

}
