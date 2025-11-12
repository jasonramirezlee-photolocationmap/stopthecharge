/* ========================================
   N8N WEBHOOK CONFIGURATION
   Configure your N8N instance URL and webhook endpoints
   ======================================== */

// ⚠️ IMPORTANT: Replace 'YOUR_N8N_URL_HERE' with your actual N8N instance URL
// Example: 'https://n8n.example.com' or 'https://your-instance.n8n.cloud'

const N8N_CONFIG = {
    // Your N8N instance base URL
    baseUrl: process.env.N8N_BASE_URL || 'YOUR_N8N_URL_HERE',
    
    // Webhook endpoint paths (configured in N8N workflows)
    webhooks: {
        // Triggered when user adds a new subscription
        newSubscription: '/webhook/new-subscription',
        
        // Triggered when user cancels a subscription
        cancelSubscription: '/webhook/cancel-subscription',
        
        // Triggered for reminder emails (7 days before renewal)
        reminder: '/webhook/reminder-email',
        
        // Triggered when user submits a review/cancellation note
        userReview: '/webhook/user-review',
        
        // Triggered when user exports data
        exportData: '/webhook/export-data'
    },
    
    // Webhook timeout in milliseconds
    timeout: 10000,
    
    // Enable/disable webhook integration
    enabled: true,
    
    // Retry settings
    maxRetries: 3,
    retryDelay: 1000, // milliseconds
    
    // Headers to send with webhook requests
    defaultHeaders: {
        'Content-Type': 'application/json',
        'X-StopTheCharge': 'PWA/1.0'
    }
};

// Export for use in app.js
// In browser environment, this will be available as window.N8N_CONFIG
if (typeof window !== 'undefined') {
    window.N8N_CONFIG = N8N_CONFIG;
}

// For Node.js environments (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = N8N_CONFIG;
}

console.log('[N8N Config] Configuration loaded');
console.log('[N8N Config] Base URL:', N8N_CONFIG.baseUrl);
console.log('[N8N Config] Webhooks enabled:', N8N_CONFIG.enabled);
