npm run build
rm -r cordova/app/www
mkdir cordova/app/www

cp -R build/* cordova/app/www

pushd cordova/app
cp -R www/* ./platforms/ios/www/

popd


