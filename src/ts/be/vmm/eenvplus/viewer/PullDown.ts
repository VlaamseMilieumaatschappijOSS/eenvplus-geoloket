module be.vmm.eenvplus.viewer {
    'use strict';

    export var NAME:string = 'gaPullDown';

    export var STATE = {
        OVERVIEW: 'overview',
        DETAIL: 'detail'
    };

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            scope: {},
            controller: PullDownController
        };
    }

    function PullDownController($scope) {

        console.log('pulldown');
        $scope.state = 'test';

    }

    angular
        .module(Module.VIEWER)
        .directive(NAME, configure);

}
