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
    
    GoogleDrive.prototype.uploadFile = function (fpath, targetPath, folderId, rootFolderId, rootFolderName, appfolder, properties, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "GoogleDrive", "uploadFile", [fpath,targetPath, folderId, rootFolderId, rootFolderName, appfolder, properties]);
    };
    
    GoogleDrive.prototype.findFolder = function (folderName, parentFolderId, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "GoogleDrive", "findFolder", [folderName, parentFolderId]);
    };
    
        
    GoogleDrive.prototype.fileList = function (parentFolderId, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "GoogleDrive", "fileList", [parentFolderId]);
    };
    
    GoogleDrive.prototype.deleteFile = function (fileid,successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "GoogleDrive", "deleteFile", [fileid]);
    };
    
    GoogleDrive.prototype.rename = function (id, newName,successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "GoogleDrive", "rename", [id, newName]);
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
    