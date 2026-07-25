# IssieSign
אפליקציה ללימוד שפת הסימנים המכילה כ-600 מילים בעברית מעולמם של ילדים. האפליקציה כוללת תמונות וסרטונים ופותחה בשיתוף עם סאפ והמרכז לייעוץ טכנולוגי בבית איזי שפירא.

## Build instruction
- git clone `https://github.com/BeitIssieShapiro/IssieSign.git`
- Install cordova: `npm install -g cordova`
- run `npm install`

### Run in Browser 
Note: some features won't work, as it requires device API such as filesystem

- change `window.isBrowser = true`
- comment out `<script type="text/javascript" charset="utf-8" src="cordova.js"></script>`

- run `npm start`
- browser will open with the App.
- On every file change, the browser will reload the App.

### Run in iOS
- 

### Run in iOS simulator

- to run in ios, you need a Mac and xcode installed
- you need to create a cordova project - see below
- run `./make/ios-make-<prod-variant: he/en/ar>`
- Open xcode and open a workspace in `cordova/IsraeliSignLanguage/platforms/ios/IssieSign.xcworkspace`
- On the project Navigator left panel, select the root (IssieSign)
- In the "Signing" section, choose the Team (you would need to click on manage-account and add your appleId account before)
- choose a device (your connected iPad) and press the run button.

### Run on iPad, connected via cable
- same as before, select the iPad as the device
- On first run, you need to verify the app: in Settings->General->Device Management->choose you e-mail and the verify the app.

<!--   
## Build android
* run `./make/android-make-<variant: en | ar | he>.sh`
* Open android studio `androidApp/platforms/android/<proj>` 

* in `build.gradle` promote the `versionCode` and `versionName` 
* in the studio - `build -> generate signed bundle`
* set the right signing key
* locate the bundle in filesystem and upload to google-play console
 -->


# Licence
IssieSign is avaiable under the GPL Licence. See the following link: https://www.gnu.org/licenses/gpl-3.0.en.html


## recreate cordova — Android

Tested with **cordova-android 15.1.0**, targetSdkVersion **36** (API 36, Android 16), Gradle 8.14.2, AGP 8.10.1.
Node >= 20.17.0 required.

### Prerequisites

- Node >= 20.17
- `npm install -g cordova` (any recent version, e.g. 12.x)
- Android SDK installed, `ANDROID_HOME` set
- JDK 17 (e.g. JetBrains Runtime). Note the path — needed in `gradle.properties`
- `bundletool` installed (`brew install bundletool`) — needed for emulator testing with Play Assets
- `keystore.properties` and `googleplay/*.jks` keystore files (not in repo — copy from secure backup)
- `google-services.json` (not in repo — see "Setup oauth client for android" section)

### 1. Rename existing android-app as backup (if upgrading)

```bash
mv android-app android-app-old
```

### 2. Create fresh Cordova project

```bash
# from project root
cordova create android-app com.issieshapiro.signlang IssieSign
cp android-app-old/config.xml android-app/config.xml   # carries preferences

cd android-app
npm install cordova-android@^15.1.0 --save-dev
cordova platform add android
# → confirms: Android Target SDK: android-36
```

### 3. Add plugins

```bash
# from android-app/
cordova plugin add cordova-plugin-file@^8.1.3
cordova plugin add cordova-plugin-camera@^8.0.0
cordova plugin add cordova-plugin-media-capture@^6.0.0
cordova plugin add cordova-plugin-share
cordova plugin add cordova-plugin-x-socialsharing
cordova plugin add cordova-plugin-vibration
cordova plugin add ../GDrivePlugin/ \
  --variable IOS_REVERSED_CLIENT_ID=com.googleusercontent.apps.972582951029-7i2ipcpioalrfe0glkgp9udo5ne2fe0q \
  --variable IOS_CLIENT_ID=972582951029-7i2ipcpioalrfe0glkgp9udo5ne2fe0q.apps.googleusercontent.com
cordova plugin add ../PlayAssetsPlugin/
cordova plugin add cc.fovea.cordova.openwith@2.1.0 \
  --variable ANDROID_MIME_TYPE="image/*" \
  --variable IOS_URL_SCHEME=ccfoveaopenwithdemo \
  --variable IOS_UNIFORM_TYPE_IDENTIFIER=public.image \
  --variable ANDROID_EXTRA_ACTIONS=" "
```

Note: do **not** add `cordova-plugin-splashscreen` — cordova-android 15 has a built-in splash screen handler that replaces it.

### 4. gradle.properties

Edit `platforms/android/gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx4048m
android.useAndroidX=true
android.enableJetifier=true
org.gradle.java.home=<path to JDK 17, e.g. /Users/you/Library/Java/JavaVirtualMachines/jbr-17.0.12/Contents/Home>
```

### 5. Gradle wrapper

Copy the Gradle wrapper from the old project (or generate via Android Studio):
```bash
cp -R android-app-old/platforms/android/gradle android-app/platforms/android/
cp android-app-old/platforms/android/gradlew android-app/platforms/android/
chmod +x android-app/platforms/android/gradlew
```

Update `gradle/wrapper/gradle-wrapper.properties` to match `cdv-gradle-config.json`'s `GRADLE_VERSION`:
```
distributionUrl=https\://services.gradle.org/distributions/gradle-8.14.2-bin.zip
```

### 6. settings.gradle — add asset packs

In `platforms/android/settings.gradle` add:
```groovy
include ":issiesign_assets"
include ":issiesign_assets3"
```

### 7. build.gradle (top-level) — add google-services classpath

In `platforms/android/build.gradle`, inside `buildscript > dependencies`:
```groovy
classpath "com.google.gms:google-services:4.5.0"
```

### 8. app/build.gradle — custom dependencies, signing, flavors

After `apply plugin: 'com.android.application'` add:
```groovy
apply plugin: 'com.google.gms.google-services'

dependencies {
    implementation 'com.google.android.play:asset-delivery:2.2.2'
    implementation 'com.google.android.gms:play-services-auth:21.2.0'
    implementation 'com.squareup.okhttp3:okhttp:4.10.0'
    implementation 'com.google.apis:google-api-services-drive:v3-rev75-1.22.0'
    implementation platform('com.google.firebase:firebase-bom:33.1.2')
    implementation 'com.google.firebase:firebase-functions'
    implementation 'com.google.firebase:firebase-appcheck-playintegrity'
    implementation 'com.google.firebase:firebase-appcheck-debug:16.1.0'
    implementation 'com.google.guava:listenablefuture:9999.0-empty-to-avoid-conflict-with-guava'
}
```

Before the `android {` block add keystore loading:
```groovy
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
```

Inside `android {` after `buildFeatures` add:
```groovy
    assetPacks = [":issiesign_assets", ":issiesign_assets3"]

    signingConfigs {
        create("issiesign") {
            keyAlias keystoreProperties['HEkeyAlias']
            keyPassword keystoreProperties['HEkeyPassword']
            storeFile file(keystoreProperties['HEstoreFile'])
            storePassword keystoreProperties['HEstorePassword']
        }
        create("issiesignarabic") {
            keyAlias keystoreProperties['ENkeyAlias']
            keyPassword keystoreProperties['ENkeyPassword']
            storeFile file(keystoreProperties['ENstoreFile'])
            storePassword keystoreProperties['ENstorePassword']
        }
    }

    flavorDimensions "languages"

    productFlavors {
        issiesign {
            namespace "org.issieshapiro.signlang2"
            applicationId "org.issieshapiro.signlang2"
            resValue "string", "app_name", "IssieSign"
            manifestPlaceholders = [appIcon: "@mipmap/ic_launcher"]
            versionCode 10106
            versionName "2.2.2"
            signingConfig signingConfigs.issiesign
        }
        issiesignarabic {
            namespace "com.issieshapiro.issiesignarabic"
            applicationId "com.issieshapiro.issiesignarabic"
            resValue "string", "app_name", "IssieSignArabic"
            manifestPlaceholders = [appIcon: "@mipmap/ic_launcher_ar"]
            versionCode 10104
            versionName "2.2.2"
            signingConfig signingConfigs.issiesign
        }
    }
```

### 9. AndroidManifest.xml

In `app/src/main/AndroidManifest.xml`:

- `<manifest>` tag: add `xmlns:tools="http://schemas.android.com/tools"`
- `<application>` tag: set `android:icon="${appIcon}"`, `android:theme="@style/Theme.AppCompat.Light"`, `android:usesCleartextTraffic="true"`
- `<activity>` tag: set `android:name="com.issieshapiro.signlang.MainActivity"`, `android:theme="@style/Theme.App.SplashScreen"`, `android:launchMode="singleTask"`
- Add Import Words intent-filter inside the activity:
```xml
<intent-filter android:label="Import Words" android:priority="1"
    android:scheme="http" tools:ignore="AppLinkUrlError">
    <action android:name="android.intent.action.VIEW" />
    <action android:name="android.intent.action.EDIT" />
    <action android:name="android.intent.action.PICK" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:mimeType="*/*" />
    <data android:pathPattern="*.zip" />
</intent-filter>
```
- Add permissions: `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO`, `RECORD_AUDIO`, `READ_MEDIA_AUDIO`, `READ_EXTERNAL_STORAGE` (maxSdkVersion=32)

### 10. res/values/cdv_themes.xml — splash screen theme

Change `postSplashScreenTheme` to use `Theme.AppCompat.Light` (not the default DayNight):
```xml
<item name="postSplashScreenTheme">@style/Theme.AppCompat.Light</item>
```

### 11. MainActivity.java

In `onCreate`, add before `loadUrl`:
```java
getSupportActionBar().hide();
```

### 12. GDrivePlugin — comment out BuildConfig reference

In `platforms/android/app/src/main/java/bentu/googledrive/GoogleDrive.java`:
- Comment out: `//import com.issieshapiro.signlang.BuildConfig;`
- Replace: `if (com.issieshapiro.signlang.BuildConfig.DEBUG)` → `//if (...)\nif (false)`

### 13. Copy asset packs, res, and secret files

```bash
# from project root
cp -R code-changes/AndroidAssets/issiesign_assets  android-app/platforms/android/
cp -R code-changes/AndroidAssets/issiesign_assets3 android-app/platforms/android/
cp -R code-changes/AndroidAssets/res/. android-app/platforms/android/app/src/main/res/

# secret files (not in repo):
cp <backup>/keystore.properties       android-app/platforms/android/
cp <backup>/google-services.json      android-app/platforms/android/app/
```

Note: `res/values/strings.xml` must be empty (no `launcher_name`/`activity_name` — they come from `cdv_strings.xml`):
```xml
<?xml version='1.0' encoding='utf-8'?>
<resources>
</resources>
```

### 14. Verify build

```bash
cd android-app/platforms/android
./gradlew assembleIssiesignDebug
# → BUILD SUCCESSFUL
```

---

## Run on Android emulator with Play Assets (bundletool)

```bash
# 1. Build React + copy assets (from project root):
./make/android-make-he.sh

# 2. Build debug AAB (from android-app/platforms/android):
./gradlew bundleIssiesignDebug

# 3. Build APK set with local-testing flag:
bundletool build-apks \
  --bundle=app/build/outputs/bundle/issiesignDebug/app-issiesign-debug.aab \
  --output=/tmp/issiesign-debug.apks \
  --overwrite \
  --ks=/path/to/googleplay/issieSign.jks \
  --ks-pass=pass:signlang \
  --ks-key-alias=issiesign \
  --key-pass=pass:signlang \
  --local-testing

# 4. Install on emulator (includes asset packs):
bundletool install-apks --apks=/tmp/issiesign-debug.apks --device-id=emulator-5554

# 5. Launch:
adb -s emulator-5554 shell am start -n org.issieshapiro.signlang2/com.issieshapiro.signlang.MainActivity
```

The `--local-testing` flag pushes asset packs directly to the device without going through Play, enabling full local testing of Play Asset Delivery.

---

## recreate cordova — iOS

Tested with **cordova-ios 8.1.1**. Node >= 20.17.0, CocoaPods >= 1.16, Xcode 16+ required.

### 1. Rename existing ios-app as backup (if upgrading)

```bash
mv ios-app ios-app-old
```

### 2. Create fresh Cordova project

```bash
# from project root
cordova create ios-app com.issieshapiro.signlang IssieSign
cp ios-app-old/config.xml ios-app/config.xml   # carries preferences

cd ios-app
npm install cordova-ios@^8.1.1 --save-dev
cordova platform add ios
```

### 3. Add plugins

```bash
# from ios-app/
cordova plugin add cordova-plugin-file@^8.1.3
cordova plugin add cordova-plugin-camera@^8.0.0
cordova plugin add cordova-plugin-media-capture@^6.0.0
cordova plugin add cordova-plugin-share
cordova plugin add cordova-plugin-x-socialsharing
cordova plugin add cordova-plugin-splashscreen
cordova plugin add cordova-plugin-vibration
cordova plugin add ../GDrivePlugin/ \
  --variable IOS_REVERSED_CLIENT_ID=com.googleusercontent.apps.972582951029-7i2ipcpioalrfe0glkgp9udo5ne2fe0q \
  --variable IOS_CLIENT_ID=972582951029-7i2ipcpioalrfe0glkgp9udo5ne2fe0q.apps.googleusercontent.com
cordova plugin add ../PlayAssetsPlugin/
cordova plugin add cc.fovea.cordova.openwith@2.1.0 \
  --variable ANDROID_MIME_TYPE="image/*" \
  --variable IOS_URL_SCHEME=ccfoveaopenwithdemo \
  --variable IOS_UNIFORM_TYPE_IDENTIFIER=public.image \
  --variable ANDROID_EXTRA_ACTIONS=" "
```

### 4. Podfile

In `platforms/ios/Podfile` change `use_frameworks!` to `use_modular_headers!`:
```ruby
#use_frameworks!
use_modular_headers!
```

Then run:
```bash
cd platforms/ios && pod install
```

### 5. CDVWebViewEngine.m — add issie-file scheme

File: `platforms/ios/packages/cordova-ios/CordovaLib/Classes/Private/Plugins/CDVWebViewEngine/CDVWebViewEngine.m`

Just before `return configuration;` at the end of `createConfigurationFromSettings`, add:
```objc
[configuration setURLSchemeHandler:self forURLScheme:@"issie-file"];
```

Then add these three methods to the class (after the closing `}` of `createConfigurationFromSettings`):
```objc
- (NSURL *)changeURLScheme:(NSURL *)url toScheme:(NSString *)newScheme {
    NSURLComponents *components = [NSURLComponents componentsWithURL:url resolvingAgainstBaseURL:YES];
    components.scheme = newScheme;
    return components.URL;
}

- (void)webView:(WKWebView *)webView startURLSchemeTask:(id<WKURLSchemeTask>)urlSchemeTask {
    NSURL *fileURL = [self changeURLScheme:urlSchemeTask.request.URL toScheme:@"file"];
    NSURLRequest *req = [[NSURLRequest alloc] initWithURL:fileURL cachePolicy:NSURLRequestReloadIgnoringLocalCacheData timeoutInterval:.1];
    [[NSURLSession.sharedSession dataTaskWithRequest:req completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) { [urlSchemeTask didFailWithError:error]; return; }
        NSURLResponse *r = [[NSURLResponse alloc] initWithURL:urlSchemeTask.request.URL MIMEType:response.MIMEType expectedContentLength:data.length textEncodingName:nil];
        [urlSchemeTask didReceiveResponse:r];
        [urlSchemeTask didReceiveData:data];
        [urlSchemeTask didFinish];
    }] resume];
}

- (void)webView:(WKWebView *)webView stopURLSchemeTask:(id<WKURLSchemeTask>)urlSchemeTask {}
```

See `code-changes/CDVWebViewEngine.m.txt` for full context.

### 6. App-Info.plist — merge custom entries

In `platforms/ios/App/App-Info.plist` ensure the following are present (cordova-ios 8 auto-generates some of them):

- `NSAllowsArbitraryLoads: true` (replace the localhost-only ATS entry)
- `NSCameraUsageDescription` — "Use camera to capture new words"
- `NSMicrophoneUsageDescription` — "This app needs microphone access"
- `LSSupportsOpeningDocumentsInPlace: true`
- `CFBundleDocumentTypes` — zip import entry (see `code-changes/IssieSign-Info.plist`)
- `UILaunchStoryboardName` — `IssieSignLaunchScreen`
- `CFBundleURLTypes` — Google OAuth reversed client ID (auto-generated by GDrivePlugin)

### 7. Copy assets

```bash
# from project root
# App icons
cp -R code-changes/Images.xcassets/AppIcon.appiconset    ios-app/platforms/ios/App/Assets.xcassets/
cp -R code-changes/Images.xcassets/AppIconAR.appiconset  ios-app/platforms/ios/App/Assets.xcassets/

# Launch storyboard
cp code-changes/IssieSignLaunchScreen.storyboard ios-app/platforms/ios/App/Base.lproj/

# Header image
cp -R ios-app-old/platforms/ios/IssieSign/Images.xcassets/header.imageset \
       ios-app/platforms/ios/App/Assets.xcassets/
```

### 8. xcodeproj — build settings

In `platforms/ios/App.xcodeproj/project.pbxproj`, for both Debug and Release build configs add:

```
HEADER_SEARCH_PATHS = ("$(inherited)", "$(SRCROOT)/ShareExtension");
LD_RUNPATH_SEARCH_PATHS = ("$(inherited)", "@executable_path/Frameworks", "/usr/lib/swift");
```

Or set these in Xcode under Build Settings for the App target.

### 9. SceneDelegate.swift — fix window setup

cordova-ios 8's `CDVSceneDelegate` overrides `scene:willConnectTo:options:` without setting up the window, so the storyboard never loads. Override it in `platforms/ios/App/SceneDelegate.swift`:

```swift
import Cordova
import UIKit

class SceneDelegate: CDVSceneDelegate {
    override func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = (scene as? UIWindowScene) else { return }
        let storyboard = UIStoryboard(name: "Main", bundle: nil)
        let rootVC = storyboard.instantiateInitialViewController()!
        window = UIWindow(windowScene: windowScene)
        window.rootViewController = rootVC
        window.makeKeyAndVisible()
        super.scene(scene, willConnectTo: session, options: connectionOptions)
    }
}
```

### 10. Main.storyboard — disable Cordova splash overlay

In `platforms/ios/App/Base.lproj/Main.storyboard`, change `showSplashScreen` to `NO` so the iOS system launch screen handles the splash instead of Cordova's white overlay:

```xml
<userDefinedRuntimeAttribute type="boolean" keyPath="showSplashScreen" value="NO"/>
```

### 11. config.xml — set AutoHideSplashScreen and scheme

Ensure `config.xml` has:
```xml
<preference name="AutoHideSplashScreen" value="false" />
<preference name="scheme" value="app" />
<preference name="hostname" value="localhost" />
<preference name="iosExtraFilesystems" value="root" />
```

Note: `AutoHideSplashScreen=false` keeps Cordova's white overlay until `navigator.splashscreen.hide()` is called from JS after deviceready. The iOS system launch screen (`IssieSignLaunchScreen.storyboard`) shows the IssieSign branding briefly before the Cordova layer takes over.

### 12. Build and run make script

```bash
# from project root — builds React and copies to www:
./make/ios-make-he.sh

# rebuild (from ios-app/platforms/ios):
xcodebuild -workspace App.xcworkspace -scheme App -configuration Debug \
  -sdk iphonesimulator -destination "platform=iOS Simulator,name=iPhone 17 Pro" build
# → BUILD SUCCEEDED
```

### 13. Xcode — create Arabic target profile

Open `ios-app/platforms/ios/App.xcworkspace` in Xcode:
- Duplicate the `App` target → rename to `IssieSignArabic`
- Set Bundle Identifier: `com.issieshapiro.signlangarabic`
- Set version & build
- Change launch storyboard to `IssieSignArabicLaunchScreen`
- Change AppIcon to `AppIconAR`

Note: if you move the project from backup and get a CodeSign error: `xattr -rc /path/to/directory`

TODO: changes to add.js `cameraOption: correctOrientation: true` — not tested on iOS; essential for Android.

---

### Electron


#### Build/Run
- for debug `cordova run electron --nobuild`
- release `cordova build electron --release`


### Android

> See the **"recreate cordova — Android"** section for the full up-to-date setup guide (cordova-android 15, API 36).

Legacy notes (may be outdated):

<!-- - for the camera to work, add these files
```
package org.issieshapiro.signlang2;

public class BuildConfig {
    public static final String APPLICATION_ID = "org.issieshapiro.signlang2";
}
 

package com.issieshapiro.issiesignarabic; 
public class BuildConfig {
    public static final String APPLICATION_ID = "com.issieshapiro.issiesignarabic";
} -->

...
```

- android/app/src/main/AndroidManifest.xml: 
  ??- adjust `<manifest android:versionCode="10008"  ...`
  - add `< application ...android:usesCleartextTraffic="true" ... android:theme="@style/Theme.AppCompat.Light" ... android:icon="${appIcon}"`
  - modify `<activity ... android:name="com.issieshapiro.signlang.MainActivity">`
  - add intent-filter (for open with)
    ```
    <intent-filter android:label="Import Words" android:priority="1">
        <action android:name="android.intent.action.VIEW" />
        <action android:name="android.intent.action.EDIT" />
        <action android:name="android.intent.action.PICK" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:mimeType="*/*" />
        <data android:pathPattern="*.zip" />
    </intent-filter>
    ```
- see example androidManifest.xml in code_changes folder
- add the openwith plugin:
```
cordova plugin add cc.fovea.cordova.openwith \
  --variable ANDROID_MIME_TYPE="image/*" \
  --variable IOS_URL_SCHEME=ccfoveaopenwithdemo \
  --variable IOS_UNIFORM_TYPE_IDENTIFIER=public.image
```

- Create playassets folders:
  Copy `code-changes/AndroidAssets/issiesign_assets*` to `/platforms/android/`

- in `android/gradle.properties`, 
  - need to add java-home. for example:
  add `org.gradle.java.home=/usr/local/Cellar/openjdk/18.0.1.1/`
  - `android.enableJetifier=false`
  
- in `android/build.gradle`
- add in buildscript/dependencies: `classpath "com.google.gms:google-services:4.4.2"`
`

-  in `android/app/build.gradle`: 
  add at root
  ```
  apply plugin: 'com.google.gms.google-services'

  dependencies {
    implementation 'com.google.android.play:asset-delivery:2.2.2'
    implementation 'com.google.android.gms:play-services-auth:21.2.0'

    implementation 'com.squareup.okhttp3:okhttp:4.10.0'
    //implementation 'androidx.core:core-splashscreen:1.0.0-beta01'
    implementation 'com.google.apis:google-api-services-drive:v3-rev75-1.22.0'

    implementation platform('com.google.firebase:firebase-bom:33.1.2')
    implementation 'com.google.firebase:firebase-functions'
    implementation 'com.google.firebase:firebase-appcheck-playintegrity'
    implementation 'com.google.firebase:firebase-appcheck-debug:16.1.0'

    // Added due to a duplicate class error - try without
    implementation 'com.google.guava:listenablefuture:9999.0-empty-to-avoid-conflict-with-guava'
  }
  ```
  - near `android {}`

  - you need the keystore.properties file in the root of the android project
```
    def keystorePropertiesFile = rootProject.file("keystore.properties")
    def keystoreProperties = new Properties()
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))

    android {
            namespace cordovaConfig.PACKAGE_NAMESPACE
            assetPacks = [":issiesign_assets", ":issiesign_assets3"]

            signingConfigs {
                create("issiesign") {
                    keyAlias keystoreProperties['HEkeyAlias']
                    keyPassword keystoreProperties['HEkeyPassword']
                    storeFile file(keystoreProperties['HEstoreFile'])
                    storePassword keystoreProperties['HEstorePassword']
                }
                create("issiesignarabic") {
                    keyAlias keystoreProperties['ENkeyAlias']
                    keyPassword keystoreProperties['ENkeyPassword']
                    storeFile file(keystoreProperties['ENstoreFile'])
                    storePassword keystoreProperties['ENstorePassword']
                }
            }

            flavorDimensions "languages"

            productFlavors {
                issiesign {
                    namespace "org.issieshapiro.signlang2"
                    applicationId "org.issieshapiro.signlang2"
                    resValue "string", "app_name", "IssieSign"
                    manifestPlaceholders = [
                            appIcon: "@mipmap/ic_launcher",
                    ]
                    versionCode 10024
                    versionName "2.1.0"
                    signingConfig signingConfigs.issiesign
                }
                
                issiesignarabic {
                    namespace "com.issieshapiro.issiesignarabic"
                    applicationId "com.issieshapiro.issiesignarabic"
                    resValue "string", "app_name", "IssieSignArabic"
                    manifestPlaceholders = [
                            appIcon: "@mipmap/ic_launcher_ar",
                    ]
                    versionCode 10013
                    versionName "1.0.1"
                    signingConfig signingConfigs.issiesign
                }
            }
             defaultConfig {
                versionCode cdvVersionCode ?: new BigInteger("" + privateHelpers.extractIntFromManifest("versionCode"))
                applicationId cordovaConfig.PACKAGE_NAMESPACE

                minSdkVersion cordovaConfig.MIN_SDK_VERSION
                if (cordovaConfig.MAX_SDK_VERSION != null) {
                    maxSdkVersion cordovaConfig.MAX_SDK_VERSION
                }
                targetSdkVersion cordovaConfig.SDK_VERSION
                compileSdkVersion cordovaConfig.COMPILE_SDK_VERSION
            }

```
 
- in `platforms/android/settings.gradle`
  add
  ```
include ":issiesign_assets"
include ":issiesign_assets3"

  ```

  - verify file `platforms/android/local.properties` exists and has this key:

    `sdk.dir=</path to android sdk. e.g. on Mac ~/Library/Android/sdk>`
  

  - in ContentFileSystem.java , function toNativeUri
    first line: `String authorityAndPath = inputURL.uri.getEncodedPath().substring(12 + this.name.length() + 2);`
    - see [issue](https://github.com/apache/cordova-plugin-file/issues/525)
  ```
  
  - Copy `res` folder from `code-changes/AndroidAssets` to (replace) `platform/android/app/src/main/`

  - prepare a google-services.json as in "Setup oauth client for android"


  - In the IDE, select 'Generate Signed Bundle /APK' and set the following:
    RELEASE_STORE_FILE={path to your keystore [the file named `issieSign.jks`]}
    RELEASE_STORE_PASSWORD=signlang
    RELEASE_KEY_ALIAS=issiesign
    RELEASE_KEY_PASSWORD=signlang




## Run on simulator with react dev-server
- Change your config.xml and make <content src="..." /> point to your local-IP address and your dev-port, e.g. <content src="http://localhost:3000/index.html" />
- Add a whitelist entry (refer to cordova whitelist-plugin documentation for more details): e.g. <allow-navigation href="http://localhost:3000/*" />
- run `./scripts/prepareCDVLocal.sh`
- start the server `npm start`

- to revert, run `windownCDVLocalRun.sh`


## run on android emulator with PlayAssets
See "Run on Android emulator with Play Assets (bundletool)" section above.

## Android Signing keys:
IssieSign: 
  - issieSign.jks
  - SHA1: 3C:EA:48:E1:4D:23:C6:25:B6:EB:A5:4A:87:C6:01:62:9A:25:F8:08
  - `keytool -keystore googleplay/issieSign2.0.jks -list -v`
  - signlang

~~MyIssieSign~~ (no longer a standalone project — retired)

IssieSignArabic:
  - IssieSignArabic.jks 
  - SHA1: 95:8D:6A:5C:A8:81:3C:D7:AF:D5:D6:0F:8E:C4:13:4F:3E:AE:11:EA
  - `openssl pkcs12 -in googleplay/IssieSignArabic.jks -nokeys -out certificate.crt`
  - issiesign
  - `openssl x509 -noout -fingerprint -sha1 -inform pem -in certificate.crt`

Find the SHA1 of an aab file: `keytool -printcert -jarfile androidApp/platforms/android/app/issiesign/release/app-issiesign-release.aab`


## Setup oauth client for android:
In Android, the code only obtains Auth-code by the google lib. To convert it to access-token and refresh with refresh_token, a Firebase function is used in project MyIssieSign.

To setup the function, it needs the client id and secret as variable:
```
firebase functions:config:set oauth.client_id=<client-id>
firebase functions:config:set oauth.secret=<secret>
```

this is the Web-CLient-ID in GCP prohect IssieSign

In Addition, only registered apps IssieSign, MyIssieSign and IssieSignArabic may call this function. This is enforced by Firebase AppCheck.

For that, there are 3 apps of type android in MyIssieSign (Firebase).
Each App is created with the java-package and with SH1/SH256
For debug:
 - SH1 of the signing upload key. to find it base, build the APK
 - locate the APK
 - `keytool -printcert -jarfile <*.apk>`

For AppCheck, you need in addition to enable it, and provide the play's SH256. In addition a debug key. this is ommited into the logs by the debug-provider set in the code


- The code is using the WebClientID of the IssieSign project in GCP
- In addition, 2 android oauth-clients should be created in IssieSign project in GCP for each package/variant:
  - one with the SHA1 of the APK `keytool -printcert -jarfile <*.apk>` for debug
  - one with the SHA1 as shown in `https://play.google.com/console`, under Setup->App Integrity->AppSigning->SHA1 for release


- google-services.json under "app" folder
Download latest from Firebase MyIssieSign and reduce to look like below:
```
{
  "project_info": {
    "project_number": "821810142864",
    "project_id": "myissiesign",
    "storage_bucket": "myissiesign.appspot.com"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:821810142864:android:e7913c1db485f3dc450215",
        "android_client_info": {
          "package_name": "com.issieshapiro.issiesignarabic"
        }
      },
      "oauth_client": [
      ],
      "api_key": [
        {
          "current_key": "AIzaSyBvDloBhbVKTi1n7h_Ewk7WTXN9ja1144A"
        }
      ]
    },
    {
      "client_info": {
        "mobilesdk_app_id": "1:821810142864:android:ec47c87a9ea1458c450215",
        "android_client_info": {
          "package_name": "com.issieshapiro.myissiesign"
        }
      },
      "oauth_client": [
      ],
      "api_key": [
        {
          "current_key": "AIzaSyBvDloBhbVKTi1n7h_Ewk7WTXN9ja1144A"
        }
      ]
    },
    {
      "client_info": {
        "mobilesdk_app_id": "1:821810142864:android:0a66f34a4c7470cd450215",
        "android_client_info": {
          "package_name": "org.issieshapiro.signlang2"
        }
      },
      "oauth_client": [
        
      ],
      "api_key": [
        {
          "current_key": "AIzaSyBvDloBhbVKTi1n7h_Ewk7WTXN9ja1144A"
        }
      ]
    }
  ],
  "configuration_version": "1"
}
```

## Publish Android version

- Build android app:
  - run `./make/android-make-he.sh` or `./make/android-make-ar.sh` 
  - open Android Studio
    - Adjust the version in `build.gradle` in `productFlavors->issiesign`
    - Adjust the sdk version of Android (targetSdkVersion = **36**, compileSdkVersion = **36**) in `cdv-gradle-config.json`
    - Build -> Generate Singed Bundle... ->  Android App Budnle -> (release)
    - locate the aab file
- open `https://play.google.com/`
- create/edit the Internal release of IssieSign or IssieSignArabic
- upload the aab file