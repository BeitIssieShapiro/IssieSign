./make/react_prepare.sh ar true "IssieSignArabic"

if [ $? -ne 1 ]; then
    ./make/ios_prepare.sh
fi


