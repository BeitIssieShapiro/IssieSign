# Cordova Google Drive plugin


Access to GDrive in ios or android

## Installation


### Install with cordova-cli

If you are using [cordova-cli](https://github.com/apache/cordova-cli), install
with:

    cordova plugin add cordova plugins add ../GDrivePlugin/ --variable IOS_REVERSED_CLIENT_ID=com.googleusercontent.apps.YOUR_CLIENT_ID --variable IOS_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
    
The IOS_REVERSED_CLIENT_ID is the "iOS URL Scheme" on the Google Developer's Console. The variables are only for iOS platform. You can omit them if you are developing for Android.

## Credits
Based initially on `https://github.com/JcDenton86/cordova-plugin-jc-googledrive.git`
