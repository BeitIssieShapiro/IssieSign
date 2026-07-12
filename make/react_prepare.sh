mediaPath=$(cat ./make/.mediaPath)

# cleanup react project
#rm -rf src/images/adt/*
rm -rf public/videos

lang=$1
isIOS=$2
appName=$3
os=$4

# Verify not in browser mode:
if grep -q "window.isBrowser = true" public/index.html; then
  echo "Error: Still in browser mode - Abort";
  exit 1
fi

# Copy images - uncomment if images change
# cp -R $mediaPath/images/ src/images/adt/

# if [ "$isIOS" = true ]; then
#     cp -R $mediaPath/videos/$lang/prod public/videos
# fi

echo "export const gCurrentLanguage = \"$lang\";\nexport const AppName = \"$appName\";\nexport const os=\"$os\";\n" > ./src/current-language.js

# Append version info if version.properties exists
if [ -f "./version.properties" ]; then
  versionName=$(grep "^issiesign.versionName" ./version.properties | cut -d'=' -f2)
  versionCode=$(grep "^issiesign.versionCode" ./version.properties | cut -d'=' -f2)
  echo "export const AppVersion = \"$versionName\";\nexport const AppBuild = \"$versionCode\";" >> ./src/current-language.js
fi
# cp -f jsons/$lang/mainJson.js src/mainJson.js

npm run build
