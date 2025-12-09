const axios = require("axios");
const admin = require("firebase-admin");

const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions, logger } = require("firebase-functions/v2");
const { defineString } = require("firebase-functions/params");


setGlobalOptions({
    region: "europe-west1",
});

admin.initializeApp();
const db = getFirestore();

const oauthClientID = defineString("OAUTH_CLIENT_ID");
const oauthClientSecret = defineString("OAUTH_SECRET");


// const express = require("express");
// const app = express();
// app.use(express.json());
// exports.httpApp = functions.region("us-central1").https.onRequest(app);

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
exports.getAccessToken = onCall({ cors: true, enforceAppCheck: true }, async (request) => {

    const code = request.data.authCode;
    const refresh_token = request.data.refresh_token;
    logger.info("getAccessToken", code, refresh_token);

    const bodyFormData = {
        client_id: oauthClientID.value(),
        client_secret: oauthClientSecret.value(),
        redirect_uri: "",
    };

    if (code) {
        bodyFormData.code = code;
        bodyFormData.grant_type = "authorization_code";
    } else {
        bodyFormData.refresh_token = refresh_token;
        bodyFormData.grant_type = "refresh_token";
    }

    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    };

    return axios.post("https://www.googleapis.com/oauth2/v4/token", bodyFormData, {
        headers,
    }).then((res) => {
        return res.data;
    });
});


exports.addUserFeedback = onCall({ cors: true, enforceAppCheck: true }, async (request) => {
    const { appName, feedbackText } = request.data;

    // Basic validation
    if (!appName || !feedbackText || feedbackText.trim().length < 5) {
        logger.warn("Invalid input in addUserFeedback", request.data);
        throw new HttpsError("invalid-argument", "Invalid input");
    }

    // Store feedback in Firestore
    const feedback = {
        appName,
        feedbackText: feedbackText.trim(),
        createdAt: FieldValue.serverTimestamp(),
    };
    console.log("feedback", feedback);
    return db.collection("userFeedback").add(feedback)
        .then(() => logger.info("Feedback saved", feedback));
});