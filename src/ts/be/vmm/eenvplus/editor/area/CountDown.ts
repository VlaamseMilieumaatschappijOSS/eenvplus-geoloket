///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.area.CountDown {
    'use strict';

    export var NAME:string = PREFIX + 'CountDown';

    function configure():ng.IDirective {
        CountDownController.$inject = ['$interval'];

        return {
            restrict: 'A',
            scope: {
                delay: '=?epCountDown'
            },
            bindToController: true,
            controllerAs: 'ctrl',
            controller: CountDownController,
            templateUrl: 'ts/be/vmm/eenvplus/editor/area/CountDown.html'
        };
    }

    class CountDownController {

        private delay:number;
        private stepWidth:number;

        public progress:number;

        constructor(interval:ng.IIntervalService) {
            var defaultDelay = 3000, // ms.
                updateDelay = 100,   // ms.
                numSteps = (this.delay || defaultDelay) / updateDelay;

            this.progress = 100; // %
            this.stepWidth = this.progress / numSteps;

            interval(this.updateProgress.bind(this), updateDelay, numSteps);
        }

        private updateProgress():void {
            this.progress -= this.stepWidth;
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
