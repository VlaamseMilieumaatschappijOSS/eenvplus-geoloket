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
        flatten(array:any[], callback:ListIterator, scope?:any):any[];
        flatten(array:any[], isShallow:boolean, callback:ListIterator, scope?:any):any[];
        flatten(array:any[], isShallow:boolean, pluckValue:string):any[];
        flatten(array:any[], isShallow:boolean, whereValue:Object):any[];
        flatten(array:any[], isShallow?:boolean):any[];
        flatten(array:any[], pluckValue:string):any[];
        flatten(array:any[], whereValue:Object):any[];
        intersection(...arrays:any[][]):any[];
        last(array:any[], fn?:any, scope?:any):any;
        remove(array:any[], callback:ListIterator, scope?:any):any[];
        remove(array:any[], pluckValue:string):any[];
        remove(array:any[], whereValue:Object):any[];
        uniq(array:any[], callback:ListIterator, scope?:any):any[];
        uniq(array:any[], isSorted:boolean, callback:ListIterator, scope?:any):any[];
        uniq(array:any[], isSorted:boolean, pluckValue:string):any[];
        uniq(array:any[], isSorted:boolean, whereValue:Object):any[];
        uniq(array:any[], isSorted?:boolean):any[];
        uniq(array:any[], pluckValue:string):any[];
        uniq(array:any[], whereValue:Object):any[];
        unzip(...arrays:any[][]):any[][];
        zip(...arrays:any[][]):any[][];
    }

    interface Chain {
        compact():Chain;
        difference(values:any[]):Chain;
        first(fn?:any, scope?:any):Chain;
        flatten(callback:ListIterator, scope?:any):Chain;
        flatten(isShallow:boolean, callback:ListIterator, scope?:any):Chain;
        flatten(isShallow:boolean, pluckValue:string):Chain;
        flatten(isShallow:boolean, whereValue:Object):Chain;
        flatten(isShallow?:boolean):Chain;
        flatten(pluckValue:string):Chain;
        flatten(whereValue:Object):Chain;
        intersection(...arrays:any[][]):any[];
        last(fn?:any, scope?:any):Chain;
        remove(callback:ListIterator, scope?:any):Chain;
        remove(pluckValue:string):Chain;
        remove(whereValue:Object):Chain;
        uniq(callback:ListIterator, scope?:any):Chain;
        uniq(isSorted:boolean, callback:ListIterator, scope?:any):Chain;
        uniq(isSorted:boolean, pluckValue:string):Chain;
        uniq(isSorted:boolean, whereValue:Object):Chain;
        uniq(isSorted?:boolean):Chain;
        uniq(pluckValue:string):Chain;
        uniq(whereValue:Object):Chain;
        unzip(...arrays:any[][]):any[][];
        zip(...arrays:any[][]):any[][];
    }

    /** Collections */
    interface Static {
        clone(value:any, isDeep?:boolean, fn?:(value:any) => any, scope?:any):any;
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
        reduce(collection:any, fn:MemoIterator, accumulator?:any, scope?:any):any;
        reject(collection:any, fn:any, scope?:any):any[];
        where(collection:any, query:Object):any;
    }

    interface Chain {
        each(fn:any, scope?:any):Chain;
        filter(fn:any, scope?:any):Chain;
        invoke(fn:Function, ...args:any[]):Chain;
        invoke(methodName:string, ...args:any[]):Chain;
        map(fn:any, scope?:any):Chain;
        reject(fn:any, scope?:any):Chain;
        where(query:Object):Chain;
    }

    /** Functions */
    interface Static {
        bind(fn:Function, scope?:any, ...args:any[]):AnyFunction;
        bindAll(object:Object, ...fns:string[]):Object;
        compose(...fns:Function[]):AnyFunction;
        curry(fn:Function):AnyFunction;
        debounce(fn:Function, time:number, options?:DebounceOptions):AnyFunction;
        delay(fn:Function, time:number, ...args:any[]):AnyFunction;
        partial(fn:Function, ...args:any[]):AnyFunction;
        partialRight(fn:Function, ...args:any[]):AnyFunction;
        throttle(fn:Function, time:number, options?:ThrottleOptions):AnyFunction;
        wrap(value:any, wrapper:Function):AnyFunction;
    }

    interface DebounceOptions extends ThrottleOptions {
        maxWait?:number;
    }

    interface ThrottleOptions {
        leading?:boolean;
        trailing?:boolean;
    }

    /** Objects */
    interface Static {
        assign(object:Object, source:Object, callback?:MergingIterator, scope?:any):any;
        mapValues(object:Object, fn:any, scope?:any):any;
        merge(object:Object, source:Object, callback?:MergingIterator, scope?:any):any;
    }

    interface Chain {
        mapValues(fn:any, scope?:any):Chain;
    }

    /** Utilities */
    interface Static {
        constant(value:any):() => any;
        now():number;
    }

    /** Iterators */
    interface ComparingIterator {
        (valueA:any, valueB:any):boolean;
    }

    interface ListIterator {
        (value:any, index:number, list:any[]):any;
    }

    interface MemoIterator {
        (prev:any, curr:any, key?:any, collection?:any):any;
    }

    interface MergingIterator {
        (objectValue:any, sourceValue:any):any;
    }


    interface AnyFunction {
        (...args:any[]):any;
    }

}
