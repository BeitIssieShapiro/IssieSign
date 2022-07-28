
echo 'export const gCurrentLanguage =  "en";\nexport const AppName = "MyIssieSign";\n' > ./src/current-language.js
cp -f jsons/en/mainJson.js src/mainJson.js
cp -R ../IssieSign-Media/images/en/ src/images/adt/

npm run build

WWW="cordovaApp/platforms/android/app/src/main/assets/www"

rm -rf $WWW
mkdir $WWW
cp -R cordovaApp/platforms/android/platform_www/* $WWW/
rm cordovaApp/platforms/android/issiesign_assets/src/main/assets/videos/*
rm cordovaApp/platforms/android/issiesign_assets3/src/main/assets/videos/*

mkdir -p ./cordovaApp/platforms/android/issiesign_assets/src/main/assets/videos
mkdir -p ./cordovaApp/platforms/android/issiesign_assets3/src/main/assets/videos/

#cp -R ../IssieSign-Media/videos/he/prod/[א-י]*   ./cordovaApp/platforms/android/issiesign_assets/src/main/assets/videos/
#cp -R ../IssieSign-Media/videos/he/prod/[כ-ת]*  ./cordovaApp/platforms/android/issiesign_assets3/src/main/assets/videos/

# MyIssieSign: copy the tutorials directly as it is not large
cp -R ../IssieSign-Media/videos/en/prod/   ./cordovaApp/platforms/android/app/src/main/assets/videos/

cp -R build/* $WWW

