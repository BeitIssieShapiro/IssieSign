./make/react_prepare.sh en true "MyIssieSign"
if [ $? -ne 1 ]; then
    ./make/ios_prepare.sh
fi

