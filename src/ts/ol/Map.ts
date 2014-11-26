declare module ol {

    interface Map {
        EVENT:MapEventEnum;
    }

    interface MapEventEnum {
        preCompose:string;
        postCompose:string;
    }

}

ol.Map.EVENT = {
    preCompose: 'precompose',
    postCompose: 'postcompose'
};
