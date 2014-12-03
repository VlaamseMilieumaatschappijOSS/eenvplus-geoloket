module be.vmm.eenvplus.feature {
    'use strict';

    export enum FeatureType {
        SEWER,
        APPURTENANCE,
        MOUNT_POINT
    }

    var editableModelPackage = 'be.vmm.eenvplus.sdi.model';

    export var typeModelMap = [
        path('RioolLink'),
        path('RioolAppurtenance'),
        path('KoppelPunt')
    ];

    export var typeDrawTypeMap = [
        'LineString',
        'Point'
    ];

    export function isEditable(model:string):boolean {
        return _.contains(model, editableModelPackage);
    }

    export function toType(model:string):FeatureType {
        return typeModelMap.indexOf(model);
    }

    export function getLayer(map:ol.Map, type:FeatureType):ol.layer.Vector {
        var layers = map.getLayers().getArray();
        return _.where(layers, {values_: {featureType: type}});
    }

    function path(name:string):string {
        return editableModelPackage + '.' + name;
    }

    angular
        .module(MODULE)
        .constant('FeatureType', FeatureType)
        .constant('typeModelMap', typeModelMap)
        .constant('typeDrawTypeMap', typeDrawTypeMap);

}
