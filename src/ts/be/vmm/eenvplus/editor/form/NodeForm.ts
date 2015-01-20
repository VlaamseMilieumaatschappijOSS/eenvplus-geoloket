///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.NodeForm {
    'use strict';

    export var NAME:string = PREFIX + 'NodeForm';

    function configure():ng.IDirective {
        NodeFormController.$inject = ['epLabelService'];

        return {
            restrict: 'A',
            scope: {
                data: '='
            },
            bindToController: true,
            controllerAs: 'ctrl',
            controller: NodeFormController,
            templateUrl: 'ts/be/vmm/eenvplus/editor/form/NodeForm.html'
        };
    }

    class NodeFormController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        /** @inject */
        public data:feature.model.FeatureJSON;
        /** @inject */
        public validate:Validator;
        public selectedSource:label.Label;
        public sources:Array<label.Label>;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(labelService:label.LabelService) {
            this.sources = labelService.getLabels(label.LabelType.SOURCE);

            label.proxy(this, this.data.properties)
                .map(this.sources, 'selectedSource', 'namespaceId');
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
