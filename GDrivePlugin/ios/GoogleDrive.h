#import <Cordova/CDVPlugin.h>
#import <UIKit/UIKit.h>
#import "GTLRDrive.h"
#import <Cordova/CDVAppDelegate.h>

@class OIDAuthState;
@class GTMAuthSession;
@class OIDServiceConfiguration;
@protocol OIDExternalUserAgentSession;
NS_ASSUME_NONNULL_BEGIN


@interface GoogleDrive : CDVPlugin
@property(nonatomic, nullable) GTMAuthSession *authSession;

- (void)downloadFile:(CDVInvokedUrlCommand*)command;
- (void)uploadFile:(CDVInvokedUrlCommand*)command;
- (void)deleteFile:(CDVInvokedUrlCommand*)command;
- (void)rename:(CDVInvokedUrlCommand*)command;

- (void)whoAmI:(CDVInvokedUrlCommand*)command;
- (void)logout:(CDVInvokedUrlCommand*)command;

- (void)findFolder:(CDVInvokedUrlCommand*)command;
- (void)fileList:(CDVInvokedUrlCommand*)command;
@end
NS_ASSUME_NONNULL_END


// Extending CDVAppDelegate:

@interface CDVAppDelegate (GoogleDrive)
@property(nonatomic, strong, nullable) id<OIDExternalUserAgentSession> currentAuthorizationFlow;


- (BOOL)application:(UIApplication *)app myOpenURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options;
@end
