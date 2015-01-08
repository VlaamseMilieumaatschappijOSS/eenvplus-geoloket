///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.user.UserCallout {
    'use strict';

    export var NAME:string = PREFIX + 'UserCallout';

    function configure():ng.IDirective {
        UserCalloutController.$inject = ['epUserService'];

        return {
            restrict: 'A',
            scope: {},
            controllerAs: 'ctrl',
            controller: UserCalloutController,
            templateUrl: 'ts/be/vmm/eenvplus/user/UserCallout.html'
        };
    }

    class UserCalloutController {

        public avatar:string = 'img/user.png';

        public get loggedIn():boolean {
            return this.service.user.authenticated;
        }

        constructor(private service:UserService) {
            this.logout = service.logout;
        }

        public logout:() => void;

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
