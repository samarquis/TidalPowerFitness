import { execSync } from 'child_process';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';

function getEnvVar(name: string): string | undefined {
    try {
        const envPath = path.resolve(__dirname, '../backend/.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const lines = envContent.split('\n');
            for (const line of lines) {
                const [key, ...valueParts] = line.split('=');
                if (key.trim() === name) {
                    return valueParts.join('=').trim();
                }
            }
        }
    } catch (e) {
        console.error('Error reading .env file:', e);
    }
    return process.env[name];
}

const API_URL = 'https://tidal-power-backend.onrender.com/api';
const SYSTEM_KEY = getEnvVar('SYSTEM_API_KEY');

async function generateChangelog() {
    try {
        console.log('Fetching latest commit information...');
        const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
        const commitMessage = execSync('git log -1 --pretty=%B').toString().trim();
        const author = execSync('git log -1 --pretty=%an').toString().trim();

        console.log(`Processing commit: ${commitHash}`);

        // Determine category
        let category = 'improvement';
        const msgLower = commitMessage.toLowerCase();
        
        if (msgLower.includes('feat') || msgLower.includes('add')) {
            category = 'feature';
        } else if (msgLower.includes('fix') || msgLower.includes('bug')) {
            category = 'fix';
        } else if (msgLower.includes('sec')) {
            category = 'security';
        }

        const now = new Date();
        const version = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}-${commitHash}`;

        const payload = JSON.stringify({
            version,
            tracking_number: commitHash,
            title: commitMessage.split('\n')[0],
            content: `Pushed by ${author}\n\nFull Commit Message:\n${commitMessage}`,
            category,
            is_published: true
        });

        if (!SYSTEM_KEY) {
            console.error('SYSTEM_API_KEY not found. Cannot authenticate.');
            return;
        }

        console.log(`Sending changelog to: ${API_URL}/changelog`);
        
        const url = new URL(`${API_URL}/changelog`);
        const protocol = url.protocol === 'https:' ? https : http;

        const options = {
            hostname: url.hostname,
            port: url.port || (url.protocol === 'https:' ? 443 : 80),
            path: url.pathname + url.search,
            method: 'POST',
            headers: {
                'x-system-key': SYSTEM_KEY,
                'X-TPF-Request': 'true',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const req = protocol.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    console.log('✓ Changelog entry created successfully!');
                } else {
                    console.error(`✗ API Error (${res.statusCode}):`, data);
                }
            });
        });

        req.on('error', (error) => {
            console.error('✗ Request Error:', error.message);
        });

        req.write(payload);
        req.end();

    } catch (error: any) {
        console.error('✗ Failed to generate changelog:', error.message);
    }
}

generateChangelog();