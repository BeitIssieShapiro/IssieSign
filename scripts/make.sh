echo 'export const gCurrentLanguage =  "he";\nexport const AppName = "IssieSign";\n' > ./src/current-language.js
cp -f jsons/he/mainJson.js src/mainJson.js

rm -rf public/videos

# for dev cp -R ../IssieSign-Media/videos/he/dev-ios public/videos

# commented for optimized build
#cp -R ../IssieSign-MediaNew/images/he/ src/images/adt/
cp -R ../IssieSign-MediaNew/videos/he/prod public/videos

npm run build

rm cordovaApp/platforms/ios/www/precache-*.*
rm -rf cordovaApp/platforms/ios/www/static
cp -R build/* cordovaApp/platforms/ios/www

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



