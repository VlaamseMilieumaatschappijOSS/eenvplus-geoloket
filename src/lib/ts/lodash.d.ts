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
        first(array:any[], fn?:any, scope?:any):any;
        last(array:any[], fn?:any, scope?:any):any;
    }

    interface Chain {
        first(fn?:any, scope?:any):Chain;
        last(fn?:any, scope?:any):Chain;
    }

    /** Collections */
    interface Static {
        cloneDeep(value:any, fn?:(value:any) => any, scope?:any):any;
        each(collection:any, fn:any, scope?:any):any;
        filter(collection:any, fn:any, scope?:any):any[];
        find(collection:any, fn:any, scope?:any):any;
        invoke(collection:any, fn:Function, ...args:any[]):any;
        invoke(collection:any, methodName:string, ...args:any[]):any;
        map(collection:any, fn:any, scope?:any):any;
        reduce(collection:any, fn:MemoIterator, accumulator:any, scope?:any):any;
    }

    interface Chain {
        each(fn:any, scope?:any):Chain;
        filter(fn:any, scope?:any):Chain;
        invoke(fn:Function, ...args:any[]):Chain;
        invoke(methodName:string, ...args:any[]):Chain;
        map(fn:any, scope?:any):Chain;
    }

    /** Functions */
    interface Static {
        bind(fn:Function, scope?:any, ...args:any[]):(...args:any[]) => any;
        curry(fn:Function):(...args:any[]) => any;
        partial(fn:Function, ...args:any[]):(...args:any[]) => any;
        partialRight(fn:Function, ...args:any[]):(...args:any[]) => any;
    }

    /** Objects */
    interface Static {
        mapValues(object:Object, fn:any, scope?:any):any;
    }

    interface Chain {
        mapValues(fn:any, scope?:any):Chain;
    }

    /** Iterators */
    interface MemoIterator {
        (prev:any, curr:any, key?:any, collection?:any):boolean;
    }

}
