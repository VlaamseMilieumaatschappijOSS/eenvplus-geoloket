///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.feature {
    'use strict';

    export interface FeatureJSONHandler {
        (json:model.FeatureJSON):void;
    }

    export interface FeatureManager {
        commit: FeatureJSONHandler;
        discard: FeatureJSONHandler;
        load: (extent:ol.Extent) => void;
        onCommit: (fn:FeatureJSONHandler) => void;
        onLoad: (fn:() => void) => void;
        onRemove: (fn:FeatureJSONHandler) => void;
    }

    export module FeatureManager {
        export var NAME:string = PREFIX + 'FeatureManager';

        var commitCallbacks = [],
            loadCallbacks = [],
            removeCallbacks = [];

        factory.$inject = ['gaFeatureManager'];

        function factory(service:FeatureService):FeatureManager {
            return {
                commit: commit,
                discard: discard,
                load: load,
                onCommit: _.bind(commitCallbacks.push, commitCallbacks),
                onLoad: _.bind(loadCallbacks.push, loadCallbacks),
                onRemove: _.bind(removeCallbacks.push, removeCallbacks)
            };

            function load(extent:ol.Extent):void {
                service.clear().then(_.partial(pull, extent));
            }

            function pull(extent:ol.Extent):void {
                var notifyLoad = _.partial(notify, null, loadCallbacks);

                service.pull(extent)
                    .then(notifyLoad)
                    .catch((error:Error) => {
                        console.error('Failed to load features', error);
                    });
            }

            function discard(json:model.FeatureJSON):void {
                var notifyRemoval = _.partial(notify, json, removeCallbacks);

                if (json.id) {
                    // don't remove but reload old geometry
                }
                else {
                    // don't forget to remove connected mountpoints
                    service
                        .remove(json)
                        .then(notifyRemoval)
                        .catch((error:Error) => {
                            console.error('Failed to discard feature', json, error);
                        });
                }
            }

            function commit(json:feature.model.FeatureJSON):void {

            }
        }

        function notify(json:model.FeatureJSON, callbacks:FeatureJSONHandler[]):void {
            _.each(callbacks, _.partial(call, json));
        }

        function call(json:model.FeatureJSON, callback:FeatureJSONHandler):void {
            callback(json);
        }

        angular
            .module(MODULE)
            .factory(NAME, factory);
    }

}
