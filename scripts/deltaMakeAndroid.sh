npm run build
WWW="../cordova/IsraeliSignLanguage/platforms/android/app/src/main/assets/www"

rm -rf $WWW
mkdir $WWW

rm -rf ../cordova/IsraeliSignLanguage/platforms/android/issie-sign-play-assets/src/main/assets/videos
mv  ../build/videos ../cordova/IsraeliSignLanguage/platforms/android/issie-sign-play-assets/src/main/assets/
cp -R ../build/* $WWW

