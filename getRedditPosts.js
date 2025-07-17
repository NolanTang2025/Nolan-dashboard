// getRedditPosts.js
const fs = require('fs');
const snoowrap = require('snoowrap');

const r = new snoowrap({
  userAgent: 'dashboard-script',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN
});

async function fetchRedditPosts() {
  // 获取近100条发帖（可调整）
  const submissions = await r.getMe().getSubmissions({ limit: 100 });
  const postData = {};
  submissions.forEach(post => {
    const date = new Date(post.created_utc * 1000);
    const dateStr = date.toISOString().slice(0, 10); // yyyy-mm-dd
    postData[dateStr] = (postData[dateStr] || 0) + 1;
  });

  // 只保留近7天
  const now = new Date();
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const filtered = {};
  last7Days.forEach(date => {
    filtered[date] = postData[date] || 0;
  });

  // 写入data.json
  const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
  data.redditPosts = filtered;
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

fetchRedditPosts(); 