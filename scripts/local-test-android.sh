
##First build a debug bundle
rm output.apks
export ANDROID_HOME=/Users/i022021/Library/Android/sdk/
java -jar bundletool-all.jar build-apks --bundle=../cordova/IsraeliSignLanguage/platforms/android/app/release/app-release.aab --output=output.apks --local-testing \
--ks=../googleplay/issieSign2.0.jks \
--ks-pass=pass:signlang \
--ks-key-alias=issiesign \
--key-pass=pass:signlang \

java -jar bundletool-all.jar install-apks --apks=output.apks 
