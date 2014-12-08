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

    ActionsController.$inject = ['$scope', '$rootScope', 'epFeatureManager'];

    function ActionsController(scope:Scope, rootScope:ng.IScope, manager:feature.FeatureManager):void {

        _.merge(scope, {
            discard: stopEditing,
            validate: manager.validate,
            save: _.compose(stopEditing, manager.push)
        });

        function stopEditing():void {
            rootScope.$broadcast(applicationState.EVENT.modeRequest, applicationState.State.OVERVIEW);
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
