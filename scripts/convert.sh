
BASE_PATH="/Users/i022021/dev/sign_lang/IssieSignMedia/newVideos"

function convertDemo() {
    file="$1"
    filename=$(basename -- "$file")
    if [ -f "$BASE_PATH/$filename" ]; then
        #echo "$file already converted"
        return
    fi
    echo "converting file: $file"
}


function convert() {

    file="$1"
    filename=$(basename -- "$file")
    if [ -f "$BASE_PATH/$filename" ]; then
        #echo "already converted"
        return
    fi
    echo "converting file: $file"
    ffmpeg -i "$file" -vn -af "pan=mono|c0=c1" /tmp/fixedAudio.mp3 
    ffmpeg -i "$file" -i /tmp/fixedAudio.mp3 -c:v copy -map 0:v:0 -map 1:a:0 /tmp/fix.mov 
    rm /tmp/fixedAudio.mp3

    ffmpeg -i /tmp/fix.mov -vcodec libx264 -crf 24 "$BASE_PATH/$filename"
    rm /tmp/fix.mov
}


function traverse() {
    echo "$1"
    ls -1 "$1"  | while read file
    do
        if [ ! -d "${1}/${file}" ] ; then
            ext="${file##*.}"
            if [ "$ext" == "mp4" ] || [ "$ext" == "mov" ] ; then 
                convert "${1}/${file}"
            else 
                echo "${1}/${file}"
            fi
        else
            traverse "${1}/${file}"
        fi
    done
}

function main() {
    traverse ${1}
}

main "."




