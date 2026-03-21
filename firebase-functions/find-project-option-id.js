const https = require("https");

const GITHUB_TOKEN = "todo";

if (!GITHUB_TOKEN) {
    console.error("Error: Set GITHUB_TOKEN in the script");
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

const body = JSON.stringify({
    query,
    variables: { projectId: PROJECT_ID },
});

const options = {
    hostname: "api.github.com",
    path: "/graphql",
    method: "POST",
    headers: {
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "find-project-option-id",
        "Content-Length": Buffer.byteLength(body),
    },
};

const req = https.request(options, (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
        if (res.statusCode !== 200) {
            console.error(`HTTP ${res.statusCode}: ${data}`);
            process.exit(1);
        }
        const result = JSON.parse(data);
        if (result.errors) {
            console.error("GraphQL errors:", JSON.stringify(result.errors, null, 2));
            process.exit(1);
        }
        console.log("Project:", result.data.node.title);
        console.log("\nApp field options:");
        console.log("==================");
        const field = result.data.node.field;
        if (field && field.options) {
            field.options.forEach((option) => {
                console.log(`${option.name}: "${option.id}"`);
            });
        } else {
            console.log("No options found or field not accessible");
        }
    });
});

req.on("error", (err) => {
    console.error("Request error:", err.message);
    process.exit(1);
});

req.write(body);
req.end();
