declare module ol {

    interface ObjectEvent {
        centerChanged:string;
        resolutionChanged:string;
        rotationChanged:string;
    }

}

_.merge(ol.ObjectEvent, {
    centerChanged: 'change:center',
    resolutionChanged: 'change:resolution',
    rotationChanged: 'change:rotation'
});
