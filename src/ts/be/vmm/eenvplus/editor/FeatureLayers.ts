///ts:ref=Mask
/// <reference path="./Mask.ts"/> ///ts:ref:generated
///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.featureLayers {
    'use strict';

    export var NAME:string = PREFIX + 'FeatureLayers';

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            controller: FeatureLayersController
        };
    }

    FeatureLayersController.$inject = ['$scope', 'gaFeatureManager', 'gaFeatureLayerFactory'];

    export function FeatureLayersController(scope:ApplicationScope,
                                            features:feature.FeatureService,
                                            featureLayer:feature.FeatureLayerFactory) {

        scope.$on(mask.EVENT.selected, init);

        function init(event:ng.IAngularEvent, extent:ol.Extent):void {
            features.clear().then(_.partial(load, extent));
        }

        function load(extent:ol.Extent):void {
            features.pull(extent)
                .then(createLayers)
                .catch((error:Error) => {
                    console.error('Failed to load features', error);
                });
        }

        function createLayers():void {
            scope.map.addLayer(featureLayer.createLayer('all:be.vmm.eenvplus.sdi.model.KoppelPunt'));
        }
    }

    angular
        .module(Module.EDITOR)
        .directive(NAME, configure);

}
