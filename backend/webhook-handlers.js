/* ========================================
   STOPTHECHARGE - Webhook Handlers
   N8N Integration - Send & Receive Data
   ======================================== */

// Import configuration (works in both Node.js and browser)
let CONFIG;
if (typeof module !== 'undefined' && module.exports) {
    CONFIG = require('./config.js');
} else if (typeof window !== 'undefined' && window.StopTheChargeConfig) {
    CONFIG = window.StopTheChargeConfig;
}

// ========================================
// WEBHOOK LOGGING & STORAGE
// ========================================
class WebhookLogger {
    constructor() {
        this.logs = this.loadLogs();
    }
    
    /**
     * Load logs from localStorage
     */
    loadLogs() {
        if (typeof localStorage !== 'undefined') {
            const stored = localStorage.getItem('webhook_logs');
            return stored ? JSON.parse(stored) : [];
        }
        return [];
    }
    
    /**
     * Save logs to localStorage
     */
    saveLogs() {
        if (typeof localStorage !== 'undefined' && CONFIG.WEBHOOK_CONFIG.STORE_LOGS) {
            const maxLogs = CONFIG.WEBHOOK_CONFIG.MAX_RETRIES || 1000;
            const logsToStore = this.logs.slice(-maxLogs);
            localStorage.setItem('webhook_logs', JSON.stringify(logsToStore));
        }
    }
    
    /**
     * Add log entry
     */
    addLog(event, data) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event,
            data,
            id: `log_${Date.now()}`
        };
        
        this.logs.push(logEntry);
        this.saveLogs();
        
        if (CONFIG.WEBHOOK_CONFIG.LOG_ENABLED) {
            console.log(`[Webhook] ${event}:`, logEntry);
        }
        
        return logEntry;
    }
    
    /**
     * Get all logs
     */
    getLogs() {
        return [...this.logs];
    }
    
    /**
     * Get logs by event type
     */
    getLogsByEvent(event) {
        return this.logs.filter(log => log.event === event);
    }
    
    /**
     * Clear logs
     */
    clearLogs() {
        this.logs = [];
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('webhook_logs');
        }
    }
}

const webhookLogger = new WebhookLogger();

// ========================================
// WEBHOOK HANDLERS
// ========================================

/**
 * Send subscription data to N8N
 * Called when user adds a new subscription
 */
async function sendSubscriptionWebhook(subscription, action = 'add') {
    const webhookUrl = CONFIG.N8N_WEBHOOKS.ADD_SUBSCRIPTION;
    
    const payload = {
        action: action, // 'add', 'update', 'view'
        subscription: {
            id: subscription.id,
            serviceName: subscription.serviceName,
            category: subscription.category,
            cost: subscription.cost,
            renewalDate: subscription.renewalDate,
            dateSaved: subscription.dateSaved || new Date().toISOString().split('T')[0]
        },
        metadata: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            source: 'stopthecharge_pwa'
        }
    };
    
    try {
        webhookLogger.addLog(
            CONFIG.WEBHOOK_CONFIG.LOG_EVENTS.REQUEST,
            { action: 'ADD_SUBSCRIPTION', url: webhookUrl }
        );
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Webhook-Source': 'stopthecharge-pwa',
                'X-Timestamp': new Date().toISOString()
            },
            body: JSON.stringify(payload),
            timeout: CONFIG.WEBHOOK_CONFIG.TIMEOUT
        });
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        webhookLogger.addLog(
            CONFIG.WEBHOOK_CONFIG.LOG_EVENTS.SUCCESS,
            { action: 'ADD_SUBSCRIPTION', response: responseData }
        );
        
        console.log('[Webhook] ✅ Subscription sent to N8N:', responseData);
        return { success: true, data: responseData };
        
    } catch (error) {
        webhookLogger.addLog(
            CONFIG.WEBHOOK_CONFIG.LOG_EVENTS.ERROR,
            { action: 'ADD_SUBSCRIPTION', error: error.message }
        );
        
        console.error('[Webhook] ❌ Failed to send subscription:', error);
        return { 
            success: false, 
            error: error.message,
            message: CONFIG.ERROR_MESSAGES.WEBHOOK_FAILED 
        };
    }
}

/**
 * Send cancellation data to N8N
 * Called when user marks subscription as cancelled
 */
async function sendCancellationWebhook(subscription, reason = '') {
    const webhookUrl = CONFIG.N8N_WEBHOOKS.CANCEL_SUBSCRIPTION;
    
    const payload = {
        action: 'cancel',
        subscription: {
            id: subscription.id,
            serviceName: subscription.serviceName,
            category: subscription.category,
            cost: subscription.cost,
            renewalDate: subscription.renewalDate,
            dateSaved: subscription.dateSaved,
            cancellationReason: reason || 'User initiated cancellation'
        },
        metadata: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            source: 'stopthecharge_pwa'
        }
    };
    
    try {
        webhookLogger.addLog(
            CONFIG.WEBHOOK_CONFIG.LOG_EVENTS.REQUEST,
            { action: 'CANCEL_SUBSCRIPTION', url: webhookUrl }
        );
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Webhook-Source': 'stopthecharge-pwa'
            },
            body: JSON.stringify(payload),
            timeout: CONFIG.WEBHOOK_CONFIG.TIMEOUT
        });
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        webhookLogger.addLog(
            CONFIG.WEBHOOK_CONFIG.LOG_EVENTS.SUCCESS,
            { action: 'CANCEL_SUBSCRIPTION', response: responseData }
        );
        
        console.log('[Webhook] ✅ Cancellation sent to N8N:', responseData);
        return { success: true, data: responseData };
        
    } catch (error) {
        webhookLogger.addLog(
            CONFIG.WEBHOOK_CONFIG.LOG_EVENTS.ERROR,
            { action: 'CANCEL_SUBSCRIPTION', error: error.message }
        );
        
        console.error('[Webhook] ❌ Failed to send cancellation:', error);
        return { 
            success: false, 
            error: error.message,
            message: CONFIG.ERROR_MESSAGES.WEBHOOK_FAILED 
        };
    }
}

/**
 * Trigger reminder email via N8N
 * Called 7 days before subscription renewal
 */
async function sendReminderEmailWebhook(subscription, userEmail) {
    const webhookUrl = CONFIG.N8N_WEBHOOKS.SEND_REMINDER_EMAIL;
    
    const payload = {
        action: 'send_reminder',
        recipient: {
            email: userEmail,
            type: 'reminder_email'
        },
        subscription: {
            serviceName: subscription.serviceName,
            renewalDate: subscription.renewalDate,
            cost: subscription.cost,
            daysUntilRenewal: calculateDaysUntilRenewal(subscription.renewalDate)
        },
        metadata: {
            timestamp: new Date().toISOString(),
            source: 'stopthecharge_pwa'
        }
    };
    
    try {
        webhookLogger.addLog(
            CONFIG.WEBHOOK_CONFIG.LOG_EVENTS.REQUEST,
            { action: 'SEND_REMINDER_EMAIL', recipient: userEmail }
        );
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Webhook-Source': 'stopthecharge-pwa'
            },
            body: JSON.stringify(payload),
            timeout: CONFIG.WEBHOOK_CONFIG.TIMEOUT
        });
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        webhookLogger.addLog(
            CONFIG.WEBHOOK_CONFIG.LOG_EVENTS.SUCCESS,
            { action: 'SEND_REMINDER_EMAIL', response: responseData }
        );
        
        console.log('[Webhook] ✅ Reminder email queued:', responseData);
        return { success: true, data: responseData };
        
    } catch (error) {
        webhookLogger.addLog(
            CONFIG.WEBHOOK_CONFIG.LOG_EVENTS.ERROR,
            { action: 'SEND_REMINDER_EMAIL', error: error.message }
        );
        
        console.error('[Webhook] ❌ Failed to send reminder:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Send weekly digest email via N8N
 * Contains list of upcoming renewals
 */
async function sendDigestEmailWebhook(subscriptions, userEmail) {
    const webhookUrl = CONFIG.N8N_WEBHOOKS.SEND_DIGEST_EMAIL;
    
    const upcomingRenewals = subscriptions
        .filter(sub => {
            const daysLeft = calculateDaysUntilRenewal(sub.renewalDate);
            return daysLeft >= 0 && daysLeft <= 30;
        })
        .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate));
    
    const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.cost, 0);
    
    const payload = {
        action: 'send_digest',
        recipient: {
            email: userEmail,
            type: 'weekly_digest'
        },
        digest: {
            upcomingRenewals: upcomingRenewals,
            totalSubscriptions: subscriptions.length,
            totalMonthlySpending: totalMonthly,
            upcomingCount: upcomingRenewals.length
        },
        metadata: {
            timestamp: new Date().toISOString(),
            dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
            source: 'stopthecharge_pwa'
        }
    };
    
    try {
        webhookLogger.addLog(
            CONFIG.WEBHOOK_CONFIG.LOG_EVENTS.REQUEST,
            { action: 'SEND_DIGEST_EMAIL', recipient: userEmail }
        );
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Webhook-Source': 'stopthecharge-pwa'
            },
            body: JSON.stringify(payload),
            timeout: CONFIG.WEBHOOK_CONFIG.TIMEOUT
        });
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        webhookLogger.addLog(
            CONFIG.WEBHOOK_CONFIG.LOG_EVENTS.SUCCESS,
            { action: 'SEND_DIGEST_EMAIL', response: responseData }
        );
        
        console.log('[Webhook] ✅ Digest email queued:', responseData);
        return { success: true, data: responseData };
        
    } catch (error) {
        webhookLogger.addLog(
            CONFIG.WEBHOOK_CONFIG.LOG_EVENTS.ERROR,
            { action: 'SEND_DIGEST_EMAIL', error: error.message }
        );
        
        console.error('[Webhook] ❌ Failed to send digest:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Send welcome email to new user
 */
async function sendWelcomeEmailWebhook(userEmail, userName = '') {
    const webhookUrl = CONFIG.N8N_WEBHOOKS.SEND_WELCOME_EMAIL;
    
    const payload = {
        action: 'send_welcome',
        recipient: {
            email: userEmail,
            name: userName,
            type: 'welcome_email'
        },
        metadata: {
            timestamp: new Date().toISOString(),
            source: 'stopthecharge_pwa'
        }
    };
    
    try {
        webhookLogger.addLog(
            CONFIG.WEBHOOK_CONFIG.LOG_EVENTS.REQUEST,
            { action: 'SEND_WELCOME_EMAIL', recipient: userEmail }
        );
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Webhook-Source': 'stopthecharge-pwa'
            },
            body: JSON.stringify(payload),
            timeout: CONFIG.WEBHOOK_CONFIG.TIMEOUT
        });
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        webhookLogger.addLog(
            CONFIG.WEBHOOK_CONFIG.LOG_EVENTS.SUCCESS,
            { action: 'SEND_WELCOME_EMAIL', response: responseData }
        );
        
        console.log('[Webhook] ✅ Welcome email sent:', responseData);
        return { success: true, data: responseData };
        
    } catch (error) {
        webhookLogger.addLog(
            CONFIG.WEBHOOK_CONFIG.LOG_EVENTS.ERROR,
            { action: 'SEND_WELCOME_EMAIL', error: error.message }
        );
        
        console.error('[Webhook] ❌ Failed to send welcome email:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Log cancellation review/feedback
 * Called when user submits feedback about cancellation process
 */
async function logCancellationReviewWebhook(review) {
    const webhookUrl = CONFIG.N8N_WEBHOOKS.LOG_CANCELLATION_REVIEW;
    
    const payload = {
        action: 'log_review',
        review: {
            id: review.id || `review_${Date.now()}`,
            serviceName: review.serviceName,
            difficulty: review.difficulty,
            rating: review.rating,
            feedback: review.feedback,
            helpful: review.helpful || false
        },
        metadata: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            source: 'stopthecharge_pwa'
        }
    };
    
    try {
        webhookLogger.addLog(
            CONFIG.WEBHOOK_CONFIG.LOG_EVENTS.REQUEST,
            { action: 'LOG_CANCELLATION_REVIEW', service: review.serviceName }
        );
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Webhook-Source': 'stopthecharge-pwa'
            },
            body: JSON.stringify(payload),
            timeout: CONFIG.WEBHOOK_CONFIG.TIMEOUT
        });
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        webhookLogger.addLog(
            CONFIG.WEBHOOK_CONFIG.LOG_EVENTS.SUCCESS,
            { action: 'LOG_CANCELLATION_REVIEW', response: responseData }
        );
        
        console.log('[Webhook] ✅ Review logged:', responseData);
        return { success: true, data: responseData };
        
    } catch (error) {
        webhookLogger.addLog(
            CONFIG.WEBHOOK_CONFIG.LOG_EVENTS.ERROR,
            { action: 'LOG_CANCELLATION_REVIEW', error: error.message }
        );
        
        console.error('[Webhook] ❌ Failed to log review:', error);
        return { success: false, error: error.message };
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Calculate days until subscription renewal
 */
function calculateDaysUntilRenewal(renewalDate) {
    const today = new Date();
    const renewal = new Date(renewalDate);
    const timeDiff = renewal - today;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

/**
 * Check if renewal reminder should be sent (7 days before)
 */
function shouldSendReminder(renewalDate) {
    const daysUntil = calculateDaysUntilRenewal(renewalDate);
    return daysUntil === CONFIG.REMINDER_CONFIG.DAYS_BEFORE_RENEWAL;
}

/**
 * Get webhook status (test webhook connectivity)
 */
async function testWebhookStatus(webhookUrl) {
    try {
        const response = await fetch(webhookUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 5000
        });
        
        return {
            webhookUrl,
            status: response.status,
            healthy: response.ok,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            webhookUrl,
            status: 'ERROR',
            healthy: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Get all webhook status
 */
async function getAllWebhookStatus() {
    const webhooks = Object.entries(CONFIG.N8N_WEBHOOKS);
    const statuses = await Promise.all(
        webhooks.map(([name, url]) => 
            testWebhookStatus(url).then(status => ({ name, ...status }))
        )
    );
    
    return statuses;
}

// ========================================
// EXPORTS
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sendSubscriptionWebhook,
        sendCancellationWebhook,
        sendReminderEmailWebhook,
        sendDigestEmailWebhook,
        sendWelcomeEmailWebhook,
        logCancellationReviewWebhook,
        webhookLogger,
        calculateDaysUntilRenewal,
        shouldSendReminder,
        testWebhookStatus,
        getAllWebhookStatus
    };
}

// Make available globally in browser
if (typeof window !== 'undefined') {
    window.WebhookHandlers = {
        sendSubscriptionWebhook,
        sendCancellationWebhook,
        sendReminderEmailWebhook,
        sendDigestEmailWebhook,
        sendWelcomeEmailWebhook,
        logCancellationReviewWebhook,
        webhookLogger,
        calculateDaysUntilRenewal,
        shouldSendReminder,
        testWebhookStatus,
        getAllWebhookStatus
    };
}
