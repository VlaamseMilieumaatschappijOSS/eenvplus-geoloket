///ts:ref=angular
/// <reference path="../../../../../lib/ts/angular.d.ts"/> ///ts:ref:generated
///ts:ref=closure
/// <reference path="../../../../../lib/ts/closure.d.ts"/> ///ts:ref:generated
///ts:ref=openlayers
/// <reference path="../../../../../lib/ts/openlayers.d.ts"/> ///ts:ref:generated
///ts:ref=Prefix
/// <reference path="../Prefix.ts"/> ///ts:ref:generated
/// <reference path="area/Module.ts"/>
/// <reference path="form/Module.ts"/>
/// <reference path="geometry/Module.ts"/>
/// <reference path="paint/Module.ts"/>
/// <reference path="snapping/Module.ts"/>
/// <reference path="tools/Module.ts"/>
/// <reference path="validation/Module.ts"/>

module be.vmm.eenvplus.editor {
    'use strict';

    export var MODULE:string = PREFIX + '_editor';

    goog.provide(MODULE);

    angular.module(MODULE, [
        area.MODULE,
        form.MODULE,
        geometry.MODULE,
        paint.MODULE,
        snapping.MODULE,
        tools.MODULE,
        validation.MODULE
    ]);

}
