declare var goog:ClosureStatic;

interface ClosureStatic {

    addDependency(relPath:string, provides:string[], requires:string[]):void;
    define(name:string, defaultValue:any):void;
    getObjectByName(name:string, obj?:any):any;
    provide(name:string):void;
    require(name:string):void;
    setTestOnly(message?:string):void

}
