/* ========================================
   STOPTHECHARGE - Main Application JavaScript
   Progressive Web App Functionality
   ======================================== */

// Note: Import backend modules if available
// In production, these would be loaded via script tags or bundler
// const webhookHandlers = require('../backend/webhook-handlers.js');
// const emailTemplates = require('../backend/email-templates.js');
// const config = require('../backend/config.js');

/* ========================================
   CONSTANTS
   ======================================== */
const APP_NAME = 'StopTheCharge';
const SERVICE_WORKER_PATH = 'service-worker.js'; // Relative path from /public
const STORAGE_KEY = 'stopthecharge_subscriptions';
const STORAGE_SAVINGS_KEY = 'stopthecharge_savings';
const N8N_WEBHOOK_ENABLED = true; // Set to false to disable webhooks

/* ========================================
   STATE MANAGEMENT
   ======================================== */
let appState = {
    isOnline: navigator.onLine,
    serviceWorkerReady: false,
    installPromptEvent: null,
    services: [],
    subscriptions: []
};

/* ========================================
   MOCK DATA: SUBSCRIPTION SERVICES
   ======================================== */
const SERVICES_DATA = [
    {
        id: 'netflix',
        name: 'Netflix',
        icon: '🎬',
        category: 'streaming',
        difficulty: 'easy',
        cost: 15.99,
        estimatedTime: '2 minutes',
        cancellationMethod: 'Online',
        steps: [
            'Go to account settings',
            'Select "Membership & Billing"',
            'Click "Cancel membership"',
            'Select reason (optional)',
            'Click "Cancel" to confirm'
        ],
        notes: [
            'You can reactivate anytime within 10 months',
            'You\'ll have access until the end of your billing cycle',
            'No refunds for partial months'
        ],
        reviews: [
            { rating: 5, username: 'jsmith92', date: '2025-11-10', text: 'Super easy to cancel! Did it in under 2 minutes.' },
            { rating: 5, username: 'movieFan', date: '2025-11-08', text: 'No hassle at all. Instructions were very clear.' }
        ],
        contact: { phone: '1-866-579-7172', email: 'help@netflix.com', chat: 'Available 24/7' }
    },
    {
        id: 'hulu',
        name: 'Hulu',
        icon: '📺',
        category: 'streaming',
        difficulty: 'easy',
        cost: 7.99,
        estimatedTime: '3 minutes',
        cancellationMethod: 'Online',
        steps: [
            'Log into your Hulu account',
            'Go to "Account" > "Billing Info"',
            'Click "Cancel Subscription"',
            'Confirm cancellation'
        ],
        notes: [
            'You\'ll still have access until the end of your billing cycle',
            'Cancellations take effect immediately after your current billing period'
        ],
        reviews: [
            { rating: 4, username: 'tvLover', date: '2025-11-05', text: 'Straightforward process. Took about 3 minutes.' }
        ],
        contact: { phone: '1-888-849-9421', email: 'support@hulu.com', chat: 'Available' }
    },
    {
        id: 'disney-plus',
        name: 'Disney+',
        icon: '👑',
        category: 'streaming',
        difficulty: 'easy',
        cost: 7.99,
        estimatedTime: '2 minutes',
        cancellationMethod: 'Online',
        steps: [
            'Sign in to your Disney+ account',
            'Go to "Account" > "Subscription"',
            'Click "Cancel Subscription"',
            'Confirm your cancellation'
        ],
        notes: [
            'Access continues until end of billing period',
            'Bundle cancellations work differently'
        ],
        reviews: [
            { rating: 5, username: 'disneyFan', date: '2025-11-01', text: 'Very easy process. No surprises!' }
        ],
        contact: { phone: '1-844-393-2326', email: 'help@disneyplus.com', chat: 'Yes' }
    },
    {
        id: 'spotify',
        name: 'Spotify',
        icon: '🎵',
        category: 'streaming',
        difficulty: 'easy',
        cost: 10.99,
        estimatedTime: '1 minute',
        cancellationMethod: 'Online',
        steps: [
            'Go to spotify.com/account',
            'Click "Download your data" or scroll to Subscription',
            'Click "Change plan" or "Upgrade/Downgrade"',
            'Select "Spotify Free" to downgrade'
        ],
        notes: [
            'Downgrading removes premium features but keeps your account',
            'To fully delete, go to Privacy settings'
        ],
        reviews: [
            { rating: 5, username: 'musicLover', date: '2025-10-28', text: 'Takes literally 30 seconds!' }
        ],
        contact: { phone: 'No phone support', email: 'support@spotify.com', chat: 'Yes' }
    },
    {
        id: 'apple-music',
        name: 'Apple Music',
        icon: '🎶',
        category: 'streaming',
        difficulty: 'medium',
        cost: 10.99,
        estimatedTime: '5 minutes',
        cancellationMethod: 'Online/iTunes',
        steps: [
            'Open Apple Music app on your device',
            'Tap "Listen Now" tab',
            'Tap your profile icon',
            'Tap "Subscription"',
            'Tap "Cancel Subscription"'
        ],
        notes: [
            'Can also cancel through Apple ID settings',
            'Family plans require family organizer approval'
        ],
        reviews: [
            { rating: 4, username: 'appleUser', date: '2025-10-25', text: 'Not too hard but a bit buried in menus.' }
        ],
        contact: { phone: '1-800-MY-APPLE', email: 'support@apple.com', chat: 'Yes' }
    },
    {
        id: 'planet-fitness',
        name: 'Planet Fitness',
        icon: '💪',
        category: 'fitness',
        difficulty: 'hard',
        cost: 24.99,
        estimatedTime: '15 minutes',
        cancellationMethod: 'In-Person',
        steps: [
            'Call your local Planet Fitness gym',
            'Speak to membership manager',
            'Provide member ID and reason for cancellation',
            'Confirm cancellation via phone or in person',
            'Request cancellation letter in writing'
        ],
        notes: [
            'No online cancellation available',
            'Must call or visit in person',
            'Early termination fees may apply',
            'Some locations may try to retain you with offers'
        ],
        reviews: [
            { rating: 1, username: 'frustrated_gym', date: '2025-10-20', text: 'Nightmare! They make it impossible to cancel.' },
            { rating: 2, username: 'gymRat', date: '2025-10-15', text: 'Very difficult. Took 3 phone calls.' }
        ],
        contact: { phone: 'Your local gym', email: 'customer.service@planetfitness.com', chat: 'Limited' }
    },
    {
        id: 'la-fitness',
        name: 'LA Fitness',
        icon: '🏋️',
        category: 'fitness',
        difficulty: 'hard',
        cost: 29.99,
        estimatedTime: '20 minutes',
        cancellationMethod: 'In-Person/Mail',
        steps: [
            'Visit your LA Fitness location',
            'Request membership cancellation form',
            'Fill out and sign the form',
            'Or mail certified letter to corporate office',
            'Keep confirmation receipt'
        ],
        notes: [
            'No online cancellation',
            'Requires 30-day notice',
            'Early termination fees may apply',
            'Membership must be current to cancel'
        ],
        reviews: [
            { rating: 1, username: 'cancelFail', date: '2025-10-10', text: 'Extremely difficult. Tried 5 times!' }
        ],
        contact: { phone: '1-800-54-LAFIT', email: 'memberservices@lafitness.com', chat: 'No' }
    },
    {
        id: 'equinox',
        name: 'Equinox',
        icon: '🤸',
        category: 'fitness',
        difficulty: 'medium',
        cost: 200.00,
        estimatedTime: '10 minutes',
        cancellationMethod: 'In-Person',
        steps: [
            'Call your Equinox club',
            'Request membership cancellation',
            'Provide member ID',
            'Visit in person with valid ID to finalize',
            'Receive cancellation confirmation'
        ],
        notes: [
            'Membership freeze available as alternative',
            'May offer retention offers',
            '30-60 day cancellation notice required'
        ],
        reviews: [
            { rating: 3, username: 'premiumMember', date: '2025-10-05', text: 'Process is okay but they keep trying to convince you not to cancel.' }
        ],
        contact: { phone: 'Your local club', email: 'membercare@equinox.com', chat: 'Yes' }
    },
    {
        id: 'adobe',
        name: 'Adobe Creative Cloud',
        icon: '🎨',
        category: 'software',
        difficulty: 'easy',
        cost: 54.99,
        estimatedTime: '3 minutes',
        cancellationMethod: 'Online',
        steps: [
            'Go to account.adobe.com',
            'Sign in with your Adobe ID',
            'Click "Plans & Subscriptions"',
            'Click "Manage Plans"',
            'Click "Cancel plan"',
            'Follow the prompts'
        ],
        notes: [
            'Annual plans may have early termination fees',
            'Can downgrade instead of canceling',
            'Creative Cloud files remain accessible'
        ],
        reviews: [
            { rating: 5, username: 'designer', date: '2025-10-01', text: 'Super easy! No tricks.' }
        ],
        contact: { phone: '1-800-585-0774', email: 'support@adobe.com', chat: 'Yes' }
    },
    {
        id: 'microsoft-365',
        name: 'Microsoft 365',
        icon: '📊',
        category: 'software',
        difficulty: 'easy',
        cost: 9.99,
        estimatedTime: '2 minutes',
        cancellationMethod: 'Online',
        steps: [
            'Go to account.microsoft.com',
            'Click "Your Services"',
            'Find Microsoft 365',
            'Click "Manage" or "Cancel subscription"',
            'Confirm cancellation'
        ],
        notes: [
            'You can still view files after cancellation',
            'Consider downgrading to free version',
            'Annual plans may have cancellation fees'
        ],
        reviews: [
            { rating: 5, username: 'officeUser', date: '2025-09-28', text: 'Very straightforward!' }
        ],
        contact: { phone: '1-888-225-4786', email: 'support@microsoft.com', chat: 'Yes' }
    },
    {
        id: 'dropbox',
        name: 'Dropbox',
        icon: '☁️',
        category: 'software',
        difficulty: 'easy',
        cost: 9.99,
        estimatedTime: '2 minutes',
        cancellationMethod: 'Online',
        steps: [
            'Log in to dropbox.com',
            'Click profile icon > Settings',
            'Go to "Subscription" tab',
            'Click "Downgrade to Basic"',
            'Confirm'
        ],
        notes: [
            'Downgrade is recommended over deletion',
            'Keep 2GB free storage after downgrade'
        ],
        reviews: [
            { rating: 5, username: 'cloudUser', date: '2025-09-25', text: 'One click!' }
        ],
        contact: { phone: 'No direct phone', email: 'support@dropbox.com', chat: 'Yes' }
    },
    {
        id: 'ps-plus',
        name: 'PlayStation Plus',
        icon: '🎮',
        category: 'gaming',
        difficulty: 'easy',
        cost: 9.99,
        estimatedTime: '3 minutes',
        cancellationMethod: 'Online',
        steps: [
            'Go to console Settings > Users & Accounts',
            'Select your account > Account info > Subscription',
            'Or visit account.playstation.com',
            'Click "Manage Subscriptions"',
            'Click "Cancel Auto-Renewal"'
        ],
        notes: [
            'Service continues until end of billing period',
            'Auto-renewal will turn back on after renewal',
            'Can reactivate anytime'
        ],
        reviews: [
            { rating: 5, username: 'gamer123', date: '2025-09-20', text: 'Super easy on console or web!' }
        ],
        contact: { phone: '1-800-345-7669', email: 'support@playstation.com', chat: 'Yes' }
    },
    {
        id: 'xbox-gamepass',
        name: 'Xbox Game Pass',
        icon: '🎯',
        category: 'gaming',
        difficulty: 'easy',
        cost: 17.99,
        estimatedTime: '2 minutes',
        cancellationMethod: 'Online',
        steps: [
            'Go to xbox.com',
            'Sign in and go to Subscriptions',
            'Find Xbox Game Pass',
            'Click "Manage"',
            'Click "Cancel subscription"'
        ],
        notes: [
            'Promotions may lock you in for 12 months',
            'Game Pass for PC and Console are separate'
        ],
        reviews: [
            { rating: 5, username: 'xboxFan', date: '2025-09-15', text: 'Straightforward process!' }
        ],
        contact: { phone: '1-888-469-9696', email: 'support@xbox.com', chat: 'Yes' }
    },
    {
        id: 'switch-online',
        name: 'Nintendo Switch Online',
        icon: '🎮',
        category: 'gaming',
        difficulty: 'easy',
        cost: 4.99,
        estimatedTime: '3 minutes',
        cancellationMethod: 'Online',
        steps: [
            'Open Settings on your Switch',
            'Go to User Settings > Subscriptions',
            'Select "Software Subscriptions"',
            'Click "Cancel Subscription"'
        ],
        notes: [
            'Can switch between Individual and Family plans',
            'No penalties for cancellation'
        ],
        reviews: [
            { rating: 5, username: 'nintendoFan', date: '2025-09-10', text: 'Very easy!' }
        ],
        contact: { phone: '1-800-255-3700', email: 'support@nintendo.com', chat: 'Limited' }
    },
    {
        id: 'amazon-prime',
        name: 'Amazon Prime',
        icon: '📦',
        category: 'shopping',
        difficulty: 'easy',
        cost: 139.00,
        estimatedTime: '2 minutes',
        cancellationMethod: 'Online',
        steps: [
            'Go to amazon.com',
            'Click Account & Lists > Your Account',
            'Select "Prime Membership"',
            'Click "End membership"',
            'Click "Continue to Cancellation"'
        ],
        notes: [
            'You keep benefits until end of membership period',
            'Can resume Prime at any time',
            'May have prorated refunds'
        ],
        reviews: [
            { rating: 5, username: 'primeUser', date: '2025-09-05', text: 'Easy peasy!' }
        ],
        contact: { phone: '1-888-280-4331', email: 'support@amazon.com', chat: 'Yes' }
    },
    {
        id: 'costco',
        name: 'Costco Membership',
        icon: '🛒',
        category: 'shopping',
        difficulty: 'medium',
        cost: 60.00,
        estimatedTime: '10 minutes',
        cancellationMethod: 'In-Person/Phone',
        steps: [
            'Call 1-800-955-2292',
            'Or visit your local Costco warehouse',
            'Request membership cancellation',
            'You may be offered a refund or downgrade',
            'Provide member card'
        ],
        notes: [
            'Refunds for unused membership available',
            'Membership is tied to card in system',
            'Can take 24-48 hours to process'
        ],
        reviews: [
            { rating: 3, username: 'savingsHunter', date: '2025-09-01', text: 'Easy to cancel by phone, but they try to convince you to stay.' }
        ],
        contact: { phone: '1-800-955-2292', email: 'memberservices@costco.com', chat: 'No' }
    },
    {
        id: 'sams-club',
        name: "Sam's Club",
        icon: '🏪',
        category: 'shopping',
        difficulty: 'medium',
        cost: 50.00,
        estimatedTime: '10 minutes',
        cancellationMethod: 'In-Person/Phone',
        steps: [
            'Call 1-888-746-7726',
            'Or visit your nearest Sam\'s Club',
            'Ask to cancel membership',
            'Provide member number',
            'May be offered refund or options'
        ],
        notes: [
            'Refund available for remaining months',
            'Can cancel anytime',
            'May take a few business days to process'
        ],
        reviews: [
            { rating: 4, username: 'clubMember', date: '2025-08-28', text: 'Pretty straightforward. They did try to upsell me though.' }
        ],
        contact: { phone: '1-888-746-7726', email: 'memberservices@samsclub.com', chat: 'Limited' }
    },
    {
        id: 'nyt',
        name: 'New York Times',
        icon: '📰',
        category: 'news',
        difficulty: 'easy',
        cost: 17.00,
        estimatedTime: '2 minutes',
        cancellationMethod: 'Online',
        steps: [
            'Go to nytimes.com',
            'Sign in to your account',
            'Click Account > Manage',
            'Find Subscription in left menu',
            'Click "Cancel Digital Subscription"'
        ],
        notes: [
            'No refunds for partial months',
            'You can pause temporarily',
            'Archives remain accessible after cancellation'
        ],
        reviews: [
            { rating: 5, username: 'newsReader', date: '2025-08-25', text: 'Very easy online!' }
        ],
        contact: { phone: '1-888-698-9999', email: 'help@nytimes.com', chat: 'Yes' }
    },
    {
        id: 'wsj',
        name: 'Wall Street Journal',
        icon: '📊',
        category: 'news',
        difficulty: 'medium',
        cost: 38.00,
        estimatedTime: '5 minutes',
        cancellationMethod: 'Online/Phone',
        steps: [
            'Go to wsj.com',
            'Sign in and go to My Account',
            'Click "Subscriptions"',
            'Click "Manage" next to your subscription',
            'Follow prompts to cancel or call customer service'
        ],
        notes: [
            'May offer retention discount',
            'Bundle subscriptions require special handling',
            'Archives and email newsletters may stop immediately'
        ],
        reviews: [
            { rating: 3, username: 'businessReader', date: '2025-08-22', text: 'Takes a bit of clicking around but possible online.' }
        ],
        contact: { phone: '1-800-369-2834', email: 'support@wsj.com', chat: 'Yes' }
    },
    {
        id: 'hellofresh',
        name: 'HelloFresh',
        icon: '🍽️',
        category: 'food',
        difficulty: 'easy',
        cost: 55.00,
        estimatedTime: '2 minutes',
        cancellationMethod: 'Online',
        steps: [
            'Log into hellofresh.com',
            'Go to Account Settings',
            'Click "Subscriptions" or "Manage Subscription"',
            'Select "Skip" or "Cancel Subscription"',
            'Choose date for cancellation'
        ],
        notes: [
            'Can skip weeks instead of canceling',
            'Cancellation takes effect next delivery date',
            'Paused subscriptions auto-resume'
        ],
        reviews: [
            { rating: 5, username: 'foodie', date: '2025-08-20', text: 'Super easy! Love that you can skip weeks too.' }
        ],
        contact: { phone: '1-877-743-3878', email: 'support@hellofresh.com', chat: 'Yes' }
    },
    {
        id: 'blue-apron',
        name: 'Blue Apron',
        icon: '🍳',
        category: 'food',
        difficulty: 'easy',
        cost: 60.00,
        estimatedTime: '2 minutes',
        cancellationMethod: 'Online',
        steps: [
            'Sign into blueapron.com',
            'Click Account > Subscription',
            'Click "Manage Subscriptions"',
            'Select "Cancel" or "Skip This Week"',
            'Confirm cancellation'
        ],
        notes: [
            'You can pause instead of cancel',
            'Cancellation effective after next shipment',
            'No cancellation fees'
        ],
        reviews: [
            { rating: 5, username: 'homeChef', date: '2025-08-18', text: 'Very simple to cancel!' }
        ],
        contact: { phone: '1-844-278-2776', email: 'hello@blueapron.com', chat: 'Yes' }
    },
    {
        id: 'peloton',
        name: 'Peloton',
        icon: '🚴',
        category: 'fitness',
        difficulty: 'medium',
        cost: 44.00,
        estimatedTime: '5 minutes',
        cancellationMethod: 'Online/App',
        steps: [
            'Open Peloton app or go to peloton.com',
            'Go to Account Settings',
            'Select "Manage Subscription"',
            'Click "Cancel Membership"',
            'Follow cancellation prompts',
            'Confirm cancellation'
        ],
        notes: [
            'If within 30-day trial, you get full refund',
            'After trial, no refunds for prepaid months',
            'Can reactivate anytime'
        ],
        reviews: [
            { rating: 4, username: 'fitnessFanatic', date: '2025-08-15', text: 'Easy enough but took a few clicks.' }
        ],
        contact: { phone: '1-866-679-9129', email: 'support@pelotoncycle.com', chat: 'Yes' }
    },
    {
        id: 'classpass',
        name: 'ClassPass',
        icon: '🧘',
        category: 'fitness',
        difficulty: 'easy',
        cost: 99.00,
        estimatedTime: '2 minutes',
        cancellationMethod: 'Online',
        steps: [
            'Log into classpass.com',
            'Go to Account Settings',
            'Click "Membership Settings"',
            'Click "Cancel Membership"',
            'Select reason and confirm'
        ],
        notes: [
            'You can pause for up to 3 months',
            'No refunds on unused credits',
            'Can reactivate within 90 days'
        ],
        reviews: [
            { rating: 5, username: 'fitnessJunkie', date: '2025-08-12', text: 'Easy online cancellation!' }
        ],
        contact: { phone: '1-866-598-1234', email: 'support@classpass.com', chat: 'Yes' }
    }
];

/* ========================================
   MOCK SAVED SUBSCRIPTIONS (Sample Data)
   ======================================== */
const SAMPLE_SUBSCRIPTIONS = [
    { id: 'user-netflix', serviceName: 'Netflix', category: 'streaming', cost: 15.99, renewalDate: '2025-12-01', dateSaved: '2025-11-01' },
    { id: 'user-spotify', serviceName: 'Spotify', category: 'streaming', cost: 10.99, renewalDate: '2025-11-28', dateSaved: '2025-11-05' },
    { id: 'user-gym', serviceName: 'Planet Fitness', category: 'fitness', cost: 24.99, renewalDate: '2025-11-15', dateSaved: '2025-10-10' }
];

/* ========================================
   N8N WEBHOOK INTEGRATION
   ======================================== */

/**
 * Send data to N8N webhook
 * @param {string} endpoint - The webhook endpoint path
 * @param {object} data - The data to send
 * @returns {Promise} - Response from N8N
 */
async function sendToN8N(endpoint, data) {
    // Check if N8N config is loaded
    if (typeof window.N8N_CONFIG === 'undefined') {
        console.warn(`[${APP_NAME}] N8N_CONFIG not found - config file not loaded`);
        return { success: false, error: 'N8N config not loaded' };
    }
    
    const baseUrl = window.N8N_CONFIG.baseUrl;
    const webhookUrl = `${baseUrl}${endpoint}`;
    
    // Don't send if base URL is still placeholder
    if (baseUrl === 'YOUR_N8N_URL_HERE' || !baseUrl.startsWith('http')) {
        console.warn(`[${APP_NAME}] ⚠️ N8N base URL not configured. Skipping webhook.`);
        console.log(`[${APP_NAME}] To enable N8N webhooks, set N8N_BASE_URL in config/n8n-config.js`);
        return { success: false, error: 'N8N URL not configured' };
    }
    
    console.log(`[${APP_NAME}] 🔗 Sending to N8N webhook: ${endpoint}`);
    console.log(`[${APP_NAME}] URL: ${webhookUrl}`);
    console.log(`[${APP_NAME}] Data:`, data);
    
    try {
        const controller = new AbortController();
        const timeout = window.N8N_CONFIG.timeout || 10000;
        
        // Set timeout
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                ...window.N8N_CONFIG.defaultHeaders,
                'X-Request-ID': `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            },
            body: JSON.stringify({
                ...data,
                timestamp: new Date().toISOString(),
                source: 'stopthecharge_pwa'
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        console.log(`[${APP_NAME}] ✅ N8N webhook response:`, result);
        return result;
        
    } catch (error) {
        console.error(`[${APP_NAME}] ❌ N8N webhook error:`, error.message);
        console.log(`[${APP_NAME}] Data saved locally. Will retry when connection available.`);
        // Still return object so caller can handle it
        return { success: false, error: error.message };
    }
}

/**
 * Send subscription data to N8N when user adds subscription
 * @param {object} subscription - The subscription object
 */
async function sendSubscriptionToN8N(subscription) {
    if (!window.N8N_CONFIG?.enabled) {
        console.log(`[${APP_NAME}] N8N webhooks disabled`);
        return;
    }
    
    const subscriptionData = {
        type: 'new_subscription',
        serviceName: subscription.serviceName,
        category: subscription.category,
        monthlyCost: subscription.cost,
        renewalDate: subscription.renewalDate,
        userId: subscription.id
    };
    
    await sendToN8N(window.N8N_CONFIG.webhooks.newSubscription, subscriptionData);
}

/**
 * Send cancellation data to N8N when user removes subscription
 * @param {object} subscription - The subscription object
 */
async function sendCancellationToN8N(subscription) {
    if (!window.N8N_CONFIG?.enabled) {
        console.log(`[${APP_NAME}] N8N webhooks disabled`);
        return;
    }
    
    const cancellationData = {
        type: 'cancel_subscription',
        serviceName: subscription.serviceName,
        category: subscription.category,
        monthlyCost: subscription.cost,
        userId: subscription.id,
        reason: 'User initiated cancellation'
    };
    
    await sendToN8N(window.N8N_CONFIG.webhooks.cancelSubscription, cancellationData);
}

/**
 * Send user review/note to N8N
 * @param {object} review - The review object
 */
async function sendReviewToN8N(review) {
    if (!window.N8N_CONFIG?.enabled) {
        console.log(`[${APP_NAME}] N8N webhooks disabled`);
        return;
    }
    
    const reviewData = {
        type: 'user_review',
        serviceName: review.serviceName,
        rating: review.rating,
        comment: review.comment,
        helpfulCount: review.helpfulCount || 0
    };
    
    await sendToN8N(window.N8N_CONFIG.webhooks.userReview, reviewData);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log(`[${APP_NAME}] Initializing application...`);
    
    // Log N8N config status
    if (typeof window.N8N_CONFIG !== 'undefined') {
        console.log(`[${APP_NAME}] N8N Config loaded:`, window.N8N_CONFIG.baseUrl !== 'YOUR_N8N_URL_HERE' ? '✅ Configured' : '⚠️ Not configured');
    } else {
        console.warn(`[${APP_NAME}] N8N Config not loaded`);
    }
    
    initializeApp();
    setupEventListeners();
    registerServiceWorker();
    setupOnlineOfflineHandlers();
    setupInstallPrompt();
});

/* ========================================
   APPLICATION INITIALIZATION
   ======================================== */
function initializeApp() {
    console.log(`[${APP_NAME}] App initialized successfully`);
    console.log(`[${APP_NAME}] Online status: ${appState.isOnline}`);
    
    // Add any additional initialization logic here
    // e.g., loading user data, preferences, etc.
}

/* ========================================
   SERVICE WORKER REGISTRATION
   ======================================== */
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            console.log(`[${APP_NAME}] Registering Service Worker from path: ${SERVICE_WORKER_PATH}`);
            
            const registration = await navigator.serviceWorker.register(SERVICE_WORKER_PATH, {
                scope: './'
            });
            
            appState.serviceWorkerReady = true;
            console.log(`[${APP_NAME}] ✅ Service Worker registered successfully`);
            console.log(`[${APP_NAME}] Registration scope: ${registration.scope}`);
            
            // Check for updates periodically
            setInterval(() => {
                registration.update().then(() => {
                    console.log(`[${APP_NAME}] Service Worker update check completed`);
                }).catch((error) => {
                    console.error(`[${APP_NAME}] Service Worker update check failed:`, error);
                });
            }, 60000); // Check every 60 seconds

            // Handle Service Worker updates
            handleServiceWorkerUpdates(registration);
        } catch (error) {
            console.error(`[${APP_NAME}] Service Worker registration failed:`, error);
        }
    } else {
        console.warn(`[${APP_NAME}] Service Workers not supported in this browser`);
    }
}

/* ========================================
   SERVICE WORKER UPDATE HANDLING
   ======================================== */
function handleServiceWorkerUpdates(registration) {
    registration.addEventListener('updatefound', () => {
        console.log(`[${APP_NAME}] Service Worker update found`);
        
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log(`[${APP_NAME}] New Service Worker available (waiting for activation)`);
                
                // Optional: Show notification to user about update
                notifyUserOfUpdate();
            }
        });
    });

    if (registration.waiting) {
        console.log(`[${APP_NAME}] Service Worker update available`);
        notifyUserOfUpdate();
    }
}

/* ========================================
   NOTIFY USER OF UPDATES
   ======================================== */
function notifyUserOfUpdate() {
    console.log(`[${APP_NAME}] New update available. Notification would be shown here.`);
    // In a production app, you might show a toast or banner:
    // showUpdateNotification();
}

/* ========================================
   EVENT LISTENERS SETUP
   ======================================== */
function setupEventListeners() {
    console.log(`[${APP_NAME}] Setting up event listeners...`);
    
    // Get Started Button
    const getStartedBtn = document.getElementById('getStartedBtn');
    if (getStartedBtn) {
        console.log(`[${APP_NAME}] Get Started button found`);
        getStartedBtn.addEventListener('click', handleGetStarted);
    } else {
        console.warn(`[${APP_NAME}] Get Started button not found`);
    }
    
    // Create Account Button
    const createAccountBtn = document.getElementById('createAccountBtn');
    if (createAccountBtn) {
        console.log(`[${APP_NAME}] Create Account button found`);
        createAccountBtn.addEventListener('click', handleCreateAccount);
    } else {
        console.warn(`[${APP_NAME}] Create Account button not found`);
    }

    // Hero search (inline on homepage) -> push search to directory
    const heroSearchBtn = document.getElementById('heroSearchBtn');
    const heroSearchInput = document.getElementById('heroSearchInput');
    if (heroSearchBtn && heroSearchInput) {
        heroSearchBtn.addEventListener('click', () => {
            const q = heroSearchInput.value.trim();
            if (q) {
                sessionStorage.setItem('directorySearch', q);
            }
            window.location.href = 'directory.html';
        });
        heroSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                heroSearchBtn.click();
            }
        });
    }

    // Navbar toggle: update aria-expanded
    const navToggle = document.getElementById('navbarToggle');
    const navMenu = document.getElementById('navbarMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!expanded));
            navMenu.classList.toggle('open');
        });
    }

    console.log(`[${APP_NAME}] ✅ Event listeners configured`);
}

/* ========================================
   CTA BUTTON HANDLERS
   ======================================== */
function handleGetStarted() {
    console.log(`[${APP_NAME}] "Get Started" button clicked`);
    const btn = document.getElementById('getStartedBtn');
    
    // Show loading state
    if (btn) {
        btn.textContent = '⏳ Loading...';
        btn.disabled = true;
    }
    
    try {
        console.log(`[${APP_NAME}] Redirecting to Directory...`);
        trackEvent('cta_click', {
            button: 'Get Started',
            timestamp: new Date().toISOString()
        });
        
        // Navigate to directory
        window.location.href = 'directory.html';
    } catch (error) {
        console.error(`[${APP_NAME}] ❌ Error in Get Started:`, error);
        if (btn) {
            btn.textContent = '🚀 Get Started - It\'s Free';
            btn.disabled = false;
        }
    }
}

function handleCreateAccount() {
    console.log(`[${APP_NAME}] "Create Free Account" button clicked`);
    const btn = document.getElementById('createAccountBtn');
    
    // Show loading state
    if (btn) {
        btn.textContent = '⏳ Loading...';
        btn.disabled = true;
    }
    
    try {
        console.log(`[${APP_NAME}] Redirecting to Dashboard...`);
        trackEvent('cta_click', {
            button: 'Create Free Account',
            timestamp: new Date().toISOString()
        });
        
        // Navigate to dashboard
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error(`[${APP_NAME}] ❌ Error in Create Account:`, error);
        if (btn) {
            btn.textContent = '📝 Create Free Account';
            btn.disabled = false;
        }
    }
}
/* ========================================
   ONLINE/OFFLINE STATUS HANDLERS
   ======================================== */
function setupOnlineOfflineHandlers() {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    console.log(`[${APP_NAME}] Online/Offline handlers configured`);
}

function handleOnline() {
    appState.isOnline = true;
    console.log(`[${APP_NAME}] Device is now ONLINE`);
    
    // Sync any pending data when coming back online
    syncPendingData();
    
    // Remove offline indicator if present
    updateOnlineStatus(true);
}

function handleOffline() {
    appState.isOnline = false;
    console.log(`[${APP_NAME}] Device is now OFFLINE`);
    
    // Update UI to show offline status
    updateOnlineStatus(false);
}

function updateOnlineStatus(isOnline) {
    // Placeholder for UI update
    console.log(`[${APP_NAME}] Online status updated: ${isOnline}`);
    
    // You could add visual indicator here, e.g.:
    // document.body.classList.toggle('offline', !isOnline);
}

function syncPendingData() {
    console.log(`[${APP_NAME}] Syncing pending data...`);
    
    // Placeholder for data sync logic
    // This would sync any locally-stored data that couldn't be sent while offline
}

/* ========================================
   INSTALL PROMPT HANDLING
   ======================================== */
function setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    console.log(`[${APP_NAME}] Install prompt handlers configured`);
}

function handleBeforeInstallPrompt(event) {
    console.log(`[${APP_NAME}] Install prompt available`);
    
    // Prevent the mini-infobar from appearing automatically
    event.preventDefault();
    
    // Store the event for later use
    appState.installPromptEvent = event;
    
    // Show custom install button/prompt
    showInstallPrompt();
}

function handleAppInstalled() {
    console.log(`[${APP_NAME}] App was installed by user`);
    
    // Clear the stored install prompt
    appState.installPromptEvent = null;
    
    // Analytics tracking
    trackEvent('app_installed', {
        timestamp: new Date().toISOString()
    });
    
    // Hide any install prompts
    hideInstallPrompt();
}

function showInstallPrompt() {
    console.log(`[${APP_NAME}] Install prompt would be shown here`);
    
    // Placeholder: In a production app, you might:
    // 1. Show a banner or button to install the app
    // 2. Programmatically trigger the install when user clicks
    
    // Example:
    // const installBtn = document.createElement('button');
    // installBtn.textContent = 'Install StopTheCharge';
    // installBtn.addEventListener('click', () => {
    //     if (appState.installPromptEvent) {
    //         appState.installPromptEvent.prompt();
    //         appState.installPromptEvent.userChoice.then((choiceResult) => {
    //             if (choiceResult.outcome === 'accepted') {
    //                 trackEvent('install_accepted');
    //             }
    //             appState.installPromptEvent = null;
    //         });
    //     }
    // });
    // document.body.appendChild(installBtn);
}

function hideInstallPrompt() {
    console.log(`[${APP_NAME}] Install prompt would be hidden here`);
    // Placeholder for hiding install UI
}

/* ========================================
   ANALYTICS & EVENT TRACKING
   ======================================== */
function trackEvent(eventName, eventData = {}) {
    const eventLog = {
        app: APP_NAME,
        event: eventName,
        data: eventData,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
    };
    
    console.log(`[${APP_NAME}] Event tracked:`, eventLog);
    
    // Placeholder for sending to analytics service
    // Example: sendToAnalytics(eventLog);
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */
function getAppVersion() {
    // Check if running as installed app
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                       window.navigator.standalone === true;
    return {
        name: APP_NAME,
        isInstalled,
        isServiceWorkerReady: appState.serviceWorkerReady,
        isOnline: appState.isOnline
    };
}

/* ========================================
   CONSOLE GREETING
   ======================================== */
console.log(`
╔═══════════════════════════════════════════════════════════╗
║          Welcome to StopTheCharge PWA! 💳                ║
║  Take control of your subscriptions and save money       ║
╚═══════════════════════════════════════════════════════════╝

App Status:
`, getAppVersion());

console.log(`[${APP_NAME}] Ready! Start by clicking "Get Started" or "Create Free Account" buttons.`);

/* ========================================
   WEBHOOK INTEGRATION FUNCTIONS
   ======================================== */

/**
 * Send subscription data to N8N webhook
 * Called when user adds a subscription
 */
async function triggerSubscriptionWebhook(subscription) {
    if (!N8N_WEBHOOK_ENABLED) {
        console.log(`[${APP_NAME}] Webhooks disabled. Skipping subscription webhook.`);
        return;
    }
    
    console.log(`[${APP_NAME}] Triggering subscription webhook for:`, subscription.serviceName);
    
    // Check if webhook handlers are available
    if (typeof window.WebhookHandlers !== 'undefined') {
        try {
            const result = await window.WebhookHandlers.sendSubscriptionWebhook(subscription, 'add');
            if (result.success) {
                console.log(`[${APP_NAME}] ✅ Webhook sent successfully`);
            } else {
                console.warn(`[${APP_NAME}] ⚠️ Webhook failed:`, result.error);
            }
            return result;
        } catch (error) {
            console.error(`[${APP_NAME}] Webhook error:`, error);
        }
    } else {
        console.warn(`[${APP_NAME}] WebhookHandlers not available. Make sure backend/webhook-handlers.js is loaded.`);
    }
}

/**
 * Send cancellation data to N8N webhook
 * Called when user removes/cancels a subscription
 */
async function triggerCancellationWebhook(subscription, reason = '') {
    if (!N8N_WEBHOOK_ENABLED) {
        console.log(`[${APP_NAME}] Webhooks disabled. Skipping cancellation webhook.`);
        return;
    }
    
    console.log(`[${APP_NAME}] Triggering cancellation webhook for:`, subscription.serviceName);
    
    // Check if webhook handlers are available
    if (typeof window.WebhookHandlers !== 'undefined') {
        try {
            const result = await window.WebhookHandlers.sendCancellationWebhook(subscription, reason);
            if (result.success) {
                console.log(`[${APP_NAME}] ✅ Cancellation webhook sent successfully`);
            } else {
                console.warn(`[${APP_NAME}] ⚠️ Cancellation webhook failed:`, result.error);
            }
            return result;
        } catch (error) {
            console.error(`[${APP_NAME}] Cancellation webhook error:`, error);
        }
    } else {
        console.warn(`[${APP_NAME}] WebhookHandlers not available.`);
    }
}

/**
 * Trigger reminder email via N8N
 * Called 7 days before subscription renewal
 */
async function triggerReminderEmailWebhook(subscription, userEmail) {
    if (!N8N_WEBHOOK_ENABLED) {
        console.log(`[${APP_NAME}] Webhooks disabled. Skipping reminder webhook.`);
        return;
    }
    
    console.log(`[${APP_NAME}] Triggering reminder email webhook for:`, subscription.serviceName);
    
    if (typeof window.WebhookHandlers !== 'undefined') {
        try {
            const result = await window.WebhookHandlers.sendReminderEmailWebhook(subscription, userEmail);
            if (result.success) {
                console.log(`[${APP_NAME}] ✅ Reminder email webhook sent`);
            }
            return result;
        } catch (error) {
            console.error(`[${APP_NAME}] Reminder webhook error:`, error);
        }
    }
}

/**
 * Send weekly digest email via N8N
 */
async function triggerWeeklyDigestWebhook(subscriptions, userEmail) {
    if (!N8N_WEBHOOK_ENABLED) {
        console.log(`[${APP_NAME}] Webhooks disabled. Skipping digest webhook.`);
        return;
    }
    
    console.log(`[${APP_NAME}] Triggering weekly digest webhook`);
    
    if (typeof window.WebhookHandlers !== 'undefined') {
        try {
            const result = await window.WebhookHandlers.sendDigestEmailWebhook(subscriptions, userEmail);
            if (result.success) {
                console.log(`[${APP_NAME}] ✅ Digest email webhook sent`);
            }
            return result;
        } catch (error) {
            console.error(`[${APP_NAME}] Digest webhook error:`, error);
        }
    }
}

/**
 * Send welcome email via N8N
 */
async function triggerWelcomeEmailWebhook(userEmail, userName = '') {
    if (!N8N_WEBHOOK_ENABLED) {
        console.log(`[${APP_NAME}] Webhooks disabled. Skipping welcome webhook.`);
        return;
    }
    
    console.log(`[${APP_NAME}] Triggering welcome email webhook`);
    
    if (typeof window.WebhookHandlers !== 'undefined') {
        try {
            const result = await window.WebhookHandlers.sendWelcomeEmailWebhook(userEmail, userName);
            if (result.success) {
                console.log(`[${APP_NAME}] ✅ Welcome email webhook sent`);
            }
            return result;
        } catch (error) {
            console.error(`[${APP_NAME}] Welcome webhook error:`, error);
        }
    }
}

/**
 * Log cancellation review/feedback via N8N
 */
async function triggerCancellationReviewWebhook(review) {
    if (!N8N_WEBHOOK_ENABLED) {
        console.log(`[${APP_NAME}] Webhooks disabled. Skipping review webhook.`);
        return;
    }
    
    console.log(`[${APP_NAME}] Triggering review webhook for:`, review.serviceName);
    
    if (typeof window.WebhookHandlers !== 'undefined') {
        try {
            const result = await window.WebhookHandlers.logCancellationReviewWebhook(review);
            if (result.success) {
                console.log(`[${APP_NAME}] ✅ Review webhook sent`);
            }
            return result;
        } catch (error) {
            console.error(`[${APP_NAME}] Review webhook error:`, error);
        }
    }
}

/**
 * Check webhook status and health
 */
async function checkWebhookStatus() {
    console.log(`[${APP_NAME}] Checking webhook status...`);
    
    if (typeof window.WebhookHandlers !== 'undefined') {
        try {
            const statuses = await window.WebhookHandlers.getAllWebhookStatus();
            console.log(`[${APP_NAME}] Webhook Status:`, statuses);
            return statuses;
        } catch (error) {
            console.error(`[${APP_NAME}] Error checking webhook status:`, error);
        }
    }
}

/**
 * Get all webhook logs
 */
function getWebhookLogs() {
    if (typeof window.WebhookHandlers !== 'undefined' && window.WebhookHandlers.webhookLogger) {
        return window.WebhookHandlers.webhookLogger.getLogs();
    }
    return [];
}
function initializeDirectory() {
    console.log(`[${APP_NAME}] Initializing Directory page...`);
    console.log(`[${APP_NAME}] Total services available: ${SERVICES_DATA.length}`);
    
    // Initialize navigation
    setupNavigation();
    
    // Load services data
    appState.services = SERVICES_DATA;
    
    // Render initial services grid
    renderServicesGrid(SERVICES_DATA);
    console.log(`[${APP_NAME}] Initial grid rendered with ${SERVICES_DATA.length} services`);
    
    // Setup search and filter listeners
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    console.log(`[${APP_NAME}] Search input found: ${!!searchInput}`);
    console.log(`[${APP_NAME}] Search button found: ${!!searchBtn}`);
    console.log(`[${APP_NAME}] Filter buttons found: ${filterBtns.length}`);
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            console.log(`[${APP_NAME}] Search input: "${e.target.value}"`);
            handleSearch(e);
        });
        searchBtn?.addEventListener('click', (e) => {
            console.log(`[${APP_NAME}] Search button clicked`);
            handleSearch(e);
        });
    }

    // If a search was passed from the homepage hero, apply it
    const initialSearch = sessionStorage.getItem('directorySearch');
    if (initialSearch && searchInput) {
        console.log(`[${APP_NAME}] Applying initial search from homepage: ${initialSearch}`);
        searchInput.value = initialSearch;
        handleSearch();
        sessionStorage.removeItem('directorySearch');
    }
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            console.log(`[${APP_NAME}] Filter changed to: ${filter}`);
            handleFilterChange(e);
        });
    });
    
    console.log(`[${APP_NAME}] Directory initialized successfully`);
}

function renderServicesGrid(services) {
    const grid = document.getElementById('servicesGrid');
    const emptyState = document.getElementById('emptyState');
    const resultsCount = document.getElementById('resultsCount');
    
    if (!grid) {
        console.error(`[${APP_NAME}] Services grid container not found`);
        return;
    }
    
    console.log(`[${APP_NAME}] Rendering ${services.length} services`);
    
    if (services.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        if (resultsCount) resultsCount.textContent = 'No services found';
        console.log(`[${APP_NAME}] No services to display - showing empty state`);
        return;
    }
    
    emptyState.style.display = 'none';
    if (resultsCount) resultsCount.textContent = `Showing ${services.length} service${services.length !== 1 ? 's' : ''}`;
    
    grid.innerHTML = services.map(service => `
        <div class="service-card" data-service-id="${service.id}">
            <div class="service-card-icon">${service.icon}</div>
            <h3 class="service-card-name">${service.name}</h3>
            <div class="service-card-meta">
                <span class="category-tag">${service.category}</span>
                <span class="difficulty-badge difficulty-${service.difficulty}">${service.difficulty}</span>
            </div>
            <div class="service-card-footer">
                <span class="service-cost">$${service.cost.toFixed(2)}/mo</span>
                <button class="cta-button cta-small" onclick="viewServiceDetail('${service.id}')">View Guide</button>
            </div>
        </div>
    `).join('');
    
    // Add click handlers for card navigation
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('cta-button')) {
                const serviceId = card.dataset.serviceId;
                console.log(`[${APP_NAME}] Card clicked for service: ${serviceId}`);
                viewServiceDetail(serviceId);
            }
        });
    });
    
    console.log(`[${APP_NAME}] Grid rendered and event listeners attached`);
}

function handleSearch(e) {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    
    console.log(`[${APP_NAME}] Filtering with search term: "${searchTerm}" and filter: "${activeFilter}"`);
    
    const filtered = SERVICES_DATA.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchTerm) ||
                            service.category.toLowerCase().includes(searchTerm);
        const matchesFilter = activeFilter === 'all' || service.category === activeFilter;
        return matchesSearch && matchesFilter;
    });
    
    console.log(`[${APP_NAME}] Filter results: ${filtered.length} matching services`);
    renderServicesGrid(filtered);
}

function handleFilterChange(e) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    console.log(`[${APP_NAME}] Filter state updated to: ${e.target.dataset.filter}`);
    
    // Re-render with search
    handleSearch();
}

function viewServiceDetail(serviceId) {
    // Store service ID in sessionStorage for detail page
    sessionStorage.setItem('selectedServiceId', serviceId);
    window.location.href = `/public/service-detail.html`;
}

/* ========================================
   SERVICE DETAIL PAGE FUNCTIONS
   ======================================== */
function initializeServiceDetail() {
    console.log(`[${APP_NAME}] Initializing Service Detail page...`);
    
    // Initialize navigation
    setupNavigation();
    
    // Get service ID from sessionStorage
    const serviceId = sessionStorage.getItem('selectedServiceId') || 'netflix';
    const service = SERVICES_DATA.find(s => s.id === serviceId);
    
    console.log(`[${APP_NAME}] Looking for service ID: ${serviceId}`);
    
    if (!service) {
        console.error(`[${APP_NAME}] ❌ Service not found: ${serviceId}`);
        return;
    }
    
    console.log(`[${APP_NAME}] ✅ Found service: ${service.name}`);
    
    // Populate service details
    populateServiceDetail(service);
    
    // Setup event listeners
    const addBtn = document.getElementById('addSubscriptionBtn');
    const reportBtn = document.getElementById('reportBtn');
    
    console.log(`[${APP_NAME}] Add subscription button found: ${!!addBtn}`);
    console.log(`[${APP_NAME}] Report button found: ${!!reportBtn}`);
    
    if (addBtn) {
        addBtn.addEventListener('click', () => handleAddSubscription(service));
    }
    
    if (reportBtn) {
        reportBtn.addEventListener('click', () => handleReportOutdated(service.name));
    }
}

function handleAddSubscription(service) {
    console.log(`[${APP_NAME}] Adding ${service.name} to subscriptions...`);
    const addBtn = document.getElementById('addSubscriptionBtn');
    
    // Show loading state
    if (addBtn) {
        const originalText = addBtn.textContent;
        addBtn.textContent = '⏳ Adding...';
        addBtn.disabled = true;
    }
    
    try {
        // Load existing subscriptions
        let subscriptions = getSubscriptionsFromStorage();
        console.log(`[${APP_NAME}] Current subscriptions: ${subscriptions.length}`);
        
        // Check if already added
        if (subscriptions.some(s => s.serviceName === service.name)) {
            console.warn(`[${APP_NAME}] ⚠️ ${service.name} is already in subscriptions`);
            alert(`${service.name} is already in your subscriptions!`);
            return;
        }
        
        // Create new subscription
        const newSubscription = {
            id: `user-${Date.now()}`,
            serviceName: service.name,
            category: service.category,
            cost: service.cost,
            renewalDate: getNextMonth(),
            dateSaved: getCurrentDate()
        };
        
        console.log(`[${APP_NAME}] New subscription object created:`, newSubscription);
        
        // Add to subscriptions
        subscriptions.push(newSubscription);
        saveSubscriptionsToStorage(subscriptions);
        console.log(`[${APP_NAME}] ✅ Subscription saved to storage`);
        
        // ========================================
        // N8N WEBHOOK INTEGRATION
        // ========================================
        // Send subscription data to N8N for processing
        console.log(`[${APP_NAME}] Sending subscription to N8N...`);
        sendSubscriptionToN8N(newSubscription);
        
        alert(`✅ ${service.name} added to your subscriptions! Check your dashboard to track it.`);
        console.log(`[${APP_NAME}] Subscription successfully added:`, newSubscription);
        
    } catch (error) {
        console.error(`[${APP_NAME}] ❌ Error adding subscription:`, error);
        alert(`❌ Error adding subscription. Please try again.`);
    } finally {
        // Restore button state
        if (addBtn) {
            addBtn.textContent = '➕ Add to My Subscriptions';
            addBtn.disabled = false;
        }
    }
}

function populateServiceDetail(service) {
    const icon = document.getElementById('serviceIcon');
    const name = document.getElementById('serviceName');
    const category = document.getElementById('serviceCategory');
    const difficulty = document.getElementById('difficultyBadge');
    const time = document.getElementById('estimateTime');
    
    if (icon) icon.textContent = service.icon;
    if (name) name.textContent = service.name;
    if (category) category.textContent = service.category.charAt(0).toUpperCase() + service.category.slice(1);
    if (difficulty) {
        difficulty.textContent = service.difficulty.charAt(0).toUpperCase() + service.difficulty.slice(1);
        difficulty.dataset.difficulty = service.difficulty;
    }
    if (time) time.textContent = `⏱️ ~${service.estimatedTime}`;
    
    // Sidebar quick info
    const sidebarTime = document.getElementById('sidebarTime');
    const sidebarDiff = document.getElementById('sidebarDifficulty');
    const cancelMethod = document.getElementById('cancellationMethod');
    
    if (sidebarTime) sidebarTime.textContent = service.estimatedTime;
    if (sidebarDiff) sidebarDiff.textContent = service.difficulty.charAt(0).toUpperCase() + service.difficulty.slice(1);
    if (cancelMethod) cancelMethod.textContent = service.cancellationMethod;
    
    // Steps
    const stepsList = document.getElementById('stepsList');
    if (stepsList) {
        stepsList.innerHTML = service.steps.map((step, index) => `
            <div class="step-item">
                <div class="step-number">${index + 1}</div>
                <div class="step-content">${step}</div>
            </div>
        `).join('');
    }
    
    // Important Notes
    const notes = document.getElementById('importantNotes');
    if (notes) {
        notes.innerHTML = service.notes.map(note => `
            <div class="note-item">
                <span class="note-icon">ℹ️</span>
                <span>${note}</span>
            </div>
        `).join('');
    }

    // Populate HowTo JSON-LD schema for this service
    try {
        const howtoEl = document.getElementById('howtoSchema');
        if (howtoEl) {
            const steps = service.steps.map((s, idx) => ({
                "@type": "HowToStep",
                "url": `${window.location.href}#step-${idx+1}`,
                "name": `Step ${idx+1}`,
                "text": s
            }));

            const howto = {
                "@context": "https://schema.org",
                "@type": "HowTo",
                "name": `${service.name} cancellation guide`,
                "description": `Step-by-step instructions to cancel ${service.name}`,
                "totalTime": `PT${Math.max(1, parseInt(service.estimatedTime))}M`,
                "estimatedCost": {
                    "@type": "MonetaryAmount",
                    "currency": "USD",
                    "value": service.cost || 0
                },
                "step": steps
            };

            howtoEl.textContent = JSON.stringify(howto, null, 2);
            console.log(`[${APP_NAME}] HowTo schema injected for ${service.name}`);
        }
    } catch (schemaErr) {
        console.error(`[${APP_NAME}] Failed to populate HowTo schema:`, schemaErr);
    }
    
    // Reviews
    const reviewsContainer = document.getElementById('reviewsContainer');
    if (reviewsContainer) {
        reviewsContainer.innerHTML = service.reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-rating">${'⭐'.repeat(review.rating)}</span>
                    <span class="review-username">@${review.username}</span>
                    <span class="review-date">${review.date}</span>
                </div>
                <p class="review-text">${review.text}</p>
                <div class="review-actions">
                    <button class="helpful-btn">👍 Helpful</button>
                    <button class="helpful-btn">👎 Not Helpful</button>
                </div>
            </div>
        `).join('');
    }
    
    // Contact Info
    const contactInfo = document.getElementById('contactInfo');
    if (contactInfo) {
        contactInfo.innerHTML = `
            <div class="contact-item">
                <span class="contact-label">Phone:</span>
                <span class="contact-value">${service.contact.phone}</span>
            </div>
            <div class="contact-item">
                <span class="contact-label">Email:</span>
                <span class="contact-value">${service.contact.email}</span>
            </div>
            <div class="contact-item">
                <span class="contact-label">Chat:</span>
                <span class="contact-value">${service.contact.chat}</span>
            </div>
        `;
    }
}

function handleAddSubscription(service) {
    console.log(`[${APP_NAME}] Adding ${service.name} to subscriptions...`);
    const addBtn = document.getElementById('addSubscriptionBtn');
    
    // Show loading state
    if (addBtn) {
        const originalText = addBtn.textContent;
        addBtn.textContent = '⏳ Adding...';
        addBtn.disabled = true;
    }
    
    try {
        // Load existing subscriptions
        let subscriptions = getSubscriptionsFromStorage();
        console.log(`[${APP_NAME}] Current subscriptions: ${subscriptions.length}`);
        
        // Check if already added
        if (subscriptions.some(s => s.serviceName === service.name)) {
            console.warn(`[${APP_NAME}] ⚠️ ${service.name} is already in subscriptions`);
            alert(`${service.name} is already in your subscriptions!`);
            return;
        }
        
        // Create new subscription
        const newSubscription = {
            id: `user-${Date.now()}`,
            serviceName: service.name,
            category: service.category,
            cost: service.cost,
            renewalDate: getNextMonth(),
            dateSaved: getCurrentDate()
        };
        
        console.log(`[${APP_NAME}] New subscription object created:`, newSubscription);
        
        // Add to subscriptions
        subscriptions.push(newSubscription);
        saveSubscriptionsToStorage(subscriptions);
        console.log(`[${APP_NAME}] ✅ Subscription saved to storage`);
        
        // ========================================
        // WEBHOOK INTEGRATION
        // ========================================
        // Trigger N8N webhook to log subscription addition
        if (N8N_WEBHOOK_ENABLED) {
            console.log(`[${APP_NAME}] Triggering subscription webhook...`);
            triggerSubscriptionWebhook(newSubscription);
        }
        
        alert(`✅ ${service.name} added to your subscriptions! Check your dashboard to track it.`);
        console.log(`[${APP_NAME}] Subscription successfully added:`, newSubscription);
        
    } catch (error) {
        console.error(`[${APP_NAME}] ❌ Error adding subscription:`, error);
        alert(`❌ Error adding subscription. Please try again.`);
    } finally {
        // Restore button state
        if (addBtn) {
            addBtn.textContent = '➕ Add to My Subscriptions';
            addBtn.disabled = false;
        }
    }
}

function handleReportOutdated(serviceName) {
    console.log(`[${APP_NAME}] Report outdated info for: ${serviceName}`);
    alert(`📧 Coming soon! We'll help you report outdated information.\n\nFor now, email us at: help@stopthecharge.com`);
    // const email = 'help@stopthecharge.com';
    // const subject = `Outdated information: ${serviceName}`;
    // window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

/* ========================================
   DASHBOARD PAGE FUNCTIONS
   ======================================== */
function initializeDashboard() {
    console.log(`[${APP_NAME}] Initializing Dashboard page...`);
    
    // Initialize navigation
    setupNavigation();
    
    // Load subscriptions
    appState.subscriptions = getSubscriptionsFromStorage();
    console.log(`[${APP_NAME}] Loaded ${appState.subscriptions.length} subscriptions from storage`);
    
    // Render dashboard
    updateDashboardStats();
    renderSubscriptionsTable();
    renderUpcomingRenewals();
    
    // Setup event listeners
    const addBtn = document.getElementById('addSubBtn');
    const cancelBtn = document.getElementById('cancelSubBtn');
    const exportBtn = document.getElementById('exportBtn');
    const form = document.getElementById('newSubscriptionForm');
    
    console.log(`[${APP_NAME}] Add button found: ${!!addBtn}`);
    console.log(`[${APP_NAME}] Cancel button found: ${!!cancelBtn}`);
    console.log(`[${APP_NAME}] Export button found: ${!!exportBtn}`);
    console.log(`[${APP_NAME}] Form found: ${!!form}`);
    
    if (addBtn) addBtn.addEventListener('click', () => {
        console.log(`[${APP_NAME}] Add subscription button clicked`);
        toggleAddForm();
    });
    if (cancelBtn) cancelBtn.addEventListener('click', () => {
        console.log(`[${APP_NAME}] Cancel subscription button clicked`);
        toggleAddForm();
    });
    if (exportBtn) exportBtn.addEventListener('click', () => {
        console.log(`[${APP_NAME}] Export data button clicked`);
        handleExportData();
    });
    if (form) form.addEventListener('submit', (e) => {
        console.log(`[${APP_NAME}] Add new subscription form submitted`);
        handleAddNewSubscription(e);
    });
    
    console.log(`[${APP_NAME}] Dashboard initialized successfully`);
}

function updateDashboardStats() {
    const subscriptions = appState.subscriptions;
    const totalMonthly = subscriptions.reduce((sum, s) => sum + s.cost, 0);
    
    // Update stats
    const totalMonthlyEl = document.getElementById('totalMonthly');
    const totalSubsEl = document.getElementById('totalSubscriptions');
    const savedThisMonthEl = document.getElementById('savedThisMonth');
    const totalSavedEl = document.getElementById('totalSaved');
    
    if (totalMonthlyEl) totalMonthlyEl.textContent = `$${totalMonthly.toFixed(2)}`;
    if (totalSubsEl) totalSubsEl.textContent = subscriptions.length;
    
    // Calculate savings
    const savings = calculateSavings(subscriptions);
    if (savedThisMonthEl) savedThisMonthEl.textContent = `$${savings.thisMonth.toFixed(2)}`;
    if (totalSavedEl) totalSavedEl.textContent = `$${savings.allTime.toFixed(2)}`;
    
    // Update chart metrics
    const chartThisMonth = document.getElementById('chartThisMonth');
    const chartLastMonth = document.getElementById('chartLastMonth');
    const chartAverage = document.getElementById('chartAverage');
    
    if (chartThisMonth) chartThisMonth.textContent = `$${savings.thisMonth.toFixed(0)}`;
    if (chartLastMonth) chartLastMonth.textContent = `$${(savings.allTime * 0.8).toFixed(0)}`;
    if (chartAverage) chartAverage.textContent = `$${(savings.allTime / 3).toFixed(0)}`;
}

function renderSubscriptionsTable() {
    const tbody = document.getElementById('subscriptionsBody');
    const emptyMsg = document.getElementById('emptySubscriptions');
    const wrapper = document.getElementById('subscriptionsWrapper');
    
    if (!tbody) return;
    
    const subscriptions = appState.subscriptions;
    
    if (subscriptions.length === 0) {
        emptyMsg.style.display = 'block';
        return;
    }
    
    emptyMsg.style.display = 'none';
    
    tbody.innerHTML = subscriptions.map(sub => `
        <tr>
            <td>${sub.serviceName}</td>
            <td><span class="category-tag">${sub.category}</span></td>
            <td>$${sub.cost.toFixed(2)}</td>
            <td>${sub.renewalDate}</td>
            <td>
                <button class="cta-button cta-small cta-danger" onclick="handleRemoveSubscription('${sub.id}')">Remove</button>
            </td>
        </tr>
    `).join('');
}

function renderUpcomingRenewals() {
    const renewalsList = document.getElementById('renewalsList');
    const emptyRenewals = document.getElementById('emptyRenewals');
    
    if (!renewalsList) return;
    
    const subscriptions = appState.subscriptions;
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const upcomingRenewals = subscriptions
        .filter(sub => {
            const renewalDate = new Date(sub.renewalDate);
            return renewalDate >= today && renewalDate <= thirtyDaysFromNow;
        })
        .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate));
    
    if (upcomingRenewals.length === 0) {
        renewalsList.innerHTML = '';
        emptyRenewals.style.display = 'block';
        return;
    }
    
    emptyRenewals.style.display = 'none';
    
    renewalsList.innerHTML = upcomingRenewals.map(renewal => `
        <div class="renewal-item">
            <div class="renewal-date">${renewal.renewalDate}</div>
            <div class="renewal-service">${renewal.serviceName}</div>
            <div class="renewal-cost">$${renewal.cost.toFixed(2)}</div>
        </div>
    `).join('');
}

function toggleAddForm() {
    const form = document.getElementById('addSubForm');
    if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
        if (form.style.display === 'block') {
            document.getElementById('subName').focus();
        }
    }
}

function handleAddNewSubscription(e) {
    e.preventDefault();
    
    const name = document.getElementById('subName').value;
    const cost = parseFloat(document.getElementById('subCost').value);
    const renewalDate = document.getElementById('subRenewal').value;
    const category = document.getElementById('subCategory').value;
    
    if (!name || !cost || !renewalDate) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newSubscription = {
        id: `user-${Date.now()}`,
        serviceName: name,
        category,
        cost,
        renewalDate,
        dateSaved: getCurrentDate()
    };
    
    appState.subscriptions.push(newSubscription);
    saveSubscriptionsToStorage(appState.subscriptions);
    
    // Reset form and hide
    e.target.reset();
    toggleAddForm();
    
    // Update display
    updateDashboardStats();
    renderSubscriptionsTable();
    renderUpcomingRenewals();
    
    console.log(`[${APP_NAME}] New subscription added:`, newSubscription);
}

function handleRemoveSubscription(subscriptionId) {
    console.log(`[${APP_NAME}] Remove button clicked for subscription: ${subscriptionId}`);
    
    if (confirm('Are you sure you want to remove this subscription?')) {
        console.log(`[${APP_NAME}] User confirmed removal`);
        
        const removedSubscription = appState.subscriptions.find(s => s.id === subscriptionId);
        console.log(`[${APP_NAME}] Removing subscription:`, removedSubscription);
        
        appState.subscriptions = appState.subscriptions.filter(s => s.id !== subscriptionId);
        console.log(`[${APP_NAME}] Subscriptions after removal: ${appState.subscriptions.length}`);
        
        // ========================================
        // N8N WEBHOOK INTEGRATION
        // ========================================
        // Send cancellation data to N8N
        if (removedSubscription) {
            console.log(`[${APP_NAME}] Sending cancellation to N8N...`);
            sendCancellationToN8N(removedSubscription);
        }
        
        saveSubscriptionsToStorage(appState.subscriptions);
        console.log(`[${APP_NAME}] ✅ Subscription removed and saved to storage`);
        
        updateDashboardStats();
        renderSubscriptionsTable();
        renderUpcomingRenewals();
        
        alert(`✅ Subscription removed successfully!`);
    } else {
        console.log(`[${APP_NAME}] User cancelled removal`);
    }
}

function handleExportData() {
    console.log(`[${APP_NAME}] Export data clicked`);
    
    try {
        const subscriptions = appState.subscriptions;
        console.log(`[${APP_NAME}] Exporting ${subscriptions.length} subscriptions`);
        
        const csvContent = "Service Name,Category,Monthly Cost,Renewal Date\n" +
            subscriptions.map(s => `"${s.serviceName}","${s.category}","${s.cost}","${s.renewalDate}"`).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stopthecharge_subscriptions_${getCurrentDate()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        console.log(`[${APP_NAME}] ✅ Data exported as CSV`);
        alert(`✅ Data exported successfully!`);
    } catch (error) {
        console.error(`[${APP_NAME}] ❌ Error exporting data:`, error);
        alert(`❌ Error exporting data. Please try again.`);
    }
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */
function getSubscriptionsFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : SAMPLE_SUBSCRIPTIONS;
}

function saveSubscriptionsToStorage(subscriptions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
}

function calculateSavings(subscriptions) {
    const totalMonthly = subscriptions.reduce((sum, s) => sum + s.cost, 0);
    const allTime = totalMonthly * 3; // Placeholder: 3 months of savings
    
    return {
        thisMonth: totalMonthly,
        allTime: allTime
    };
}

function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

function getNextMonth() {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
}

function setupNavigation() {
    const toggle = document.getElementById('navbarToggle');
    const menu = document.getElementById('navbarMenu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
        
        // Close menu when clicking links
        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
            });
        });
    }
}

/* ========================================
   DASHBOARD FORM - N8N WEBHOOK INTEGRATION
   ======================================== */

const N8N_WEBHOOK_URL = window.ENV?.N8N_WEBHOOK_URL || 'https://main-production-e9e3.up.railway.app/webhook/new-subscription';

// Handle subscription form submission on dashboard
const addSubForm = document.getElementById('newSubscriptionForm');
if (addSubForm) {
    addSubForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const resultDiv = document.getElementById('formResult');
        if (!resultDiv) {
            console.warn(`[${APP_NAME}] Form result div not found`);
            return;
        }
        
        resultDiv.style.display = 'none';
        
        const userEmail = document.getElementById('userEmail')?.value;
        const serviceName = document.getElementById('subName')?.value;
        const monthlyCost = parseFloat(document.getElementById('subCost')?.value);
        const renewalDate = document.getElementById('subRenewal')?.value;
        
        if (!userEmail || !serviceName || !monthlyCost || !renewalDate) {
            resultDiv.style.display = 'block';
            resultDiv.style.background = '#f8d7da';
            resultDiv.style.color = '#721c24';
            resultDiv.textContent = '⚠️ Please fill in all required fields';
            return;
        }
        
        const subscriptionData = {
            user_email: userEmail,
            service_name: serviceName,
            monthly_cost: monthlyCost,
            renewal_date: renewalDate,
            timestamp: new Date().toISOString()
        };
        
        console.log(`[${APP_NAME}] Sending to N8N:`, subscriptionData);
        
        // Save locally first
        saveToLocalStorage(subscriptionData);
        
        // Send to N8N
        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subscriptionData)
            });
            
            console.log(`[${APP_NAME}] N8N Response:`, response);
            
            resultDiv.style.display = 'block';
            resultDiv.style.background = '#d4edda';
            resultDiv.style.color = '#155724';
            resultDiv.textContent = '✅ Subscription added! You will receive reminder emails.';
            
            // Reset form
            addSubForm.reset();
            
            // Refresh subscription list
            displaySubscriptions();
            
        } catch (error) {
            console.error(`[${APP_NAME}] Error:`, error);
            resultDiv.style.display = 'block';
            resultDiv.style.background = '#f8d7da';
            resultDiv.style.color = '#721c24';
            resultDiv.textContent = '⚠️ Subscription saved locally. Email reminders may not work.';
        }
    });
}

// Save to localStorage
function saveToLocalStorage(data) {
    let subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    subscriptions.push(data);
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
    console.log(`[${APP_NAME}] Saved to localStorage:`, data);
}

// Display subscriptions from localStorage
function displaySubscriptions() {
    const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    const listElement = document.getElementById('subscriptionsList');
    if (listElement && subscriptions.length > 0) {
        listElement.innerHTML = subscriptions.map(sub => `
            <div class="subscription-card">
                <h4>${sub.service_name}</h4>
                <p>Cost: $${sub.monthly_cost}/month</p>
                <p>Next Renewal: ${sub.renewal_date}</p>
                <p style="font-size: 0.9rem; color: #666;">Email: ${sub.user_email}</p>
            </div>
        `).join('');
    }
}

// ========================================
// HOMEPAGE SUBSCRIPTION FORM HANDLER
// ========================================
const homePageForm = document.getElementById('addSubscriptionForm');
if (homePageForm) {
    console.log(`[${APP_NAME}] Homepage subscription form found - setting up handler`);
    
    homePageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const resultDiv = document.getElementById('formResult');
        const userEmail = document.getElementById('userEmail')?.value;
        const serviceName = document.getElementById('serviceName')?.value;
        const monthlyCost = parseFloat(document.getElementById('monthlyCost')?.value);
        const renewalDate = document.getElementById('renewalDate')?.value;
        
        // Reset result display
        if (resultDiv) {
            resultDiv.style.display = 'none';
            resultDiv.className = '';
        }
        
        // Validate
        if (!userEmail || !serviceName || !monthlyCost || !renewalDate) {
            if (resultDiv) {
                resultDiv.style.display = 'block';
                resultDiv.className = 'error';
                resultDiv.textContent = '⚠️ Please fill in all required fields';
            }
            return;
        }
        
        const subscriptionData = {
            user_email: userEmail,
            service_name: serviceName,
            monthly_cost: monthlyCost,
            renewal_date: renewalDate,
            timestamp: new Date().toISOString()
        };
        
        console.log(`[${APP_NAME}] Sending subscription from homepage:`, subscriptionData);
        
        // Save locally
        saveToLocalStorage(subscriptionData);
        
        // Send to N8N
        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subscriptionData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            console.log(`[${APP_NAME}] ✅ N8N webhook received subscription`);
            
            // Show success
            if (resultDiv) {
                resultDiv.style.display = 'block';
                resultDiv.className = 'success';
                resultDiv.textContent = '✅ Subscription added! Check your email for confirmation.';
            }
            
            // Reset form
            homePageForm.reset();
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
            
        } catch (error) {
            console.error(`[${APP_NAME}] ❌ Webhook error:`, error);
            
            if (resultDiv) {
                resultDiv.style.display = 'block';
                resultDiv.className = 'error';
                resultDiv.textContent = '⚠️ Subscription saved locally. Check your dashboard to track it.';
            }
        }
    });
}

// Load subscriptions on page load
if (document.getElementById('subscriptionsList')) {
    displaySubscriptions();
}
