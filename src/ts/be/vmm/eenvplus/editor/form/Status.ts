///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.Status {
    'use strict';

    export var NAME:string = PREFIX + 'FeatureStatus';

    function configure():ng.IDirective {
        StatusController.$inject = ['epFeatureManager', 'epLabelService'];

        return {
            restrict: 'A',
            require: '^form',
            scope: {
                data: '='
            },
            bindToController: true,
            controllerAs: 'ctrl',
            controller: StatusController,
            templateUrl: 'ts/be/vmm/eenvplus/editor/form/Status.html',
            link: injectValidator
        };
    }

    class StatusController {

        private static counter:number = 0;

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        public uid:number = StatusController.counter++;
        /** @inject */
        public data:feature.model.Status;
        /** @inject */
        public validate:Validator;
        public types:Array<label.Label>;
        public selectedStatus:label.Label;

        private _start:Date;
        public get start():Date {
            if (this.data.geldigVanaf) {
                if (!this._start || this._start.getTime() !== this.data.geldigVanaf)
                    this._start = new Date(this.data.geldigVanaf);
            }
            else this._start = undefined;
            return this._start;
        }

        public set start(date:Date) {
            if (date === this._start) return;

            this._start = date;
            this.data.geldigVanaf = date ? date.getTime() : undefined;
        }

        private _end:Date;
        public get end():Date {
            if (this.data.geldigTot) {
                if (!this._end || this._end.getTime() !== this.data.geldigTot)
                    this._end = new Date(this.data.geldigTot);
            }
            else this._end = undefined;
            return this._end;
        }

        public set end(date:Date) {
            if (date === this._end) return;

            this._end = date;
            this.data.geldigTot = date ? date.getTime() : undefined;
        }


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(manager:feature.FeatureManager, labelService:label.LabelService) {
            this.types = labelService.getLabels(label.LabelType.STATUS);
            this.remove = _.partial(manager.removeStatus, this.data);

            label.proxy(this, this.data)
                .map(this.types, 'selectedStatus', 'statusId');
        }


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        public handleDateClick(event:Event, name:string):void {
            event.preventDefault();
            event.stopPropagation();

            this[name + 'Opened'] = !this[name + 'Opened'];
        }

        public remove:() => void;

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
