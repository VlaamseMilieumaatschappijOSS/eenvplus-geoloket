declare var mockIndexedDB:IDBFactory;
declare var mockIndexedDBStore:IDBObjectStore;

declare function resetIndexedDBMock():void;
declare function commitIndexedDBMockData(key:string, value:Object):void;
