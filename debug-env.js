
const fs = require('fs');
const content = fs.readFileSync('.env', 'utf8');
console.log('Hex dump of .env content near DB_PASSWORD:');
const lines = content.split('\n');
const passwordLine = lines.find(l => l.includes('DB_PASSWORD'));
if (passwordLine) {
    for (let i = 0; i < passwordLine.length; i++) {
        console.log(`${passwordLine[i]}: ${passwordLine.charCodeAt(i)}`);
    }
} else {
    console.log('DB_PASSWORD not found');
}
