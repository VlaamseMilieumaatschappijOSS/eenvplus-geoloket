module be.vmm.eenvplus.editor.form {
    'use strict';

    export var MODULE:string = PREFIX + '_form';

    export function linkForm(scope:any, el:ng.IAugmentedJQuery, attr:ng.IAttributes, form:ng.IFormController):void {
        scope.ctrl.form = form;
    }

    goog.provide(MODULE);

    angular.module(MODULE, []);

}
