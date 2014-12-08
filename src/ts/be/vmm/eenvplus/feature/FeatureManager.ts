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
        onCommit: (fn:FeatureJSONHandler) => void;
        onRemove: (fn:FeatureJSONHandler) => void;
    }

    export module FeatureManager {
        export var NAME:string = PREFIX + 'FeatureManager';

        var commitCallbacks = [],
            removeCallbacks = [];

        factory.$inject = ['gaFeatureManager'];

        function factory(service:FeatureService):FeatureManager {
            return {
                commit: commit,
                discard: discard,
                onCommit: _.bind(commitCallbacks.push, commitCallbacks),
                onRemove: _.bind(removeCallbacks.push, removeCallbacks)
            };

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
