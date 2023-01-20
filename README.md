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
* run `./scripts/deltaMakeAndroid.sh`
* Open android studio `cordova/app/platforms/android/<proj>` 

* in `cordova/app/platforms/android/app/src/main/AndroidManifest.xml` promote the `versionCode` and `versionName` 
* in the studio - `build -> generate signed bundle`
* locate the bundle in filesystem and upload to google-play console

* to test locally (on physical device), connect an android device (play asset delivery does not work with simulator), then run `./local-test-android.sh`

## Test android locally
- build app-bundle
- Launch emulator or connect a device
```
cd scripts
./local-test-android.sh
```


## .jks file converion
* `keytool -importkeystore -srckeystore issieSign2.0.jks -destkeystore issieSign2.0.jks -deststoretype pkcs12` - converts the file to new format
* `openssl pkcs12 -in issieSign2.0.jks` - to show public and private key -> copy public key to sme file, then
* `openssl  rsa -in signlangpk.key  -pubout`
* result pk: MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmulIVIQPyeACvrQplkRWXQNT6v5VAZ/1Ysxm8Wq6ryy2/UcqCQRqX+jtnGsniyxcbBYg17KnEBCh1XNv6KuopnPzh6yCtLBYmlJUIYqmZ5nytU27QJE+rMPr9Jl7bEvfHKqvwzSrdCH1kwlSXUJj7IYjL92NjoorblsftGtYfez1K8oxRtM9qUzUOp4CLegWVb89iJdv0e486DvtSOaEuI4ok52oNOUfJEoekbLUpt7WjzOyOnDubYcOyk77idkG7t4mbc+kcnngKMpmwFBrw1M0W3oUjv1RsZxL+pdk/GIL07DVFkji4l2G1t9k5KtGK06GKujuHQ2BS1wL6TWCKQIDAQAB


MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmulIVIQPyeACvrQplkRWXQNT6v5VAZ/1Ysxm8Wq6ryy2/UcqCQRqX+jtnGsniyxcbBYg17KnEBCh1XNv6KuopnPzh6yCtLBYmlJUIYqmZ5nytU27QJE+rMPr9Jl7bEvfHKqvwzSrdCH1kwlSXUJj7IYjL92NjoorblsftGtYfez1K8oxRtM9qUzUOp4CLegWVb89iJdv0e486DvtSOaEuI4ok52oNOUfJEoekbLUpt7WjzOyOnDubYcOyk77idkG7t4mbc+kcnngKMpmwFBrw1M0W3oUjv1RsZxL+pdk/GIL07DVFkji4l2G1t9k5KtGK06GKujuHQ2BS1wL6TWCKQIDAQAB


play's MyIssieSign SHA1: 4B:09:C4:C8:C4:48:D4:27:5E:7F:2E:62:54:E4:D9:C7:FA:48:F1:4C



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

- Copy `src`, `public`, ...
- run `npm install`
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


- android/app/src/main/AndroidManifest.xml: `android:versionCode="10001" android:versionName="1.1.11"` 
  - adjust version
  - add `< application ...android:usesCleartextTraffic="true" ...`
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
    implementation 'com.google.android.gms:play-services-auth:20.4.0'

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
            storeFile file('<location>issieSign2.0.jks')
            storePassword 'signlang'
            keyAlias = 'issiesign'
            keyPassword 'signlang'
        }
        release {
            storeFile file('<location>/issieSign2.0.jks')
            storePassword 'signlang'
            keyAlias = 'issiesign'
            keyPassword 'signlang'
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



## Create IssieSign, MyIssieSign, IssieSignArabic (iOs)
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