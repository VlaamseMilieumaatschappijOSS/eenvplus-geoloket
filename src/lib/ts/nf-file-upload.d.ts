/// <reference path="angular.d.ts" />

declare module ng.fileUpload {

    interface IUploadService {
        http<T>(config:IFileUploadConfig): IUploadPromise<T>;
        upload<T>(config:IFileUploadConfig): IUploadPromise<T>;
    }

    interface IUploadPromise<T> extends IHttpPromise<T> {
        progress(callback:IHttpPromiseCallback<T>): IUploadPromise<T>;
    }

    interface IFileUploadConfig extends ng.IRequestConfig {
        file:any; //File|File[];
        fileName?:string;
    }

    interface UploadFile extends File {
        progress:number;
        upload:UploadStatus;
    }

    interface UploadStatus {
        abort():void;
        aborted:boolean;
    }

}
