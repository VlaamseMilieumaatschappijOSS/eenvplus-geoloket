declare var _:_.Static;

declare module _ {

    /** Chaining */
    interface Static {
        (value:any):Chain;
        chain(value:any):Chain;
        tap(value:any, interceptor:Function):any;
    }

    interface Chain {
        chain(value:any):Chain;
        tap(interceptor:Function):any;
        toString():string;
        value():any;
        valueOf():any;
    }

    /** Arrays */
    interface Static {
        compact(array:any[]):any[];
        difference(array:any[], values:any[]):any[];
        first(array:any[], fn?:any, scope?:any):any;
        last(array:any[], fn?:any, scope?:any):any;
    }

    interface Chain {
        compact():Chain;
        difference(values:any[]):Chain;
        first(fn?:any, scope?:any):Chain;
        last(fn?:any, scope?:any):Chain;
    }

    /** Collections */
    interface Static {
        cloneDeep(value:any, fn?:(value:any) => any, scope?:any):any;
        contains(collection:any[], target:any, fromIndex?:number):boolean;
        contains(collection:Object, target:any, fromIndex?:number):boolean;
        contains(collection:string, target:any, fromIndex?:number):boolean;
        each(collection:any, fn:any, scope?:any):any;
        filter(collection:any, fn:any, scope?:any):any[];
        find(collection:any, fn:any, scope?:any):any;
        invoke(collection:any, fn:Function, ...args:any[]):any;
        invoke(collection:any, methodName:string, ...args:any[]):any;
        isEqual(valueA:any, valueB:any, compare?:ComparingIterator, scope?:any):boolean;
        map(collection:any, fn:any, scope?:any):any;
        reduce(collection:any, fn:MemoIterator, accumulator:any, scope?:any):any;
        where(collection:any, query:Object):any;
    }

    interface Chain {
        each(fn:any, scope?:any):Chain;
        filter(fn:any, scope?:any):Chain;
        invoke(fn:Function, ...args:any[]):Chain;
        invoke(methodName:string, ...args:any[]):Chain;
        map(fn:any, scope?:any):Chain;
        where(query:Object):Chain;
    }

    /** Functions */
    interface Static {
        bind(fn:Function, scope?:any, ...args:any[]):AnyFunction;
        bindAll(object:Object, ...fns:string[]):Object;
        compose(...fns:Function[]):AnyFunction;
        curry(fn:Function):AnyFunction;
        partial(fn:Function, ...args:any[]):AnyFunction;
        partialRight(fn:Function, ...args:any[]):AnyFunction;
        wrap(value:any, wrapper:Function):AnyFunction;
    }

    /** Objects */
    interface Static {
        mapValues(object:Object, fn:any, scope?:any):any;
        merge(object:Object, source:Object, callback?:MergingIterator, scope?:any):Object;
    }

    interface Chain {
        mapValues(fn:any, scope?:any):Chain;
    }

    /** Iterators */
    interface ComparingIterator {
        (valueA:any, valueB:any):boolean;
    }

    interface MemoIterator {
        (prev:any, curr:any, key?:any, collection?:any):boolean;
    }

    interface MergingIterator {
        (objectValue:any, sourceValue:any):any;
    }


    interface AnyFunction {
        (...args:any[]):any;
    }

}
