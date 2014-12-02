///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated
///ts:ref=FeatureService
/// <reference path="../feature/FeatureService.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.actions {
    'use strict';

    export var NAME:string = PREFIX + 'EditActions';

    interface Scope extends ng.IScope {
        discard:Function;
        validate:Function;
        save:Function;
    }

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            scope: {},
            controller: ActionsController,
            templateUrl: 'html/be/vmm/eenvplus/editor/Actions.html'
        };
    }

    ActionsController.$inject = ['$scope', '$rootScope', 'gaFeatureManager'];

    function ActionsController(scope:Scope, rootScope:ng.IScope, service:feature.FeatureService):void {

        _.merge(scope, {
            discard: stopEditing,
            validate: _.partial(execute, service.test),
            save: _.compose(stopEditing, _.partial(execute, service.push))
        });

        function stopEditing():void {
            rootScope.$broadcast(applicationState.EVENT.modeRequest, applicationState.State.OVERVIEW);
        }

        function execute(call:() => ng.IPromise<any>):void {
            call()
                .then(showMessages)
                .catch(console.error);
        }

        function showMessages(messages:any):void {
            console.log(messages);
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
