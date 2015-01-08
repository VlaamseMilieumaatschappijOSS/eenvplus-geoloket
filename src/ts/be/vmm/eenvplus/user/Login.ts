///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.user.Login {
    'use strict';

    export var NAME:string = PREFIX + 'Login';

    function configure():ng.IDirective {
        LoginController.$inject = ['epUserService'];

        return {
            restrict: 'A',
            scope: {},
            controllerAs: 'ctrl',
            controller: LoginController,
            templateUrl: 'ts/be/vmm/eenvplus/user/Login.html'
        };
    }

    class LoginController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        public username:string;
        public password:string;
        public storeCredentials:boolean;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(private service:UserService) {
        }


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        /**
         * Prevent Bootstrap from closing the dropdown when clicking it, unless the submit Button was clicked.
         *
         * @param event
         */
        public handleDropDownClick(event:Event):void {
            var target = <HTMLElement> event.target;
            if (target.tagName !== 'BUTTON') event.stopImmediatePropagation();
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        public submit():void {
            this.service.login(this.username, this.password);
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
