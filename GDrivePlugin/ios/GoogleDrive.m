#import "GoogleDrive.h"
#import <AppAuth/AppAuth.h>
#import <GTMAppAuth/GTMAppAuth.h>
#import "OIDExternalUserAgent.h"
#import "GTLRUtilities.h"
#import "AppDelegate.h"
#import <objc/runtime.h>


static NSString *kClientID = @"";
static NSString *kRedirectURI =@":/oauthredirect";
static NSString *kAuthorizerKey = @"";

@interface GoogleDrive () <OIDAuthStateChangeDelegate,OIDAuthStateErrorDelegate>
@property (nonatomic, readonly) GTLRDriveService *driveService;
@end


@implementation CDVAppDelegate (GoogleDrive)

static CDVAppDelegate * _instance;
id<OIDExternalUserAgentSession> _currentAuthorizationFlow;

+ (id<OIDExternalUserAgentSession>) currentAuthorizationFlow;{ return _currentAuthorizationFlow; }
+ (void)setCurrentAuthorizationFlow:(id<OIDExternalUserAgentSession>)authFlow { _currentAuthorizationFlow = authFlow; }


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
    kAuthorizerKey = [[[NSBundle mainBundle] infoDictionary] objectForKey:(NSString*)kCFBundleNameKey];
    NSLog(@"%@",kAuthorizerKey);
    NSMutableArray *ids = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleURLTypes"];
    NSArray *reversedClientId = [ids filteredArrayUsingPredicate:[NSPredicate predicateWithFormat:@"CFBundleURLName == %@", @"reversedClientId"]];
    NSArray *clientId = [ids filteredArrayUsingPredicate:[NSPredicate predicateWithFormat:@"CFBundleURLName == %@", @"clientId"]];
    kRedirectURI = [[[[reversedClientId valueForKey:@"CFBundleURLSchemes"] objectAtIndex:0 ] objectAtIndex:0] stringByAppendingString:kRedirectURI];
    kClientID = [[[clientId valueForKey:@"CFBundleURLSchemes"] objectAtIndex:0 ] objectAtIndex:0];
    [self loadState];
    //NSLog(@"%@",kRedirectURI);
    //NSLog(@"%@",kClientID);
}




- (void)downloadFile:(CDVInvokedUrlCommand*)command
{
    NSString* destPath = [command.arguments objectAtIndex:0];
    NSString* fileid = [command.arguments objectAtIndex:1];
    BOOL anonymousAccess = [[command.arguments objectAtIndex:2] boolValue];
    
    if([destPath stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]].length>0){
        dispatch_async(dispatch_get_main_queue(), ^{
            if(self.authorization.canAuthorize){
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
    BOOL appfolder = [[command.arguments objectAtIndex:3] boolValue];
    if([path stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]].length>0){
        dispatch_async(dispatch_get_main_queue(), ^{
            if(self.authorization.canAuthorize){
                [self uploadAFile:command fpath:path targetPath:targetPath folderId:folderId appFolder:appfolder];
                    NSLog(@"Already authorized app. No need to ask user again");
            } else{
                [self runSigninThenHandler:command onComplete:^{
                    [self uploadAFile:command fpath:path targetPath:targetPath folderId:folderId appFolder:appfolder];
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

    BOOL appfolder = [[command.arguments objectAtIndex:0] boolValue];
    dispatch_async(dispatch_get_main_queue(), ^{
        if(self.authorization.canAuthorize){
            [self fetchFileList:command appFolder:appfolder];
            NSLog(@"Already authorized app. No need to ask user again");
        } else{
            [self runSigninThenHandler:command onComplete:^{
                [self fetchFileList:command appFolder:appfolder];
            }];
        }
    });
}

- (void)deleteFile:(CDVInvokedUrlCommand*)command{

    NSString* fileid = [command.arguments objectAtIndex:0];
    if([fileid stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]].length>0){
            dispatch_async(dispatch_get_main_queue(), ^{
                if(self.authorization.canAuthorize){
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

- (void)fetchFileList:(CDVInvokedUrlCommand*)command appFolder:(BOOL)appfolder {
    GTLRDriveService *service = self.driveService;
    GTLRDriveQuery_FilesList *query = [GTLRDriveQuery_FilesList query];

    query.fields = @"nextPageToken,files(id,name,trashed,modifiedTime)";
    if(appfolder)
        query.spaces = @"appDataFolder";

    //query.orderBy=@"modifiedDate";

    [service executeQuery:query
        completionHandler:^(GTLRServiceTicket *callbackTicket,
                            GTLRDrive_FileList *fileList,
                            NSError *callbackError) {
            // Callback
            NSArray *notTrashed = [[fileList files] filteredArrayUsingPredicate:[NSPredicate predicateWithFormat:@"trashed == %d", 0]];
            NSMutableArray *res = [[NSMutableArray alloc] init];
            if (notTrashed.count > 0) {
                for (GTLRDrive_File *file in notTrashed) {
                    [res addObject:file.JSON];
                }
            }
            CDVPluginResult* pluginResult = nil;
            if (callbackError == nil) {
                NSMutableDictionary *result = [[NSMutableDictionary alloc] init];
                [result setObject:@"Retrived file list succesfully!" forKey:@"message"];
                [result setObject:res forKey:@"flist"];
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:result];
            } else {
                [callbackTicket cancelTicket];
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[callbackError localizedDescription]];
            }
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }];
}


-(void)uploadAFile:(CDVInvokedUrlCommand*)command fpath:(NSString*) fpath targetPath:(NSString*) targetPath folderId:(NSString*) folderId appFolder:(BOOL)appfolder{

    NSURL *fileToUploadURL = [NSURL fileURLWithPath:fpath];
    NSLog(@"%@", fileToUploadURL);

    NSError *fileError;
    if (![fileToUploadURL checkPromisedItemIsReachableAndReturnError:&fileError]) {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[@"No Local File Found: " stringByAppendingString:fpath]]
                                    callbackId:command.callbackId];
    }
    //NSString *libs = [NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES) objectAtIndex: 0];
    //NSLog(@"Detected Library path: %@", libs);

    GTLRDriveService *service = self.driveService;

    GTLRUploadParameters *uploadParameters =
    [GTLRUploadParameters uploadParametersWithFileURL:fileToUploadURL
                                             MIMEType:@"application/octet-stream"];

    uploadParameters.useBackgroundSession = YES;

    GTLRDrive_File *backUpFile = [GTLRDrive_File object];
    backUpFile.name = [targetPath lastPathComponent];
    
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


    if(appfolder)
        backUpFile.parents = @[@"appDataFolder"];
    else if (folderId != (id)[NSNull null] && folderId.length > 0){
        backUpFile.parents = @[folderId];
    } else if ([[[targetPath stringByDeletingLastPathComponent] pathComponents] count] == 1) {
        // this file has parent folder but folderId is not provided - create the folder
        GTLRDrive_File *folderObj = [GTLRDrive_File object];
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
                NSString* createdFolderID = [folderItem identifier];
                backUpFile.parents = @[createdFolderID];
                [self doUploadAFile:query command:command folderId:createdFolderID];
                

            } else {
                CDVPluginResult* pluginResult = nil;
                [callbackTicket cancelTicket];
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[callbackError localizedDescription]];
            }
        }];
        return;
    }
    [self doUploadAFile:query command:command folderId:folderId];
}


-(void)doUploadAFile:(GTLRDriveQuery_FilesCreate *)query command:(CDVInvokedUrlCommand*)command folderId:(NSString*)folderId {
    GTLRDriveService *service = self.driveService;

   
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

    OIDServiceConfiguration *configuration = [GTMAppAuthFetcherAuthorization configurationForGoogle];
    NSArray<NSString *> *scopes = @[ kGTLRAuthScopeDriveFile, OIDScopeEmail,
                                     kGTLRAuthScopeDriveAppdata,
                                     kGTLRAuthScopeDrive];
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
                                            presentingViewController:self.viewController
                                                                                          callback:^(OIDAuthState *_Nullable authState,
                                                                                                     NSError *_Nullable error) {
                                                                                              if (authState) {
                                                                                                  GTMAppAuthFetcherAuthorization *authorization =
                                                                                                  [[GTMAppAuthFetcherAuthorization alloc] initWithAuthState:authState];

                                                                                                  [self setGtmAuthorization:authorization];
                                                                                                  self.driveService.authorizer = authorization;
                                                                                                  NSLog(@"Got authorization tokens. Access token: %@",
                                                                                                        authState.lastTokenResponse.accessToken);
                                                                                                  if (handler) handler();
                                                                                              } else {
                                                                                                  [self setGtmAuthorization:nil];
                                                                                                  [self.commandDelegate sendPluginResult:                                                                                                   [CDVPluginResult resultWithStatus:                                                                                                CDVCommandStatus_ERROR messageAsString:[error localizedDescription]] callbackId:command.callbackId];                                                                                                NSLog(@"Authorization error: %@", [error localizedDescription]);
                                                                                              }
                                                                                          }];
}

- (void)setGtmAuthorization:(GTMAppAuthFetcherAuthorization*)authorization {
    if ([_authorization isEqual:authorization]) {
        return;
    }
    _authorization = authorization;
    self.driveService.authorizer = authorization;
    [self stateChanged];
}

- (void)stateChanged {
    [self saveState];
}

- (void)didChangeState:(OIDAuthState *)state {
    [self stateChanged];
}

- (void)saveState {
    if (_authorization.canAuthorize) {
        [GTMAppAuthFetcherAuthorization saveAuthorization:_authorization
                                        toKeychainForName:kAuthorizerKey];
    } else {
        [GTMAppAuthFetcherAuthorization removeAuthorizationFromKeychainForName:kAuthorizerKey];
    }
}

- (void)loadState {
//    [GTMAppAuthFetcherAuthorization removeAuthorizationFromKeychainForName:kAuthorizerKey];

    
    
    GTMAppAuthFetcherAuthorization* authorization = [GTMAppAuthFetcherAuthorization authorizationFromKeychainForName:kAuthorizerKey];
    [self setGtmAuthorization:authorization];
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
