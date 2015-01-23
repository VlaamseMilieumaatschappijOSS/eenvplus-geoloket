///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.user.Login {
    'use strict';

    export var NAME:string = PREFIX + 'LoginCallout';

    function configure():ng.IDirective {
        LoginController.$inject = ['epUserService'];

        return {
            restrict: 'A',
            scope: {},
            controllerAs: 'ctrl',
            controller: LoginController,
            templateUrl: 'ts/be/vmm/eenvplus/user/LoginCallout.html'
        };
    }

    class LoginController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        public username:string;
        public password:string;
        public error:string;
        public storeCredentials:boolean;

        public get loggedIn():boolean {
            return this.service.user.authenticated;
        }


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(private service:UserService) {
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        public submit():void {
            var setError = this.setError.bind(this);

            this.service
                .login(this.username, this.password)
                .then(_.partial(setError, undefined))
                .catch(_.compose(setError, get('data.error')));
        }

        /**
         * Update the error code.
         * If there is none, we can close the dropdown.
         *
         * @param error
         */
        private setError(error:string):void {
            this.error = error;
            if (!error) $('body').trigger('click');
        }

        public toggleStorage():void {
            alert('Feature to be implemented!');
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
