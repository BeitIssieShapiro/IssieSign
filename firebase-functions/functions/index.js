const axios = require("axios");
const admin = require("firebase-admin");

const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions, logger } = require("firebase-functions/v2");
const { defineString, defineSecret } = require("firebase-functions/params");


setGlobalOptions({
    region: "europe-west1",
});

admin.initializeApp();
const db = getFirestore();

const oauthClientID = defineString("OAUTH_CLIENT_ID");
const oauthClientSecret = defineString("OAUTH_SECRET");
const GITHUB_PAT = defineSecret("GITHUB_PAT");


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


const GITHUB_PROJECT_CONFIG = {
    PROJECT_ID: "PVT_kwDOAP7gl84BLorl",
    APP_FIELD_ID: "PVTSSF_lADOAP7gl84BLorlzg7KCrg",
    FEEDBACK_BOOL_FIELD_ID: "PVTF_lADOAP7gl84BLorlzg7KehA", // IsUserFeedback
    REPO_OWNER: "BeitIssieShapiro",
    REPO_NAME: "issie-internal",
    APPS: {
        IssieDocs: "600b5886",
        IssieDice: "b45d2395",
        IssieSign: "d1cedfca",
        IssieBoard: "a0dc3761",
        IssieCalc: "8244afb0",
        IssieSays: "3dc62959",
        IssieVoice: "377f5282",
        IssieAlbum: "a73b498f",
    }
};


exports.addUserFeedback2 = onCall({ cors: true, enforceAppCheck: true, secrets: [GITHUB_PAT] }, async (request) => {
    const { appName, feedbackText, feedbackTitle, email } = request.data;

    if (!appName || !GITHUB_PROJECT_CONFIG.APPS[appName] || !feedbackText || feedbackText.trim().length < 5) {
        logger.warn("Invalid input in addUserFeedback", request.data);
        throw new HttpsError("invalid-argument", "Invalid input");
    }

    // Detect platform from user-agent header
    const ua = (request.rawRequest?.headers?.["user-agent"] || "").toLowerCase();
    const platformLabel = ua.includes("iphone") || ua.includes("ipad") || ua.includes("darwin")
        ? "iOS"
        : ua.includes("android")
            ? "Android"
            : "";

    const { Octokit } = require("@octokit/rest");
    const octokit = new Octokit({ auth: GITHUB_PAT.value() });

    // 1. Mutation to link issue to project
    const addToProjectMutation = `
    mutation($projectId: ID!, $contentId: ID!) {
      addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
        item { id }
      }
    }`;

    // 2. Mutation for Single Select (App dropdown)
    const updateSelectMutation = `
    mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
      updateProjectV2ItemFieldValue(input: {
        projectId: $projectId, itemId: $itemId, fieldId: $fieldId,
        value: { singleSelectOptionId: $optionId }
      }) { projectV2Item { id } }
    }`;

    // 3. Mutation for Number/Text fields (IsUserFeedback)
    const updateNumberMutation = `
    mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: Float!) {
      updateProjectV2ItemFieldValue(input: {
        projectId: $projectId, itemId: $itemId, fieldId: $fieldId,
        value: { number: $value }
      }) { projectV2Item { id } }
    }`;

    const body = feedbackText
        + (platformLabel ? "\nplatform: " + platformLabel : "")
        + (email ? "\nfrom: " + email : "");

    try {
        // Step 1: Create a regular issue in the issie-internal repo
        const issueRes = await octokit.issues.create({
            owner: GITHUB_PROJECT_CONFIG.REPO_OWNER,
            repo: GITHUB_PROJECT_CONFIG.REPO_NAME,
            title: `[UserFeedback-${appName}] ${feedbackTitle}`,
            body,
        });

        const issueNodeId = issueRes.data.node_id;

        // Step 2: Add the issue to the project
        const addToProjectRes = await octokit.graphql(addToProjectMutation, {
            projectId: GITHUB_PROJECT_CONFIG.PROJECT_ID,
            contentId: issueNodeId,
        });

        const newItemId = addToProjectRes.addProjectV2ItemById.item.id;

        // Step 3: Set "App" (Select Option)
        await octokit.graphql(updateSelectMutation, {
            projectId: GITHUB_PROJECT_CONFIG.PROJECT_ID,
            itemId: newItemId,
            fieldId: GITHUB_PROJECT_CONFIG.APP_FIELD_ID,
            optionId: GITHUB_PROJECT_CONFIG.APPS[appName]
        });

        // Step 4: Set "IsUserFeedback" to 1 (Number)
        await octokit.graphql(updateNumberMutation, {
            projectId: GITHUB_PROJECT_CONFIG.PROJECT_ID,
            itemId: newItemId,
            fieldId: GITHUB_PROJECT_CONFIG.FEEDBACK_BOOL_FIELD_ID,
            value: 1.0 // GitHub GraphQL treats numbers as Floats
        });

        return { success: true, itemId: newItemId, issueNumber: issueRes.data.number };
    } catch (err) {
        console.error("Error creating issue:", err);
        throw new HttpsError("internal", "Failed to create GitHub issue");
    }
});