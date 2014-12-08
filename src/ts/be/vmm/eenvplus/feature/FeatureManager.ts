///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

import signal = Trasys.Signals;

module be.vmm.eenvplus.feature {
    'use strict';

    export interface FeatureJSONHandler {
        (json:model.FeatureJSON):void;
    }

    export interface Signals {
        create:signal.ITypeSignal<feature.model.FeatureJSON>;
        load:signal.ISignal;
        remove:signal.ITypeSignal<feature.model.FeatureJSON>;
    }

    export interface FeatureManager {
        commit: FeatureJSONHandler;
        create: FeatureJSONHandler;
        discard: FeatureJSONHandler;
        load: (extent:ol.Extent) => void;
        signal: Signals;
    }

    export module FeatureManager {
        export var NAME:string = PREFIX + 'FeatureManager';

        factory.$inject = ['$rootScope', '$q', 'gaFeatureManager'];

        function factory(rootScope:ng.IScope, q:ng.IQService, service:FeatureService):FeatureManager {
            var broadcast = rootScope.$broadcast.bind(rootScope),
                signals = {
                    create: new signal.TypeSignal<feature.model.FeatureJSON>(),
                    load: new signal.Signal(),
                    remove: new signal.TypeSignal<feature.model.FeatureJSON>()
                };

            signals.remove.add(_.partial(broadcast, EVENT.selected, null));

            return {
                commit: commit,
                create: create,
                discard: discard,
                load: load,
                signal: _.mapValues(signals, unary(_.bindAll))
            };

            function load(extent:ol.Extent):void {
                service.clear().then(_.partial(pull, extent));
            }

            function pull(extent:ol.Extent):void {
                service.pull(extent)
                    .then(signals.load.fire)
                    .catch((error:Error) => {
                        console.error('Failed to load features', error);
                    });
            }

            function create(feature:feature.model.FeatureJSON):ng.IPromise<feature.model.FeatureJSON> {
                var deferred = q.defer<feature.model.FeatureJSON>();

                service
                    .create(feature)
                    .then(getSavedData)
                    .catch(console.error);

                return deferred.promise;

                function getSavedData(key:number):void {
                    service
                        .get(feature.layerBodId, key)
                        .then(deferred.resolve)
                        .catch(console.error);
                }
            }

            function discard(json:model.FeatureJSON):void {
                if (json.id) {
                    // don't remove but reload old geometry
                }
                else {
                    // don't forget to remove connected mountpoints
                    service
                        .remove(json)
                        .then(_.partial(signals.remove.fire, json))
                        .catch((error:Error) => {
                            console.error('Failed to discard feature', json, error);
                        });
                }
            }

            function commit(json:feature.model.FeatureJSON):ng.IPromise<feature.model.FeatureJSON> {
                return undefined;
            }
        }

        angular
            .module(MODULE)
            .factory(NAME, factory);
    }

}
