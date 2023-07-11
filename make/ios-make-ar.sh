./make/react_prepare.sh ar true "IssieSignArabic" "iOS"

if [ $? -ne 1 ]; then
    ./make/ios_prepare.sh
fi


