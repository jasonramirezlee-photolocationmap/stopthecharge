export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { priceId, email, mode = 'subscription' } = req.body;
    
    try {
        const session = await stripe.checkout.sessions.create({
            mode: mode, // 'subscription' for Pro plans, 'payment' for one-time purchases
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            customer_email: email,
            success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/dashboard.html`,
            metadata: { source: 'stopthecharge_web' }
        });
        
        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: error.message });
    }
}

