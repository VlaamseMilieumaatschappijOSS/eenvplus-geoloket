module be.vmm.eenvplus.label {
    'use strict';

    export interface Proxy {
        map:(labels:Label[], proxyProp:string, idProp:string) => Proxy;
    }

    export function proxy(proxyObj:any, dataObj:any):Proxy {
        return {
            map: _.partial(map, proxyObj, dataObj)
        };
    }

    export function map(proxyObj:any, dataObj:any, labels:Label[], proxyProp:string, idProp:string):Proxy {
        var accessor = {
            get: getter(labels, dataObj, idProp),
            set: setter(dataObj, idProp)
        };

        Object.defineProperty(proxyObj, proxyProp, accessor);
        return proxy(proxyObj, dataObj);
    }

    export function getter(labels:Label[], data:any, idProp:string):() => Label {
        return function getter():Label {
            return _.find(labels, {id: data[idProp]});
        };
    }

    export function setter(data:any, idProp:string):(label:Label) => void {
        return function setter(label:Label):void {
            if (label.id !== data[idProp]) data[idProp] = label.id;
        };
    }

}
