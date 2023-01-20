
echo 'export const gCurrentLanguage =  "en";\nexport const AppName = "MyIssieSign";\n' > ./src/current-language.js
cp -f jsons/en/mainJson.js src/mainJson.js

# images
rm -rf src/images/adt/*
cp -R ../IssieSign-MediaNew/images/en/ src/images/adt/

rm -rf public/videos
npm run build

WWW="androidApp/platforms/android/app/src/main/assets/www"

 rm -rf $WWW/css
 rm -rf $WWW/img
 rm -rf $WWW/js
 rm $WWW/index.html

# mkdir $WWW
# cp -R androidApp/platforms/android/platform_www/* $WWW/

rm androidApp/platforms/android/issiesign_assets/src/main/assets/videos/*
rm androidApp/platforms/android/issiesign_assets3/src/main/assets/videos/*

mkdir -p ./androidApp/platforms/android/issiesign_assets/src/main/assets/videos
mkdir -p ./androidApp/platforms/android/issiesign_assets3/src/main/assets/videos/

#cp -R ../IssieSign-Media/videos/he/prod/[א-י]*   ./androidApp/platforms/android/issiesign_assets/src/main/assets/videos/
#cp -R ../IssieSign-Media/videos/he/prod/[כ-ת]*  ./androidApp/platforms/android/issiesign_assets3/src/main/assets/videos/

# MyIssieSign: copy the tutorials directly as it is not large
cp -R ../IssieSign-MediaNew/videos/en/prod/   ./androidApp/platforms/android/app/src/main/assets/videos/

cp -R build/* $WWW

