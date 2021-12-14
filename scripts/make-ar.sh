echo 'export const gCurrentLanguage =  "ar"' > ./src/current-language.js
cp -f jsons/ar/mainJson.js src/mainJson.js
cp -R Ext-Media/images/ar/ src/images/adt/

rm -rf public/videos
cp -R Ext-Media/videos/ar/dev-ios public/videos

npm run build

rm cordova/IsraeliSignLanguage/platforms/ios/www/precache-*.*
rm -rf cordova/IsraeliSignLanguage/platforms/ios/www/static
cp -R build/* cordova/IsraeliSignLanguage/platforms/ios/www

#cp -R build/static cordova/IsraeliSignLanguage/platforms/ios/www/
#cp  build/* cordova/IsraeliSignLanguage/platforms/ios/www/

#if [[ -z "$debug" ]]; then
#   cp -R build/videos cordova/IsraeliSignLanguage/platforms/ios/www/
#else
#    rm -rf cordova/IsraeliSignLanguage/platforms/ios/www/videos
#    mkdir -p cordova/IsraeliSignLanguage/platforms/ios/www/videos
#    cp -R build/videos/אבא.mov cordova/IsraeliSignLanguage/platforms/ios/www/videos/
#    echo 'Only debug movies copied'
# fi



