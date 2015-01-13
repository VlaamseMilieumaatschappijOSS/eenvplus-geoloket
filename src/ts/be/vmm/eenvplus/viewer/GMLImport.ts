///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.viewer.GMLImport {
    'use strict';

    export var NAME:string = PREFIX + 'GmlImport';

    function configure():ng.IDirective {
        GMLImportController.$inject = ['$upload', 'epUser', 'epFeatureManager', 'gaGlobalOptions'];

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
        public progress:number = 0;
        public uploadUrl = '/rest/services/:mapId/DataServer/';

        public get file():ng.fileUpload.UploadFile {
            return this.files && this.files.length ? this.files[0] : null;
        }

        public get label():string {
            return this.file ? this.file.name + ' (' + Math.round(this.file.size / 1000) + ' kB)' : undefined;
        }

        public inProgress():boolean {
            return this.file && this.file.upload && !this.file.upload.aborted && this.progress < 100;
        }

        public get hasPermission():boolean {
            return this.user.authenticated;
        }


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(private fileUpload:ng.fileUpload.IUploadService,
                    private user:user.User,
                    private featureManager:feature.FeatureManager,
                    config:ga.GlobalOptions) {
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
            this.files = null;
            this.progress = 0;
        }

        public upload():void {
            this.fileUpload
                .upload({
                    method: 'POST',
                    url: this.uploadUrl,
                    file: this.file
                })
                .progress(this.handleProgress.bind(this))
                .error(console.error.bind(console));
        }

        public abort():void {
            if (!this.file) return;

            this.file.upload.abort();
            this.file.upload.aborted = true;
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
