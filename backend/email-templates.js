/* ========================================
   STOPTHECHARGE - Email Templates
   N8N Integration - Email Content
   ======================================== */

// ========================================
// REMINDER EMAIL TEMPLATE
// ========================================
const REMINDER_EMAIL_TEMPLATE = {
    id: 'reminder_email',
    name: 'Subscription Renewal Reminder',
    subject: '7 Days Until {{serviceName}} Renews - {{cost}}/month',
    description: 'Sent 7 days before subscription renewal',
    
    html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; }
        .reminder-box { background: white; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 6px; }
        .service-name { font-size: 24px; font-weight: bold; color: #4f46e5; }
        .renewal-info { background: #fef3c7; border-radius: 6px; padding: 15px; margin: 20px 0; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
        .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💳 StopTheCharge</h1>
            <p>Your Subscription Reminder</p>
        </div>
        
        <div class="content">
            <p>Hi {{userName}},</p>
            
            <p>Your subscription is renewing in <strong>7 days</strong>!</p>
            
            <div class="reminder-box">
                <p><strong>Service:</strong> <span class="service-name">{{serviceName}}</span></p>
                <p><strong>Renewal Date:</strong> {{renewalDate}}</p>
                <p><strong>Cost:</strong> ${{cost}}/month</p>
            </div>
            
            <div class="renewal-info">
                ⚠️ Don't forget to cancel if you're no longer using this service!
            </div>
            
            <p>Need help canceling? <a href="https://stopthecharge.com/services/{{serviceSlug}}">View our cancellation guide</a></p>
            
            <a href="https://stopthecharge.com/dashboard" class="button">Manage Subscriptions</a>
            
            <p style="margin-top: 40px; font-size: 12px; color: #6b7280;">
                You're receiving this reminder because you have {{serviceName}} tracked in StopTheCharge. 
                <a href="#">Unsubscribe from reminders</a>
            </p>
        </div>
        
        <div class="footer">
            <p>&copy; 2025 StopTheCharge. All rights reserved.</p>
            <p>Taking control of subscriptions, one reminder at a time.</p>
        </div>
    </div>
</body>
</html>
    `,
    
    text: `
StopTheCharge - Subscription Renewal Reminder

Hi {{userName}},

Your subscription is renewing in 7 days!

Service: {{serviceName}}
Renewal Date: {{renewalDate}}
Cost: ${{cost}}/month

Don't forget to cancel if you're no longer using this service!

View our cancellation guide: https://stopthecharge.com/services/{{serviceSlug}}

Manage your subscriptions: https://stopthecharge.com/dashboard

---
You're receiving this reminder because you have {{serviceName}} tracked in StopTheCharge.
&copy; 2025 StopTheCharge
    `
};

// ========================================
// WELCOME EMAIL TEMPLATE
// ========================================
const WELCOME_EMAIL_TEMPLATE = {
    id: 'welcome_email',
    name: 'Welcome to StopTheCharge',
    subject: 'Welcome to StopTheCharge - Take Control of Your Subscriptions',
    description: 'Sent when user first signs up or visits the app',
    
    html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; }
        .feature { display: flex; align-items: center; margin: 20px 0; }
        .feature-icon { font-size: 32px; margin-right: 15px; }
        .feature-text h3 { margin: 0 0 5px 0; color: #4f46e5; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; }
        .secondary-button { display: inline-block; background: white; color: #4f46e5; border: 2px solid #4f46e5; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-left: 10px; }
        .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">💳 Welcome to StopTheCharge</h1>
            <p style="margin: 10px 0 0 0;">Take Control of Your Subscriptions</p>
        </div>
        
        <div class="content">
            <p>Hi {{userName}},</p>
            
            <p>Welcome to StopTheCharge! We're excited to help you manage and save money on your subscriptions.</p>
            
            <h2>Here's what you can do:</h2>
            
            <div class="feature">
                <div class="feature-icon">📚</div>
                <div class="feature-text">
                    <h3>Browse 500+ Services</h3>
                    <p>Find detailed cancellation guides for your favorite services</p>
                </div>
            </div>
            
            <div class="feature">
                <div class="feature-icon">📋</div>
                <div class="feature-text">
                    <h3>Track Your Subscriptions</h3>
                    <p>Keep all your recurring payments in one place</p>
                </div>
            </div>
            
            <div class="feature">
                <div class="feature-icon">🔔</div>
                <div class="feature-text">
                    <h3>Get Reminders</h3>
                    <p>Never miss a renewal date with smart notifications</p>
                </div>
            </div>
            
            <div class="feature">
                <div class="feature-icon">💰</div>
                <div class="feature-text">
                    <h3>Track Your Savings</h3>
                    <p>See exactly how much money you're saving</p>
                </div>
            </div>
            
            <p style="margin-top: 30px;">
                <a href="https://stopthecharge.com/public/directory.html" class="button">Browse Services</a>
                <a href="https://stopthecharge.com/public/dashboard.html" class="secondary-button">Go to Dashboard</a>
            </p>
            
            <p style="margin-top: 40px; font-size: 12px; color: #6b7280;">
                Questions? <a href="mailto:support@stopthecharge.com">Contact us</a>
            </p>
        </div>
        
        <div class="footer">
            <p>&copy; 2025 StopTheCharge. All rights reserved.</p>
            <p>Start saving money today!</p>
        </div>
    </div>
</body>
</html>
    `,
    
    text: `
Welcome to StopTheCharge!

Hi {{userName}},

Welcome to StopTheCharge! We're excited to help you manage and save money on your subscriptions.

Here's what you can do:

📚 Browse 500+ Services - Find detailed cancellation guides
📋 Track Your Subscriptions - Keep all recurring payments in one place
🔔 Get Reminders - Never miss a renewal date
💰 Track Your Savings - See how much money you're saving

Get started: https://stopthecharge.com/public/directory.html
Go to Dashboard: https://stopthecharge.com/public/dashboard.html

Questions? Contact us at support@stopthecharge.com

---
&copy; 2025 StopTheCharge
    `
};

// ========================================
// CANCELLATION CONFIRMATION TEMPLATE
// ========================================
const CANCELLATION_CONFIRMATION_TEMPLATE = {
    id: 'cancellation_confirmation',
    name: 'Cancellation Confirmation',
    subject: 'Cancellation Logged: {{serviceName}}',
    description: 'Sent when user marks a subscription as cancelled',
    
    html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f0fdf4; padding: 30px; border: 1px solid #d1fae5; }
        .success-box { background: white; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 6px; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
        .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 28px;">✅ Cancellation Logged</h1>
        </div>
        
        <div class="content">
            <p>Hi {{userName}},</p>
            
            <p>Great! We've logged your cancellation for <strong>{{serviceName}}</strong>.</p>
            
            <div class="success-box">
                <p><strong>Service:</strong> {{serviceName}}</p>
                <p><strong>Cancellation Date:</strong> {{cancellationDate}}</p>
                <p><strong>Monthly Savings:</strong> ${{monthlySavings}}</p>
            </div>
            
            <h3>What's next?</h3>
            <ul>
                <li>Keep an eye on your email for confirmation from {{serviceName}}</li>
                <li>Check your bank account to ensure the charges stop</li>
                <li>We'll send you reminders about your other subscriptions</li>
            </ul>
            
            <p><strong>Found this helpful?</strong> Help others by sharing your cancellation experience!</p>
            
            <a href="https://stopthecharge.com/services/{{serviceSlug}}/review" class="button">Leave a Review</a>
            
            <p style="margin-top: 30px;">
                <a href="https://stopthecharge.com/public/dashboard.html">Back to Dashboard</a>
            </p>
        </div>
        
        <div class="footer">
            <p>&copy; 2025 StopTheCharge. All rights reserved.</p>
            <p>Congratulations on saving money! 🎉</p>
        </div>
    </div>
</body>
</html>
    `,
    
    text: `
StopTheCharge - Cancellation Logged ✅

Hi {{userName}},

Great! We've logged your cancellation for {{serviceName}}.

Service: {{serviceName}}
Cancellation Date: {{cancellationDate}}
Monthly Savings: ${{monthlySavings}}

What's next?
- Keep an eye on your email for confirmation from {{serviceName}}
- Check your bank account to ensure the charges stop
- We'll send you reminders about your other subscriptions

Help others by sharing your cancellation experience:
https://stopthecharge.com/services/{{serviceSlug}}/review

Back to Dashboard: https://stopthecharge.com/public/dashboard.html

---
&copy; 2025 StopTheCharge
Congratulations on saving money! 🎉
    `
};

// ========================================
// WEEKLY DIGEST TEMPLATE
// ========================================
const WEEKLY_DIGEST_TEMPLATE = {
    id: 'weekly_digest',
    name: 'Weekly Subscription Digest',
    subject: 'Your Weekly Digest: {{upcomingCount}} Renewals This Week',
    description: 'Sent every Monday with upcoming renewals for the week',
    
    html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; }
        .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .stat-box { background: white; border: 1px solid #e5e7eb; padding: 15px; border-radius: 6px; text-align: center; }
        .stat-number { font-size: 28px; font-weight: bold; color: #4f46e5; }
        .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
        .renewal-item { background: white; border-left: 4px solid #667eea; padding: 15px; margin: 10px 0; border-radius: 4px; }
        .renewal-date { font-weight: bold; color: #4f46e5; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
        .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Weekly Digest</h1>
            <p>Your subscription summary for the week</p>
        </div>
        
        <div class="content">
            <p>Hi {{userName}},</p>
            
            <p>Here's your weekly subscription digest:</p>
            
            <div class="stats">
                <div class="stat-box">
                    <div class="stat-number">{{totalSubscriptions}}</div>
                    <div class="stat-label">Active Subscriptions</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${{totalMonthlySpending}}</div>
                    <div class="stat-label">Monthly Spending</div>
                </div>
            </div>
            
            <h3>Renewals This Week ({{upcomingCount}})</h3>
            
            {{#upcomingRenewals}}
            <div class="renewal-item">
                <div class="renewal-date">{{renewalDate}}: {{serviceName}}</div>
                <div>${{cost}}/month</div>
                <a href="https://stopthecharge.com/services/{{serviceSlug}}" style="font-size: 12px; color: #667eea;">View cancellation guide →</a>
            </div>
            {{/upcomingRenewals}}
            
            {{#noUpcoming}}
            <p style="text-align: center; color: #6b7280; padding: 20px;">
                ✨ No renewals coming up this week. Great job staying organized!
            </p>
            {{/noUpcoming}}
            
            <p style="margin-top: 30px;">
                <a href="https://stopthecharge.com/public/dashboard.html" class="button">View Full Dashboard</a>
            </p>
        </div>
        
        <div class="footer">
            <p>&copy; 2025 StopTheCharge. All rights reserved.</p>
            <p>Stay in control of your subscriptions</p>
        </div>
    </div>
</body>
</html>
    `,
    
    text: `
StopTheCharge - Weekly Digest

Hi {{userName}},

Here's your weekly subscription digest:

Active Subscriptions: {{totalSubscriptions}}
Monthly Spending: ${{totalMonthlySpending}}

Renewals This Week ({{upcomingCount}}):

{{#upcomingRenewals}}
{{renewalDate}}: {{serviceName}} - ${{cost}}/month
View guide: https://stopthecharge.com/services/{{serviceSlug}}

{{/upcomingRenewals}}

{{#noUpcoming}}
✨ No renewals coming up this week. Great job staying organized!
{{/noUpcoming}}

View Full Dashboard: https://stopthecharge.com/public/dashboard.html

---
&copy; 2025 StopTheCharge
    `
};

// ========================================
// CANCELLATION FAILED TEMPLATE
// ========================================
const CANCELLATION_FAILED_TEMPLATE = {
    id: 'cancellation_failed',
    name: 'Unable to Cancel - Help Available',
    subject: 'Having Trouble Canceling {{serviceName}}?',
    description: 'Sent if user marks subscription as "hard to cancel"',
    
    html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #fffbeb; padding: 30px; border: 1px solid #fde68a; }
        .help-box { background: white; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 6px; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
        .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">Need Help Canceling?</h1>
            <p style="margin: 10px 0 0 0;">We're here to assist you with {{serviceName}}</p>
        </div>
        
        <div class="content">
            <p>Hi {{userName}},</p>
            
            <p>We noticed you're having trouble canceling {{serviceName}}. We're here to help!</p>
            
            <div class="help-box">
                <h3 style="margin-top: 0;">We can help you:</h3>
                <ul>
                    <li>Find the correct cancellation page</li>
                    <li>Navigate tricky cancellation processes</li>
                    <li>Draft cancellation emails if needed</li>
                    <li>Report issues directly to the service</li>
                </ul>
            </div>
            
            <p><strong>Contact us and we'll help you get it done:</strong></p>
            
            <a href="mailto:support@stopthecharge.com?subject=Help Canceling {{serviceName}}" class="button">Email Support</a>
            
            <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
                Or include your details here: <a href="https://stopthecharge.com/help">Submit a Help Request</a>
            </p>
        </div>
        
        <div class="footer">
            <p>&copy; 2025 StopTheCharge. All rights reserved.</p>
            <p>We're committed to helping you save money</p>
        </div>
    </div>
</body>
</html>
    `,
    
    text: `
StopTheCharge - Help Canceling {{serviceName}}

Hi {{userName}},

We noticed you're having trouble canceling {{serviceName}}. We're here to help!

We can help you:
- Find the correct cancellation page
- Navigate tricky cancellation processes
- Draft cancellation emails if needed
- Report issues directly to the service

Contact us and we'll help you get it done:
Email: support@stopthecharge.com
Subject: Help Canceling {{serviceName}}

Or submit a help request: https://stopthecharge.com/help

---
&copy; 2025 StopTheCharge
We're committed to helping you save money
    `
};

// ========================================
// EXPORT ALL TEMPLATES
// ========================================
const EMAIL_TEMPLATES = {
    reminder: REMINDER_EMAIL_TEMPLATE,
    welcome: WELCOME_EMAIL_TEMPLATE,
    cancellationConfirmation: CANCELLATION_CONFIRMATION_TEMPLATE,
    weeklyDigest: WEEKLY_DIGEST_TEMPLATE,
    cancellationFailed: CANCELLATION_FAILED_TEMPLATE
};

// ========================================
// TEMPLATE RENDERER
// ========================================
/**
 * Render email template with variables
 * @param {string} templateId - ID of the template
 * @param {object} variables - Variables to replace in template
 * @param {string} format - 'html' or 'text'
 * @returns {string} - Rendered template
 */
function renderTemplate(templateId, variables = {}, format = 'html') {
    const template = EMAIL_TEMPLATES[templateId];
    if (!template) {
        console.error(`Template not found: ${templateId}`);
        return '';
    }
    
    let content = format === 'html' ? template.html : template.text;
    
    // Replace variables: {{variableName}}
    Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        content = content.replace(regex, value || '');
    });
    
    // Remove unrendered variables
    content = content.replace(/{{.*?}}/g, '');
    
    return content;
}

/**
 * Get template by ID
 */
function getTemplate(templateId) {
    return EMAIL_TEMPLATES[templateId];
}

/**
 * Get all templates
 */
function getAllTemplates() {
    return EMAIL_TEMPLATES;
}

// ========================================
// EXPORTS
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        REMINDER_EMAIL_TEMPLATE,
        WELCOME_EMAIL_TEMPLATE,
        CANCELLATION_CONFIRMATION_TEMPLATE,
        WEEKLY_DIGEST_TEMPLATE,
        CANCELLATION_FAILED_TEMPLATE,
        EMAIL_TEMPLATES,
        renderTemplate,
        getTemplate,
        getAllTemplates
    };
}

// Make available globally in browser
if (typeof window !== 'undefined') {
    window.EmailTemplates = {
        REMINDER_EMAIL_TEMPLATE,
        WELCOME_EMAIL_TEMPLATE,
        CANCELLATION_CONFIRMATION_TEMPLATE,
        WEEKLY_DIGEST_TEMPLATE,
        CANCELLATION_FAILED_TEMPLATE,
        EMAIL_TEMPLATES,
        renderTemplate,
        getTemplate,
        getAllTemplates
    };
}
