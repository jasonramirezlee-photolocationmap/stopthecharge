/* ========================================
   STOPTHECHARGE - Backend Configuration
   N8N Integration & API Settings
   ======================================== */

// ========================================
// ENVIRONMENT DETECTION
// ========================================
const IS_DEVELOPMENT = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ========================================
// N8N WEBHOOK CONFIGURATION
// ========================================
// Replace with your actual N8N instance URLs
// Format: https://your-n8n-instance.com/webhook/WEBHOOK_ID

const N8N_WEBHOOKS = {
    // Webhook for new subscription addition
    // Triggered when user adds a subscription
    ADD_SUBSCRIPTION: process.env.N8N_WEBHOOK_ADD_SUB || 
        'https://n8n.example.com/webhook/add-subscription',
    
    // Webhook for subscription cancellation
    // Triggered when user marks subscription as cancelled
    CANCEL_SUBSCRIPTION: process.env.N8N_WEBHOOK_CANCEL_SUB || 
        'https://n8n.example.com/webhook/cancel-subscription',
    
    // Webhook for sending reminder emails
    // Triggered 7 days before subscription renewal
    SEND_REMINDER_EMAIL: process.env.N8N_WEBHOOK_SEND_REMINDER || 
        'https://n8n.example.com/webhook/send-reminder-email',
    
    // Webhook for weekly digest emails
    // Triggered every Monday with upcoming renewals
    SEND_DIGEST_EMAIL: process.env.N8N_WEBHOOK_SEND_DIGEST || 
        'https://n8n.example.com/webhook/send-digest-email',
    
    // Webhook for welcome email
    // Triggered when user first creates account/visits app
    SEND_WELCOME_EMAIL: process.env.N8N_WEBHOOK_SEND_WELCOME || 
        'https://n8n.example.com/webhook/send-welcome-email',
    
    // Webhook for receiving cancellation reviews
    // Triggered when user submits feedback about cancellation process
    LOG_CANCELLATION_REVIEW: process.env.N8N_WEBHOOK_LOG_REVIEW || 
        'https://n8n.example.com/webhook/log-cancellation-review'
};

// ========================================
// EMAIL SERVICE CONFIGURATION
// ========================================
const EMAIL_CONFIG = {
    // Email service provider (N8N will handle actual sending)
    SERVICE: 'n8n',
    
    // Default sender address
    FROM_ADDRESS: process.env.EMAIL_FROM || 'noreply@stopthecharge.com',
    
    // Support email for user inquiries
    SUPPORT_EMAIL: process.env.EMAIL_SUPPORT || 'support@stopthecharge.com',
    
    // Admin notification email
    ADMIN_EMAIL: process.env.EMAIL_ADMIN || 'admin@stopthecharge.com',
    
    // Email sending timeout (ms)
    TIMEOUT: 30000,
    
    // Retry failed emails
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 5000
};

// ========================================
// API ENDPOINTS
// ========================================
const API_ENDPOINTS = {
    // Base URL for API calls (when backend is separate)
    BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
    
    // Subscriptions API
    SUBSCRIPTIONS: {
        LIST: '/api/subscriptions',
        CREATE: '/api/subscriptions',
        UPDATE: '/api/subscriptions/:id',
        DELETE: '/api/subscriptions/:id',
        GET_ONE: '/api/subscriptions/:id'
    },
    
    // Services API
    SERVICES: {
        LIST: '/api/services',
        GET_ONE: '/api/services/:id',
        SEARCH: '/api/services/search'
    },
    
    // Users API
    USERS: {
        CREATE: '/api/users',
        GET_PROFILE: '/api/users/profile',
        UPDATE_PROFILE: '/api/users/profile',
        GET_STATS: '/api/users/stats'
    },
    
    // Webhooks API
    WEBHOOKS: {
        TEST: '/api/webhooks/test',
        STATUS: '/api/webhooks/status',
        LOGS: '/api/webhooks/logs'
    },
    
    // Admin API
    ADMIN: {
        GET_SUBMISSIONS: '/api/admin/submissions',
        GET_WEBHOOK_STATUS: '/api/admin/webhook-status',
        GET_EMAIL_LOGS: '/api/admin/email-logs',
        GET_STATS: '/api/admin/stats'
    }
};

// ========================================
// WEBHOOK CONFIGURATION
// ========================================
const WEBHOOK_CONFIG = {
    // Webhook timeout (how long to wait for response)
    TIMEOUT: 10000,
    
    // Max retry attempts for failed webhooks
    MAX_RETRIES: 3,
    
    // Delay between retries (exponential backoff)
    RETRY_DELAY: 1000,
    
    // Log all webhook requests/responses
    LOG_ENABLED: true,
    
    // Store webhook logs in localStorage
    STORE_LOGS: true,
    
    // Max logs to keep in storage
    MAX_LOGS: 1000,
    
    // Events to log
    LOG_EVENTS: {
        REQUEST: 'webhook_request',
        SUCCESS: 'webhook_success',
        ERROR: 'webhook_error',
        RETRY: 'webhook_retry'
    }
};

// ========================================
// STORAGE CONFIGURATION
// ========================================
const STORAGE_CONFIG = {
    // Keys for localStorage
    KEYS: {
        SUBSCRIPTIONS: 'stopthecharge_subscriptions',
        SAVINGS: 'stopthecharge_savings',
        WEBHOOK_LOGS: 'stopthecharge_webhook_logs',
        USER_PROFILE: 'stopthecharge_user_profile',
        SETTINGS: 'stopthecharge_settings'
    },
    
    // Max items to store per category
    MAX_ITEMS: {
        WEBHOOK_LOGS: 1000,
        SUBSCRIPTIONS: 500
    }
};

// ========================================
// REMINDER CONFIGURATION
// ========================================
const REMINDER_CONFIG = {
    // Days before renewal to send reminder
    DAYS_BEFORE_RENEWAL: 7,
    
    // Send digest emails
    SEND_DIGEST: true,
    
    // Digest schedule (cron format, handled by N8N)
    DIGEST_SCHEDULE: '0 9 * * MON', // Every Monday at 9 AM
    
    // Reminder check interval (client-side, in ms)
    CHECK_INTERVAL: 86400000 // 24 hours
};

// ========================================
// ANALYTICS CONFIGURATION
// ========================================
const ANALYTICS_CONFIG = {
    // Track user actions
    TRACKING_ENABLED: true,
    
    // Events to track
    EVENTS: {
        ADD_SUBSCRIPTION: 'add_subscription',
        CANCEL_SUBSCRIPTION: 'cancel_subscription',
        VIEW_SERVICE: 'view_service',
        SEARCH_SERVICE: 'search_service',
        EXPORT_DATA: 'export_data',
        SUBMIT_REVIEW: 'submit_review'
    }
};

// ========================================
// FEATURE FLAGS
// ========================================
const FEATURE_FLAGS = {
    // Enable reminder emails
    REMINDERS_ENABLED: true,
    
    // Enable digest emails
    DIGEST_ENABLED: true,
    
    // Enable admin dashboard
    ADMIN_DASHBOARD_ENABLED: true,
    
    // Enable webhook logging
    WEBHOOK_LOGGING_ENABLED: true,
    
    // Enable local data persistence (localStorage)
    LOCAL_PERSISTENCE_ENABLED: true,
    
    // Enable PWA features
    PWA_ENABLED: true
};

// ========================================
// ERROR MESSAGES
// ========================================
const ERROR_MESSAGES = {
    WEBHOOK_TIMEOUT: 'Webhook request timed out. Please try again.',
    WEBHOOK_FAILED: 'Failed to send data. Your changes have been saved locally.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    NETWORK_ERROR: 'Network error. Changes saved locally.',
    STORAGE_ERROR: 'Failed to save data locally.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
};

// ========================================
// SUCCESS MESSAGES
// ========================================
const SUCCESS_MESSAGES = {
    SUBSCRIPTION_ADDED: 'Subscription added successfully!',
    SUBSCRIPTION_REMOVED: 'Subscription removed.',
    DATA_EXPORTED: 'Data exported successfully!',
    REVIEW_SUBMITTED: 'Thank you for your feedback!',
    EMAIL_SENT: 'Email sent successfully.',
    WEBHOOK_SUCCESS: 'Data synced to server.'
};

// ========================================
// EXPORT CONFIGURATION
// ========================================
module.exports = {
    IS_DEVELOPMENT,
    IS_PRODUCTION,
    N8N_WEBHOOKS,
    EMAIL_CONFIG,
    API_ENDPOINTS,
    WEBHOOK_CONFIG,
    STORAGE_CONFIG,
    REMINDER_CONFIG,
    ANALYTICS_CONFIG,
    FEATURE_FLAGS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
};

// ========================================
// FRONTEND-COMPATIBLE EXPORT
// ========================================
// For browser usage, export as window object
if (typeof window !== 'undefined') {
    window.StopTheChargeConfig = {
        N8N_WEBHOOKS,
        EMAIL_CONFIG,
        WEBHOOK_CONFIG,
        REMINDER_CONFIG,
        ANALYTICS_CONFIG,
        FEATURE_FLAGS,
        ERROR_MESSAGES,
        SUCCESS_MESSAGES,
        IS_DEVELOPMENT,
        IS_PRODUCTION
    };
}
