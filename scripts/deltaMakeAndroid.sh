npm run build
WWW="../cordova/IsraeliSignLanguage/platforms/android/app/src/main/assets/www"

rm -rf $WWW
mkdir $WWW

rm -rf ../build/videos
cp -R ../build/* $WWW

