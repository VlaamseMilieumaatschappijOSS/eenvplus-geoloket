///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.formBrowser {
    'use strict';

    export var NAME:string = PREFIX + 'FormBrowser';

    interface Scope extends ng.IScope {
        features:feature.model.Feature[];
        getLabel(properties:feature.model.Feature):string;
        isSewer(properties:feature.model.Feature):boolean;
        isAppurtenance(properties:feature.model.Feature):boolean;
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
            isSewer: (properties:feature.model.Feature): boolean => {
                return true;
            },
            isAppurtenance: (properties:feature.model.Feature): boolean => {
                return false;
            },
            getUser: ():string => { return 'Max';},
            toDate: (timestamp:number):string => { return timestamp + '' || new Date() +'';}
        });

        scope.$on('featuresSelected', (event:ng.IAngularEvent, features:ol.Feature[]) => {
            setFeatures(features);
        });

        function setFeatures(features:ol.Feature[]):void {
            scope.features = features.map(toProperties);
        }

        function toProperties(feature:ol.Feature):feature.model.Feature {
            return feature.get('properties') || {};
        }

        function getLabel(properties:feature.model.Feature):string {
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
