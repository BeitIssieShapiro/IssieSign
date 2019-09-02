npm run build
rm -r cordova/IsraeliSignLanguage/www
mkdir cordova/IsraeliSignLanguage/www

cp -R build/* cordova/IsraeliSignLanguage/www

pushd cordova/IsraeliSignLanguage
cp -R www/* ./platforms/ios/www/

popd


