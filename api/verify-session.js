const Stripe = require('stripe');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    
    const sessionId = req.query.session_id;
    if (!sessionId) {
        return res.status(400).json({ success: false, error: 'session_id query param is required' });
    }
    
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
        return res.status(500).json({ success: false, error: 'Stripe not configured' });
    }
    
    try {
        const stripeClient = Stripe(stripeSecretKey);
        const session = await stripeClient.checkout.sessions.retrieve(sessionId, {
            expand: ['subscription']
        });
        
        const planType = session.metadata?.planType || 'unknown';
        const responsePayload = {
            success: true,
            planType,
            customerEmail: session.customer_details?.email || session.customer_email,
            amountTotal: session.amount_total,
            currency: session.currency,
            paymentStatus: session.payment_status,
            subscriptionStatus: session.subscription?.status || null,
            currentPeriodEnd: session.subscription?.current_period_end || null,
            metadata: session.metadata || {}
        };
        
        return res.status(200).json(responsePayload);
    } catch (error) {
        console.error('[Stripe] verify-session error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
