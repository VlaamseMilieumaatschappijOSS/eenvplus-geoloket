declare module Trasys.Signals {
    interface IListener {
        (): void;
    }
}
declare module Trasys.Signals {
    interface ISignal {
        add(listener: IListener, scope?: any): ISignal;
        once(listener: IListener, scope?: any): ISignal;
        remove(listener: IListener, scope?: any): ISignal;
        removeAll(): ISignal;
        fire(): ISignal;
    }
}
declare module Trasys.Signals {
    interface ITypeListener<T> {
        (arg: T): void;
    }
}
declare module Trasys.Signals {
    interface ITypeSignal<T> {
        add(listener: ITypeListener<T>, scope?: any): ITypeSignal<T>;
        once(listener: ITypeListener<T>, scope?: any): ITypeSignal<T>;
        remove(listener: ITypeListener<T>, scope?: any): ITypeSignal<T>;
        removeAll(): ITypeSignal<T>;
        fire(arg: T): ITypeSignal<T>;
    }
}
declare module Trasys.Signals {
    class Slot<T> {
        public isOnce: boolean;
        private signal;
        private listener;
        private scope;
        constructor(signal: any, listener: ITypeListener<T>, scope: any, isOnce?: boolean);
        public execute(arg: T): void;
        public equals(listener: ITypeListener<T>, scope: any): boolean;
        public destroy(): void;
    }
}
declare module Trasys.Signals {
    class TypeSignal<T> implements ITypeSignal<T> {
        private slots;
        public add(listener: ITypeListener<T>, scope?: any): ITypeSignal<T>;
        public once(listener: ITypeListener<T>, scope?: any): ITypeSignal<T>;
        public remove(listener: ITypeListener<T>, scope?: any): ITypeSignal<T>;
        public removeAll(): ITypeSignal<T>;
        public fire(arg: T): ITypeSignal<T>;
        private hasSlot(listener, scope);
    }
}
declare module Trasys.Signals {
    class Signal implements ISignal {
        private wrapped;
        public add(listener: IListener, scope?: any): ISignal;
        public once(listener: IListener, scope?: any): ISignal;
        public remove(listener: IListener, scope?: any): ISignal;
        public removeAll(): ISignal;
        public fire(): ISignal;
    }
}
