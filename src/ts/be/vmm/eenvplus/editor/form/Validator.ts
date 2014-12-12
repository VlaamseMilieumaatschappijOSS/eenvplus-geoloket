module be.vmm.eenvplus.editor.form {
    'use strict';

    export interface Validator {
        valid(field?:string):boolean;
        invalid(field?:string):boolean;
        required(field:string):boolean;
        min(field:string):boolean;
        max(field:string):boolean;
        pattern(field:string):boolean;
        setDirty():void;
    }

    interface ValidateFn {
        (field:string):boolean;
    }

    export function Validator(form:ng.IFormController):Validator {

        return {
            valid: not(invalid),
            invalid: invalid,
            required: validate('required'),
            min: validate('min'),
            max: validate('max'),
            pattern: validate('pattern'),
            setDirty: setDirty
        };

        function invalid(field?:string):boolean {
            if (!field) return form.$invalid;

            var validator:ng.INgModelController = form[field];
            return validator.$dirty && validator.$invalid;
        }

        function validate(type:string):ValidateFn {
            return function validate(field:string):boolean {
                var validator:ng.INgModelController = form[field];
                return validator.$dirty && validator.$error[type];
            };
        }

        function setDirty():void {
            form.$setDirty();

            _(form)
                .reject(shiftData(isDynamicProperty))
                .each(setFieldDirty);
        }

        function setFieldDirty(model:ng.INgModelController):void {
            model.$dirty = true;
        }

        function isDynamicProperty(name:string):boolean {
            return name.indexOf('$') === 0;
        }

        function not(fn:ValidateFn):ValidateFn {
            return function not(field:string):boolean {
                return !fn(field);
            };
        }

    }

}
