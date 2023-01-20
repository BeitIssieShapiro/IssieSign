echo 'export const gCurrentLanguage =  "en";\nexport const AppName = "MyIssieSign";\n' > ./src/current-language.js
cp -f jsons/en/mainJson.js src/mainJson.js

#media
rm -rf public/videos
rm -rf src/images/adt/*
cp -R ../IssieSign-MediaNew/images/en/ src/images/adt/
cp -R ../IssieSign-MediaNew/videos/en/prod public/videos

npm run build

rm cordovaApp/platforms/ios/www/precache-*.*
rm -rf cordovaApp/platforms/ios/www/static
cp -R build/* cordovaApp/platforms/ios/www
