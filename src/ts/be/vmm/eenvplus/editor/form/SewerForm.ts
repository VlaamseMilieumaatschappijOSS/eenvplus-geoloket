///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.sewerForm {
    'use strict';

    export var NAME:string = PREFIX + 'SewerForm';

    function configure():ng.IDirective {
        SewerFormController.$inject = ['$q', 'epLabelService'];

        return {
            restrict: 'A',
            require: 'form',
            scope: {
                data: '='
            },
            bindToController: true,
            controllerAs: 'ctrl',
            controller: SewerFormController,
            templateUrl: 'ts/be/vmm/eenvplus/editor/form/SewerForm.html',
            link: injectValidator
        };
    }

    class SewerFormController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        /** @inject */
        private _data:feature.model.FeatureJSON;
        public get data():feature.model.FeatureJSON {
            return this._data;
        }

        public set data(value:feature.model.FeatureJSON) {
            this._data = value;
            // framework oddity:
            // sometimes the data setter is called twice, so we need to reinitialize the proxies
            // sometimes it's called before the constructor, so we check for the existence of the labels
            if (this.sources) this.initProxies();
        }

        /** @inject */
        public validate:Validator;
        public selectedSource:label.Label;
        public sources:Array<label.Label>;
        public selectedType:label.Label;
        public types:Array<label.Label>;
        public selectedWaterType:label.Label;
        public waterTypes:Array<label.Label>;
        public isInteger:RegExp = /^\d*$/;
        public max2Decimals:RegExp = /^\d+(,|\.\d{1,2})?$/;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(q:ng.IQService, labelService:label.LabelService) {
            this.sources = labelService.getLabels(label.LabelType.SOURCE);
            this.types = labelService.getLabels(label.LabelType.SEWER_TYPE);
            this.waterTypes = labelService.getLabels(label.LabelType.WATER_TYPE);

            // sometimes the data setter is called before the constructor, so we need to reinitialize the proxies
            if (this.data) this.initProxies();
        }

        private initProxies():void {
            label.proxy(this, this.data.properties)
                .map(this.sources, 'selectedSource', 'namespaceId')
                .map(this.types, 'selectedType', 'rioolLinkTypeId')
                .map(this.waterTypes, 'selectedWaterType', 'sewerWaterTypeId');
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
