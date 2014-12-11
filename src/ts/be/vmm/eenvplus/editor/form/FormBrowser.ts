///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.formBrowser {
    'use strict';

    export var NAME:string = PREFIX + 'FormBrowser';

    function configure():ng.IDirective {
        FormBrowserController.$inject = ['$scope'];

        return {
            restrict: 'A',
            scope: {},
            controllerAs: 'ctrl',
            controller: FormBrowserController,
            templateUrl: 'html/be/vmm/eenvplus/editor/form/FormBrowser.html'
        };
    }

    class FormBrowserController {

        public features:feature.model.FeatureJSON[];
        public featureType:any;

        constructor(scope:ng.IScope) {
            this.featureType = feature.FeatureType;
            scope.$on(feature.EVENT.selected, handle(this.setFeatures.bind(this)));
        }

        public setFeatures(features:feature.model.FeatureJSON[]):void {
            this.features = features;
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
