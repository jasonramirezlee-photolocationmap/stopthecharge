const baseServices = [
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
        cost: 200.0,
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
        cost: 139.0,
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
        cost: 60.0,
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
        cost: 50.0,
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
        cost: 17.0,
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
        cost: 38.0,
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
        cost: 55.0,
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
        cost: 60.0,
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
        cost: 44.0,
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
        cost: 99.0,
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

const SERVICE_TEMPLATE_SETS = [
    {
        category: 'streaming',
        icon: '🎬',
        difficulty: 'easy',
        estimatedTime: '3 minutes',
        cancellationMethod: 'Online',
        baseCost: 12.99,
        names: [
            'Max (HBO)', 'Paramount+', 'Peacock', 'YouTube Premium', 'Apple TV+',
            'Crunchyroll', 'Showtime', 'Starz', 'Discovery+', 'ESPN+',
            'BET+', 'Sling TV', 'FuboTV', 'Philo', 'Vudu',
            'Tubi', 'Pluto TV', 'Kanopy', 'BritBox', 'Acorn TV',
            'Shudder', 'Funimation', 'DAZN', 'Hallmark Movies Now', 'Hulu Live TV'
        ]
    },
    {
        category: 'fitness',
        icon: '💪',
        difficulty: 'medium',
        estimatedTime: '10 minutes',
        cancellationMethod: 'In-Person/Phone',
        baseCost: 29.99,
        names: [
            'OrangeTheory Fitness', 'Anytime Fitness', 'Gold\'s Gym', '24 Hour Fitness',
            'Snap Fitness', 'Crunch Fitness', 'YMCA Membership', 'Pure Barre',
            'CorePower Yoga', 'Lifetime Fitness', 'Blink Fitness', 'Retro Fitness',
            'SoulCycle', 'Barry\'s Bootcamp', 'Orangetheory All Access'
        ]
    },
    {
        category: 'software',
        icon: '💻',
        difficulty: 'easy',
        estimatedTime: '2 minutes',
        cancellationMethod: 'Online',
        baseCost: 14.99,
        names: [
            'Notion Plus', 'Evernote Premium', 'Grammarly Premium', 'Canva Pro',
            'Zoom Pro', 'Slack Pro', 'Asana Premium', 'Todoist Pro',
            'LastPass Premium', 'Quicken Deluxe', 'QuickBooks Online', '1Password Families',
            'Google Workspace', 'GitHub Copilot', 'Figma Professional', 'Monday.com', 'Bitwarden Families'
        ]
    },
    {
        category: 'gaming',
        icon: '🎮',
        difficulty: 'easy',
        estimatedTime: '3 minutes',
        cancellationMethod: 'Online',
        baseCost: 9.99,
        names: [
            'EA Play', 'Ubisoft+', 'GeForce NOW', 'Apple Arcade',
            'Google Play Pass', 'Minecraft Realms', 'RuneScape Membership',
            'Final Fantasy XIV Online', 'World of Warcraft', 'Roblox Premium'
        ]
    },
    {
        category: 'news',
        icon: '📰',
        difficulty: 'easy',
        estimatedTime: '2 minutes',
        cancellationMethod: 'Online',
        baseCost: 19.99,
        names: [
            'Washington Post', 'Los Angeles Times', 'The Atlantic', 'Bloomberg',
            'The Economist', 'The New Yorker', 'USA Today', 'Time Magazine',
            'Business Insider', 'Barron\'s'
        ]
    },
    {
        category: 'shopping',
        icon: '🛒',
        difficulty: 'easy',
        estimatedTime: '2 minutes',
        cancellationMethod: 'Online',
        baseCost: 14.99,
        names: [
            'Instacart+', 'DoorDash DashPass', 'Uber One', 'Walmart+',
            'Target Circle', 'Best Buy TotalTech', 'Chewy Autoship',
            'Hello Bello Diaper Subscription', 'Sephora Flash', 'Stitch Fix Premium',
            'Ipsy Glam Bag', 'Poshmark Closets'
        ]
    },
    {
        category: 'education',
        icon: '📚',
        difficulty: 'easy',
        estimatedTime: '4 minutes',
        cancellationMethod: 'Online',
        baseCost: 19.99,
        names: [
            'Duolingo Plus', 'MasterClass', 'Skillshare', 'Coursera Plus',
            'Udemy Pro', 'Brilliant.org', 'Codecademy Pro', 'LinkedIn Learning',
            'Khan Academy Supporter', 'ABCmouse'
        ]
    },
    {
        category: 'finance',
        icon: '💳',
        difficulty: 'medium',
        estimatedTime: '5 minutes',
        cancellationMethod: 'Online/Phone',
        baseCost: 24.99,
        names: [
            'LifeLock', 'Identity Guard', 'Credit Karma Money', 'Experian Boost Premium', 'Rocket Money Premium'
        ]
    }
];

const existingServiceIds = new Set(baseServices.map(service => service.id));

SERVICE_TEMPLATE_SETS.forEach(template => {
    template.names.forEach((name, index) => {
        const serviceId = slugifyServiceName(name);
        if (existingServiceIds.has(serviceId)) return;
        const service = buildServiceFromTemplate({
            id: serviceId,
            name,
            icon: template.icon,
            category: template.category,
            difficulty: template.difficulty,
            cost: Number((template.baseCost + (index % 5)).toFixed(2)),
            estimatedTime: template.estimatedTime,
            cancellationMethod: template.cancellationMethod
        });
        baseServices.push(service);
        existingServiceIds.add(serviceId);
    });
});

function buildServiceFromTemplate(template) {
    const defaultSteps = [
        `Log into your ${template.name} account`,
        'Navigate to billing or subscription settings',
        'Select manage or cancel subscription',
        `Follow the prompts to cancel ${template.name}`,
        'Confirm cancellation and save the confirmation number'
    ];
    
    return {
        id: template.id,
        name: template.name,
        icon: template.icon,
        category: template.category,
        difficulty: template.difficulty,
        cost: template.cost,
        estimatedTime: template.estimatedTime,
        cancellationMethod: template.cancellationMethod,
        steps: defaultSteps,
        notes: [
            `${template.name} may allow you to pause instead of canceling.`,
            'Access typically continues through the end of the billing cycle.',
            'Contact support if you do not receive a confirmation email.'
        ],
        reviews: [
            {
                rating: template.difficulty === 'hard' ? 2 : template.difficulty === 'medium' ? 4 : 5,
                username: `${template.category}User`,
                date: '2025-11-01',
                text: `Cancellation was ${template.difficulty} for me, but these steps helped.`
            }
        ],
        contact: {
            phone: template.difficulty === 'hard' ? '1-800-000-0000' : 'Online Support',
            email: `support@${template.id.replace(/-/g, '')}.com`,
            chat: 'Yes'
        }
    };
}

function slugifyServiceName(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const SERVICES_DATA = baseServices;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SERVICES_DATA };
}

if (typeof window !== 'undefined') {
    window.SERVICES_DATA = SERVICES_DATA;
}
