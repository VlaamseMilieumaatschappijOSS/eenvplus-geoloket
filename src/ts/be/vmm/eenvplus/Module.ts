/// <reference path="config/Module.ts"/>
/// <reference path="editor/Module.ts"/>
/// <reference path="feature/Module.ts"/>
/// <reference path="label/Module.ts"/>
/// <reference path="viewer/Module.ts"/>

module be.vmm.eenvplus {
    'use strict';

    export var PREFIX:string = 'ep';
    export var MODULE:string = PREFIX + '_eenvplus';

    interface AnyFunction {
        (...args:any[]):any;
    }

    export function factory(fn:Function):AnyFunction {
        return function createFactory():Function {
            return fn;
        };
    }

    export function shiftData(fn:Function):AnyFunction {
        return function dataAsLastArgument(...args:any[]):any {
            args.push(args.shift());
            return fn.apply(null, args);
        };
    }

    export function get(propertyChain:string):AnyFunction {
        return function get(object:any):any {
            return _.reduce(propertyChain.split('.'), (host:Object, property:string):any => {
                return host ? host[property] : undefined;
            }, object);
        };
    }

    export function set(property:string, value:any):AnyFunction {
        return function set(object:any):any {
            return object[property] = value;
        };
    }

    export function unary(fn:Function):AnyFunction {
        return function createUnaryFunction(first:any):Function {
            return fn.call(this, first);
        };
    }

    export function apply(fn:Function):AnyFunction {
        return function apply() {
            fn.apply(null, arguments[0]);
        };
    }

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
        };
    }

    goog.provide(MODULE);

    angular.module(MODULE, [
        config.MODULE,
        editor.MODULE,
        feature.MODULE,
        label.MODULE,
        viewer.MODULE,
        'ngResource'
    ]);

}
