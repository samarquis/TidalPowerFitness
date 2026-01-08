const fs = require('fs');
const path = require('path');

const STATUS_PATH = path.join(__dirname, '..', 'PROJECT_STATUS.md');

function extractTodos() {
    if (!fs.existsSync(STATUS_PATH)) {
        console.log("❌ No PROJECT_STATUS.md found.");
        return;
    }
    
    const content = fs.readFileSync(STATUS_PATH, 'utf8');
    const lines = content.split('\n');
    
    console.log("\n========================================");
    console.log("   📝 TIDAL POWER FITNESS - TODO LIST");
    console.log("========================================\n");

    let inActiveSession = false;
    let inBugs = false;
    let hasActionItems = false;
    let hasBugs = false;

    // 1. Scan for Active Session (Unchecked items)
    for (const line of lines) {
        if (line.match(/## .*Active Session/)) {
            inActiveSession = true;
            continue;
        }
        if (inActiveSession && line.startsWith('## ')) {
            inActiveSession = false;
        }

        if (inActiveSession) {
            if (line.trim().startsWith('- [ ]')) {
                if (!hasActionItems) {
                    console.log("--- ⚡ IMMEDIATE ACTIONS (Active Session) ---");
                    hasActionItems = true;
                }
                console.log(line.trim());
            }
        }
    }

    if (!hasActionItems) {
        console.log("--- ⚡ IMMEDIATE ACTIONS ---");
        console.log("No unchecked items in Active Session!");
    }

    console.log(""); // Spacer

    // 2. Scan for Bugs
    for (const line of lines) {
        if (line.match(/## .*Known Bugs/)) {
            inBugs = true;
            continue;
        }
        if (inBugs && line.startsWith('## ')) {
            inBugs = false;
        }

        if (inBugs) {
             if (line.trim().startsWith('-')) {
                if (!hasBugs) {
                    console.log("--- 🐛 KNOWN BUGS & DEBT ---");
                    hasBugs = true;
                }
                console.log(line.trim());
             }
        }
    }

    if (!hasBugs) {
        console.log("--- 🐛 KNOWN BUGS & DEBT ---");
        console.log("No known bugs listed.");
    }
    
    console.log("\n========================================");
    console.log("Available Commands:");
    console.log("👉 `status`      : View full project dashboard");
    console.log("👉 `todo`        : View these tasks again");
    console.log("👉 `end session` : Archive work & update history");
    console.log("========================================\n");
}

extractTodos();
