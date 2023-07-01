#import <Cordova/CDVPlugin.h>
#import <UIKit/UIKit.h>
#import <Cordova/CDVAppDelegate.h>

NS_ASSUME_NONNULL_BEGIN

@interface OnDemandResources : CDVPlugin
@property (nonatomic, strong) NSBundleResourceRequest *resourceRequest;
@property (nonatomic, strong) NSArray *tags;

- (void)initPlayAssets:(CDVInvokedUrlCommand*)command;
- (void)getPlayAssets:(CDVInvokedUrlCommand*)command;

@end
NS_ASSUME_NONNULL_END


