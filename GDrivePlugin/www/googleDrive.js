cordova.define("cordova-plugin-jc-googledrive.GoogleDrive", function(require, exports, module) {
    function GoogleDrive() {}
    
    GoogleDrive.prototype.whoAmI = function (successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "GoogleDrive", "whoAmI", []);
    };
    
    GoogleDrive.prototype.logout = function (successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "GoogleDrive", "logout", []);
    };
        
    GoogleDrive.prototype.downloadFile = function (destinationURL,fileid, isAnonymous, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "GoogleDrive", "downloadFile", [destinationURL,fileid, isAnonymous]);
    };
    
    GoogleDrive.prototype.uploadFile = function (fpath, targetPath, folderId, rootFolderId, rootFolderName, appfolder, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "GoogleDrive", "uploadFile", [fpath,targetPath, folderId, rootFolderId, rootFolderName, appfolder]);
    };
    
    GoogleDrive.prototype.fileList = function (appfolder,successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "GoogleDrive", "fileList", [appfolder]);
    };
    
    GoogleDrive.prototype.deleteFile = function (fileid,successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "GoogleDrive", "deleteFile", [fileid]);
    };
    
    GoogleDrive.prototype.requestSync = function(returnFiles,successCallback,errorCallback){
        cordova.exec(successCallback,errorCallback,"GoogleDrive","requestSync",[returnFiles]);
    };
    
    GoogleDrive.install = function () {
        if (!window.plugins) {
            window.plugins = {};
        }
    
        window.plugins.gdrive = new GoogleDrive();
        return window.plugins.gdrive;
    };
    
    cordova.addConstructor(GoogleDrive.install);
    });
    