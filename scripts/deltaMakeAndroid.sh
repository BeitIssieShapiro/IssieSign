npm run build
WWW="../cordova/IsraeliSignLanguage/platforms/android/app/src/main/assets/www"

rm -rf $WWW
mkdir $WWW
rm -rf ../cordova/IsraeliSignLanguage/platforms/android/issiesign_assets/src/main/assets/videos
cp -R ../cordova/IsraeliSignLanguage/platforms/android/platform_www/* ../cordova/IsraeliSignLanguage/platforms/android/app/src/main/assets/www/
mv  ../build/videos ../cordova/IsraeliSignLanguage/platforms/android/issiesign_assets/src/main/assets/
cp -R ../build/* $WWW

