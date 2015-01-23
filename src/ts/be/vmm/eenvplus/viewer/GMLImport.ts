///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.viewer.GMLImport {
    'use strict';

    export var NAME:string = PREFIX + 'GmlImport';

    function configure():ng.IDirective {
        GMLImportController.$inject = [
            '$timeout', '$upload', 'epUser', 'epFeatureManager', 'gaGlobalOptions'
        ];

        return {
            restrict: 'A',
            scope: {},
            controllerAs: 'ctrl',
            controller: GMLImportController,
            templateUrl: 'ts/be/vmm/eenvplus/viewer/GMLImport.html'
        };
    }

    class GMLImportController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        public files:ng.fileUpload.UploadFile[];
        public open:boolean;
        public complete:boolean;
        public valid:boolean;
        public error:any;
        public progress:number = 0;
        public uploadUrl = '/rest/services/:mapId/DataServer/';

        public get file():ng.fileUpload.UploadFile {
            return this.files && this.files.length ? this.files[0] : null;
        }

        public get label():string {
            return this.file ? this.file.name + ' (' + Math.round(this.file.size / 1000) + ' kB)' : undefined;
        }

        public get inProgress():boolean {
            return this.file && this.file.upload && !this.file.upload.aborted && this.progress < 100;
        }

        public get hasPermission():boolean {
            return this.user.authenticated;
        }


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(private delay:ng.ITimeoutService,
                    private fileUpload:ng.fileUpload.IUploadService,
                    private user:user.User,
                    private featureManager:feature.FeatureManager,
                    config:ga.GlobalOptions) {

            _.bindAll(this);
            this.uploadUrl = config.apiUrl + this.uploadUrl.replace(':mapId', '0');
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        private handleProgress(event:ProgressEvent):void {
            this.progress = 100.0 * event.loaded / event.total;
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        public toggle():void {
            this.open = !this.open;
            this.files = this.error = null;
            this.complete = false;
            this.progress = 0;
        }

        public upload():void {
            this.fileUpload
                .upload({
                    method: 'POST',
                    url: this.uploadUrl,
                    file: this.file
                })
                .progress(this.handleProgress)
                .success(this.featureManager.signal.push.fire)
                .success(this.featureManager.signal.validate.fire)
                .success(this.updateStatus)
                .error(this.handleError);
        }

        public updateStatus(result:editor.validation.ValidationResult):void {
            // since upload progress isn't working, we need to show the upload bar for a little while
            this.delay(() => {
                this.complete = true;
                this.valid = result.valid
            }, 1000);
        }

        public abort():void {
            if (!this.file) return;

            this.file.upload.abort();
            this.file.upload.aborted = true;
        }

        private handleError(error:Error,
                            status:number,
                            headers:ng.IHttpHeadersGetter,
                            config:ng.fileUpload.IFileUploadConfig):void {

            this.error = _.merge(error, {file: config.file});
            this.error.type = this.error.type.replace('class ', '');
            this.error.file.size = Math.round(this.error.file.size / 100);
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
