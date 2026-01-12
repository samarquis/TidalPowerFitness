import https from 'https';
import logger from '../utils/logger';

interface GitHubIssueInput {
    title: string;
    body: string;
    labels?: string[];
}

class GitHubService {
    private token: string | undefined;
    private repo: string | undefined; // Format: "username/repo"

    constructor() {
        this.token = process.env.GITHUB_PAT;
        this.repo = process.env.GITHUB_REPO || 'samarquis/TidalPowerFitness';
    }

    async createIssue(input: GitHubIssueInput): Promise<{ url: string; number: number } | null> {
        if (!this.token) {
            logger.warn('GITHUB_PAT not configured. Skipping GitHub issue creation.');
            return null;
        }

        const postData = JSON.stringify({
            title: input.title,
            body: input.body,
            labels: input.labels || ['user-feedback']
        });

        const options = {
            hostname: 'api.github.com',
            port: 443,
            path: `/repos/${this.repo}/issues`,
            method: 'POST',
            headers: {
                'Authorization': `token ${this.token}`,
                'User-Agent': 'TidalPowerFitness-Backend',
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    if (res.statusCode === 201) {
                        const response = JSON.parse(data);
                        resolve({
                            url: response.html_url,
                            number: response.number
                        });
                    } else {
                        logger.error(`GitHub API Error (${res.statusCode}): ${data}`);
                        resolve(null);
                    }
                });
            });

            req.on('error', (error) => {
                logger.error('GitHub Service Request Error:', error);
                resolve(null);
            });

            req.write(postData);
            req.end();
        });
    }

    async listIssues(state: 'open' | 'closed' | 'all' = 'open', labels?: string[]): Promise<any[]> {
        if (!this.token) {
            logger.warn('GITHUB_PAT not configured. Skipping GitHub issue listing.');
            return [];
        }

        const queryParams = new URLSearchParams();
        queryParams.append('state', state);
        if (labels && labels.length > 0) {
            queryParams.append('labels', labels.join(','));
        }

        const options = {
            hostname: 'api.github.com',
            port: 443,
            path: `/repos/${this.repo}/issues?${queryParams.toString()}`,
            method: 'GET',
            headers: {
                'Authorization': `token ${this.token}`,
                'User-Agent': 'TidalPowerFitness-Backend',
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        return new Promise((resolve) => {
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        resolve(JSON.parse(data));
                    } else {
                        logger.error(`GitHub API Error (${res.statusCode}): ${data}`);
                        resolve([]);
                    }
                });
            });

            req.on('error', (error) => {
                logger.error('GitHub Service Request Error:', error);
                resolve([]);
            });

            req.end();
        });
    }

    async closeIssue(issueNumber: number, comment?: string): Promise<boolean> {
        if (!this.token) {
            logger.warn('GITHUB_PAT not configured. Skipping GitHub issue closure.');
            return false;
        }

        // Add comment first if provided
        if (comment) {
            await this.addComment(issueNumber, comment);
        }

        const postData = JSON.stringify({
            state: 'closed'
        });

        const options = {
            hostname: 'api.github.com',
            port: 443,
            path: `/repos/${this.repo}/issues/${issueNumber}`,
            method: 'PATCH',
            headers: {
                'Authorization': `token ${this.token}`,
                'User-Agent': 'TidalPowerFitness-Backend',
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };

        return new Promise((resolve) => {
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        resolve(true);
                    } else {
                        logger.error(`GitHub API Error (${res.statusCode}): ${data}`);
                        resolve(false);
                    }
                });
            });

            req.on('error', (error) => {
                logger.error('GitHub Service Request Error:', error);
                resolve(false);
            });

            req.write(postData);
            req.end();
        });
    }

    async addComment(issueNumber: number, body: string): Promise<boolean> {
        if (!this.token) return false;

        const postData = JSON.stringify({ body });

        const options = {
            hostname: 'api.github.com',
            port: 443,
            path: `/repos/${this.repo}/issues/${issueNumber}/comments`,
            method: 'POST',
            headers: {
                'Authorization': `token ${this.token}`,
                'User-Agent': 'TidalPowerFitness-Backend',
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };

        return new Promise((resolve) => {
            const req = https.request(options, (res) => {
                res.on('data', () => {});
                res.on('end', () => resolve(res.statusCode === 201));
            });
            req.on('error', () => resolve(false));
            req.write(postData);
            req.end();
        });
    }
}

export default new GitHubService();
