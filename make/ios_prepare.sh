iosRoot=ios-app
mediaPath=$(cat ./make/.mediaPath)
lang=$1

if [ "$lang" = "ar" ]; then
    langPrefix="Arabic"
elif [ "$lang" = "he" ]; then
    langPrefix="Hebrew"
else
    echo "Unsupported language: $lang"
    exit 1
fi

echo "Delete old files from ./$iosRoot/platforms/ios"

rm ./$iosRoot/platforms/ios/www/precache-*.*
rm -rf ./$iosRoot/platforms/ios/www/videos
rm -rf ./$iosRoot/platforms/ios/www/static

echo "copy build results to ./$iosRoot/platforms/ios"

cp -R build/* ./$iosRoot/platforms/ios/www

# uncomment only when media changes
# # Clean up video files
# rm ./$iosRoot/Hebrew-IL1/*
# rm ./$iosRoot/Hebrew-IL2/*
# rm ./$iosRoot/Arabic-IL1/*
# rm ./$iosRoot/Arabic-IL2/*

# # # Copy video files
# mkdir -p ./$iosRoot/${langPrefix}-IL1
# mkdir -p ./$iosRoot/${langPrefix}-IL2

# cp -R $mediaPath/videos/$lang/prod/[A-L]*   ./$iosRoot/${langPrefix}-IL1/
# cp -R $mediaPath/videos/$lang/prod/[M-Z]*  ./$iosRoot/${langPrefix}-IL2/


