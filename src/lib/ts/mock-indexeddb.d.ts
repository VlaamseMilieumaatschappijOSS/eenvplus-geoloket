declare var mockIndexedDB:IDBFactory;
declare var mockIndexedDBStore:IDBObjectStore;
declare var mockIndexedDBItems:Object;

declare function resetIndexedDBMock():void;
declare function commitIndexedDBMockData(key:string, value:Object):void;
