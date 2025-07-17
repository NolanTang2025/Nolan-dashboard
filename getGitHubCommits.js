// getGitHubCommits.js
const fs = require('fs');
const fetch = require('node-fetch');

const GITHUB_USERNAME = 'iristang';
const TOKEN = process.env.GIT_TOKEN;

async function fetchCommits() {
  const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events`, {
    headers: { 'Authorization': `token ${TOKEN}` }
  });
  const events = await res.json();

  const commitData = {};
  events.forEach(event => {
    if (event.type === 'PushEvent') {
      const date = event.created_at.slice(0, 10); // yyyy-mm-dd
      const count = event.payload.commits.length;
      commitData[date] = (commitData[date] || 0) + count;
    }
  });

  // 读入原始 data.json 并写入 githubCommits 字段
  const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
  data.githubCommits = commitData;
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

fetchCommits();
