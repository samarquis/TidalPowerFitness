const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const STATUS_PATH = path.join(ROOT_DIR, 'PROJECT_STATUS.md');
const CURRENT_LOG_PATH = path.join(ROOT_DIR, 'docs', 'session_logs', 'CURRENT.md');
const LOGS_DIR = path.join(ROOT_DIR, 'docs', 'session_logs');

// Template for resetting CURRENT.md
const TEMPLATE = `# Session Summary - [YYYY-MM-DD]

## 📝 Summary
<!-- 1-2 sentences summarizing the main achievements of this session. -->


## 🛠️ Key Changes
<!-- Bullet points of specific technical changes or features implemented. -->


## 🚧 Next Steps
<!-- What should the next session focus on? -->


## 🧠 Context Updates
<!-- Any new architectural decisions, environment variables, or "gotchas" discovered? -->
`;

function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

function updateProjectStatus(summaryText) {
    if (!fs.existsSync(STATUS_PATH)) {
        console.error("❌ PROJECT_STATUS.md not found!");
        return false;
    }

    let content = fs.readFileSync(STATUS_PATH, 'utf8');
    const today = getTodayDate();
    const historyHeader = "## 📝 Session History (Last 3)";
    
    // Construct the new entry
    const newEntry = `- **${today}**: ${summaryText}`;

    if (content.includes(historyHeader)) {
        // Insert after the header
        const parts = content.split(historyHeader);
        // Add new line after header, then new entry
        content = parts[0] + historyHeader + '\n' + newEntry + parts[1];
        
        fs.writeFileSync(STATUS_PATH, content, 'utf8');
        console.log("✅ Updated PROJECT_STATUS.md history.");
        return true;
    }
     else {
        console.error("❌ Could not find 'Session History' section in PROJECT_STATUS.md");
        return false;
    }
}

function archiveLog(content) {
    const today = getTodayDate();
    let archivePath = path.join(LOGS_DIR, `${today}.md`);
    
    // Handle multiple logs on same day
    let counter = 1;
    while (fs.existsSync(archivePath)) {
        archivePath = path.join(LOGS_DIR, `${today}-${counter}.md`);
        counter++;
    }

    fs.writeFileSync(archivePath, content, 'utf8');
    console.log(`✅ Archived session log to: ${path.relative(ROOT_DIR, archivePath)}`);
}

function parseCurrentLog() {
    if (!fs.existsSync(CURRENT_LOG_PATH)) {
        console.error("❌ CURRENT.md not found!");
        return null;
    }

    const content = fs.readFileSync(CURRENT_LOG_PATH, 'utf8');
    
    // Simple extraction: Get text between "## 📝 Summary" and next header
    const summaryMatch = content.match(/## 📝 Summary([\s\S]*?)##/);
    if (!summaryMatch) {
        console.error("❌ Could not parse Summary section from CURRENT.md");
        return null;
    }

    let summary = summaryMatch[1].trim();
    // Remove comments
    summary = summary.replace(/<!--[\s\S]*?-->/g, '').trim();

    if (!summary || summary.startsWith("Example:")) {
        console.log("⚠️  Warning: Summary appears empty or unmodified from template.");
    }

    return { content, summary };
}

function main() {
    console.log("🔒 Concluding Session...");

    const logData = parseCurrentLog();
    if (!logData) return;

    // 1. Update Project Status
    if (logData.summary && !logData.summary.startsWith("Example:")) {
        updateProjectStatus(logData.summary);
    } else {
        console.log("ℹ️  Skipping PROJECT_STATUS.md update (no valid summary found).");
    }

    // 2. Archive the log
    archiveLog(logData.content);

    // 3. Reset CURRENT.md
    fs.writeFileSync(CURRENT_LOG_PATH, TEMPLATE, 'utf8');
    console.log("🔄 Reset CURRENT.md for next session.");

    console.log("\n✅ Session closed successfully.");
}

main();
