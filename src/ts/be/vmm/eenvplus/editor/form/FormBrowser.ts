///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.formBrowser {
    'use strict';

    export var NAME:string = PREFIX + 'FormBrowser';

    interface Scope extends ng.IScope {
        features:feature.model.FeatureJSON[];
        featureType:feature.FeatureType;
    }

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            scope: {},
            controller: FormBrowserController,
            templateUrl: 'html/be/vmm/eenvplus/editor/form/FormBrowser.html'
        };
    }

    FormBrowserController.$inject = ['$scope'];

    function FormBrowserController(scope:Scope):void {

        _.merge(scope, {
            featureType: feature.FeatureType
        });

        scope.$on(feature.EVENT.selected, handle(setFeatures));

        function setFeatures(features:feature.model.FeatureJSON[]):void{
            scope.features = features;
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
