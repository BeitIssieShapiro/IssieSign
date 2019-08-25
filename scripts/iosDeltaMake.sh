npm run build
rm -r cordova/IsraeliSignLanguage/www
mkdir cordova/IsraeliSignLanguage/www

cp -R build/* cordova/IsraeliSignLanguage/www
#cp -R public/videos cordova/IsraeliSignLanguage/www
pushd cordova/IsraeliSignLanguage
#cordova platform remove ios
#cordova platform add ios

popd


