///ts:ref=angular
/// <reference path="../../../../../lib/ts/angular.d.ts"/> ///ts:ref:generated
///ts:ref=closure
/// <reference path="../../../../../lib/ts/closure.d.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor {
    'use strict';

    export module Module {
        export var EDITOR:string = 'ga_editor';
        export var MASK:string = 'ga_editor_mask';
    }

    export module Directive {
        export var MASK:string = 'gaMask';
    }

    goog.provide(Module.EDITOR);

    goog.require(Module.MASK);

    angular.module(Module.EDITOR, [
        Module.MASK
    ]);

}
