const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../public/index.html');
let html = fs.readFileSync(indexPath, 'utf8');

html = html.replace(
  'N8N_WEBHOOK_URL_PLACEHOLDER',
  process.env.N8N_WEBHOOK_URL || 'https://main-production-e9e3.up.railway.app/webhook/new-subscription'
);

fs.writeFileSync(indexPath, html);
console.log('Environment variables injected');
