# N8N Webhook Integration Guide

> **Status:** N8N webhook infrastructure is ready for configuration. Follow this guide to connect your N8N instance.

---

## Quick Start - 5 Minute Setup

### Step 1: Set Your N8N Base URL

Edit `/config/n8n-config.js`:

```javascript
const N8N_CONFIG = {
    baseUrl: 'https://your-n8n-instance.com', // ← REPLACE THIS
    // ... rest of config
};
```

**Examples:**
- Self-hosted: `https://n8n.example.com`
- N8N Cloud: `https://your-instance.n8n.cloud`
- Local: `http://localhost:5678`

### Step 2: Create Webhooks in N8N

You need 4 webhooks. In N8N:

1. Create a new workflow
2. Add "Webhook" node as trigger
3. Set to "POST" method
4. Note the generated webhook URL
5. Configure the workflow logic
6. Save and activate

### Step 3: Verify Connection

Open browser console (F12) and check:
```
[StopTheCharge] N8N Config loaded: ✅ Configured
```

---

## Webhook Endpoints

### 1. New Subscription Webhook

**Endpoint:** `/webhook/new-subscription`

**Triggered When:** User adds a subscription from directory

**Data Sent:**
```json
{
  "type": "new_subscription",
  "serviceName": "Netflix",
  "category": "streaming",
  "monthlyCost": 15.99,
  "renewalDate": "2025-12-01",
  "userId": "user-1234567890",
  "timestamp": "2025-11-12T10:30:00.000Z",
  "source": "stopthecharge_pwa"
}
```

**Suggested N8N Workflow Actions:**
- ✅ Send welcome email
- ✅ Add to CRM/database
- ✅ Start reminder scheduler
- ✅ Log analytics event
- ✅ Create calendar event

---

### 2. Cancel Subscription Webhook

**Endpoint:** `/webhook/cancel-subscription`

**Triggered When:** User removes subscription from dashboard

**Data Sent:**
```json
{
  "type": "cancel_subscription",
  "serviceName": "Netflix",
  "category": "streaming",
  "monthlyCost": 15.99,
  "userId": "user-1234567890",
  "reason": "User initiated cancellation",
  "timestamp": "2025-11-12T10:31:00.000Z",
  "source": "stopthecharge_pwa"
}
```

**Suggested N8N Workflow Actions:**
- ✅ Send cancellation confirmation email
- ✅ Update database record
- ✅ Cancel reminder scheduler
- ✅ Calculate savings
- ✅ Update user analytics

---

### 3. Reminder Email Webhook

**Endpoint:** `/webhook/reminder-email`

**Triggered When:** Scheduled reminder 7 days before renewal (future feature)

**Data Sent:**
```json
{
  "type": "reminder",
  "serviceName": "Netflix",
  "renewalDate": "2025-11-19",
  "daysUntilRenewal": 7,
  "userEmail": "user@example.com",
  "timestamp": "2025-11-12T08:00:00.000Z",
  "source": "stopthecharge_pwa"
}
```

**Suggested N8N Workflow Actions:**
- ✅ Send reminder email
- ✅ Add to notification queue
- ✅ Log reminder sent

---

### 4. User Review Webhook

**Endpoint:** `/webhook/user-review`

**Triggered When:** User submits a review or cancellation note

**Data Sent:**
```json
{
  "type": "user_review",
  "serviceName": "Netflix",
  "rating": 4,
  "comment": "Easy to cancel online",
  "helpfulCount": 5,
  "timestamp": "2025-11-12T10:32:00.000Z",
  "source": "stopthecharge_pwa"
}
```

**Suggested N8N Workflow Actions:**
- ✅ Save review to database
- ✅ Update community ratings
- ✅ Flag helpful reviews
- ✅ Send to moderation

---

## File Structure

### Configuration Files

```
/config/
├── n8n-config.js          ← Main N8N configuration
│                           baseUrl, webhook endpoints, settings
```

### Integration Points

```
/js/app.js
├── sendToN8N()            ← Main webhook sender function
├── sendSubscriptionToN8N() ← Called when user adds subscription
├── sendCancellationToN8N() ← Called when user removes subscription
└── sendReviewToN8N()       ← Called when user submits review
```

### HTML Pages Load Config

```
/public/
├── index.html             ← Includes: config/n8n-config.js
├── directory.html         ← Includes: config/n8n-config.js
├── dashboard.html         ← Includes: config/n8n-config.js
├── service-detail.html    ← Includes: config/n8n-config.js
└── admin.html             ← Includes: config/n8n-config.js
```

---

## Setup Instructions

### Step 1: Create N8N Webhook Workflows

For each webhook endpoint, create a workflow in N8N:

#### Workflow 1: New Subscription
1. New workflow → name: "stopthecharge-new-subscription"
2. Add Webhook node (POST, path: `/new-subscription`)
3. Add your processing logic:
   - Save to database
   - Send email
   - Update CRM
4. Test with data from below
5. Activate workflow

#### Workflow 2: Cancel Subscription
1. New workflow → name: "stopthecharge-cancel-subscription"
2. Add Webhook node (POST, path: `/cancel-subscription`)
3. Add your processing logic
4. Activate workflow

#### Workflow 3: Reminder Email (Optional)
1. New workflow → name: "stopthecharge-reminder"
2. Add Webhook node (POST, path: `/reminder-email`)
3. Add email node to send reminders
4. Activate workflow

#### Workflow 4: User Review (Optional)
1. New workflow → name: "stopthecharge-user-review"
2. Add Webhook node (POST, path: `/user-review`)
3. Add your processing logic
4. Activate workflow

### Step 2: Get Webhook URLs

After creating each workflow:

1. Click Webhook node
2. Copy the webhook URL shown
3. Note the format: `https://your-n8n.com/webhook/path`

**Important:** Each workflow has a unique webhook URL!

### Step 3: Configure in StopTheCharge

Edit `/config/n8n-config.js`:

```javascript
const N8N_CONFIG = {
    // Your N8N instance URL
    baseUrl: 'https://your-n8n.com', // ← Your N8N URL
    
    webhooks: {
        // Update these with your actual webhook paths
        newSubscription: '/webhook/new-subscription',
        cancelSubscription: '/webhook/cancel-subscription',
        reminder: '/webhook/reminder-email',
        userReview: '/webhook/user-review'
    },
    
    // ... rest of config
};
```

### Step 4: Test Connection

#### Test in Browser Console:

```javascript
// In browser console (F12):
await sendToN8N(
  window.N8N_CONFIG.webhooks.newSubscription,
  {
    serviceName: 'Netflix Test',
    category: 'streaming',
    monthlyCost: 15.99,
    renewalDate: '2025-12-01'
  }
);
```

You should see in console:
```
[StopTheCharge] 🔗 Sending to N8N webhook: /webhook/new-subscription
[StopTheCharge] ✅ N8N webhook response: { success: true, ... }
```

#### Test via App:

1. Go to directory
2. Click "View Guide" on any service
3. Click "Add to My Subscriptions"
4. Check N8N workflow execution history
5. Should see request in logs

---

## Console Logging

### What Gets Logged

Every webhook sends logs like:

```
[StopTheCharge] 🔗 Sending to N8N webhook: /webhook/new-subscription
[StopTheCharge] URL: https://your-n8n.com/webhook/new-subscription
[StopTheCharge] Data: { type: 'new_subscription', serviceName: 'Netflix', ... }
[StopTheCharge] ✅ N8N webhook response: { success: true, ... }
```

### Error Handling

If N8N isn't configured:
```
[StopTheCharge] ⚠️ N8N base URL not configured. Skipping webhook.
[StopTheCharge] To enable N8N webhooks, set N8N_BASE_URL in config/n8n-config.js
```

If webhook fails:
```
[StopTheCharge] ❌ N8N webhook error: HTTP 404: Not Found
[StopTheCharge] Data saved locally. Will retry when connection available.
```

### To Enable Debug Mode:

In browser console:
```javascript
// Set config to log all requests
window.N8N_CONFIG.debug = true;
```

---

## Example N8N Workflows

### Workflow 1: Send Welcome Email

```
Webhook (trigger) 
  ↓
Email node
  - To: ${data.userEmail}
  - Subject: "Welcome to StopTheCharge"
  - Body: "Thank you for adding ${data.serviceName}"
  ↓
HTTP Response (success)
```

### Workflow 2: Save to Google Sheets

```
Webhook (trigger)
  ↓
Google Sheets node
  - Spreadsheet: "StopTheCharge Subscriptions"
  - Operation: Add row
  - Row: { serviceName, category, cost, renewalDate }
  ↓
HTTP Response (success)
```

### Workflow 3: Send Slack Notification

```
Webhook (trigger)
  ↓
Slack node
  - Channel: #subscriptions
  - Message: "New subscription: ${data.serviceName}"
  ↓
HTTP Response (success)
```

---

## Troubleshooting

### Issue: Webhook not firing

**Check:**
1. Is N8N_CONFIG.baseUrl set correctly?
2. Is N8N_CONFIG.enabled = true?
3. Are the webhook paths correct?
4. Is N8N workflow activated?

**Fix:**
```javascript
// In browser console
console.log(window.N8N_CONFIG);
// Check baseUrl and enabled status
```

### Issue: 404 errors in console

**Cause:** Webhook path doesn't match N8N workflow

**Fix:**
1. Check workflow URL in N8N: `/webhook/xxx`
2. Make sure path in config matches exactly
3. Verify workflow is activated

### Issue: CORS errors

**Cause:** N8N CORS not configured

**Fix:**
1. In N8N settings, enable CORS for PWA domain
2. Add header: `X-StopTheCharge: PWA/1.0`

### Issue: Timeout errors

**Cause:** N8N taking too long to respond

**Fix:**
1. Check N8N workflow performance
2. Increase timeout in config:
```javascript
timeout: 20000 // 20 seconds
```

---

## Configuration Options

### In `/config/n8n-config.js`

```javascript
const N8N_CONFIG = {
    // Required: Your N8N instance URL
    baseUrl: 'https://your-n8n.com',
    
    // Webhook endpoint paths (from N8N workflows)
    webhooks: {
        newSubscription: '/webhook/new-subscription',
        cancelSubscription: '/webhook/cancel-subscription',
        reminder: '/webhook/reminder-email',
        userReview: '/webhook/user-review'
    },
    
    // Timeout in milliseconds (default: 10000)
    timeout: 10000,
    
    // Enable/disable webhooks (default: true)
    enabled: true,
    
    // Retry settings
    maxRetries: 3,
    retryDelay: 1000,
    
    // Headers sent with all requests
    defaultHeaders: {
        'Content-Type': 'application/json',
        'X-StopTheCharge': 'PWA/1.0'
    }
};
```

---

## Security Considerations

### For Production:

1. **API Key Authentication**
   - Add X-API-Key header in config
   - Verify in N8N webhook node

2. **HTTPS Only**
   - Always use https:// URLs
   - Never send over HTTP

3. **Rate Limiting**
   - Set max requests per user
   - Implement cooldown periods

4. **Data Validation**
   - Validate data in N8N
   - Reject invalid requests

5. **Error Logging**
   - Log all webhook errors
   - Monitor for failures

### Example with API Key:

```javascript
// /config/n8n-config.js
const N8N_CONFIG = {
    baseUrl: 'https://your-n8n.com',
    
    defaultHeaders: {
        'Content-Type': 'application/json',
        'X-API-Key': 'your-secret-key-here', // ← Add this
        'X-StopTheCharge': 'PWA/1.0'
    }
};
```

Then in N8N webhook node:
- Add authentication check
- Verify X-API-Key header
- Return 401 if invalid

---

## Monitoring & Analytics

### View Webhook Activity

In admin dashboard (`/public/admin.html`), webhooks show:
- ✅ Status: Success/Failed
- 🔗 Webhook: Which endpoint
- ⏱️ Response time
- 📊 Event type

### Enable Webhook Logs

```javascript
// In app.js, webhook calls are logged:
console.log(`[${APP_NAME}] 🔗 Sending to N8N webhook...`);
console.log(`[${APP_NAME}] ✅ N8N webhook response: ...`);
console.log(`[${APP_NAME}] ❌ N8N webhook error: ...`);
```

---

## Next Steps

1. ✅ Create N8N workflows (4 total)
2. ✅ Get webhook URLs from N8N
3. ✅ Update config with your URLs
4. ✅ Test webhooks in browser
5. ✅ Monitor in admin dashboard
6. ✅ Set up email notifications (optional)
7. ✅ Add database integration (optional)

---

## Support

### Documentation:
- Full N8N docs: https://docs.n8n.io/
- Webhook docs: https://docs.n8n.io/nodes/n8n-nodes-base.webhook/
- API reference: https://docs.n8n.io/api/

### Debug Info:

```javascript
// In browser console, check N8N config:
console.log('N8N Config:', window.N8N_CONFIG);
console.log('N8N Enabled:', window.N8N_CONFIG.enabled);
console.log('Base URL:', window.N8N_CONFIG.baseUrl);

// Test a webhook:
await sendToN8N(window.N8N_CONFIG.webhooks.newSubscription, {
  serviceName: 'Test',
  category: 'test',
  monthlyCost: 9.99
});
```

---

## Files Modified

1. **Created:** `/config/n8n-config.js` - Configuration file
2. **Updated:** `js/app.js` - Added webhook functions
3. **Updated:** All HTML files - Include config script

### Code Added:

- `sendToN8N()` - Main webhook sender
- `sendSubscriptionToN8N()` - Called on add subscription
- `sendCancellationToN8N()` - Called on cancel subscription
- `sendReviewToN8N()` - Called on review submission

---

**Status: Ready for N8N Configuration** ✅

All webhook infrastructure is in place. Follow the setup instructions above to connect your N8N instance!
