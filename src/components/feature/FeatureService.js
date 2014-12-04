(function() {
	goog.provide('ga_feature_service');
	
	var module = angular.module('ga_feature_service', []);
	
	var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
	
	var TRUE = "t";
	
	function getType(layerBodId) {
		var index = layerBodId.indexOf(':');
		if (index > 0)
			return layerBodId.substring(index + 1);

		return layerBodId;
	}

	var BASE_32 = ['0', '1', '2', '3', '4', '5', '6',
	      '7', '8', '9', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'm', 'n',
	      'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
	var BITS = [16, 8, 4, 2, 1];
	
	var encodePointHash = function(bbox, point, precision) {
		  
		var x = point[0];
		var y = point[1];
		
		var ix = [ bbox[0], bbox[2] ];
		var iy = [ bbox[1], bbox[3] ];
		
		var hash = '';
		var even = true;
		
		var bit = 0;
		var ch = 0;

	    while (hash.length < precision) {
	    	if (even) {
	    		var mx = (ix[0] + ix[1]) / 2.0;
	    		if (x > mx) {
	    			ch |= BITS[bit];
	    			ix[0] = mx;
	    		} else {
	    			ix[1] = mx;
	    		}
	    	} else {
	    		var my = (iy[0] + iy[1]) / 2.0;
	    		if (y > my) {
	    			ch |= BITS[bit];
	    			iy[0] = my;
	    		} else {
	    			iy[1] = my;
	    		}
	    	}

	    	even = !even;

	    	if (bit < 4) {
	    		bit++;
	    	} else {
	    		hash += BASE_32[ch];
	    		bit = 0;
	    		ch = 0;
	    	}
	    }

	    return hash;
	};
	
	var addBbox = function(feature) {
		if(!feature.geometry.bbox){
			var geometry = new ol.format.GeoJSON().readGeometry(feature.geometry);
			var extent = geometry.getExtent();
			feature.geometry.bbox = extent;
		}
	};

	module.factory('gaFeatureManager', function($http, $q, typeModelMap) {
		var types = typeModelMap;

		var db = (function() {
			var d = $q.defer();

			var openRequest = indexedDB.open("Feature", 2);
			openRequest.onupgradeneeded = function(event) {
				  var db = event.target.result;
				  for (var i = 0; i < types.length; i++) {
					  var type = types[i];
					  if(!db.objectStoreNames.contains(type)) {
						  var objectStore = db.createObjectStore(type, { keyPath: "key", autoIncrement: true });
						  objectStore.createIndex("featureId", "featureId", { unique: true });
						  objectStore.createIndex("modified", "modified", { unique: false });
						  objectStore.createIndex("deleted", "deleted", { unique: false });
					  }
				  }
			};
			openRequest.onsuccess = function(event) {
				d.resolve(event.target.result);
			};
			openRequest.onerror = function(event) {
				d.reject("Could not open local storage.");
			};
			
			return d.promise;
		})();
		
		var featureManager = {
			"apiUrl": "http://127.0.0.1:8080/eenvplus-sdi-services",
		
			"query" : function(layerBodId, extent) {
				var d = $q.defer();
				var type = getType(layerBodId);
				
				db.then(function(db) {
					var results = [];
					
					var objectStore = db.transaction(type).objectStore(type);
					
					var request = objectStore.openCursor();
					request.onsuccess = function(event) {
						var cursor = event.target.result;
						if (cursor) {
							var feature = cursor.value;
							if (feature && !feature.deleted) {
								if(ol.extent.intersects(extent, feature.geometry.bbox))
									results.push(cursor.value);
								cursor.continue();
							}
						} else {
							d.resolve(results);
						}
					};
					request.onerror = function(event) {
						d.reject("Could not get features from local storage.");
					};
				});
				
				return d.promise;
			},
			"get" : function(layerBodId, featureId) {
				var d = $q.defer();
				var type = getType(layerBodId);
				
				db.then(function(db) {
					var objectStore = db.transaction(type).objectStore(type);
					var index = objectStore.index("featureId");
					
					var request = index.get(featureId);
					request.onsuccess = function(event) {
						var feature = event.target.result;
						if (feature && !feature.deleted) {
							d.resolve(feature);
						} else {
							d.resolve(null);
						}
					};
					request.onerror = function(event) {
						d.reject("Could not get feature from local storage.");
					};
				});
				
				return d.promise;
			},
			"create" : function(feature) {
				var d = $q.defer();
				var type = getType(feature.layerBodId);
				
				db.then(function(db) {
					feature.modified = TRUE;
					addBbox(feature);
					
					var objectStore = db.transaction(type, "readwrite").objectStore(type);
					
					var request = objectStore.add(feature);
					request.onsuccess = function(event) {
						d.resolve(event.target.result);
					};
					request.onerror = function(event) {
						d.reject("Could not add feature to local storage.");
					};
				});
				
				return d.promise;
			},
			"update" : function(feature) {
				var d = $q.defer();
				var type = getType(feature.layerBodId);
				
				db.then(function(db) {
					feature.modified = TRUE;
					addBbox(feature);
					
					var objectStore = db.transaction(type, "readwrite").objectStore(type);
					
					var request = objectStore.put(feature);
					request.onsuccess = d.resolve;
					request.onerror = function(event) {
						d.reject("Could not update feature in local storage.");
					};
				});
				
				return d.promise;
			},
			"remove" : function(feature) {
				var d = $q.defer();
				var type = getType(feature.layerBodId);
				
				db.then(function(db) {
					feature.modified = TRUE;
					feature.deleted = TRUE;
					
					var objectStore = db.transaction(type, "readwrite").objectStore(type);
					
					var request = objectStore.put(feature);
					request.onsuccess = d.resolve;
					request.onerror = function(event) {
						d.reject("Could not delete feature in local storage.");
					};
				});
				
				return d.promise;
			},
			"clear" : function() {
				var d = $q.defer();
				
				db.then(function(db) {
					var transaction = db.transaction(types, "readwrite");
					var i = 0;
					var next = function() {
						if (i < types.length) {
							var type = types[i++];
							
							var objectStore = transaction.objectStore(type);
							
							var request = objectStore.clear();
							request.onsuccess = next;
							request.onerror = function(event) {
								d.reject("Could not clear features in local storage.");
							};
						} else {
							d.resolve();
						}
					};
					next();
				});
				
				return d.promise;
			},
			"dirty" : function() {
				var d = $q.defer();
				
				db.then(function(db) {
					var transaction = db.transaction(types, "readwrite");
					var i = 0;
					var next = function() {
						if (i < types.length) {
							var type = types[i++];
							
							var objectStore = transaction.objectStore(type);
							var index = objectStore.index("modified");
							
							var request = index.getKey(TRUE);
							request.onsuccess = function(event) {
								if (event.target.result != null) {
									d.resolve(true);
								} else {
									next();
								}
							};
							request.onerror = function(event) {
								d.reject("Could not check for modified features in local storage.");
							};
						} else {
							d.resolve(false);
						}
					};
					next();
				});
				
				return d.promise;
			},
			"modifications": function() {
				var d = $q.defer();
				
				db.then(function(db) {
					var results = [];
					
					var transaction = db.transaction(types, "readwrite");
					var i = 0;
					var next = function() {
						if (i < types.length) {
							var type = types[i++];
							
							var objectStore = transaction.objectStore(type);
							var index = objectStore.index("modified");
							
							var request = index.openCursor(IDBKeyRange.only(TRUE));
							request.onsuccess = function(event) {
								var cursor = event.target.result;
								if (cursor) {
									var feature = cursor.value;
									if (feature) {
										results.push(cursor.value);
										cursor.continue();
									}
								} else {
									next();
								}
							};
							request.onerror = function(event) {
								d.reject("Could not get modified features from local storage.");
							};
						} else {
							d.resolve(results);
						}
					};
					next();
				});
				
				return d.promise;
			},
			"merge": function(features) {
				var d = $q.defer();
				
				db.then(function(db) {
					var transaction = db.transaction(types, "readwrite");
					var i = 0;
					var next = function() {
						if (i < features.length) {
							var feature = features[i++];
							var type = getType(feature.layerBodId);
							
							addBbox(feature);
							
							var objectStore = transaction.objectStore(type);
							var index = objectStore.index("featureId");
							
							var request = index.getKey(feature.featureId);
							request.onsuccess = function(event) {
								var key = event.target.result;
								var request;
								if (key) {
									feature.key = key;
									request = objectStore.put(feature);
									
								} else {
									request = objectStore.add(feature);
								}
								request.onsuccess = next;
								request.onerror = function(event) {
									d.reject("Could not update modified features in local storage.");
								};
							};
							request.onerror = function(event) {
								d.reject("Could not update modified features in local storage.");
							};
						} else {
							d.resolve();
						}
					} 
					next();
				});
				
				return d.promise;
			},
			"pull" : function(bbox) {
				var d = $q.defer();
				
				var url = featureManager.apiUrl + "/rest/services/api/MapServer/pull";
				url += "?types=" + types.join(",");
				if(bbox)
					url += "&extent=" + bbox.join(",");
				
				$http.get(url).success(function(features) {
					this.merge(features).then(d.resolve, d.reject);
				}.bind(this)).error(function() {
					d.reject("Could not pull features.");
				});
				
				return d.promise;
			},
			"push" : function() {
				var d = $q.defer();
				
				this.modifications().then(function(results) {
					$http.post(featureManager.apiUrl + "/rest/services/api/MapServer/push", results).success(function(messages) {
						d.resolve(messages);
					}).error(function() {
						d.reject("Could not push features.");
					});
				}, d.reject);
				
				return d.promise;
			},
			"test" : function() {
				var d = $q.defer();
				
				this.modifications().then(function(results) {
					$http.post(featureManager.apiUrl + "/rest/services/api/MapServer/test", results).success(function(messages) {
						d.resolve(messages);
					}).error(function() {
						d.reject("Could not test features.");
					});
				}, d.reject);
				
				return d.promise;
			}
		};
		
		return featureManager;
	});
})();
