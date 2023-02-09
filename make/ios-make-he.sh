
./make/react_prepare.sh he true "IssieSign"
if [ $? -ne 1 ]; then
    ./make/ios_prepare.sh
fi


