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

    ActionsController.$inject = ['$scope', '$rootScope'];

    function ActionsController(scope:Scope, rootScope:ng.IScope):void {

        _.merge(scope, {
            discard: discard,
            validate: validate,
            save: save
        });

        function discard():void {
            rootScope.$broadcast(applicationState.EVENT.modeRequest, applicationState.State.OVERVIEW);
        }

        function validate():void {

        }

        function save():void {

        }

    }

    angular
        .module(Module.EDITOR)
        .directive(NAME, configure);

}
