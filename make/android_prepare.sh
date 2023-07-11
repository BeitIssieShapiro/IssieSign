androidRoot=android-app
mediaPath=$(cat ./make/.mediaPath)

lang=$1

WWW=./$androidRoot/platforms/android/app/src/main/assets/www

# cleanup static files
rm -rf $WWW/css
rm -rf $WWW/img
rm -rf $WWW/js
rm $WWW/index.html

#copy statuc files
cp -R build/* $WWW


# uncomment only when media changes
# # Clean up video files
rm ./$androidRoot/platforms/android/issiesign_assets/src/main/assets/videos/*
rm ./$androidRoot/platforms/android/issiesign_assets3/src/main/assets/videos/*

# # Copy video files
# mkdir -p ./$androidRoot/platforms/android/issiesign_assets/src/main/assets/videos
# mkdir -p ./$androidRoot/platforms/android/issiesign_assets3/src/main/assets/videos/

# cp -R $mediaPath/videos/$lang/prod/[A-L]*   ./$androidRoot/platforms/android/issiesign_assets/src/main/assets/videos/
# cp -R $mediaPath/videos/$lang/prod/[M-Z]*  ./$androidRoot/platforms/android/issiesign_assets3/src/main/assets/videos/

