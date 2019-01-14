
if [ "$1" == "" ]; then
    echo "You must provide encryption password"
    exit 1
fi

#npm install


echo "Remove old media"
rm -rf public/videos
rm -rf src/images


echo "Decrypt Videos"

for f in videos_split.*.enc; 
do 
    openssl aes256 -k $1 -d -in $f -out $(basename $f .enc)
done

echo "Extract Videos"

zip -s 0 videos_split.zip --out all.zip
unzip -d public/ all.zip

echo "Decrypt Images"
openssl aes256 -k $1 -d -in images.zip.enc -out images.zip

echo "Extract Images"
unzip -d src/ images.zip

echo "Clean up"
rm images.zip
rm all.zip
rm videos_split.z??
