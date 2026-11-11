export const server = {
  name: 'WillowCraft',
  description: 'A magical Minecraft SMP experience. Explore custom biomes, build your legacy, and join a cozy community.',
  maintenanceMode: false,
  javaAddress: 'play.willowcraft.top',
  bedrockAddress: 'play.willowcraft.top',
  bedrockPort: '19132',
  versionNote: 'Check the latest supported version in Discord.',
  discord: 'https://discord.gg/McDEGEUD3U',
  startingCommands: ['/claim', '/kit'],
  founded: '9 April 2018',
  region: 'Bangladesh / Asia',
  languages: ['English', 'Bangla'],
  owner: 'Joynal Bokhsho',
  stats: [
    { label: 'Registered players', value: '10,000+', confirmed: false },
    { label: 'Uptime', value: '99.9%', confirmed: false },
    { label: 'Game modes', value: '4+', confirmed: false },
    { label: 'Community rating', value: '4.9 / 5', confirmed: false }
  ],
  infrastructure: [
    { title: 'Custom anti-cheat', verified: false },
    { title: 'Ryzen 9 CPUs', verified: false },
    { title: 'NVMe storage', verified: false },
    { title: 'Low-latency network', verified: false },
    { title: 'Global access', verified: false },
    { title: '99.9% uptime SLA', verified: false }
  ],
  vote: { url: 'https://v.willowcraft.top/', verified: false },
  announcements: [],
  gallery: [],
  leaderboard: [],
  staff: [
    { name: 'joynalbokhsho', role: 'Owner', group: 'Owner' },
    { name: 'RealEsco', role: 'Manager', group: 'Management' },
    { name: 'AZombie_', role: 'Manager', group: 'Management' },
    { name: 'MainulXD18', role: 'Developer', group: 'Development' },
    { name: 'Sapish_', role: 'Developer', group: 'Development' },
    { name: 'NOTHIN5', role: 'Jr. Developer', group: 'Development' },
    { name: 'robin_the_noob', role: 'Mod', group: 'Moderation' },
    { name: 'Betsumei', role: 'Jr. Mod', group: 'Moderation' },
    { name: 'Tasif27', role: 'Former Manager', group: 'Former Staff', former: true }
  ],
  store: { minPoints: 100, maxPoints: 50000, step: 100, defaultPoints: 700, currency: 'BDT', packages: [], prices: [{ points: 700, price: 330 }], paymentConfigured: false },
  ranks: [
    { name: 'VIP', points: 500, homes: 3, shops: 15, ah: 3, commands: ['/tpahere', '/back', '/craft'], tone: 'moss' },
    { name: 'MVP', points: 1500, homes: 5, shops: 25, ah: 5, commands: ['/smite', '/anvil', '/carttable'], tone: 'jade' },
    { name: 'ELITE', points: 5000, homes: 8, shops: 40, ah: 10, commands: ['/god', '/nick', '/tpaall'], tone: 'moon' }
  ],
  features: [
    { icon: '⌂', eyebrow: 'Make it yours', title: 'Land claiming', text: 'Protect a place to call home and grow your own corner of the world. Ask staff in Discord for current claim details.' },
    { icon: '✳', eyebrow: 'A world to wander', title: 'Custom biomes', text: 'Discover a world shaped for exploration, with custom biomes as part of the WillowCraft experience.' },
    { icon: '↗', eyebrow: 'Built together', title: 'Player-driven economy', text: 'Trade and shape a community economy alongside the people you meet.' },
    { icon: '❖', eyebrow: 'Keep growing', title: 'Rank progression', text: 'Progress through ranks as you play. Current tiers and details are shared by the team in Discord.' },
    { icon: '♡', eyebrow: 'A place to belong', title: 'Cozy survival', text: 'Settle in, build at your own pace, and become part of a welcoming community.' }
  ]
};

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Guides', href: '/guides' },
  { label: 'How to Join', href: '/how-to-join' },
  { label: 'Rules', href: '/rules' },
  { label: 'Team', href: '/team' },
  { label: 'Store', href: '/store' },
  { label: 'Announcements', href: '/announcements' },
  { label: 'Leaderboard', href: '/leaderboard' }
];

export const footerNav = {
  Explore: [{ label: 'About', href: '/about' }, { label: 'Features', href: '/features' }, { label: 'Gameplay guides', href: '/guides' }, { label: 'Announcements', href: '/announcements' }],
  Server: [{ label: 'How to join', href: '/how-to-join' }, { label: 'Ranks', href: '/ranks' }, { label: 'Rules', href: '/rules' }, { label: 'FAQ', href: '/faq' }],
  Community: [{ label: 'Discord ↗', href: server.discord, external: true }, { label: 'Team', href: '/team' }, { label: 'Leaderboard', href: '/leaderboard' }, { label: 'Support', href: '/support' }],
  Legal: [{ label: 'Contact', href: '/support' }, { label: 'Shipping & Delivery', href: '/shipping' }, { label: 'Returns & Refunds', href: '/refunds' }, { label: 'Terms of Service', href: '/terms' }, { label: 'Privacy Policy', href: '/privacy' }, { label: 'Server Rules', href: '/rules' }]
};

export const guides = [
  { path: '/guides/land-claims', icon: '⌂', title: 'Land claims', text: `Get started with ${server.startingCommands[0]} and find the details that matter before you settle.`, tag: 'Getting started' },
  { path: '/guides/economy', icon: '↗', title: 'The economy', text: 'A first look at a player-driven economy, with server-specific details kept current in Discord.', tag: 'Community' },
  { path: '/guides/custom-biomes', icon: '✳', title: 'Custom biomes', text: 'Explore a world with custom biomes. Specific names and locations are not yet published.', tag: 'Exploration' },
  { path: '/guides/ranks', icon: '❖', title: 'Ranks & progression', text: 'Learn where to find current rank information without relying on outdated lists.', tag: 'Progression' }
];

export const rules = [
  { id: 'conduct', title: 'Respect & conduct', icon: '♡', items: ['Treat players and staff with respect. Racism, sexism, hate speech, bullying, and targeted harassment are not allowed.', 'Avoid excessive swearing, toxicity, public drama, spam, and flooding.', 'Do not advertise other servers or share unrelated external links.'] },
  { id: 'fair-play', title: 'Gameplay & fair play', icon: '⚒', items: ['Hacked clients, X-ray, fly hacks, macro abuse, unfair mods, and exploits are prohibited.', 'Do not grief, alter or steal from another player’s build or property, or make dishonest trades involving items, currency, or ranks.', 'Report bugs, duplication glitches, and exploits to staff instead of using them.'] },
  { id: 'building', title: 'Building & land claims', icon: '⌂', items: ['Build a reasonable distance from other bases unless you have permission.', 'Do not build lag machines, excessive entity farms, or offensive or inappropriate structures. Staff may remove offensive builds.'] },
  { id: 'chat', title: 'Chat & community', icon: '☏', items: ['Use the appropriate Discord channels and support tickets. Avoid repeatedly pinging staff about minor matters.', 'Use English or the primary language designated for the relevant public chat so the community can understand.'] },
  { id: 'staff', title: 'Staff decisions & appeals', icon: '✧', items: ['Staff make moderation decisions. If you believe a punishment was unfair or have a staff complaint, open a support ticket and explain calmly.', 'Depending on severity, consequences may include a warning, temporary mute, item rollback, temporary ban, or permanent ban. No fixed escalation schedule is promised.'] }
];

export const faq = [
  { category: 'General', q: 'What is WillowCraft?', a: 'WillowCraft is an international premium Java server with a custom-featured Survival SMP experience.' },
  { category: 'General', q: 'What kind of server is it?', a: 'It is a community-focused survival world with land protection, custom biomes, a player-driven economy, and rank progression.' },
  { category: 'Joining & versions', q: 'What is the server address?', a: `Use ${server.javaAddress} for Java Edition. The supplied Bedrock address is ${server.bedrockAddress}, port ${server.bedrockPort}. Check Discord for the latest supported version and current connection help.` },
  { category: 'Joining & versions', q: 'Which game version do I need?', a: server.versionNote },
  { category: 'Gameplay', q: 'How do I get started?', a: `The supplied starting commands are ${server.startingCommands.join(' and ')}. Ask in Discord or in-game if you need help with their current behavior.` },
  { category: 'Gameplay', q: 'How do claims, ranks, and the economy work?', a: 'These features are part of WillowCraft, but their detailed rules and mechanics are not published here yet. Check Discord for current guidance.' },
  { category: 'Support & community', q: 'How do I report a player or bug?', a: 'Join the official Discord and open a support ticket. Include relevant proof with a report when possible.' },
  { category: 'Support & community', q: 'How can I apply for staff?', a: 'Applications are handled in the designated applications channel when open, or through support.' },
  { category: 'Support & community', q: 'Where can I read the rules?', a: 'Read the Rules page here, and check the designated rules channel in Discord for the server’s current publication.' },
  { category: 'Joining & versions', q: 'Can I join from Bedrock?', a: `The supplied connection details list ${server.bedrockAddress} with port ${server.bedrockPort}. Device and cross-play compatibility have not been independently verified; ask the team in Discord if you have trouble.` },
  { category: 'Gameplay', q: 'Are ranks permanent?', a: 'The supplied rank information describes VIP, MVP, and ELITE as lifetime ranks with no monthly fee. Purchasing and delivery are not enabled on this website.' },
  { category: 'Support & community', q: 'What if a store order is missing?', a: 'Use the official Discord support route and share your Minecraft username and order reference in a private support ticket. Never send a password or payment credentials.' },
  { category: 'Support & community', q: 'Can I buy points here?', a: 'The points interface is a preparation flow only. Approved prices, payment processing, order handling, and delivery are not configured, so checkout is unavailable.' },
  { category: 'General', q: 'Is the server free to play?', a: 'A server entry-fee policy has not been supplied. Ask the team in Discord for current access details.' },
  { category: 'Joining & versions', q: 'Do I need a premium Minecraft account?', a: 'Account requirements have not been confirmed for this website. Contact WillowCraft support before joining if you are unsure.' },
  { category: 'Support & community', q: 'How should I keep my account secure?', a: 'Keep your account password private. WillowCraft support will never need your password or payment credentials.' },
  { category: 'Support & community', q: 'Can I change my Minecraft username?', a: 'The server’s current username-change behavior has not been confirmed. Ask staff before changing your account name if you have a store order or rank question.' },
  { category: 'Joining & versions', q: 'Can I play from a console?', a: 'The supplied Bedrock address and port are listed above, but console compatibility has not been verified. Contact support for current device guidance.' },
  { category: 'Gameplay', q: 'Are cheats or modified clients allowed?', a: 'Hacked clients, X-ray, fly hacks, macro abuse, unfair mods, and exploits are prohibited by the current WillowCraft rules. Ask staff if you are unsure about a specific modification.' },
  { category: 'Support & community', q: 'How do I recover my account password?', a: 'This website cannot reset Minecraft account passwords. Use the official recovery process for your account provider; never send a password to staff.' },
  { category: 'Gameplay', q: 'What are the PvP rules?', a: 'A separate PvP policy has not been supplied. Check the official rules channel or ask staff before a disputed PvP interaction.' }
];
