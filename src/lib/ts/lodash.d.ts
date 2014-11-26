declare var _:_.Static;

declare module _ {

    interface Static {
        (value:any):Chain;

        first(array:any[], fn?:any, scope?:any):any;
        last(array:any[], fn?:any, scope?:any):any;

        cloneDeep(value:any, fn?:(value:any) => any, scope?:any):any;
        each(collection:any, fn:any, scope?:any):any;
        filter(collection:any, fn:any, scope?:any):any[];
        find(collection:any, fn:any, scope?:any):any;
        invoke(collection:any, fn:Function, ...args:any[]):any;
        invoke(collection:any, methodName:string, ...args:any[]):any;
        map(collection:any, fn:any, scope?:any):any;
        mapValues(collection:any, fn:any, scope?:any):any;
        reduce(collection:any, fn:MemoIterator, accumulator:any, scope?:any):any;

        bind(fn:Function, scope?:any, ...args:any[]):Function;
        curry(fn:Function):Function;
        partial(fn:Function, ...args:any[]):Function;
        partialRight(fn:Function, ...args:any[]):Function;

    }

    interface Chain {

        first(fn?:any, scope?:any):Chain;
        last(fn?:any, scope?:any):Chain;

        each(fn:any, scope?:any):Chain;
        filter(fn:any, scope?:any):Chain;
        invoke(fn:Function, ...args:any[]):any;
        invoke(methodName:string, ...args:any[]):any;
        map(fn:any, scope?:any):Chain;
        mapValues(fn:any, scope?:any):Chain;

    }

    interface MemoIterator {
        (prev:any, curr:any, key?:any, collection?:any): boolean;
    }

}
