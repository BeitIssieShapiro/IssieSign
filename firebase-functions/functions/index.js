const functions = require("firebase-functions");
const axios = require("axios");

// const express = require("express");
// const app = express();
// app.use(express.json());
// exports.httpApp = functions.region("us-central1").https.onRequest(app);

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
exports.getAccessToken = functions.region("europe-west1")
    .runWith({
        enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
    })
    .https.onCall(async (data, context) => {
        const code = data.authCode;
        const refresh_token = data.refresh_token;
        functions.logger.info("getAccessToken", code, refresh_token);

        const bodyFormData = {
            client_id: functions.config().oauth.client_id,
            client_secret: functions.config().oauth.secret,
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


