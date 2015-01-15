///ts:ref=Prefix
/// <reference path="./Prefix.ts"/> ///ts:ref:generated
/// <reference path="config/Module.ts"/>
/// <reference path="editor/Module.ts"/>
/// <reference path="feature/Module.ts"/>
/// <reference path="label/Module.ts"/>
/// <reference path="state/Module.ts"/>
/// <reference path="user/Module.ts"/>
/// <reference path="viewer/Module.ts"/>

module be.vmm.eenvplus {
    'use strict';

    export var MODULE:string = PREFIX + '_eenvplus';

    interface AnyFunction {
        (...args:any[]):any;
    }

    export function factory(value:any, dependencies?:string[]):AnyFunction {
        var fn = function createFactory():Function {
            return value;
        };
        if (dependencies) fn.$inject = dependencies;
        return fn;
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
        return function apply(args:any[]) {
            return fn.apply(null, args);
        };
    }

    export function passThrough(fn:Function):AnyFunction {
        return function passThrough(first:any):void {
            fn.call(this, first);
            return first;
        };
    }

    export function changeEvent(propertyName:string):string {
        return 'change:' + propertyName;
    }

    goog.provide(MODULE);

    angular.module(MODULE, [
        config.MODULE,
        editor.MODULE,
        feature.MODULE,
        label.MODULE,
        state.MODULE,
        user.MODULE,
        viewer.MODULE,
        'ngResource'
    ]);

}
