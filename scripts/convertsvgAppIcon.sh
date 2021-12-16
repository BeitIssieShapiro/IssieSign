#Provide the path of the source SVG folder e.g project/assets/SVG/
sourcepath="/Users/i022021/Downloads/src"
#Provide the destination path where you want the exported PNG files
destinationpath="/Users/i022021/Downloads/icons/"
# Provide the source SVG file names to be converted as PNG
filestoprocess=(happy)
dimensionbyscale=false
dimensionpixel=($"29:29" $"58:58" $"40:40" $"80:80" $"76:76" $"152:152" $"167:167" $"58:58" $"87:87" $"80:80" $"120:120" $"120:120" $"180:180")
dimensionscale=($"1x" $"2x" $"3x")
iconname=($"iPad-29" $"iPad-29@2x" $"iPad-40" $"iPad-40@2x" $"iPad-76" $"iPad-76@2x" $"iPad-83.5@2x" $"iPhone-29@2x" $"iPhone-29@3x" $"iPhone-40@2x" $"iPhone-40@3x" $"iPhone-60@2x" $"iPhone-60@3x")
pngextension=$".png"
quality=$"100%"
for file in $sourcepath/*.svg; do
echo $file
fullname=$(basename "$file")
extension="${fullname##*.}"
filename="${fullname%.*}"
if [[ " ${filestoprocess[@]} " =~ " ${filename} " ]]; then
    subfolder=${destinationpath}${filename}"/"
      echo $subfolder
  rm -rf  ${subfolder}
  mkdir ${subfolder}
  for index in ${!iconname[*]}
  do
      pngfilename=${subfolder}${iconname[index]}$pngextension
      echo $pngfilename
 # echo $pngfilename
  #remove any file exists with the name before exporting
  rm -f $pngfilename
  if [ $dimensionbyscale == true ] 
    then
   scalefactor=${dimensionscale[index]}
   else
    scalefactor=${dimensionpixel[index]}
fi
  svgexport $sourcepath${fullname} ${pngfilename} ${quality} ${scalefactor}
  done
fi
done
open $destinationpath