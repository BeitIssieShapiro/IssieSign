
# cleanup react project
rm -rf src/images/adt/*
rm -rf public/videos

lang=$1
isIOS=$2
appName=$3

# Verify not in browser mode:
if grep -q "window.isBrowser = true" public/index.html; then
  echo "Error: Still in browser mode - Abort";
  exit 1
fi

# Copy images
cp -R ../IssieSign-MediaNew/images/$lang/ src/images/adt/

if [ "$isIOS" = true ]; then
    cp -R ../IssieSign-MediaNew/videos/$lang/prod public/videos
fi

echo "export const gCurrentLanguage = \"$lang\";\nexport const AppName = \"$appName\";\n" > ./src/current-language.js
cp -f jsons/$lang/mainJson.js src/mainJson.js

npm run build
