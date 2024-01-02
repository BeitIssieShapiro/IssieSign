winRoot=win-app
mediaPath=$(cat ./make/.mediaPath)
lang=$1

echo "Delete old files from ./$winRoot/platforms/electron"

rm ./$winRoot/platforms/electron/www/precache-*.*
rm -rf ./$winRoot/platforms/electron/www/videos
rm -rf ./$winRoot/platforms/electron/www/static

echo "copy build results to ./$winRoot/platforms/electron"


cp -R build/* ./$winRoot/platforms/electron/www
cp -R build/* ./$winRoot/www 

# uncomment only when media changes
# # Clean up video files
# rm ./$winRoot/Hebrew-IL1/*
# rm ./$winRoot/Hebrew-IL2/*

# # Copy video files
mkdir -p ./$winRoot/www/videos

cp -R $mediaPath/videos/$lang/prod/*  ./$winRoot/www/videos


