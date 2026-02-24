const { Octokit } = require("@octokit/rest");

// Usage: GITHUB_TOKEN=your_token_here node find-project-option-id.js

const GITHUB_TOKEN = "add here"
;

if (!GITHUB_TOKEN) {
    console.error("Error: GITHUB_TOKEN environment variable is required");
    console.error("Usage: GITHUB_TOKEN=your_token_here node find-project-option-id.js");
    process.exit(1);
}

const PROJECT_ID = "PVT_kwDOAP7gl84BLorl";

const query = `
query($projectId: ID!) {
  node(id: $projectId) {
    ... on ProjectV2 {
      title
      field(name: "App") {
        ... on ProjectV2SingleSelectField {
          id
          name
          options {
            id
            name
          }
        }
      }
    }
  }
}`;

async function findOptionId() {
    const octokit = new Octokit({ auth: GITHUB_TOKEN });

    try {
        const result = await octokit.graphql(query, {
            projectId: PROJECT_ID
        });

        console.log("Project:", result.node.title);
        console.log("\nApp field options:");
        console.log("==================");

        if (result.node.field && result.node.field.options) {
            result.node.field.options.forEach(option => {
                console.log(`${option.name}: "${option.id}"`);
            });
        } else {
            console.log("No options found or field not accessible");
        }
    } catch (error) {
        console.error("Error querying GitHub:", error.message);
        if (error.errors) {
            console.error("Details:", JSON.stringify(error.errors, null, 2));
        }
        process.exit(1);
    }
}

findOptionId();
