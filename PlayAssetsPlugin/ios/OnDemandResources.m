#import "OnDemandResources.h"
#import "AppDelegate.h"
#import <Foundation/NSProgress.h>


//
//@interface OnDemandResources ()
//@property (nonatomic, readonly) NSBundleResourceRequest *resourceRequest;
//@property (nonatomic, readonly) NSArray *tags;
//@end



@implementation OnDemandResources {}

// - (void)pluginInitialize {

// }


- (void)initPlayAssets:(CDVInvokedUrlCommand*)command {
    
    self.tags = [command.arguments objectAtIndex:0];
    NSSet *tags = [NSSet setWithArray:self.tags];
     
    _resourceRequest = [[NSBundleResourceRequest alloc] initWithTags:tags];

    [_resourceRequest beginAccessingResourcesWithCompletionHandler:
                                                 ^(NSError * __nullable error)
        {
            // Check if there is an error
            if (error) {
                // todo handle error;
            }        
        }
    ];

    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

}

- (void)getPlayAssets:(CDVInvokedUrlCommand*)command {

    if (self.resourceRequest == nil) {
        //todo error
        return;
    }

    NSProgress * progress = [self.resourceRequest progress];
    
    NSMutableDictionary *assets = [[NSMutableDictionary alloc] init];
    [assets setValue:@0 forKey:@"fileIndex"];
    
    int finished = 0;

    NSMutableArray *targetArray = [NSMutableArray array];
    for (NSString *tag in self.tags) {
        NSDictionary *elementDict = nil;

        NSURL *url = [[self->_resourceRequest bundle] URLForResource:tag withExtension: @""];

        if (url != nil) {
            finished++;
            // Here we make a very strong assumption:
            // Tag name is also a folder name that is taged with that tag

            elementDict = @{
                @"name" : tag,
                @"path" : [[url absoluteString] substringFromIndex:7],
                @"downloadPercent" : @100
            };
            [targetArray addObject:elementDict];

        } else {
            double prog = [self->_resourceRequest progress].fractionCompleted;
            [assets setValue:[NSNumber numberWithInt:((int) (prog * 100))] forKey:@"downloadPercent"];
        }

    }
    [assets setObject:targetArray forKey:@"assets"];
    if (finished == self->_tags.count) {
        [assets setValue:@YES forKey:@"ready"];
    }
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:assets];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


@end
