npm run build
WWW="../cordova/IsraeliSignLanguage/platforms/android/app/src/main/assets/www"

rm -rf $WWW
mkdir $WWW
cp -R ../cordova/IsraeliSignLanguage/platforms/android/platform_www/* ../cordova/IsraeliSignLanguage/platforms/android/app/src/main/assets/www/
rm ../cordova/IsraeliSignLanguage/platforms/android/issiesign_assets/src/main/assets/videos/*
rm ../cordova/IsraeliSignLanguage/platforms/android/issiesign_assets3/src/main/assets/videos/*

cp -R ../Ext-Media/videos/he/prod/[א-י]*   ../cordova/IsraeliSignLanguage/platforms/android/issiesign_assets/src/main/assets/videos/
cp -R ../Ext-Media/videos/he/prod/[כ-ת]*  ../cordova/IsraeliSignLanguage/platforms/android/issiesign_assets3/src/main/assets/videos/


#mv  ../build/videos ../cordova/IsraeliSignLanguage/platforms/android/issiesign_assets/src/main/assets/
cp -R ../build/* $WWW

