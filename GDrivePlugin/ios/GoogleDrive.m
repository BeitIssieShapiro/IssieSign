#import "GoogleDrive.h"
#import "GTLRUtilities.h"
#import "AppDelegate.h"
#import <objc/runtime.h>


@import AppAuth;
@import GTMAppAuth;
@import GTMSessionFetcher;

static NSString *kClientID = @"";
static NSString *kRedirectURISuffix =@":/oauthredirect";
static NSString *kRedirectURI =@"";
static NSString *kAuthorizerKey = @"";
static NSString *const kKeychainStoreItemName = @"authorization";


@interface GoogleDrive () <OIDAuthStateChangeDelegate,OIDAuthStateErrorDelegate>
@property (nonatomic, readonly) GTLRDriveService *driveService;
@property (nonatomic, strong) GTMKeychainStore *keychainStore;

@end




@implementation CDVAppDelegate (GoogleDrive)

static const char *kCurrentAuthorizationFlowKey = "CurrentAuthorizationFlowKey";

@dynamic currentAuthorizationFlow;

- (void)setCurrentAuthorizationFlow:(id<OIDExternalUserAgentSession>)currentAuthorizationFlow {
    objc_setAssociatedObject(self, kCurrentAuthorizationFlowKey, currentAuthorizationFlow, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (id<OIDExternalUserAgentSession>)currentAuthorizationFlow {
    return objc_getAssociatedObject(self, kCurrentAuthorizationFlowKey);
}

+ (void)load {
    Method original = class_getInstanceMethod(self, @selector(application:openURL:options:));
    Method myApp = class_getInstanceMethod(self, @selector(application:myOpenURL:options:));
    method_exchangeImplementations(original, myApp);
}

- (BOOL)application:(UIApplication *)app myOpenURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{
    if ([self.currentAuthorizationFlow resumeExternalUserAgentFlowWithURL:url]) {
        self.currentAuthorizationFlow = nil;
        return YES;
    }
    return [self application:app myOpenURL:url options:options];
}

@end

@implementation GoogleDrive {}

- (void)pluginInitialize {
    self.keychainStore = [[GTMKeychainStore alloc] initWithItemName:kKeychainStoreItemName];
    
    kAuthorizerKey = [[[NSBundle mainBundle] infoDictionary] objectForKey:(NSString*)kCFBundleNameKey];
    NSLog(@"%@",kAuthorizerKey);
    NSMutableArray *ids = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleURLTypes"];
    // IOS rejects url starting with non-alphabetic letter
    NSArray *reversedClientId = [ids filteredArrayUsingPredicate:[NSPredicate predicateWithFormat:@"CFBundleURLName == %@", @"reversedClientId"]];
    kRedirectURI = [[[reversedClientId valueForKey:@"CFBundleURLSchemes"] objectAtIndex:0 ] objectAtIndex:0];
    //    NSArray *clientId = [ids filteredArrayUsingPredicate:[NSPredicate predicateWithFormat:@"CFBundleURLName == %@", @"clientId"]];
    //    kClientID = [[[clientId valueForKey:@"CFBundleURLSchemes"] objectAtIndex:0 ] objectAtIndex:0];
    
    NSArray * reversedClientIdParts = [kRedirectURI componentsSeparatedByString: @"."];
    NSArray* clientIdParts = [[reversedClientIdParts reverseObjectEnumerator] allObjects];
    kClientID = [clientIdParts componentsJoinedByString:@"."];
    
    kRedirectURI = [kRedirectURI stringByAppendingString:kRedirectURISuffix];
    
    [self loadState];
    //NSLog(@"%@",kRedirectURI);
    //NSLog(@"%@",kClientID);
}



- (void)whoAmI:(CDVInvokedUrlCommand*)command {
    CDVPluginResult* pluginResult = nil;
    NSMutableDictionary *result = [[NSMutableDictionary alloc] init];
    
    if (_authSession.canAuthorize) {
        // logged in
        [result setObject:_authSession.userEmail forKey:@"email"];
    } else {
        [result setObject:@"Not logged in" forKey:@"message"];
    }
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:result];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)logout:(CDVInvokedUrlCommand*)command {
    
    [self clearState];
    
    CDVPluginResult* pluginResult = nil;
    NSMutableDictionary *result = [[NSMutableDictionary alloc] init];
    [result setObject:@"Logout Successful" forKey:@"message"];
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:result];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)findFolder:(CDVInvokedUrlCommand*)command {
    
    NSString* folderName = [command.arguments objectAtIndex:0];
    NSString* parentFolderId = [command.arguments objectAtIndex:1];
    
    dispatch_async(dispatch_get_main_queue(), ^{
        if(self.authSession.canAuthorize){
            [self findAFolder:command folderName:folderName parentFolderId:parentFolderId];
            NSLog(@"Already authorized app. No need to ask user again");
        } else{
            [self runSigninThenHandler:command onComplete:^{
                [self findAFolder:command folderName:folderName parentFolderId:parentFolderId];
            }];
        }
    });
}


- (void)downloadFile:(CDVInvokedUrlCommand*)command
{
    NSString* destPath = [command.arguments objectAtIndex:0];
    NSString* fileid = [command.arguments objectAtIndex:1];
    BOOL anonymousAccess = [[command.arguments objectAtIndex:2] boolValue];
    
    if([destPath stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]].length>0){
        dispatch_async(dispatch_get_main_queue(), ^{
            if(self.authSession.canAuthorize){
                [self downloadAFile:command destPath:destPath fid:fileid anonymousAccess:anonymousAccess];
                NSLog(@"Already authorized app. No need to ask user again");
            } else{
                [self runSigninThenHandler:command onComplete:^{
                    [self downloadAFile:command destPath:destPath fid:fileid anonymousAccess:anonymousAccess];
                }];
            }
        });
    } else {
        [self.commandDelegate sendPluginResult:[CDVPluginResult
                                                resultWithStatus:CDVCommandStatus_ERROR
                                                messageAsString:@"One of the parameters is empty"]
                                    callbackId:command.callbackId];
    }
}

- (void)uploadFile:(CDVInvokedUrlCommand*)command
{
    NSString* path = [command.arguments objectAtIndex:0];
    NSString* targetPath = [command.arguments objectAtIndex:1];
    NSString* folderId = [command.arguments objectAtIndex:2];
    NSString* rootFolderId = [command.arguments objectAtIndex:3];
    NSString* rootFolderName = [command.arguments objectAtIndex:4];
    
    BOOL appfolder = [[command.arguments objectAtIndex:5] boolValue];
    NSDictionary* props = [command.arguments objectAtIndex:6];
    GTLRDrive_File_Properties *properties = nil;
    if (props != nil) {
        properties = [GTLRDrive_File_Properties objectWithJSON:props];
    }
    
    
    if([path stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]].length>0){
        dispatch_async(dispatch_get_main_queue(), ^{
            if(self.authSession.canAuthorize){
                [self uploadAFile:command fpath:path targetPath:targetPath folderId:folderId rootFolderId:rootFolderId rootFolderName:rootFolderName appFolder:appfolder properties:properties];
                NSLog(@"Already authorized app. No need to ask user again");
            } else{
                [self runSigninThenHandler:command onComplete:^{
                    [self uploadAFile:command fpath:path targetPath:targetPath folderId:folderId rootFolderId:rootFolderId rootFolderName:rootFolderName appFolder:appfolder properties:properties];
                }];
            }
        });
    } else {
        [self.commandDelegate sendPluginResult:[CDVPluginResult
                                                resultWithStatus:CDVCommandStatus_ERROR
                                                messageAsString:@"One of the parameters is empty"]
                                    callbackId:command.callbackId];
    }
    
}

- (void)fileList:(CDVInvokedUrlCommand*)command{
    
    NSString * parentFolderId = [command.arguments objectAtIndex:0];
    dispatch_async(dispatch_get_main_queue(), ^{
        if(self.authSession.canAuthorize){
            [self fetchFileList:command parentFolderId:parentFolderId];
            NSLog(@"Already authorized app. No need to ask user again");
        } else{
            [self runSigninThenHandler:command onComplete:^{
                [self fetchFileList:command parentFolderId:parentFolderId];
            }];
        }
    });
}

- (void)deleteFile:(CDVInvokedUrlCommand*)command{
    
    NSString* fileid = [command.arguments objectAtIndex:0];
    if([fileid stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]].length>0){
        dispatch_async(dispatch_get_main_queue(), ^{
            if(self.authSession.canAuthorize){
                [self deleteSelectedFile:command fid:fileid];
                NSLog(@"Already authorized app. No need to ask user again");
            } else{
                [self runSigninThenHandler:command onComplete:^{
                    [self deleteSelectedFile:command fid:fileid];
                }];
            }
        });
    } else{
        [self.commandDelegate sendPluginResult:[CDVPluginResult
                                                resultWithStatus:CDVCommandStatus_ERROR
                                                messageAsString:@"One of the parameters is empty"]
                                    callbackId:command.callbackId];
    }
}

- (void)rename:(CDVInvokedUrlCommand*)command{
    
    NSString* id = [command.arguments objectAtIndex:0];
    NSString* newName = [command.arguments objectAtIndex:1];
    
    if([id stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]].length>0){
        dispatch_async(dispatch_get_main_queue(), ^{
            if(self.authSession.canAuthorize){
                [self renameSelectedFile:command fid:id newName:newName];
                NSLog(@"Already authorized app. No need to ask user again");
            } else{
                [self runSigninThenHandler:command onComplete:^{
                    [self renameSelectedFile:command fid:id newName:newName];
                }];
            }
        });
    } else{
        [self.commandDelegate sendPluginResult:[CDVPluginResult
                                                resultWithStatus:CDVCommandStatus_ERROR
                                                messageAsString:@"One of the parameters is empty"]
                                    callbackId:command.callbackId];
    }
}

- (void)downloadAFile:(CDVInvokedUrlCommand*)command destPath:(NSString*)destPath fid:(NSString*)fileid  anonymousAccess:(BOOL) anonymousAccess {
    NSURL *fileToDownloadURL = [NSURL fileURLWithPath:destPath];
    //NSLog(@"%@", fileToDownloadURL);
    //NSLog(@"%@",fileid);
    
    GTLRDriveService *service = self.driveService;
    id <GTMFetcherAuthorizationProtocol> auth = service.authorizer;
    
    if (anonymousAccess) {
        //service.authorizer = nil;
    }
    
    GTLRQuery *query = [GTLRDriveQuery_FilesGet queryForMediaWithFileId:fileid];
    [service executeQuery:query
        completionHandler:^(GTLRServiceTicket *callbackTicket,
                            GTLRDataObject *object,
                            NSError *callbackError) {
        NSError *errorToReport = callbackError;
        NSError *writeError;
        if (anonymousAccess) {
            // restore
            service.authorizer = auth;
        }
        if (callbackError == nil) {
            BOOL didSave = [object.data writeToURL:fileToDownloadURL
                                           options:NSDataWritingAtomic
                                             error:&writeError];
            if (!didSave) {
                errorToReport = writeError;
            }
        }
        CDVPluginResult* pluginResult = nil;
        if (errorToReport == nil) {
            NSMutableDictionary *result = [[NSMutableDictionary alloc] init];
            [result setObject:@"File downloaded succesfully and saved to path" forKey:@"message"];
            [result setObject:[fileToDownloadURL path] forKey:@"destPath"];
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:result];
        } else {
            [callbackTicket cancelTicket];
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[errorToReport localizedDescription]];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}


// find a folder, optionally can pass a parent folderId
- (void)findAFolder:(CDVInvokedUrlCommand*)command folderName:(NSString*)folderName parentFolderId:(NSString*)parentFolderId {
    GTLRDriveService *service = self.driveService;
    GTLRDriveQuery_FilesList *query = [GTLRDriveQuery_FilesList query];
    query.fields = @"nextPageToken,files(id,name,modifiedTime,trashed)";
    NSString* parentQueryAddition = @"";
    if (![self IsEmpty:parentFolderId]) {
        parentQueryAddition = [NSString stringWithFormat:@" and '%@' in parents", parentFolderId];
    }
    
    query.q = [NSString stringWithFormat:@"name = '%@' and mimeType = 'application/vnd.google-apps.folder' and trashed = false %@" , folderName ,parentQueryAddition];
    
    [service executeQuery:query
        completionHandler:^(GTLRServiceTicket *callbackTicket,
                            GTLRDrive_FileList *fileList,
                            NSError *callbackError) {
        
        CDVPluginResult* pluginResult = nil;
        if (callbackError == nil) {
            NSMutableDictionary *result = [[NSMutableDictionary alloc] init];
            NSMutableArray *filesArray = [[NSMutableArray alloc] init];
            
            for (GTLRDrive_File *file in [fileList files]) {
                [filesArray addObject:file.JSON];
            }
            
            [result setObject:filesArray forKey:@"folders"];
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:result];
        } else {
            [callbackTicket cancelTicket];
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[callbackError localizedDescription]];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}


- (void)fetchFileList:(CDVInvokedUrlCommand*)command parentFolderId:(NSString*)parentFolderId {
    GTLRDriveService *service = self.driveService;
    GTLRDriveQuery_FilesList *query = [GTLRDriveQuery_FilesList query];
    
    query.fields = @"nextPageToken,files(id,name,modifiedTime,mimeType,properties)";
    
    query.q = [NSString stringWithFormat:@"trashed = false and '%@' in parents", parentFolderId];
    query.orderBy = @"modifiedTime desc";
    [service executeQuery:query
        completionHandler:^(GTLRServiceTicket *callbackTicket,
                            GTLRDrive_FileList *fileList,
                            NSError *callbackError) {
        CDVPluginResult* pluginResult = nil;
        if (callbackError == nil) {
            NSMutableDictionary *result = [[NSMutableDictionary alloc] init];
            NSMutableArray *filesArray = [[NSMutableArray alloc] init];
            
            for (GTLRDrive_File *file in [fileList files]) {
                [filesArray addObject:file.JSON];
            }
            
            [result setObject:filesArray forKey:@"files"];
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:result];
        } else {
            [callbackTicket cancelTicket];
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[callbackError localizedDescription]];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}


-(void)uploadAFile:(CDVInvokedUrlCommand*)command fpath:(NSString*) fpath targetPath:(NSString*) targetPath folderId:(NSString*) folderId rootFolderId:(NSString*) rootFolderId rootFolderName:(NSString*) rootFolderName appFolder:(BOOL)appfolder properties:(GTLRDrive_File_Properties*)properties{
    
    NSError *fileError;
    NSURL *fileToUploadURL = [NSURL fileURLWithPath:fpath];
    
    if (![fileToUploadURL checkPromisedItemIsReachableAndReturnError:&fileError]) {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[@"No Local File Found: " stringByAppendingString:fpath]]
                                    callbackId:command.callbackId];
    }
    //NSString *libs = [NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES) objectAtIndex: 0];
    //NSLog(@"Detected Library path: %@", libs);
    
    GTLRDriveService *service = self.driveService;
    
    
    if ([self IsEmpty:rootFolderId] && ![self IsEmpty:rootFolderName]) {
        // Need to create rootFolder first
        GTLRDrive_File *folderObj = [GTLRDrive_File object];
        folderObj.name = rootFolderName;
        folderObj.mimeType = @"application/vnd.google-apps.folder";
        
        GTLRDriveQuery_FilesCreate *folderCreatequery =
        [GTLRDriveQuery_FilesCreate queryWithObject:folderObj
                                   uploadParameters:nil];
        
        [service executeQuery:folderCreatequery
            completionHandler:^(GTLRServiceTicket *callbackTicket,
                                GTLRDrive_File *folderItem,
                                NSError *callbackError) {
            if (callbackError == nil) {
                NSString* createdRootFolderID = [folderItem identifier];
                NSMutableDictionary *interimResult = [[NSMutableDictionary alloc] init];
                [interimResult setObject:createdRootFolderID forKey:@"rootFolderId"];
                
                [self doCreateFolderThenUploadAFile:command fpath:fpath folderId:folderId rootFolderId:createdRootFolderID targetPath:targetPath prevResult:interimResult properties:properties];
            } else {
                CDVPluginResult* pluginResult = nil;
                [callbackTicket cancelTicket];
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[callbackError localizedDescription]];
                [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            }
        }];
        return;
    }
    
    // todo use appFolder??
    [self doCreateFolderThenUploadAFile:command fpath:fpath folderId:folderId rootFolderId:rootFolderId targetPath:targetPath prevResult:nil properties:properties];
}


-(BOOL)IsEmpty:(NSString*)str {
    return (str == (id)[NSNull null] || str.length == 0);
}

-(void)doCreateFolderThenUploadAFile:(CDVInvokedUrlCommand*)command fpath:(NSString*)fpath folderId:(NSString*)folderId rootFolderId:(NSString*)rootFolderId targetPath:(NSString*)targetPath prevResult:(NSMutableDictionary *)prevResult properties:(GTLRDrive_File_Properties*)properties {
    GTLRDriveService *service = self.driveService;
    
    if ([self IsEmpty:folderId] &&
        [[[targetPath stringByDeletingLastPathComponent] pathComponents] count] == 1) {
        // this file has parent folder but folderId is not provided - create the folder
        GTLRDrive_File *folderObj = [GTLRDrive_File object];
        
        if (![self IsEmpty:rootFolderId]) {
            folderObj.parents = @[rootFolderId];
        }
        
        // Support one level of Parent  folder/file.ext
        
        folderObj.name = [[[targetPath stringByDeletingLastPathComponent] pathComponents] objectAtIndex:0];
        folderObj.mimeType = @"application/vnd.google-apps.folder";
        
        GTLRDriveQuery_FilesCreate *folderCreatequery =
        [GTLRDriveQuery_FilesCreate queryWithObject:folderObj
                                   uploadParameters:nil];
        
        [service executeQuery:folderCreatequery
            completionHandler:^(GTLRServiceTicket *callbackTicket,
                                GTLRDrive_File *folderItem,
                                NSError *callbackError) {
            if (callbackError == nil) {
                NSMutableDictionary *interimResult = prevResult == nil ? [[NSMutableDictionary alloc] init] : prevResult;
                NSString* createdFolderId = [folderItem identifier];
                [interimResult setObject:createdFolderId forKey:@"folderId"];
                
                [self doUploadAFile:command fpath:fpath fname:[targetPath lastPathComponent] folderId:createdFolderId prevResult:interimResult properties:properties];
            } else {
                CDVPluginResult* pluginResult = nil;
                [callbackTicket cancelTicket];
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[callbackError localizedDescription]];
                [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            }
        }];
        return;
    }
    NSString* parentId = [self IsEmpty:folderId] ? rootFolderId : folderId;
    
    [self doUploadAFile:command fpath:fpath fname:[targetPath lastPathComponent] folderId:parentId prevResult:prevResult properties:properties];
}


-(void)doUploadAFile:(CDVInvokedUrlCommand*)command fpath:(NSString*)fpath fname:(NSString*)fname folderId:(NSString*)folderId prevResult:(NSMutableDictionary *)prevResult properties:(GTLRDrive_File_Properties*)properties {
    GTLRDriveService *service = self.driveService;
    
    NSURL *fileToUploadURL = [NSURL fileURLWithPath:fpath];
    NSLog(@"%@", fileToUploadURL);
    
    GTLRUploadParameters *uploadParameters =
    [GTLRUploadParameters uploadParametersWithFileURL:fileToUploadURL
                                             MIMEType:@"application/octet-stream"];
    
    uploadParameters.useBackgroundSession = YES;
    
    GTLRDrive_File *backUpFile = [GTLRDrive_File object];
    backUpFile.name = fname;
    if (properties != nil) {
        backUpFile.properties = properties;
    }
    
    if (![self IsEmpty:folderId]) {
        backUpFile.parents = @[folderId];
    }
    
    GTLRDriveQuery_FilesCreate *query =
    [GTLRDriveQuery_FilesCreate queryWithObject:backUpFile
                               uploadParameters:uploadParameters];
    
    //TODO: show native progress indicator
    query.executionParameters.uploadProgressBlock = ^(GTLRServiceTicket *callbackTicket,
                                                      unsigned long long numberOfBytesRead,
                                                      unsigned long long dataLength) {
        //double maxValue = (double)dataLength;
        //double doubleValue = (double)numberOfBytesRead;
    };
    
    
    
    [service executeQuery:query
        completionHandler:^(GTLRServiceTicket *callbackTicket,
                            GTLRDrive_File *uploadedFile,
                            NSError *callbackError) {
        
        //NSLog(@"%@", NSStringFromClass([uploadedFile class]));
        if (callbackError == nil) {
            NSString* fileId = [uploadedFile identifier];
            // Set permission to anyone with a link
            GTLRDrive_Permission *perm = [GTLRDrive_Permission object];
            perm.type = @"anyone";
            perm.role = @"reader";
            GTLRDriveQuery_PermissionsCreate * createPermQuery = [GTLRDriveQuery_PermissionsCreate  queryWithObject:perm fileId:fileId];
            
            [service executeQuery:createPermQuery
                completionHandler:^(GTLRServiceTicket *callbackTicket,
                                    GTLRDrive_File *uploadedFile,
                                    NSError *callbackError) {
                CDVPluginResult* pluginResult = nil;
                if (callbackError == nil) {
                    NSMutableDictionary *result = [[NSMutableDictionary alloc] init];
                    if (prevResult != nil) {
                        // merge results from previous run if exists
                        [result addEntriesFromDictionary:prevResult];
                    }
                    
                    [result setObject:@"File uploaded succesfully!" forKey:@"message"];
                    [result setObject:[NSString stringWithFormat:@"%@", [NSDate date]] forKey:@"created_date"];
                    [result setObject:fileId forKey:@"fileId"];
                    [result setObject:folderId forKey:@"folderId"];
                    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:result];
                } else {
                    [callbackTicket cancelTicket];
                    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[callbackError localizedDescription]];
                }
                
                [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            }];
        } else {
            CDVPluginResult* pluginResult = nil;
            [callbackTicket cancelTicket];
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[callbackError localizedDescription]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }];
}

- (void)deleteSelectedFile:(CDVInvokedUrlCommand*)command fid:(NSString*) fileid{
    GTLRDriveService *service = self.driveService;
    
    GTLRDriveQuery_FilesDelete *query = [GTLRDriveQuery_FilesDelete queryWithFileId:fileid];
    [service executeQuery:query completionHandler:^(GTLRServiceTicket *callbackTicket,
                                                    id nilObject,
                                                    NSError *callbackError) {
        CDVPluginResult* pluginResult = nil;
        if (callbackError == nil) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[callbackError localizedDescription]];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}


- (void)renameSelectedFile:(CDVInvokedUrlCommand*)command fid:(NSString*) fid newName:(NSString*) newName {
    GTLRDriveService *service = self.driveService;
    
    
    GTLRDrive_File *fileObj = [GTLRDrive_File object];
    fileObj.name = newName;
    GTLRDriveQuery_FilesUpdate *query = [GTLRDriveQuery_FilesUpdate queryWithObject:fileObj fileId:fid uploadParameters:nil];
    
    [service executeQuery:query completionHandler:^(GTLRServiceTicket *callbackTicket,
                                                    id nilObject,
                                                    NSError *callbackError) {
        CDVPluginResult* pluginResult = nil;
        if (callbackError == nil) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[callbackError localizedDescription]];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}


- (void)createAFolder:(CDVInvokedUrlCommand*)command dirName:(NSString*) title{
    GTLRDriveService *service = self.driveService;
    
    GTLRDrive_File *folderObj = [GTLRDrive_File object];
    folderObj.name = title;
    folderObj.mimeType = @"application/vnd.google-apps.folder";
    
    GTLRDriveQuery_FilesCreate *query =
    [GTLRDriveQuery_FilesCreate queryWithObject:folderObj
                               uploadParameters:nil];
    
    [service executeQuery:query
        completionHandler:^(GTLRServiceTicket *callbackTicket,
                            GTLRDrive_File *folderItem,
                            NSError *callbackError) {
        // Callback
        CDVPluginResult* pluginResult = nil;
        if (callbackError == nil) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"OK!"];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[callbackError localizedDescription]];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
    
}

- (void)runSigninThenHandler:(CDVInvokedUrlCommand*)command onComplete:(void (^)(void))handler{
    NSURL *redirectURI = [NSURL URLWithString:kRedirectURI];
    
    OIDServiceConfiguration *configuration = [GTMAuthSession configurationForGoogle];
    NSArray<NSString *> *scopes = @[ kGTLRAuthScopeDriveFile, OIDScopeEmail,
                                     //kGTLRAuthScopeDriveAppdata,
                                     //kGTLRAuthScopeDrive
    ];
    OIDAuthorizationRequest *request = [[OIDAuthorizationRequest alloc] initWithConfiguration:configuration
                                                                                     clientId:kClientID
                                                                                 clientSecret:nil
                                                                                       scopes:scopes
                                                                                  redirectURL:redirectURI
                                                                                 responseType:OIDResponseTypeCode
                                                                         additionalParameters:nil];
    
    AppDelegate *appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
    NSLog(@"Initiating authorization request with scope: %@", request.scope);
    
    appDelegate.currentAuthorizationFlow = [OIDAuthState authStateByPresentingAuthorizationRequest:request
                                    //externalUserAgent:safariUserAgent
                                                                          presentingViewController:self.viewController
                                            
                                    

                                                              callback:^(OIDAuthState *_Nullable authState, NSError *_Nullable error) {
        if (authState) {
            GTMAuthSession *authorization =
            [[GTMAuthSession alloc] initWithAuthState:authState];
            
            [self setAuthSession:authorization];
            self.driveService.authorizer = authorization;
            NSLog(@"Got authorization tokens. Access token: %@",
                  authState.lastTokenResponse.accessToken);
            if (handler) handler();
        } else {
            [self setAuthSession:nil];
            [self.commandDelegate sendPluginResult:                                                                                                   [CDVPluginResult resultWithStatus:                                                                                                CDVCommandStatus_ERROR messageAsString:[error localizedDescription]] callbackId:command.callbackId];                                                                                                NSLog(@"Authorization error: %@", [error localizedDescription]);
        }
    }];
}


- (void)stateChanged {
    [self saveState];
}

- (void)didChangeState:(OIDAuthState *)state {
    [self stateChanged];
}

- (void)setAuthSession:(GTMAuthSession *)authSession {
    if ([_authSession isEqual:authSession]) {
        return;
    }
    _authSession = authSession;
    self.driveService.authorizer = _authSession;

    [self stateChanged];
}

- (void)saveState {
    NSError *error;
    if (_authSession != nil && _authSession.canAuthorize) {
        [self.keychainStore saveAuthSession:_authSession error:&error];
    } else {
        [self.keychainStore removeAuthSessionWithError:&error];
    }
    if (error) {
        NSLog(@"Error saving state: %@ error", error);
    }
}

- (void)clearState {
    [self setAuthSession:nil];
    [self saveState];
}

- (void)loadState {
  NSError *error;
  GTMAuthSession *authSession =
      [self.keychainStore retrieveAuthSessionWithError:&error];
  if (error) {
    NSLog(@"Error loading state: %@", error);
  }
  [self setAuthSession:authSession];
}

- (void)authState:(OIDAuthState *)state didEncounterAuthorizationError:(NSError *)error {
    NSLog(@"Received authorization error: %@", error);
}

- (GTLRDriveService *)driveService {
    static GTLRDriveService *service;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        service = [[GTLRDriveService alloc] init];
        service.shouldFetchNextPages = YES;
        service.retryEnabled = YES;
    });
    return service;
}

@end
