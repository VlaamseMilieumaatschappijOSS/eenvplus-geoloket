///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.formBrowser {
    'use strict';

    export var NAME:string = PREFIX + 'FormBrowser';

    interface Scope extends ng.IScope {
        features:feature.model.FeatureJSON[];
        getLabel(properties:feature.model.FeatureJSON):string;
        isSewer(bodId:string):boolean;
        isAppurtenance(bodId:string):boolean;
    }

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            scope: {},
            controller: FormBrowserController,
            templateUrl: 'html/be/vmm/eenvplus/editor/form/FormBrowser.html'
        };
    }

    FormBrowserController.$inject = ['$scope'];

    function FormBrowserController(scope:Scope):void {

        _.merge(scope, {
            getLabel: getLabel,
            isSewer: _.partial(feature.isType, feature.FeatureType.SEWER),
            isAppurtenance: _.partial(feature.isType, feature.FeatureType.APPURTENANCE),
            getUser: ():string => {
                return 'Max';
            },
            toDate: (timestamp:number):string => {
                return timestamp + '' || new Date() + '';
            }
        });

        scope.$on('featuresSelected', (event:ng.IAngularEvent, features:feature.model.FeatureJSON[]) => {
            scope.features = features;
        });

        function getLabel(properties:feature.model.FeatureProperties):string {
            // TODO get these from .properties
            var typeLabels = ['RioolLink', 'RioolAppurtenance', 'KoppelPunt'],
                type = feature.toType(properties.layerBodId);

            if (properties.id)
                return typeLabels[type] + ' ' + properties.alternatieveId;
            return 'Nieuwe ' + typeLabels[type];
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
