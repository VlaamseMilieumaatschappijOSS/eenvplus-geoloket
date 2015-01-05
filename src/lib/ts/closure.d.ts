declare var goog:goog.ClosureStatic;

declare module goog {

    interface ClosureStatic {

        events:events.Static;

        addDependency(relPath:string, provides:string[], requires:string[]):void;
        base(instance:Function, ...args:any[]):void;
        base(instance:Function, method:string, ...args:any[]):void;
        define(name:string, defaultValue:any):void;
        getObjectByName(name:string, obj?:any):any;
        getUid(object:Object):string;
        inherits(subClass:Function, baseClass:Function):void;
        isNull(value:any):boolean;
        provide(name:string):void;
        require(name:string):void;
        setTestOnly(message?:string):void

    }

    module events {

        interface Static {
            Event:Event;
            EventType:EventType;
            Key:Key<any>;
        }

        interface Key<T> {
            src:T;
        }

        interface Event {
        }

        interface EventType {
            CHANGE:string;
        }

    }

}

