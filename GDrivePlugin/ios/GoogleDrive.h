#import <Cordova/CDVPlugin.h>
#import <UIKit/UIKit.h>
#import "GTLRDrive.h"
#import <Cordova/CDVAppDelegate.h>

@class OIDAuthState;
@class GTMAppAuthFetcherAuthorization;
@class OIDServiceConfiguration;

@interface GoogleDrive : CDVPlugin
@property(nonatomic, nullable) GTMAppAuthFetcherAuthorization *authorization;
- (void)downloadFile:(CDVInvokedUrlCommand*)command;
- (void)uploadFile:(CDVInvokedUrlCommand*)command;
- (void)deleteFile:(CDVInvokedUrlCommand*)command;
- (void)rename:(CDVInvokedUrlCommand*)command;

- (void)whoAmI:(CDVInvokedUrlCommand*)command;
- (void)logout:(CDVInvokedUrlCommand*)command;


- (void)findFolder:(CDVInvokedUrlCommand*)command;
- (void)fileList:(CDVInvokedUrlCommand*)command;



@end

@protocol OIDExternalUserAgentSession;


@interface CDVAppDelegate (GoogleDrive) <UIApplicationDelegate>
@property(nonatomic, strong, nullable) id<OIDExternalUserAgentSession> currentAuthorizationFlow;
- (BOOL)application:(UIApplication *)app myOpenURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options;
@end
