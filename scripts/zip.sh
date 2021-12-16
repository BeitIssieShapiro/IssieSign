
if [ "$1" == "" ]; then
    echo "You must provide encryption password"
    exit 1
fi


zip -s50m -sv -r videos_split.zip videos
zip -sv -r images.zip images

for f in videos_split.z*; do openssl aes256 -k $1 -in $f -out $f.enc ; done

openssl aes256 -k $1 -in images.zip -out images.zip.enc

