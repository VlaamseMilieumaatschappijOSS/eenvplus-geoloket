declare module ol {

    interface DrawEvent {
        drawStart:string;
        drawEnd:string;
    }

}

_.merge(ol.DrawEvent, {
    drawStart: 'drawstart',
    drawEnd: 'drawend'
});
