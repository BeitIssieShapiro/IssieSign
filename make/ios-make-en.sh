./make/react_prepare.sh en true "MyIssieSign" "iOS"
if [ $? -ne 1 ]; then
    ./make/ios_prepare.sh
fi

