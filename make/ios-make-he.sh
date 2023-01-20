echo 'export const gCurrentLanguage =  "he";\nexport const AppName = "IssieSign";\n' > ./src/current-language.js
cp -f jsons/he/mainJson.js src/mainJson.js

#media
rm -rf public/videos
rm -rf src/images/adt/*
cp -R ../IssieSign-MediaNew/images/he/ src/images/adt/
cp -R ../IssieSign-MediaNew/videos/he/prod public/videos

npm run build

rm cordovaApp/platforms/ios/www/precache-*.*
rm -rf cordovaApp/platforms/ios/www/static
cp -R build/* cordovaApp/platforms/ios/www
