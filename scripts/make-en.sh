echo 'export const gCurrentLanguage =  "en"' > ./src/current-language.js
cp -f jsons/en/mainJson.js src/mainJson.js
cp -R Ext-Media/images/en/ src/images/adt/

rm -rf public/videos
cp -R Ext-Media/videos/en/prod public/videos

npm run build

rm cordova/IsraeliSignLanguage/platforms/ios/www/precache-*.*
rm -rf cordova/IsraeliSignLanguage/platforms/ios/www/static
cp -R build/* cordova/IsraeliSignLanguage/platforms/ios/www
