echo "Delete old files from cordovaApp/platforms/ios"

rm cordovaApp/platforms/ios/www/precache-*.*
rm -rf cordovaApp/platforms/ios/www/videos
rm -rf cordovaApp/platforms/ios/www/static

echo "copy build results to cordovaApp/platforms/ios"

cp -R build/* cordovaApp/platforms/ios/www
