echo 'export const gCurrentLanguage =  "he";\nexport const AppName = "IssieSign";\n' > ./src/current-language.js
cp -f jsons/he/mainJson.js src/mainJson.js
cp -R ../IssieSign-Media/images/he/ src/images/adt/

rm -rf public/videos
#cp -R ../IssieSign-Media/videos/he/dev-ios public/videos
cp -R ../IssieSign-Media/videos/he/prod public/videos

npm run build

rm cordova/app/platforms/ios/www/precache-*.*
rm -rf cordova/app/platforms/ios/www/static
cp -R build/* cordova/app/platforms/ios/www

#cp -R build/static cordova/app/platforms/ios/www/
#cp  build/* cordova/app/platforms/ios/www/

#if [[ -z "$debug" ]]; then
#   cp -R build/videos cordova/app/platforms/ios/www/
#else
#    rm -rf cordova/app/platforms/ios/www/videos
#    mkdir -p cordova/app/platforms/ios/www/videos
#    cp -R build/videos/אבא.mov cordova/app/platforms/ios/www/videos/
#    echo 'Only debug movies copied'
# fi



