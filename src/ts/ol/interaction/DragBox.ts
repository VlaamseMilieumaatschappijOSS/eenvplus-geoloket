declare module ol.interaction {

    interface DragBox {
        EVENT:DragBoxEventEnum;
    }

    interface DragBoxEventEnum {
        boxStart:string;
        boxEnd:string;
    }

}

ol.interaction.DragBox.EVENT = {
    boxStart: 'boxstart',
    boxEnd: 'boxend'
};
