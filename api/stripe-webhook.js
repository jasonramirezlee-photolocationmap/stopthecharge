const Stripe = require('stripe');

module.exports = async (req, res) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    
    if (!webhookSecret || !stripeSecret) {
        console.error('[Stripe] Missing webhook or secret key configuration');
        return res.status(500).json({ success: false, error: 'Stripe webhook not configured' });
    }
    
    const stripe = Stripe(stripeSecret);
    const signature = req.headers['stripe-signature'];
    
    if (!signature) {
        return res.status(400).json({ success: false, error: 'Missing Stripe signature' });
    }
    
    let event;
    try {
        const payload = req.rawBody
            || (Buffer.isBuffer(req.body) ? req.body : null)
            || (typeof req.body === 'string' ? Buffer.from(req.body) : Buffer.from(JSON.stringify(req.body || {})));
        event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
        console.error('[Stripe] Webhook signature verification failed:', error.message);
        return res.status(400).json({ success: false, error: 'Invalid signature' });
    }
    
    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const planType = session.metadata?.planType || 'unknown';
            console.log('[Stripe] Checkout completed for plan:', planType);
            
            if (process.env.N8N_STRIPE_WEBHOOK_URL) {
                fetch(process.env.N8N_STRIPE_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        event: event.type,
                        planType,
                        amountTotal: session.amount_total,
                        currency: session.currency,
                        email: session.customer_details?.email || session.customer_email,
                        timestamp: new Date().toISOString()
                    })
                }).catch(err => console.error('[Webhook] Failed to notify N8N', err.message));
            }
        }
        
        return res.status(200).json({ received: true });
    } catch (error) {
        console.error('[Stripe] Webhook handler error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports.config = {
    api: {
        bodyParser: false
    }
};
