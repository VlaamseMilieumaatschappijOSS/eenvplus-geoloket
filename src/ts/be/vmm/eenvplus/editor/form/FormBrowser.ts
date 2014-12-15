///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.formBrowser {
    'use strict';

    export var NAME:string = PREFIX + 'FormBrowser';

    function configure():ng.IDirective {
        FormBrowserController.$inject = ['epFeatureStore'];

        return {
            restrict: 'A',
            scope: {},
            controllerAs: 'ctrl',
            controller: FormBrowserController,
            templateUrl: 'html/be/vmm/eenvplus/editor/form/FormBrowser.html'
        };
    }

    class FormBrowserController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        public featureType:any;

        public get features():feature.model.FeatureJSON[] {
            return this.featureStore.current ? [this.featureStore.current] : [];
        }

        private featureStore:feature.FeatureStore;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(featureStore:feature.FeatureStore) {
            this.featureType = feature.FeatureType;
            this.featureStore = featureStore;
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
