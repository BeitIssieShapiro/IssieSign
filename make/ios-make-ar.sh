echo 'export const gCurrentLanguage =  "ar";\nexport const AppName = "IssieSignArabic";\n' > ./src/current-language.js
cp -f jsons/ar/mainJson.js src/mainJson.js

rm -rf public/videos
rm -rf src/images/adt/*
cp -R ../IssieSign-MediaNew/images/ar/ src/images/adt/
cp -R ../IssieSign-MediaNew/videos/ar/prod public/videos

npm run build

rm cordovaApp/platforms/ios/www/precache-*.*
rm -rf cordovaApp/platforms/ios/www/videos
rm -rf cordovaApp/platforms/ios/www/static

cp -R build/* cordovaApp/platforms/ios/www

