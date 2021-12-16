
echo 'export const gCurrentLanguage =  "he"' > ./src/current-language.js
cp -f jsons/he/mainJson.js src/mainJson.js
cp -R ../IssieSign-Media/images/he/ src/images/adt/

npm run build

WWW="cordova/app/platforms/android/app/src/main/assets/www"

rm -rf $WWW
mkdir $WWW
cp -R cordova/app/platforms/android/platform_www/* $WWW/
rm cordova/app/platforms/android/issiesign_assets/src/main/assets/videos/*
rm cordova/app/platforms/android/issiesign_assets3/src/main/assets/videos/*

mkdir -p ./cordova/app/platforms/android/issiesign_assets/src/main/assets/videos
mkdir -p ./cordova/app/platforms/android/issiesign_assets3/src/main/assets/videos/

cp -R ../IssieSign-Media/videos/he/prod/[א-י]*   ./cordova/app/platforms/android/issiesign_assets/src/main/assets/videos/
cp -R ../IssieSign-Media/videos/he/prod/[כ-ת]*  ./cordova/app/platforms/android/issiesign_assets3/src/main/assets/videos/

cp -R build/* $WWW

