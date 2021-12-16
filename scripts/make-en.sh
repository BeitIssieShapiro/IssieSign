echo 'export const gCurrentLanguage =  "en"' > ./src/current-language.js
cp -f jsons/en/mainJson.js src/mainJson.js
cp -R ../IssieSign-Media/images/en/ src/images/adt/

rm -rf public/videos
cp -R ../IssieSign-Media/videos/en/prod public/videos

npm run build

rm cordova/app/platforms/ios/www/precache-*.*
rm -rf cordova/app/platforms/ios/www/static
cp -R build/* cordova/app/platforms/ios/www
