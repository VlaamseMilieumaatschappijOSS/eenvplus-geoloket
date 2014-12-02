module be.vmm.eenvplus.editor.paint {
    'use strict';

    export var MODULE:string = PREFIX + '_paint';

    export var EVENT = {
        selected: 'painterSelected'
    };

    goog.provide(MODULE);

    angular.module(MODULE, []);

}
