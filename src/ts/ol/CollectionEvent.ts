declare module ol {

    interface CollectionEvent {
        add:string;
        change:string;
        remove:string;
    }

}

_.merge(ol.CollectionEvent, {
    add: 'add',
    change: 'change:length',
    remove: 'remove'
});
