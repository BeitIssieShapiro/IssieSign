
./make/react_prepare.sh he true "IssieSign" "iOS"
if [ $? -ne 1 ]; then
    ./make/ios_prepare.sh he
fi


