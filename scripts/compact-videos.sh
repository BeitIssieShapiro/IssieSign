for mp4 in *.mp4; do
 
#  ffmpeg -i $mp4 -vn -af "pan=mono|c0=c1" /tmp/fixedAudio.mp3 
#  ffmpeg -i $mp4 -i /tmp/fixedAudio.mp3 -c:v copy -map 0:v:0 -map 1:a:0 /tmp/fix.mov 
#  rm /tmp/fixedAudio.mp3

 ffmpeg -i $mp4 -vcodec libx264 -crf 24 ./compact/$mp4
 #rm /tmp/fix.mov

done