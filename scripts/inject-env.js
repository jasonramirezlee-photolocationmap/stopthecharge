const fs = require('fs');
const path = require('path');

// Create config directory if it doesn't exist
const configDir = path.join(__dirname, '../public/config');
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

// Create n8n-config.js with environment variable
const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://main-production-e9e3.up.railway.app/webhook/new-subscription';

const configContent = `// N8N Webhook Configuration (injected at build time)
window.ENV = window.ENV || {};
window.ENV.N8N_WEBHOOK_URL = '${n8nWebhookUrl}';
`;

const configPath = path.join(configDir, 'n8n-config.js');
fs.writeFileSync(configPath, configContent);

console.log('✅ Environment variables injected into public/config/n8n-config.js');
console.log('   N8N_WEBHOOK_URL:', n8nWebhookUrl);
