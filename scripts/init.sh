MEDIA_PATH=/Users/i022021/dev/sign_lang/IssieSignMedia

pushd ..
npm install
cp -R $MEDIA_PATH/videos public/
cp -R $MEDIA_PATH/images src/
popd