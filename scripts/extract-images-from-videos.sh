
for mp4 in *.mp4; do
 ffmpeg -i $mp4 -vframes:v 1 -f image2 ../ext-images/$mp4.jpg
done