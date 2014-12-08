///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.formBrowser {
    'use strict';

    export var NAME:string = PREFIX + 'FormBrowser';

    interface Scope extends ng.IScope {
        features:feature.model.FeatureJSON[];
        featureType:feature.FeatureType;
        discard:(json:feature.model.FeatureJSON) => void;
        commit:(json:feature.model.FeatureJSON) => void;
    }

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            scope: {},
            controller: FormBrowserController,
            templateUrl: 'html/be/vmm/eenvplus/editor/form/FormBrowser.html'
        };
    }

    FormBrowserController.$inject = ['$scope', '$rootScope'];

    function FormBrowserController(scope:Scope, rootScope:ng.IScope):void {

        _.merge(scope, {
            featureType: feature.FeatureType,
            discard: discard,
            commit: commit
        });

        scope.$on(feature.EVENT.selected, handle(setFeatures));

        function setFeatures(features:feature.model.FeatureJSON[]):void {
            scope.features = features;
        }

        function discard(json:feature.model.FeatureJSON):void {
            rootScope.$broadcast(feature.EVENT.discardModification, json);
        }

        function commit(json:feature.model.FeatureJSON):void {

        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
