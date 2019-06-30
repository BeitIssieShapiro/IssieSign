# IssieSign
אפליקציה ללימוד שפת הסימנים המכילה כ-600 מילים בעברית מעולמם של ילדים. האפליקציה כוללת תמונות וסרטונים ופותחה בשיתוף עם סאפ והמרכז לייעוץ טכנולוגי בבית איזי שפירא.

## Build instraction

* After cloning the project, you need to run at the root fo the project: `scripts/init.sh <password>`, password is kept secret and not in this git repo. as the repo admin...
* you need also to install cordova: `npm install -g cordova`
* run in the root prject`./make.sh` (linux/bash) 
* for other than ios, run `cordova platform remove android` and then `cordova platform add android`

* to run in ios simulator, you need xcode installed, then:
  * in ./cordova/IsraeliSignLanguage/ run `cordova run ios`
  
* to install on iPad, after running the make.sh:
  * Open xcode and open a workspace in `cordova/IsraeliSignLanguage/platforms/ios/IssieSign.xcworkspace`
  * On the project Navigator left panel, select the root (IssieSign)
  * In the "Signing" section, choose the Team (you would need to click on manage-account and add your appleId account before)
  * choose a device (your connected iPad) and press the run button.
  * You may get this error: "A valid provisioning profile for this executable was not found". In this case, goto File->project settings... and choose legacy build system. then re-run
  * On first run, you need to verify the app: in Settings->General->Device Management->choose you e-mail and the verify the app.
  
## Build android
* run `scripts/makeAndroid.sh`
* Open android studio `cordova/IsraeliSignLanguage/platforms/android/<proj>`
* Manually create file named `gradle.properties`, with the following:
```
    org.gradle.jvmargs=-Xmx4608M
    
    RELEASE_STORE_FILE={path to your keystore}
    RELEASE_STORE_PASSWORD=<ask the team for password>
    RELEASE_KEY_ALIAS=signlang
    RELEASE_KEY_PASSWORD=<ask the team for password>
```
* in the studio - build APK
* 

# Licence
IssieSign is avaiable under the GPL Licence. See the following link: https://www.gnu.org/licenses/gpl-3.0.en.html