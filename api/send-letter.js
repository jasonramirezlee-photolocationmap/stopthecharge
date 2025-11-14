const sgMail = require('@sendgrid/mail');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    
    const { email, subject, html, text, serviceName } = req.body || {};
    if (!email || !subject || !html) {
        return res.status(400).json({ success: false, error: 'Email, subject, and html are required' });
    }
    
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    
    if (!apiKey || !fromEmail) {
        return res.status(500).json({ success: false, error: 'SendGrid not configured' });
    }
    
    try {
        sgMail.setApiKey(apiKey);
        await sgMail.send({
            to: email,
            from: fromEmail,
            subject,
            html,
            text: text || html.replace(/<[^>]+>/g, ''),
            categories: ['stopthecharge', 'cancellation_letter'],
            customArgs: {
                serviceName: serviceName || 'subscription'
            }
        });
        
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('[SendGrid] Error sending letter:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
