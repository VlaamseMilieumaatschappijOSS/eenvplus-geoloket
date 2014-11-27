module be.vmm.eenvplus.feature {
    'use strict';

    export interface FeatureLayerFactory {

        createSource(layerBodId:string):ol.source.ServerVector;
        createLayer(layerBodId:string):ol.layer.Vector;

    }

}
