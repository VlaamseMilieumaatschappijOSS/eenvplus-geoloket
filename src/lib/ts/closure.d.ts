declare var goog:goog.ClosureStatic;

declare module goog {

    interface ClosureStatic {

        asserts:asserts.Static;
        events:events.Static;
        functions:functions.Static;

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

    module asserts {

        interface Static {
            assertInstanceof(instance:any, klass:any):void;
        }

    }

    module events {

        interface Static {
            BrowserEvent:BrowserEvent;
            Event:Event;
            EventType:EventType;
            Key:Key<any>;
        }

        interface BrowserEvent extends Event {
            ctrlKey:boolean;
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

    module functions {

        interface Static {
            and(fnA:(data?:any) => boolean, fnB:(data?:any) => boolean):boolean;
        }

    }

}

