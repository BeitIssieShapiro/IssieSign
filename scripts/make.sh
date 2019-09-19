npm run build

rm cordova/IsraeliSignLanguage/platforms/ios/www/precache-*.*
rm -rf cordova/IsraeliSignLanguage/platforms/ios/www/static
cp -R build/* cordova/IsraeliSignLanguage/platforms/ios/www



