#import "MMShare.h"
#import <Cordova/CDV.h>

@implementation MMShare

- (void)share:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* fullPath = [command.arguments objectAtIndex:0];
    
    if (fullPath != nil && [fullPath length] > 0) {
        NSURL *url = [NSURL fileURLWithPath:fullPath];
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        //NSArray* dataToShare = @[url];  // ...or whatever pieces of data you want to share.
        
        UIActivityViewController* activityViewController =
        [[UIActivityViewController alloc] initWithActivityItems:@[url]
                                          applicationActivities:nil];

        // fix crash on iOS8
        if (IsAtLeastiOSVersion(@"8.0")) {
            activityViewController.popoverPresentationController.sourceView = self.webView;
        }

        [self.viewController presentViewController:activityViewController animated:YES completion:^{}];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
