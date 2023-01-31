# IssieSign
אפליקציה ללימוד שפת הסימנים המכילה כ-600 מילים בעברית מעולמם של ילדים. האפליקציה כוללת תמונות וסרטונים ופותחה בשיתוף עם סאפ והמרכז לייעוץ טכנולוגי בבית איזי שפירא.

## Build instruction

- After cloning the project, you need to run at the root fo the project: `scripts/init.sh <password>`, password is kept secret and not in this git repo. as the repo admin...
- Install cordova: `npm install -g cordova`
- run `npm install`

### Run in Browser 
Note: some features won't work, as it requires device API such as filesystem

- change `window.isBrowser = true`
- comment out `<script type="text/javascript" charset="utf-8" src="cordova.js"></script>`

- run `npm start`
- browser will open with the App.
- On every file change, the browser will reload the App.

### Run in iOS simulator

- to run in ios simulator, you need a Mac and xcode installed
- run `./scripts/make.sh`  
- Open xcode and open a workspace in `cordova/IsraeliSignLanguage/platforms/ios/IssieSign.xcworkspace`
- On the project Navigator left panel, select the root (IssieSign)
- In the "Signing" section, choose the Team (you would need to click on manage-account and add your appleId account before)
- choose a device (your connected iPad) and press the run button.
- You may get this error: "A valid provisioning profile for this executable was not found". In this case, goto File->project settings... and choose legacy build system. then re-run

### Run on iPad, connected via cable
- same as before, select the iPad as the device
- On first run, you need to verify the app: in Settings->General->Device Management->choose you e-mail and the verify the app.

  
## Build android
* run `./make/android-make-<variant: en | ar | he>.sh`
* Open android studio `androidApp/platforms/android/<proj>` 

* in `build.gradle` promote the `versionCode` and `versionName` 
* in the studio - `build -> generate signed bundle`
* set the right signing key
* locate the bundle in filesystem and upload to google-play console



# Licence
IssieSign is avaiable under the GPL Licence. See the following link: https://www.gnu.org/licenses/gpl-3.0.en.html


## recreate cordova

- start a new cordova app : recommended to keep one app for android and one for ios
```
cordova create app com.issieshapiro.signlang IssieSign
cd app
cordova plugin add cordova-plugin-file
cordova plugins add cordova-plugin-camera
cordova plugins add cordova-plugin-media-capture
cordova plugins add cordova-plugin-share
cordova plugins add cordova-plugin-x-socialsharing
cordova plugins add ../GDrivePlugin/ --variable IOS_REVERSED_CLIENT_ID=com.googleusercontent.apps.YOUR_CLIENT_ID --variable IOS_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
cordova plugins add ../PlayAssetsPlugin/
```


- Fix cordova.xml:
  - description and author
  - copy the icons section to the platform ios and the folder "resources" to the cordova app's root
  - replace (make sure only once)  - `<preference name="AllowInlineMediaPlayback" value="true" />`

- add ios and android
```
cordova platform add ios
cordova platform add android
```

- Add the cordova folder to the .gitignore

### IOS
- Open xcode and the ios project
//  - copy from `Images.xcassets` the `header`
//  - replace AppIcon
Under "Resources"
  - copy the Storyboard from code-changes (copy , create group)
  - Copy IssieSign-info.plist (copy , create group)
  - Change code of CDVWebViewEngine.m to include `issie-file` scheme - see `code-changes/CDVWebViewEngine.m.txt`


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


### Android
- Import project (app/platforms/android)


- android/app/src/main/AndroidManifest.xml: 
  - adjust `<manifest android:versionCode="10008"  package="$applicationId" ...`
  - add `< application ...android:usesCleartextTraffic="true" android:label="@string/app_name"...`
  - modify `<activity ... android:name="com.issieshapiro.issiesign.MainActivity">`
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


- Create playassets folders:
  Copy `code-changes/AndroidAssets/issiesign_assets*` to `/platforms/android/`

- in `android/gradle.properties`
  add `org.gradle.java.home=/usr/local/Cellar/openjdk/18.0.1.1/`

- in `android/build.grade`
- add i buildscript/dependencies: `classpath 'com.google.gms:google-services:4.3.14'`
`

-  in `android/app/build.gradle`: 
  add at root
  ```
  apply plugin: 'com.google.gms.google-services'

  dependencies {
     implementation 'com.google.android.play:core:1.10.3'
    implementation 'com.google.android.gms:play-services-auth:20.4.1'

    implementation 'com.squareup.okhttp3:okhttp:4.10.0'
    //implementation 'androidx.core:core-splashscreen:1.0.0-beta01'
    implementation 'com.google.apis:google-api-services-drive:v3-rev75-1.22.0'

    implementation platform('com.google.firebase:firebase-bom:31.1.1')
    implementation 'com.google.firebase:firebase-functions'
    implementation 'com.google.firebase:firebase-appcheck-playintegrity'
    implementation 'com.google.firebase:firebase-appcheck-debug:16.1.0'
  }
  ```
  - in `android {}`
  ```
    assetPacks = [":issiesign_assets", ":issiesign_assets3"]

    signingConfigs {
        debug {
            storeFile file('<location><file.jks')
            storePassword '<pwd>'
            keyAlias = '<alias>'
            keyPassword '<pwd>'
        }
        release {
            storeFile file('<location><file.jks')
            storePassword '<pwd>'
            keyAlias = '<alias>'
            keyPassword '<pwd>'
        }
    }

    flavorDimensions "languages"

    productFlavors {
        issiesign {
            applicationId "org.issieshapiro.signlang2"
            resValue "string", "app_name", "IssieSign"
            versionCode 10000
            versionName "2.0.0"
        }
        myissiesign {
            applicationId "com.issieshapiro.myissiesign"
            resValue "string", "app_name", "MyIssieSign"
            versionCode 10004
            versionName "1.0.0"
        }
        issiesignarabic {
            applicationId "com.issieshapiro.issiesignarabic"
            resValue "string", "app_name", "IssieSignArabic"
            versionCode 10009
            versionName "1.0.0"
        }
    }

    ```
 
- in `platforms/android/settings.gradle`
  add
  ```
include ":issiesign_assets"
include ":issiesign_assets3"

  ```

  - add new file `platforms/android/local.properties`

    `sdk.dir=</path to android sdk. e.g. on Mac ~/Library/Android/sdk>`
  
  - in ContentFileSystem.java , function toNativeUri
    first line: `String authorityAndPath = inputURL.uri.getEncodedPath().substring(12 + this.name.length() + 2);`
    - see [issue](https://github.com/apache/cordova-plugin-file/issues/525)
  ```
  
  - in `platforms/android/cdv-gradle-config.json`
    set version of android to 31 `"SDK_VERSION": 31`,

  - Copy `res` folder from `code-changes/AndroidAssets` to (replace) `platform/android/app/src/main/`

  - In the IDE, select 'Generate Signed Bundle /APK' and set the following:
    RELEASE_STORE_FILE={path to your keystore [the file named `issieSign2.0.jks`]}
    RELEASE_STORE_PASSWORD=signland
    RELEASE_KEY_ALIAS=issiesign
    RELEASE_KEY_PASSWORD=signland



## iOS: Create IssieSign, MyIssieSign, IssieSignArabic
- Duplicate the target and rename as needed
- Change bundle identified and version/build
- Change info->bundle display name
- Duplicate IssieLaunchScreen.storyboard and change as needed
- Change info->Launch screen interface base file name



## Run on simulator with react dev-server
- Change your config.xml and make <content src="..." /> point to your local-IP address and your dev-port, e.g. <content src="http://localhost:3000/index.html" />
- Add a whitelist entry (refer to cordova whitelist-plugin documentation for more details): e.g. <allow-navigation href="http://localhost:3000/*" />
- run `./scripts/prepareCDVLocal.sh`
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

- The code is using the WebClientID of the IssieSign project in GCP
- In addition, 2 android oauth-clients should be created in  IssieSign project in GCP for each package/variant:
  - one with the SHA1 of the aab as it was signed on the developer machine
  - one with the SHA1 as shown in `https://play.google.com/console`, under Setup->App Integrity->AppSigning->SHA1 


Note2: After uploading to PlayStore:
- In Firebase, an android app should match the app (same package) and with the 2x SHA1
- In Firebase AppCheck, also add the SHA256 from the PlayStore

- google-services.json
client type 3 must be the web client id 
client type 1 is the android app (maybe has no effect...)
```
"client_info": {
        "mobilesdk_app_id": "1:821810142864:android:76ace3241b973661450215",
        "android_client_info": {
          "package_name": "com.issieshapiro.issiesignarabic"
        }
      },
      "oauth_client": [
        {
          "client_id": "972582951029-e7t8l63hrpg2beg1gbt5vq0i87bdm1tj.apps.googleusercontent.com",
          "client_type": 3
        },
        {
          "client_id": "972582951029-kcdh38amck77mt4iraj3jt3u4ppu7i74.apps.googleusercontent.com",
          "client_type": 1
        }
      ],
```
