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


# Licence
IssieSign is avaiable under the GPL Licence. See the following link: https://www.gnu.org/licenses/gpl-3.0.en.html


## recreate cordova

- start a new cordova app
```
cordova create app com.issieshapiro.signlang IssieSign
cd app
cordova plugin add cordova-plugin-file
cordova plugins add cordova-plugin-camera
cordova plugins add cordova-plugin-media-capture
cordova plugins add cordova-plugin-share
cordova plugins add cordova-plugin-x-socialsharing
cordova plugins add ../GDrivePlugin/
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
under "Resoutrces"
  - copy the CDVLaunchStoryboard (copy , create group)
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
- android/app/src/main/AndroidManifest.xml: `android:versionCode="21" android:versionName="1.1.11"` - adjust version
- Install playassets own plugin:
  - in `cordova/app/platforms/android/android.json`
    - add 
    ```
      "config_munge": {
    "files": {
       "res/xml/config.xml": {
         "parents": {
           "/*": [
             {
               "xml": "<feature name=\"PlayAssets\"><param name=\"android-package\" value=\"bentu.playassets.PlayAssets\" /><param name=\"onload\" value=\"true\" /></feature>",
               "count": 1
             },
    ```
    - add
    ```
    },
     "cordova-plugin-assets": {
       "PACKAGE_NAME": "com.issieshapiro.signlang"
     }
    ```
    - add 
    ```
    "modules": [
     {
       "id": "cordova-plugin-assets.PlayAssets",
       "file": "plugins/cordova-plugin-assets/www/playassets.js",
       "pluginId": "cordova-plugin-assets",
       "clobbers": [
         "window.PlayAssets"
       ]
     },
     ```
  - in `cordova/app/platforms/android/platform_www/cordova_plugins.js`
    - add
    ```
    {
       "id": "cordova-plugin-assets.PlayAssets",
       "file": "plugins/cordova-plugin-assets/www/playassets.js",
       "pluginId": "cordova-plugin-assets",
       "clobbers": [
         "window.PlayAssets"
       ]
     },
    ```
  - copy `code-changes/AndroidAssets/cordova-plugin-assets` to `cordova/app/platforms/android/platform_www/plugins/`
  - copy `code-changes/AndroidAssets/bentu` to  `cordova/IsraeliSignLanguage/platforms/android/app/src/main/java/`
  - in `cordova/app/platforms/android/app/src/main/res/xml/config.xml`
    - add
    ```
     <feature name="PlayAssets">
         <param name="android-package" value="bentu.playassets.PlayAssets" />
     </feature>
    ```
- Create playassets folders:
  - Copy `code-changes/AndroidAssets/issiesign_assets*` to `cordova/app/platforms/android/`
-  in `android/app/build.gradle`: 
  - add at root
  ```
  dependencies {
        implementation 'com.google.android.play:core:1.10.0'
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
  - in `platforms/android/project.properties`:
    add
    ```
    android.library.reference.3=:issiesign_assets
    android.library.reference.4=:issiesign_assets3

    ```
  - add new file at root `local.properties`
    `sdk.dir=/home/myFolder/androidSdk`
  - CameraLauncher: 
  ```
  //import android.support.v4.content.FileProvider;
  ```
  - Camera/FileProvider
  ```
  public class FileProvider extends androidx.core.content.FileProvider {}
  ```
  - set the signing info ??
    RELEASE_STORE_FILE={path to your keystore}
    RELEASE_STORE_PASSWORD=issiesign
    RELEASE_KEY_ALIAS=signlang
    RELEASE_KEY_PASSWORD=issiesign


## Run on simulator with react dev-server
- Change your config.xml and make <content src="..." /> point to your local-IP address and your dev-port, e.g. <content src="http://localhost:3000/index.html" />
- Add a whitelist entry (refer to cordova whitelist-plugin documentation for more details): e.g. <allow-navigation href="http://localhost:3000/*" />
- run `./scripts/prepareCDVLocal.sh`
- to revert, run `windownCDVLocalRun.sh`