const fs = require('fs');
const path = require('path');

const GEMINI_PATH = path.join(__dirname, '..', 'GEMINI.md');
const STATUS_PATH = path.join(__dirname, '..', 'PROJECT_STATUS.md');
const EPICS_PATH = path.join(__dirname, '..', '_bmad-output', 'planning-artifacts', 'epics.md');

function readFileSafe(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf8');
        }
    } catch (e) {
        return null;
    }
    return null;
}

function extractSection(content, sectionHeader) {
    if (!content) return "N/A";
    const lines = content.split('\n');
    let capturing = false;
    let result = [];
    for (const line of lines) {
        if (line.indexOf(sectionHeader) !== -1) {
            capturing = true;
            continue;
        }
        if (capturing) {
            if (line.startsWith('#')) break;
            result.push(line);
        }
    }
    return result.join('\n').trim();
}

const geminiContent = readFileSafe(GEMINI_PATH);
const statusContent = readFileSafe(STATUS_PATH);
const epicsContent = readFileSafe(EPICS_PATH);

console.log("\n========================================================");
console.log("   TIDAL POWER FITNESS - PROJECT STATUS REPORT");
console.log("========================================================\n");

if (geminiContent) {
    console.log("--- MAJOR MILESTONES (Current) ---");
    const milestonesMatch = geminiContent.match(/## 3\. Major Milestones[\s\S]*?## 4\./);
    if (milestonesMatch) {
        console.log(milestonesMatch[0].replace('## 3. Major Milestones', '').replace('## 4.', '').trim());
    } else {
        console.log(extractSection(geminiContent, "Major Milestones"));
    }
    console.log("\n");
}

if (statusContent) {
    console.log("--- ACTIVE SESSION FOCUS ---");
    console.log(extractSection(statusContent, "Active Session: Quality & Stability"));
    console.log("\n");
    
    console.log("--- KNOWN BUGS / DEBT ---");
    console.log(extractSection(statusContent, "Known Bugs & Technical Debt"));
    console.log("\n");
}

if (epicsContent) {
    console.log("--- EPICS STATUS ---");
    console.log("Detailed breakdown available in _bmad-output/planning-artifacts/epics.md");
    const roadmap = extractSection(statusContent, "Roadmap");
    if(roadmap) console.log(roadmap);
}

console.log("\n========================================================");
console.log("Available Commands:");
console.log("👉 `status`      : Refresh this dashboard");
console.log("👉 `todo`        : View pending tasks & bugs");
console.log("👉 `end session` : Archive work & update history");
console.log("========================================================\n");