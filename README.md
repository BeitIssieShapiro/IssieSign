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


## recreate cordova

- start a new cordova app : recommended to keep one app for android and one for ios
```
cordova create <ios-app | android-app> com.issieshapiro.signlang IssieSign
cd <ios-app | android-app>
cordova plugins add cordova-plugin-file
cordova plugins add cordova-plugin-camera
cordova plugins add cordova-plugin-media-capture
cordova plugins add cordova-plugin-share
cordova plugins add cordova-plugin-x-socialsharing
cordova plugin add cordova-plugin-splashscreen
# take the client id of the IOS for prod from IssieSign project's API's Credentials in GCP
cordova plugins add ../GDrivePlugin/ --variable IOS_REVERSED_CLIENT_ID=com.googleusercontent.apps.972582951029-7i2ipcpioalrfe0glkgp9udo5ne2fe0q --variable IOS_CLIENT_ID=972582951029-7i2ipcpioalrfe0glkgp9udo5ne2fe0q.apps.googleusercontent.com


cordova plugins add ../PlayAssetsPlugin/
```


- Fix config.xml:
  - description and author
  - add 
```
    <preference name="AllowInlineMediaPlayback" value="true" />
    <preference name="AutoHideSplashScreen" value="false" />


    <preference name="scheme" value="cdvfile" />
    <preference name="hostname" value="localhost" />
    <preference name="iosExtraFilesystems" value="root" />
```

- for iOS: install cocoapods: https://cocoapods.org/
- add the platfrom: `cordova platform add <ios | android>`
- Add the cordova folder to the .gitignore


### IOS

- change Podfile:
```
#use_frameworks!
use_modular_headers!
```
- run pod install in the `platforms/ios` folder

- copy `code-changes/Images.xcassets/` AppIcon.appiconset and AppIconAR.appiconset 
- todo: add header icon for launch
- Open xcode and the ios project
- Under "Resources"
  - copy the Storyboard from code-changes (copy , create group)
  - Copy IssieSign-info.plist contents into the one created by cordova (open as source)
- Change code of CDVWebViewEngine.m to include `issie-file` scheme - see `code-changes/CDVWebViewEngine.m.txt`
- In `Build-Settings->Runpath Search Paths` add `/usr/lib/swift`. make sure for both debug and release.

  - Create Arabic profile:
    - duplicate IssieSign profile
    - set Display Name: `IssieSignArabic`
    - set Bundle Identifier: `com.issieshapiro.signlangarabic`
    - set version & build
    - change launch storyboard
    - change appicon and header

  - Create MyIssieSign profile:
    - duplicate IssieSign profile
    - set Display Name: `MyIssieSign`
    - set Bundle Identifier: `com.issieshapiro.myissiesign`
    - set version & build
    - change launch storyboard
    - change appicon and header

Note: if you move the whole project from backup, you may get an error os CodeSign. in this case removing all xattr helped: `xattr -rc /path/to/directory` 

### Electron


#### Build/Run
- for debug `cordova run electron --nobuild`
- release `cordova build electron --release`


### Android
- Import project (app/platforms/android)

- in MainActivity.java
  add `getSupportActionBar().hide();` before `loadUrl` - to hide a redundent header

- for the camera to work, add these files
```
package org.issieshapiro.signlang2;

public class BuildConfig {
    public static final String APPLICATION_ID = "org.issieshapiro.signlang2";
}
 

package com.issieshapiro.issiesignarabic; 
public class BuildConfig {
    public static final String APPLICATION_ID = "com.issieshapiro.issiesignarabic";
}

package com.issieshapiro.myissiesign; 
public class BuildConfig {
    public static final String APPLICATION_ID = "com.issieshapiro.myissiesign";
}

...
```

- android/app/src/main/AndroidManifest.xml: 
  ??- adjust `<manifest android:versionCode="10008"  package="$applicationId" ...`
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
- add in buildscript/dependencies: `classpath "com.google.gms:google-services:4.3.14"`
`

-  in `android/app/build.gradle`: 
  add at root
  ```
  apply plugin: 'com.google.gms.google-services'

  dependencies {
    //implementation 'com.google.android.play:core:1.10.3'
    implementation 'com.google.android.gms:play-services-auth:20.4.1'

    implementation 'com.squareup.okhttp3:okhttp:4.10.0'
    //implementation 'androidx.core:core-splashscreen:1.0.0-beta01'
    implementation 'com.google.apis:google-api-services-drive:v3-rev75-1.22.0'

    implementation platform('com.google.firebase:firebase-bom:31.1.1')
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
                create("myissiesign") {
                    keyAlias keystoreProperties['ENkeyAlias']
                    keyPassword keystoreProperties['ENkeyPassword']
                    storeFile file(keystoreProperties['ENstoreFile'])
                    storePassword keystoreProperties['ENstorePassword']
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
                    applicationId "org.issieshapiro.signlang2"
                    resValue "string", "app_name", "IssieSign"
                    manifestPlaceholders = [
                            appIcon: "@mipmap/ic_launcher",
                    ]
                    versionCode 10024
                    versionName "2.1.0"
                    signingConfig signingConfigs.issiesign
                }
                myissiesign {
                    applicationId "com.issieshapiro.myissiesign"
                    resValue "string", "app_name", "My IssieSign"
                    manifestPlaceholders = [
                            appIcon: "@mipmap/ic_launcher_en",
                    ]
                    versionCode 10005
                    versionName "1.0.0"
                    signingConfig signingConfigs.myissiesign
                }
                issiesignarabic {
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
        ...

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
  
  - in `platforms/android/cdv-gradle-config.json`
    set version of android to 31 `"SDK_VERSION": 31`,

  - Copy `res` folder from `code-changes/AndroidAssets` to (replace) `platform/android/app/src/main/`

  - prepare a google-services.json as in "Setup oauth client for android"


  - In the IDE, select 'Generate Signed Bundle /APK' and set the following:
    RELEASE_STORE_FILE={path to your keystore [the file named `issieSign2.0.jks`]}
    RELEASE_STORE_PASSWORD=signland
    RELEASE_KEY_ALIAS=issiesign
    RELEASE_KEY_PASSWORD=signland



## Run on simulator with react dev-server
- Change your config.xml and make <content src="..." /> point to your local-IP address and your dev-port, e.g. <content src="http://localhost:3000/index.html" />
- Add a whitelist entry (refer to cordova whitelist-plugin documentation for more details): e.g. <allow-navigation href="http://localhost:3000/*" />
- run `./scripts/prepareCDVLocal.sh`
- start the server `npm start`

- to revert, run `windownCDVLocalRun.sh`


## run on android emulator with PlayAssets
Create a bundle for debug, and debug on the emulator. this will trigger download of the assets

## Android Signing keys:
IssieSign: 
  - issieSign.jks
  - SHA1: 3C:EA:48:E1:4D:23:C6:25:B6:EB:A5:4A:87:C6:01:62:9A:25:F8:08
  - `keytool -keystore googleplay/issieSign2.0.jks -list -v`
  - signlang
MyIssieSign: 
  - MyIssieSign.jks 
  - SHA1: BA:B0:41:80:6C:EE:A8:00:D4:DD:06:64:5A:94:89:AA:1F:0B:2E:0A
  - `openssl pkcs12 -in  googleplay/MyIssieSign.jks -nokeys -out certificate.crt`
  - signlang
  - `openssl x509 -noout -fingerprint -sha1 -inform pem -in certificate.crt`

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

