export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
        console.error('[Stripe] STRIPE_SECRET_KEY environment variable not set');
        return res.status(500).json({ 
            error: 'Stripe is not configured. Please contact support.',
            details: 'STRIPE_SECRET_KEY missing'
        });
    }
    
    console.log('[Stripe] API called with body:', req.body);
    
    const stripe = require('stripe')(stripeSecretKey);
    const { priceId, email, mode = 'subscription' } = req.body;
    
    if (!priceId) {
        return res.status(400).json({ error: 'Price ID is required' });
    }
    
    try {
        console.log('[Stripe] Creating checkout session...');
        console.log('[Stripe] Price ID:', priceId);
        console.log('[Stripe] Mode:', mode);
        console.log('[Stripe] Email:', email);
        
        const session = await stripe.checkout.sessions.create({
            mode: mode,
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            customer_email: email || undefined,
            success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/dashboard.html`,
            metadata: { source: 'stopthecharge_web' }
        });
        
        console.log('[Stripe] Session created successfully:', session.id);
        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('[Stripe] Error creating session:', error);
        res.status(500).json({ 
            error: error.message,
            details: error.type || 'unknown_error'
        });
    }
}

