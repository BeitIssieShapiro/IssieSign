echo "Delete old files from ios-app/platforms/ios"

rm ios-app/platforms/ios/www/precache-*.*
rm -rf ios-app/platforms/ios/www/videos
rm -rf ios-app/platforms/ios/www/static

echo "copy build results to ios-app/platforms/ios"

cp -R build/* ios-app/platforms/ios/www
