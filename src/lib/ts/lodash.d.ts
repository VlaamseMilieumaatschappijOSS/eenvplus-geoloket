declare var _:_.Static;

declare module _ {

    interface Static {

        first(array:any[], fn?:any, scope?:any):any;
        last(array:any[], fn?:any, scope?:any):any;

        cloneDeep(value:any, fn?:(value:any) => any, scope?:any):any;
        each(collection:any, fn:any, scope?:any):any;
        find(collection:any, fn:any, scope?:any):any;
        map(collection:any, fn:any, scope?:any):any;
        mapValues(collection:any, fn:any, scope?:any):any;
        reduce(collection:any, fn:MemoIterator, accumulator:any, scope?:any):any;

        bind(fn:Function, scope?:any, ...args: any[]):Function;
        curry(fn:Function):Function;
        partial(fn:Function, ...args: any[]):Function;
        partialRight(fn:Function, ...args: any[]):Function;

    }

    interface MemoIterator {
        (prev:any, curr:any, key?:any, collection?:any): boolean;
    }

}