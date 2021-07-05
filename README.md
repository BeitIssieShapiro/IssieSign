# IssieSign
אפליקציה ללימוד שפת הסימנים המכילה כ-600 מילים בעברית מעולמם של ילדים. האפליקציה כוללת תמונות וסרטונים ופותחה בשיתוף עם סאפ והמרכז לייעוץ טכנולוגי בבית איזי שפירא.

## Build instruction

- After cloning the project, you need to run at the root fo the project: `scripts/init.sh <password>`, password is kept secret and not in this git repo. as the repo admin...
- Install cordova: `npm install -g cordova`
- run `npm install`

### Run in Browser 
Note: some features won't work, as it requires device API such as filesystem

- run `npm start`
- browser will open with the App.
- On every file change, the browser will reload the App.

### Run in iOS simulator

- to run in ios simulator, you need a Mac and xcode installed
- run `script/make.sh`  
- Open xcode and open a workspace in `cordova/IsraeliSignLanguage/platforms/ios/IssieSign.xcworkspace`
- On the project Navigator left panel, select the root (IssieSign)
- In the "Signing" section, choose the Team (you would need to click on manage-account and add your appleId account before)
- choose a device (your connected iPad) and press the run button.
- You may get this error: "A valid provisioning profile for this executable was not found". In this case, goto File->project settings... and choose legacy build system. then re-run

### Run on iPad, connected via cable
- same as before, select the iPad as the device
- On first run, you need to verify the app: in Settings->General->Device Management->choose you e-mail and the verify the app.

  
## Build android
* `cd scripts`
* run `./deltaMakeAndroid.sh`
* Open android studio `cordova/IsraeliSignLanguage/platforms/android/<proj>` 
* set the signing info
    RELEASE_STORE_FILE={path to your keystore}
    RELEASE_STORE_PASSWORD=issiesign
    RELEASE_KEY_ALIAS=signlang
    RELEASE_KEY_PASSWORD=issiesign

* in `cordova/IsraeliSignLanguage/platforms/android/app/src/main/AndroidManifest.xml` promote the `versionCode` and `versionName` 
* in the studio - `build -> generate signed bundle`
* locate the bundle in filesystem and upload to google-play console

* to test locally (on physical device), connect an android device (play asset delivery does not work with simulator), then run `./local-test-android.sh`




## .jks file converion
* `keytool -importkeystore -srckeystore issieSign2.0.jks -destkeystore issieSign2.0.jks -deststoretype pkcs12` - converts the file to new format
* `openssl pkcs12 -in issieSign2.0.jks` - to show public and private key -> copy public key to sme file, then
* `openssl  rsa -in signlangpk.key  -pubout`
* result pk: MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmulIVIQPyeACvrQplkRWXQNT6v5VAZ/1Ysxm8Wq6ryy2/UcqCQRqX+jtnGsniyxcbBYg17KnEBCh1XNv6KuopnPzh6yCtLBYmlJUIYqmZ5nytU27QJE+rMPr9Jl7bEvfHKqvwzSrdCH1kwlSXUJj7IYjL92NjoorblsftGtYfez1K8oxRtM9qUzUOp4CLegWVb89iJdv0e486DvtSOaEuI4ok52oNOUfJEoekbLUpt7WjzOyOnDubYcOyk77idkG7t4mbc+kcnngKMpmwFBrw1M0W3oUjv1RsZxL+pdk/GIL07DVFkji4l2G1t9k5KtGK06GKujuHQ2BS1wL6TWCKQIDAQAB


MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmulIVIQPyeACvrQplkRWXQNT6v5VAZ/1Ysxm8Wq6ryy2/UcqCQRqX+jtnGsniyxcbBYg17KnEBCh1XNv6KuopnPzh6yCtLBYmlJUIYqmZ5nytU27QJE+rMPr9Jl7bEvfHKqvwzSrdCH1kwlSXUJj7IYjL92NjoorblsftGtYfez1K8oxRtM9qUzUOp4CLegWVb89iJdv0e486DvtSOaEuI4ok52oNOUfJEoekbLUpt7WjzOyOnDubYcOyk77idkG7t4mbc+kcnngKMpmwFBrw1M0W3oUjv1RsZxL+pdk/GIL07DVFkji4l2G1t9k5KtGK06GKujuHQ2BS1wL6TWCKQIDAQAB


# Licence
IssieSign is avaiable under the GPL Licence. See the following link: https://www.gnu.org/licenses/gpl-3.0.en.html