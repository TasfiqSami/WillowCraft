import { server, nav, footerNav, guides, rules, faq, team, departments, roleDetails } from './config.js';

const runtime = globalThis.WILLOWCRAFT_RUNTIME || {};
const siteName = String(runtime.name || server.name);
server.name = siteName;
if (runtime.description) server.description = String(runtime.description);
const $ = (s, root = document) => root.querySelector(s);
const main = $('#main');
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
const brandMarkup = () => { const words = siteName.trim().split(/\s+/); const first = words.length > 1 ? words.shift() : siteName.slice(0, Math.min(6, Math.max(1, Math.ceil(siteName.length / 2)))); const rest = words.length ? words.join(' ') : siteName.slice(first.length); return `${esc(first || siteName)}${rest ? `<span>${esc(rest)}</span>` : ''}`; };
const applyConfiguredName = (markup) => markup.replaceAll('WillowCraft', esc(siteName));
const link = (href, label, cls = '') => `<a class="${cls}" href="${href}">${label}</a>`;
const icon = (value) => `<span class="icon" aria-hidden="true">${value}</span>`;
const discordLink = (label = 'Join the Discord') => `<a class="button button-secondary" href="${server.discord}" target="_blank" rel="noopener noreferrer">${label}<span aria-hidden="true">↗</span></a>`;
const discordButton = (extra = '') => `<a class="button button-discord ${extra}" href="${server.discord}" target="_blank" rel="noopener noreferrer" aria-label="Join ${esc(siteName)} Discord"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.4 6.1a16.2 16.2 0 0 0-4-1.25l-.5 1a14.8 14.8 0 0 0-5.8 0l-.5-1a16.2 16.2 0 0 0-4 1.25C2.1 9.7 1.4 13.2 1.8 16.7a16.4 16.4 0 0 0 4.9 2.45l1.05-1.7a10.6 10.6 0 0 1-1.65-.8l.4-.3c3.2 1.5 6.7 1.5 9.8 0l.4.3a10.6 10.6 0 0 1-1.65.8l1.05 1.7a16.4 16.4 0 0 0 4.9-2.45c.5-4.1-.8-7.6-3.6-10.6Z"/><circle cx="8.8" cy="12.6" r="1.1" fill="var(--bg)"/><circle cx="15.2" cy="12.6" r="1.1" fill="var(--bg)"/></svg><span>Discord</span></a>`;
const primary = (href, label, cls = '') => `<a class="button button-primary ${cls}" href="${href}">${label}<span aria-hidden="true">↗</span></a>`;

const titles = {
  '/': ['Find your place in the wild', 'A cozy Minecraft Survival SMP for explorers, builders, and the stories made together.'],
  '/about': ['A world worth settling into', 'A community-first Survival SMP shaped by exploration, thoughtful building, and shared moments.'],
  '/features': ['Survival, with room to grow', 'A world with more to discover and the freedom to make it your own.'],
  '/how-to-join': ['Your next world is waiting', 'A few simple steps to find WillowCraft and make yourself at home.'],
  '/guides': ['A little help for the journey', 'Useful starting points for life in WillowCraft. Server-specific details stay with the team in Discord.'],
  '/guides/land-claims': ['Land Claim Guide', 'Get started with the supplied land-claim command and confirm current claim details with WillowCraft staff.'],
  '/guides/economy': ['Economy Guide', 'A high-level introduction to WillowCraft’s player-driven economy. Ask the team for current mechanics.'],
  '/guides/custom-biomes': ['Custom Biomes Guide', 'Explore WillowCraft’s custom-biome feature. Specific locations and names are not published yet.'],
  '/guides/ranks': ['Ranks and Progression Guide', 'Find current WillowCraft rank details through the official Discord community.'],
  '/rules': ['A world we build together', 'A clear guide to keeping WillowCraft welcoming, fair, and fun for everyone.'],
  '/faq': ['Good questions, clear answers', 'The details players ask about most, all in one place.'],
  '/community': ['Find your people', 'Meet the community, get help, and keep up with what is happening in WillowCraft.'],
  '/announcements': ['WillowCraft announcements', 'Official updates, community highlights, events, and notices from WillowCraft.'],
  '/ranks': ['WillowCraft ranks', 'Compare the supplied VIP, MVP, and ELITE rank details.'],
  '/store': ['WillowCraft Points store', 'Browse points information and learn what is needed before purchases can be enabled.'],
  '/leaderboard': ['Supporter leaderboard', 'A leaderboard will appear when verified, publishable purchase records are available.'],
  '/gallery': ['Community gallery', 'WillowCraft builds and moments shared by the community.'],
  '/team': ['The WillowCraft team', 'Meet the people who help make WillowCraft a welcoming place to play.'],
  '/support': ['We’re here to help', 'For player reports, bug reports, and questions, Discord is the best place to reach the team.'],
  '/terms': ['Terms of service', 'A draft framework for WillowCraft. Owner and legal review is required before publication.'],
  '/privacy': ['Privacy policy', 'A transparent summary of what this frontend stores and what still needs owner confirmation.'],
  '/shipping': ['Shipping & delivery', 'Delivery details for store items are still being confirmed by the owner.'],
  '/refunds': ['Returns & refunds', 'Refund terms are still being confirmed by the owner.'],
  '/maintenance': ['Maintenance', 'WillowCraft is taking a short break for maintenance. Check Discord for updates.'],
};

const backgroundAudio = $('#background-audio');
let musicAutoplayBlocked = false;
let musicLoadError = false;
function updateMusicControls() {
  if (!backgroundAudio) return;
  const playButton = $('[data-audio-toggle]');
  const muteButton = $('[data-audio-mute]');
  const slider = $('[data-audio-volume]');
  const status = $('[data-audio-status]');
  const toggle = $('.nav-audio-toggle');
  if (playButton) { playButton.textContent = backgroundAudio.paused ? 'Play' : 'Pause'; playButton.setAttribute('aria-label', backgroundAudio.paused ? 'Play background music' : 'Pause background music'); }
  if (muteButton) { muteButton.textContent = backgroundAudio.muted || backgroundAudio.volume === 0 ? 'Unmute' : 'Mute'; muteButton.setAttribute('aria-label', backgroundAudio.muted || backgroundAudio.volume === 0 ? 'Unmute background music' : 'Mute background music'); }
  if (slider) slider.value = String(backgroundAudio.volume);
  if (status) status.textContent = musicLoadError ? 'Music file could not be loaded' : backgroundAudio.paused ? (musicAutoplayBlocked ? 'Tap Play to start' : 'Paused') : 'Playing · Memories';
  if (toggle) { toggle.classList.toggle('is-playing', !backgroundAudio.paused); toggle.setAttribute('aria-label', backgroundAudio.paused ? 'Open music controls · paused' : 'Open music controls · playing'); }
}
function initializeBackgroundAudio() {
  if (!backgroundAudio) return;
  backgroundAudio.volume = 0.25;
  try {
    const savedVolume = localStorage.getItem('willowcraft-volume');
    const volume = savedVolume === null ? NaN : Number(savedVolume);
    if (Number.isFinite(volume) && volume >= 0 && volume <= 1) backgroundAudio.volume = volume;
    backgroundAudio.muted = localStorage.getItem('willowcraft-muted') === 'true';
  } catch {}
  backgroundAudio.addEventListener('play', () => { musicAutoplayBlocked = false; updateMusicControls(); });
  backgroundAudio.addEventListener('pause', updateMusicControls);
  backgroundAudio.addEventListener('volumechange', updateMusicControls);
  backgroundAudio.addEventListener('error', () => { musicLoadError = true; updateMusicControls(); });
  const attempt = backgroundAudio.play();
  if (attempt?.then) attempt.then(() => { musicAutoplayBlocked = false; updateMusicControls(); }).catch(() => { musicAutoplayBlocked = true; updateMusicControls(); });
}

function header(path) {
  return `<header class="site-header"><a class="brand" href="/" aria-label="${esc(siteName)} home"><img src="/logo.png" alt="" width="40" height="40"><span>${brandMarkup()}</span></a>
    <nav class="desktop-nav" aria-label="Main navigation">${nav.map(n => `<a href="${n.href}" ${path === n.href ? 'aria-current="page"' : ''}>${n.label}</a>`).join('')}</nav>
    <div class="nav-actions"><button class="nav-ip-copy" type="button" data-copy="${server.javaAddress}" aria-label="Copy ${esc(siteName)} server IP"><code>${server.javaAddress}</code><span aria-hidden="true">▢</span></button><div class="nav-audio"><button class="nav-audio-toggle" type="button" aria-expanded="false" aria-controls="audio-panel" aria-label="Open background music controls"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Zm12-1.2v8.4a5 5 0 0 0 0-8.4Zm0-4v2.1a8.5 8.5 0 0 1 0 16.2v2.1a10.5 10.5 0 0 0 0-20.4Z"/></svg><span class="audio-button-state" aria-hidden="true"></span></button><div class="nav-audio-panel" id="audio-panel" hidden><div class="audio-panel-head"><b>Background music</b><span data-audio-status>Starting…</span></div><div class="audio-panel-controls"><button class="audio-action" type="button" data-audio-toggle>Pause</button><label class="audio-volume-label" for="audio-volume">Volume <input id="audio-volume" type="range" min="0" max="1" step="0.01" value="0.25" data-audio-volume></label><button class="audio-action audio-mute" type="button" data-audio-mute>Mute</button></div></div></div><button class="theme-toggle" type="button" aria-label="Switch to light theme" title="Switch theme"><span aria-hidden="true">☼</span></button>${primary('/how-to-join', 'Join server', 'nav-join')}${discordButton('nav-discord header-discord')}<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open navigation"><span></span><span></span></button></div>
    <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation" hidden>${nav.map(n => `<a href="${n.href}" ${path === n.href ? 'aria-current="page"' : ''}>${n.label}<span aria-hidden="true">↗</span></a>`).join('')}<button class="nav-ip-copy mobile-ip-copy" type="button" data-copy="${server.javaAddress}" aria-label="Copy ${esc(siteName)} server IP"><span>Server IP</span><code>${server.javaAddress}</code><span aria-hidden="true">▢</span></button>${primary('/how-to-join', 'Join server')}${discordButton('nav-discord menu-discord')}</nav></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="footer-main"><div class="footer-brand-group"><div class="footer-brand"><a class="brand" href="/" aria-label="${esc(siteName)} home"><img src="/logo.png" alt="" width="44" height="44"><span>${brandMarkup()}</span></a><p>${esc(server.description)}</p>${discordLink('Join our Discord')}</div>
  <div class="footer-server"><span class="card-eyebrow">Server address</span><div class="footer-address"><code>${server.javaAddress}</code><button class="copy-button" data-copy="${server.javaAddress}" aria-label="Copy WillowCraft server address">Copy</button></div></div>
  <div class="footer-developer"><div class="developer-card"><img src="/assets/syxlor-mark.png" alt="Syxlor Studios geometric S mark" width="44" height="44"><div><b>SYXLOR</b><p>Syxlor Studios builds polished Minecraft, Discord, and web systems.</p><div class="developer-domains"><a href="https://syxlor.xyz" target="_blank" rel="noopener noreferrer">syxlor.xyz</a><a href="https://studios.syxlor.xyz" target="_blank" rel="noopener noreferrer">studios.syxlor.xyz</a></div></div></div><p class="developer-credit"><span>Developer:&nbsp;</span><b>Rayhan</b></p></div></div>
  ${Object.entries(footerNav).map(([heading,items])=>`<div class="footer-col"><h3>${heading}</h3>${items.map(item=>item.external?`<a href="${item.href}" target="_blank" rel="noopener noreferrer">${item.label}</a>`:link(item.href,item.label)).join('')}</div>`).join('')}</div>
  <div class="footer-bottom"><span>© <span id="year">${new Date().getFullYear()}</span> ${esc(siteName)}</span><span class="footer-note">Made for the worlds we build together <span aria-hidden="true">✳</span></span><a href="#main">Back to top ↑</a></div></footer>`;
}

function pageHead(eyebrow, title, desc, actions = '') {
  return `<section class="page-head"><div class="eyebrow"><span class="eyebrow-dot"></span>${eyebrow}</div><h1>${title}</h1><p>${desc}</p>${actions ? `<div class="hero-actions">${actions}</div>` : ''}</section>`;
}

function featuresGrid(items = server.features) {
  return `<div class="feature-grid">${items.map(f => `<article class="feature-card reveal">${icon(f.icon)}<span class="card-eyebrow">${f.eyebrow}</span><h3>${f.title}</h3><p>${f.text}</p><span class="card-corner" aria-hidden="true">↗</span></article>`).join('')}</div>`;
}

function joinPanel() {
  return `<div class="join-panel glass-panel"><div class="join-panel-head"><div><div class="eyebrow"><span class="eyebrow-dot"></span>Connection details</div><h2>Choose your edition</h2></div><span class="edition-orb" aria-hidden="true">✳</span></div>
  <div class="segmented" role="tablist" aria-label="Choose Minecraft edition"><button role="tab" id="tab-java" aria-selected="true" aria-controls="panel-java" data-edition="java">Java Edition</button><button role="tab" id="tab-bedrock" aria-selected="false" aria-controls="panel-bedrock" data-edition="bedrock">Bedrock Edition</button></div>
  <div class="edition-panel" id="panel-java" role="tabpanel" aria-labelledby="tab-java"><div class="address-label">Server address</div><div class="address-row"><code>${server.javaAddress}</code><button class="copy-button" data-copy="${server.javaAddress}" aria-label="Copy Java server address">Copy <span aria-hidden="true">▢</span></button></div><p>In Minecraft Java Edition, open <strong>Multiplayer</strong>, choose <strong>Add Server</strong>, and enter the address above.</p></div>
  <div class="edition-panel" id="panel-bedrock" role="tabpanel" aria-labelledby="tab-bedrock" hidden><div class="address-label">Server address</div><div class="address-row"><code>${server.bedrockAddress}</code><button class="copy-button" data-copy="${server.bedrockAddress}" aria-label="Copy Bedrock server address">Copy <span aria-hidden="true">▢</span></button></div><div class="address-label port-label">Port</div><div class="address-row"><code>${server.bedrockPort}</code><button class="copy-button" data-copy="${server.bedrockPort}" aria-label="Copy Bedrock port">Copy <span aria-hidden="true">▢</span></button></div><p>In Bedrock Edition, choose <strong>Play → Servers → Add Server</strong> and enter the address and port above.</p></div>
  <div class="version-note"><span aria-hidden="true">ⓘ</span><span>${server.versionNote} The supplied address and port are shown as provided; cross-play has not been independently verified.</span></div></div>`;
}

function home() {
  return `<section class="hero"><div class="hero-image" aria-hidden="true"></div><div class="ambient-layer" aria-hidden="true"></div><canvas class="particle-canvas" aria-hidden="true"></canvas><div class="hero-vignette"></div><div class="hero-content"><div class="hero-brand-mark"><img src="/logo.png" width="84" height="84" alt="${esc(siteName)} tree emblem"><span><b>${esc(siteName.toUpperCase())}</b><small>THE FOREST IS YOURS</small></span></div><div class="eyebrow hero-eyebrow"><span class="eyebrow-dot"></span>Minecraft Survival SMP</div><h1>Find your place<br>in the <em>wild.</em></h1><p>Explore new horizons, build your legacy, and share the journey with a cozy community.</p><div class="hero-server-card"><div class="hero-server-copy"><span class="server-orb" aria-hidden="true">✳</span><span><small>JAVA & BEDROCK ADDRESS</small><code>${server.javaAddress}</code></span><button class="copy-button" data-copy="${server.javaAddress}" aria-label="Copy ${esc(siteName)} server address">Copy IP <span aria-hidden="true">▢</span></button></div><span class="hero-server-divider" aria-hidden="true"></span><div class="hero-server-port"><span class="server-orb" aria-hidden="true">◈</span><span><small>BEDROCK PORT</small><code>${server.bedrockPort}</code></span><button class="copy-button" data-copy="${server.bedrockPort}" aria-label="Copy Bedrock port">Copy</button></div></div><div class="hero-actions">${primary('/how-to-join','Join the server')}${link('/ranks','Explore ranks','button button-secondary')}</div><div class="hero-footnote"><span class="status-seed" aria-hidden="true">✳</span>Custom biomes · Land claiming · Community-led survival</div></div><a class="scroll-cue" href="#discover"><span>Scroll to explore</span><i aria-hidden="true"></i></a><div class="hero-index">01 <span>/</span> THE BEGINNING</div></section>
    <section class="section intro-section" id="discover"><div class="section-label">A world of your own</div><div class="intro-layout"><h2>More than a map.<br><em>A place to belong.</em></h2><div class="intro-copy"><p>${server.description}</p><p>Whether you’re finding a quiet hillside or building alongside new friends, WillowCraft gives your next survival story room to grow.</p>${link('/about','Meet WillowCraft','arrow-link')}</div></div></section>
    <section class="section feature-section"><div class="section-heading"><div><div class="section-label">Made for the long run</div><h2>Rooted in <em>survival.</em></h2></div>${link('/features','Explore all features','arrow-link')}</div>${featuresGrid(server.features.slice(0,4))}</section>
    <section class="section journey-section"><div class="journey-image"></div><div class="journey-content"><div class="section-label">A good place to begin</div><h2>Start with a<br><em>small step.</em></h2><p>Choose your edition, add the server address, and step into the world. If you need help with versions or connection details, our Discord community can point you in the right direction.</p>${primary('/how-to-join','See how to join')}${discordLink('Visit Discord')}</div></section>
    <section class="section guide-strip"><div><div class="section-label">Find your bearings</div><h2>New to the <em>woods?</em></h2><p>Get a feel for claiming land, the economy, custom biomes, and rank progression.</p></div><div class="guide-strip-links">${guides.slice(0,3).map(g=>link(g.path,`${icon(g.icon)}<span>${g.title}</span><b>↗</b>`,'guide-strip-link')).join('')}</div></section>
    <section class="section homepage-explore"><div class="section-heading"><div><div class="section-label">Make yourself at home</div><h2>More to <em>explore.</em></h2></div></div><div class="explore-links">${[['Ranks','Compare lifetime ranks','/ranks','✧'],['Announcements','Updates from the community','/announcements','✳'],['Community gallery','Builds and moments from players','/gallery','⌂'],['Meet the team','The people behind WillowCraft','/team','♡']].map(([title,copy,href,mark])=>`<a href="${href}" class="explore-card"><span>${mark}</span><div><b>${title}</b><small>${copy}</small></div><i>↗</i></a>`).join('')}</div></section>
    <section class="section community-band"><div class="community-seal">✳</div><div><div class="section-label">The campfire is lit</div><h2>Good worlds are<br><em>better together.</em></h2><p>Find community, ask questions, and get support on the official Discord.</p></div>${discordLink('Join WillowCraft on Discord')}</section>
    <section class="section faq-preview"><div class="section-heading"><div><div class="section-label">Before you set off</div><h2>A few things to <em>know.</em></h2></div>${link('/faq','Visit the FAQ','arrow-link')}</div><div class="faq-preview-grid">${faq.slice(0,4).map(f=>`<a href="/faq" class="faq-preview-card"><span>Q</span><div><b>${f.q}</b><p>${f.a}</p></div><i>↗</i></a>`).join('')}</div></section>
    <section class="final-cta"><div class="final-cta-backdrop"></div><div class="final-cta-inner"><div class="eyebrow"><span class="eyebrow-dot"></span>Your story starts here</div><h2>Make a little<br><em>room to grow.</em></h2><div class="hero-actions">${primary('/how-to-join','Join the server')}${link('/rules','Read the rules','text-link')}</div></div></section>`;
}

function about() {
  return `${pageHead('The WillowCraft way', 'A world worth<br><em>settling into.</em>', server.description, `${primary('/how-to-join','Come join us')}${discordLink()}`)}
  <section class="section split-story"><div class="story-mark"><img src="/logo.png" alt="WillowCraft tree emblem"><span>GROW AT YOUR OWN PACE</span></div><div><div class="section-label">Survival, shared</div><h2>Find your rhythm<br>in the <em>forest.</em></h2><p>WillowCraft is a custom-featured Survival SMP shaped around exploration, building, and the people who bring a world to life. Make a home, trade with neighbors, and discover what the world has to offer.</p><p>There’s no single way to play. Settle in at your own pace and let the community become part of your story.</p></div></section>
  <section class="section about-facts"><div class="section-label">A few roots</div><div class="facts-grid">${[['Founded', server.founded], ['Based in', server.region], ['Languages', server.languages.join(' · ')], ['Owner', server.owner]].map(([label,value])=>`<article class="fact-card"><small>${label}</small><b>${esc(value)}</b></article>`).join('')}</div><p class="owner-note">Server statistics and infrastructure claims are kept unpublished until the owner confirms them.</p></section>
  <section class="section infra-section"><div class="section-heading"><div><div class="section-label">Built for the journey</div><h2>Server <em>infrastructure.</em></h2></div></div><div class="owner-note infra-pending">Technical specifications are awaiting owner verification and are not displayed as confirmed claims.</div></section>
  <section class="section feature-section"><div class="section-heading"><div><div class="section-label">What awaits</div><h2>Space to make it <em>yours.</em></h2></div></div>${featuresGrid()}</section>
  <section class="section community-band"><div class="community-seal">♡</div><div><div class="section-label">Come say hello</div><h2>Every great world<br>starts with <em>hello.</em></h2><p>Join the official Discord for questions, support, and the latest server details.</p></div>${discordLink()}</section>`;
}

function featuresPage() {
  return `${pageHead('A world with more to discover', 'Survival, with<br><em>room to grow.</em>', 'WillowCraft brings together the familiar joy of survival with community-minded features that leave room for your own play style.', primary('/how-to-join','Find your way in'))}
  <section class="section feature-page-grid">${server.features.map((f,i)=>`<article class="feature-detail reveal"><div class="feature-detail-top"><span class="feature-number">0${i+1}</span>${icon(f.icon)}</div><span class="card-eyebrow">${f.eyebrow}</span><h2>${f.title}</h2><p>${f.text}</p>${i===0||i===3?`<span class="owner-note">${i===0?'Exact claim details are confirmed in-game or through staff.':'Current rank information is shared in Discord.'}</span>`:''}</article>`).join('')}</section>
  <section class="section note-band"><span class="note-icon">✳</span><p>We keep feature details honest and current. For exact mechanics, ask the WillowCraft team in Discord.</p>${discordLink('Ask the community')}</section>`;
}

function joinPage() { return `${pageHead('Welcome to WillowCraft', 'Your next world<br>is <em>waiting.</em>', 'Use the connection details below to add WillowCraft to your server list. Need a hand? The community can help in Discord.')}<section class="section join-layout">${joinPanel()}<aside class="join-aside"><div class="section-label">Three quick steps</div><ol class="steps"><li><span>01</span><div><b>Choose your edition</b><p>Use the Java or Bedrock details supplied by the server owner.</p></div></li><li><span>02</span><div><b>Add the server</b><p>Enter the address in your edition’s multiplayer server list.</p></div></li><li><span>03</span><div><b>Step into the world</b><p>Start with <code>${server.startingCommands[0]}</code> or <code>${server.startingCommands[1]}</code>. Ask in Discord if you need help.</p></div></li></ol><div class="help-card"><span>Need connection help?</span><p>Check the latest supported version or ask a question in Discord.</p>${discordLink('Get help in Discord')}</div></aside></section><section class="section community-band compact-band"><div class="community-seal">✧</div><div><div class="section-label">Before you wander</div><h2>Read the <em>rules.</em></h2><p>A few shared guidelines help keep the world welcoming and fair.</p></div>${link('/rules','Read WillowCraft rules','button button-secondary')}</section>`; }

function guidesPage() { return `${pageHead('Field notes', 'A little help for<br><em>the journey.</em>', 'A friendly starting point for the features of WillowCraft. Some detailed mechanics are still best confirmed with the team.', primary('/how-to-join','Join the server'))}<section class="section guide-grid">${guides.map(g=>`<a class="guide-card reveal" href="${g.path}"><span class="guide-card-icon">${g.icon}</span><span class="card-eyebrow">${g.tag}</span><h2>${g.title}</h2><p>${g.text}</p><span class="arrow-link">Read guide <b>↗</b></span></a>`).join('')}</section><section class="section note-band"><span class="note-icon">ⓘ</span><p>Server mechanics can change. For the latest details, check with staff in Discord.</p>${discordLink('Ask on Discord')}</section>`; }

const guideCopy = {
  '/guides/land-claims': ['Land claims','Make a place of your own','WillowCraft offers land protection. The exact claim-block rules, protection boundaries, and claim-management commands should be confirmed in-game or with staff.',`${server.startingCommands.join(' and ')} are the supplied starting commands. Ask in-game or open a Discord support ticket if you need help with current claim details.`],
  '/guides/economy': ['The economy','Trade, make, and grow together','WillowCraft has a player-driven economy. Its specific currency, trading tools, and current mechanics have not been supplied for this guide.','Ask the community in Discord for current economy guidance.'],
  '/guides/custom-biomes': ['Custom biomes','A world made to explore','Custom biomes are part of the WillowCraft experience. Specific biome names, locations, and resources are not published here yet.','Explore at your own pace and check Discord for any current world information shared by staff.'],
  '/guides/ranks': ['Ranks & progression','Keep finding new goals','WillowCraft includes rank progression. Rank names, perks, prices, and rewards have not been provided for this guide.','For current rank details, ask the team in Discord. No purchase or rank store link is published here.']
};
function guidePage(path) { const [name,title,text,tip]=guideCopy[path]; return `<div class="breadcrumbs">${link('/','Home')} <span>›</span> ${link('/guides','Guides')} <span>›</span> <span>${name}</span></div>${pageHead('Field guide · '+name, `${title.split(' ').slice(0,-1).join(' ')}<br><em>${title.split(' ').slice(-1)}</em>`, text)}<section class="section article-layout"><aside class="article-side"><div class="section-label">In this guide</div><a href="#overview">Overview</a><a href="#good-to-know">Good to know</a>${link('/guides','All guides')}</aside><article class="article-body" id="overview"><h2>What we know</h2><p>${text}</p><div class="guide-callout" id="good-to-know"><span>✳</span><div><b>Good to know</b><p>${tip}</p></div></div><h2>Need a hand?</h2><p>The WillowCraft community can share the current details and help you get oriented.</p>${discordLink('Ask in Discord')}<div class="related-guides"><h3>Keep exploring</h3>${guides.filter(g=>g.path!==path).slice(0,2).map(g=>link(g.path,`${g.title} <b>↗</b>`,'related-link')).join('')}</div></article></section>`; }

function rulesPage() { return `${pageHead('The WillowCraft rules', 'A world we build<br><em>together.</em>', 'Treat each other with care, play fairly, and help keep WillowCraft a good place to spend time. If something feels wrong, talk to staff through Discord support.')}
  <section class="section rules-layout"><aside class="rules-toc"><span class="section-label">On this page</span>${rules.map(r=>`<a href="#${r.id}">${r.title}<span>↗</span></a>`).join('')}<div class="appeal-card"><b>Need to raise a concern?</b><p>Open a support ticket and explain the situation calmly.</p>${discordLink('Open Discord')}</div></aside><div class="rules-list">${rules.map((r,i)=>`<article class="rule-group" id="${r.id}"><div class="rule-heading">${icon(r.icon)}<span class="rule-index">0${i+1}</span><h2>${r.title}</h2></div><ul>${r.items.map(item=>`<li>${item}</li>`).join('')}</ul></article>`).join('')}<p class="rules-footnote">Moderation outcomes depend on the situation. Possible consequences are not a fixed automatic sequence.</p></div></section>`; }

function faqPage() { const cats=['General','Joining & versions','Gameplay','Support & community']; return `${pageHead('The WillowCraft handbook', 'Good questions,<br><em>clear answers.</em>', 'A quick guide to joining, getting started, and finding support.')}
  <section class="section faq-layout"><aside class="faq-categories"><span class="section-label">Browse by topic</span>${cats.map((c,i)=>`<a href="#faq-category-${i}">${c}<span>↗</span></a>`).join('')}</aside><div class="faq-groups">${cats.map((cat,i)=>`<section class="faq-group" id="faq-category-${i}"><h2>${cat}</h2>${faq.filter(f=>f.category===cat).map((f,j)=>`<details class="faq-item"><summary><span>${f.q}</span><i aria-hidden="true">+</i></summary><div class="faq-answer"><p>${f.a}</p></div></details>`).join('')}</section>`).join('')}</div></section>`; }

function communityPage() { return `${pageHead('Community', 'Find your <em>people.</em>', 'WillowCraft is better when the world is shared. Join the official Discord for community conversation, server updates, and support.', discordLink('Join the official Discord'))}<section class="section community-actions"><article class="community-action-card"><span>01</span><h2>Ask for help</h2><p>Join the official Discord and open a support ticket for questions or connection help.</p>${link('/support','How support works','arrow-link')}</article><article class="community-action-card"><span>02</span><h2>Report with care</h2><p>Use a support ticket to report a player or bug. Include proof where relevant so staff can review it.</p>${link('/support','Reporting guidance','arrow-link')}</article><article class="community-action-card"><span>03</span><h2>Join the team</h2><p>Staff applications are handled in the designated applications channel when open, or through support.</p>${link('/team','Meet the team','arrow-link')}</article></section><section class="section note-band"><span class="note-icon">ⓘ</span><p>Use the official invite below to find the designated rules and applications channels. This site does not submit tickets.</p>${discordLink('Open Discord')}</section>`; }

function supportPage() { return `${pageHead('Support & contact', 'We’re here to <em>help.</em>', 'The genuine support route is the official WillowCraft Discord. Join the community and open a support ticket.', discordLink('Join Discord & open a ticket'))}<section class="section support-grid"><article class="support-card"><span class="guide-card-icon">♡</span><h2>Player report or appeal</h2><p>Open a support ticket and describe what happened. Attach relevant proof where possible.</p></article><article class="support-card"><span class="guide-card-icon">✳</span><h2>Gameplay assistance</h2><p>Share the steps or connection details you need help with. Staff can guide you through current server mechanics.</p></article><article class="support-card"><span class="guide-card-icon">☏</span><h2>Store order question</h2><p>For an existing order or missing points, share your Minecraft username and order reference in a support ticket. Never send passwords or payment credentials.</p></article></section><section class="section note-band"><span class="note-icon">ⓘ</span><p>There is no website ticket form. Support requests are handled through Discord. Do not post private order or payment details publicly.</p>${discordLink('Go to Discord')}</section>`; }

function announcementPage() {
  const categories = ['All', 'Official Announcements', 'Server Updates', 'Media', 'Community Events', 'Minecraft Guides', 'Survival Guides', 'Patch Notes', 'Important Notices', 'Maintenance Notices', 'Community Highlights'];
  const featured = server.announcements.find(item => item.featured);
  const featuredMarkup = featured ? `<article class="featured-announcement"><span class="card-eyebrow">Featured · ${esc(featured.category || 'Announcement')}</span><h2>${esc(featured.title)}</h2><p>${esc(featured.summary || '')}</p><time>${esc(featured.date || '')}</time><a class="arrow-link" href="/announcements/${encodeURIComponent(featured.slug)}">Read announcement <b>↗</b></a></article>` : '';
  return `${pageHead('One WillowCraft feed', 'The community <em>bulletin.</em>', 'Official news, server updates, events, guides, notices, and community highlights in one place.')}${featuredMarkup ? `<section class="section announcements-featured" data-category="${esc(featured.category || 'Official Announcements')}">${featuredMarkup}</section>` : ''}<section class="section announcement-hub"><div class="announcement-filters" role="group" aria-label="Filter announcements">${categories.map((c,i)=>`<button class="filter-chip" type="button" data-filter="${esc(c)}" aria-pressed="${i===0}">${esc(c)}</button>`).join('')}</div><div class="announcement-list">${server.announcements.length ? server.announcements.map(post=>`<article class="announcement-card" data-category="${esc(post.category || 'Official Announcements')}"><span class="card-eyebrow">${esc(post.category || 'Official Announcements')}</span><h2>${esc(post.title)}</h2><p>${esc(post.summary || '')}</p><time>${esc(post.date || '')}</time><a href="/announcements/${encodeURIComponent(post.slug)}" class="arrow-link">Read more <b>↗</b></a></article>`).join('') : `<div class="empty-state announcement-empty"><div class="empty-art" aria-hidden="true"><span>✳</span><i></i><i></i><i></i></div><div class="eyebrow"><span class="eyebrow-dot"></span>A quiet moment</div><h2>No announcements published yet.</h2><p>When approved updates are ready, they’ll appear in this shared feed. Follow along with the community on Discord.</p>${discordLink('Join WillowCraft Discord')}</div>`}</div></section>`;
}
function announcementArticle(path) {
  const slug = decodeURIComponent(path.slice('/announcements/'.length));
  const post = server.announcements.find(item=>item.slug===slug);
  if (!post) return notFound();
  return `<div class="breadcrumbs">${link('/','Home')} <span>›</span> ${link('/announcements','Announcements')} <span>›</span> <span>${esc(post.title)}</span></div>${pageHead(esc(post.date || 'WillowCraft announcement'), esc(post.title), esc(post.summary || ''))}<section class="section article-layout"><aside class="article-side"><span class="section-label">Announcement</span>${link('/announcements','All announcements')}</aside><article class="article-body">${(post.body || []).map(p=>`<p>${esc(p)}</p>`).join('')}<div class="related-guides"><h3>Keep in touch</h3>${discordLink('Join the Discord')}</div></article></section>`;
}
const roleDepartment = {
  'Owner': 'ownership',
  'Server Manager': 'management',
  'Management': 'management',
  'Head Developer': 'development',
  'Developer': 'development',
  'System Administrator': 'infrastructure',
  'Marketer': 'marketing',
  'Senior Moderator': 'moderation'
};

function teamBySlug(slug) {
  const key = String(slug || '').toLowerCase();
  return team.find(member => member.slug === key) || null;
}
function departmentLabel(id) {
  return departments.find(item => item.id === id)?.label || 'WillowCraft team';
}
function memberSearchText(member) {
  return [member.ign, member.name, ...member.roles, ...member.departments.map(departmentLabel)].join(' ').toLowerCase();
}
function placeholderArt(ign) {
  const letters = String(ign || 'W').replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase() || 'W';
  let hue = 0;
  for (const character of String(ign || 'W')) hue = (hue * 31 + character.charCodeAt(0)) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue},44%,33%)"/><stop offset="1" stop-color="hsl(${(hue + 45) % 360},38%,17%)"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g)"/><text x="32" y="41" text-anchor="middle" font-family="monospace" font-size="21" fill="#e1f8e8">${letters}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
function mcHead(ign, size = 128) {
  return `<img class="mc-head is-loading" src="https://render.crafty.gg/3d/head/${encodeURIComponent(ign)}" data-mc-art="head" data-ign="${esc(ign)}" alt="${esc(ign)} Minecraft head" width="${size}" height="${size}" loading="lazy" decoding="async">`;
}
function mcFull(ign) {
  return `<img class="mc-full is-loading" src="https://render.crafty.gg/3d/full/${encodeURIComponent(ign)}" data-mc-art="full" data-ign="${esc(ign)}" alt="Full Minecraft character render of ${esc(ign)}" width="420" height="620" loading="eager" decoding="async" fetchpriority="high">`;
}
function roleBadges(member, extraClass = '') {
  return `<div class="member-roles ${extraClass}">${member.roles.map(role => `<span class="role-badge role-${roleDepartment[role] || 'development'}">${esc(role)}</span>`).join('')}</div>`;
}
function teamMemberCard(member, index) {
  const owner = member.departments.includes('ownership');
  const primary = member.departments[0];
  return `<a class="team-card${owner ? ' team-card-owner' : ''}${member.featured ? ' team-card-featured' : ''} reveal" href="/team/${member.slug}" data-departments="${member.departments.join(' ')}" data-search="${esc(memberSearchText(member))}" data-delay="${Math.min(index * 45, 360)}">
    <div class="team-card-top">
      <span class="team-head-frame">${mcHead(member.ign, 128)}</span>
      <span class="team-card-index">${String(index + 1).padStart(2, '0')}</span>
    </div>
    <div class="team-card-body">
      <span class="card-eyebrow">${esc(departmentLabel(primary))}</span>
      <h3>${esc(member.displayName || member.name)}</h3>
      <code class="team-ign">${esc(member.ign)}</code>
      ${roleBadges(member)}
    </div>
    <span class="team-card-arrow" aria-hidden="true">↗</span>
  </a>`;
}
function staffPage() {
  if (!team.length) return `${pageHead('Community team', 'The people behind<br><em>the forest.</em>', 'Meet the owners, managers, developers, and moderators who keep WillowCraft running and welcoming.')}<section class="section empty-state"><div class="empty-art" aria-hidden="true"><span>♡</span><i></i><i></i><i></i></div><div class="eyebrow"><span class="eyebrow-dot"></span>Meet the team</div><h2>The team roster is coming soon.</h2><p>Staff profiles will appear here once they are published. In the meantime, the team is easy to find on Discord.</p>${discordLink('Join the Discord')}</section>`;
  const owners = team.filter(member => member.departments.includes('ownership')).length;
  return `<section class="team-hero">
    <div class="team-hero-glow" aria-hidden="true"></div>
    <div class="team-hero-copy">
      <div class="eyebrow"><span class="eyebrow-dot"></span>Community team</div>
      <h1>The people behind<br><em>the forest.</em></h1>
      <p>Meet the owners, managers, developers, administrators, marketers, and moderators who keep WillowCraft running and welcoming.</p>
      <div class="team-hero-stats">
        <div class="team-stat"><b>${team.length}</b><span>Team members</span></div>
        <div class="team-stat"><b>${owners}</b><span>Owners</span></div>
        <div class="team-stat"><b>${departments.length}</b><span>Departments</span></div>
      </div>
    </div>
    <div class="team-hero-stack" aria-hidden="true">
      <span class="hero-stack-ring"></span>
      ${team.slice(0, 4).map((member, index) => `<span class="hero-head hero-head-${index}">${mcHead(member.ign, 96)}</span>`).join('')}
      <span class="hero-stack-label">Staff roster</span>
    </div>
  </section>
  <section class="section team-roster" id="team-roster">
    <div class="section-heading team-roster-heading">
      <div><div class="section-label">Staff directory</div><h2>Meet the <em>team.</em></h2></div>
      <label class="team-search"><span class="sr-only">Search the team</span><input id="team-search" type="search" placeholder="Search name or role" autocomplete="off"></label>
    </div>
    <div class="team-filters" role="group" aria-label="Filter team by department">
      <button class="team-filter" type="button" data-team-filter="all" aria-pressed="true">All<span>${team.length}</span></button>
      ${departments.map(department => `<button class="team-filter" type="button" data-team-filter="${department.id}" aria-pressed="false">${department.label}<span>${team.filter(member => member.departments.includes(department.id)).length}</span></button>`).join('')}
    </div>
    <div class="team-grid" id="team-grid">${team.map((member, index) => teamMemberCard(member, index)).join('')}</div>
    <div class="team-empty" id="team-empty" hidden><span aria-hidden="true">✳</span><b>No team members match that search.</b><p>Try a different name, role, or department.</p></div>
  </section>
  <section class="section team-departments">
    <div class="section-heading"><div><div class="section-label">How we work</div><h2>Organised for <em>the long run.</em></h2></div></div>
    <div class="department-grid">${departments.map(department => {
      const members = team.filter(member => member.departments.includes(department.id));
      return `<article class="department-card"><span class="department-mark" aria-hidden="true">✳</span><div><span class="card-eyebrow">${members.length} member${members.length === 1 ? '' : 's'}</span><h3>${department.label}</h3><p>${department.blurb}</p><div class="department-members">${members.map(member => `<a href="/team/${member.slug}">${esc(member.ign)}</a>`).join('')}</div></div></article>`;
    }).join('')}</div>
  </section>
  <section class="section team-cta"><div class="community-seal" aria-hidden="true">✳</div><div><div class="section-label">Join the community</div><h2>A good team starts<br>with <em>good people.</em></h2><p>Questions about the team or interested in helping? The official Discord is the place to start.</p></div>${discordLink('Join the Discord')}</section>`;
}
function teamProfilePage(path) {
  const member = teamBySlug(path.slice('/team/'.length));
  if (!member) return notFound();
  const displayName = member.name;
  const primary = member.departments[0];
  const responsibilities = member.responsibilities || member.roles.map(role => roleDetails[role]).filter(Boolean);
  const others = team.filter(other => other.slug !== member.slug && other.departments.some(department => member.departments.includes(department))).slice(0, 3);
  const related = others.length ? others : team.filter(other => other.slug !== member.slug).slice(0, 3);
  return `<div class="breadcrumbs">${link('/','Home')} <span>›</span> ${link('/team','Team')} <span>›</span> <span>${esc(member.ign)}</span></div>
  <section class="profile-hero${member.featured ? ' profile-hero-featured' : ''}">
    <div class="profile-stage">
      <div class="profile-stage-glow" aria-hidden="true"></div>
      <div class="profile-stage-grid" aria-hidden="true"></div>
      ${mcFull(member.ign)}
      <div class="profile-stage-meta"><span>Minecraft character</span><code>${esc(member.ign)}</code></div>
    </div>
    <div class="profile-info">
      <div class="eyebrow"><span class="eyebrow-dot"></span>${esc(departmentLabel(primary))}</div>
      <h1>${esc(displayName)}</h1>
      <div class="profile-identity"><span>IGN <code>${esc(member.ign)}</code></span><button class="copy-button" type="button" data-copy="${esc(member.ign)}">Copy</button></div>
      ${member.title ? `<p class="profile-professional">${esc(member.title)}</p>` : ''}
      ${roleBadges(member, 'profile-role-list')}
      <div class="profile-bio">${member.bio.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</div>
      <div class="profile-actions">
        <a class="button button-primary" href="/api/skin/${encodeURIComponent(member.ign)}" download="${esc(member.ign)}-skin.png" data-download-skin="${esc(member.ign)}"><span>Download skin</span><b aria-hidden="true">↓</b></a>
        ${link('/team','Back to team','button button-secondary')}
        ${(member.links || []).map(linkItem => `<a class="button button-ghost" href="${linkItem.href}" target="_blank" rel="noopener noreferrer">${esc(linkItem.label)}<span aria-hidden="true">↗</span></a>`).join('')}
      </div>
      <p class="profile-download-note">Downloads the original Minecraft skin texture as a PNG file. The full-body character above is a rendered preview, not the skin file.</p>
    </div>
  </section>
  <section class="section profile-details">
    <div class="profile-detail-grid">
      <article class="profile-detail-card"><div class="section-label">Responsibilities</div><h2>What ${esc(displayName)} does</h2><ul class="profile-list">${responsibilities.map(item => `<li>${esc(item)}</li>`).join('')}</ul></article>
      <article class="profile-detail-card"><div class="section-label">Departments</div><h2>Where they work</h2><div class="profile-dept-list">${member.departments.map(id => `<a href="/team" class="profile-dept"><b>${departmentLabel(id)}</b><span>${esc(departments.find(item => item.id === id)?.blurb || '')}</span></a>`).join('')}</div></article>
    </div>
    ${member.skills ? `<div class="profile-skills"><div class="section-heading"><div><div class="section-label">Skills &amp; technologies</div><h2>Tools of the <em>trade.</em></h2></div></div><div class="skill-grid">${member.skills.map(group => `<article class="skill-group"><h3>${esc(group.title)}</h3><div class="skill-tags">${group.items.map(item => `<span>${esc(item)}</span>`).join('')}</div></article>`).join('')}</div></div>` : ''}
    <div class="profile-related"><div class="section-heading"><div><div class="section-label">More of the team</div><h2>People who share <em>the work.</em></h2></div></div><div class="related-team-grid">${related.map(other => `<a class="related-member" href="/team/${other.slug}">${mcHead(other.ign, 72)}<div><b>${esc(other.name)}</b><span>${esc(other.roles.join(' · '))}</span></div><i aria-hidden="true">↗</i></a>`).join('')}</div></div>
  </section>`;
}

function ranksPage() {
  return `${pageHead('Choose your path', 'Ranks for the <em>long run.</em>', 'The supplied rank tiers are lifetime ranks with no monthly fee. Purchase, upgrade, and delivery actions require a configured store backend.')}
    <section class="section rank-grid">${server.ranks.map((rank,i)=>`<article class="rank-card rank-${rank.tone}"><div class="rank-art" aria-hidden="true"><span>${i===0?'✧':i===1?'✳':'❖'}</span></div><span class="card-eyebrow">Lifetime rank</span><h2>${rank.name}</h2><div class="rank-price"><b>${rank.points.toLocaleString()}</b><span>Points</span></div><ul><li>Set up to ${rank.homes} homes</li><li>Create ${rank.shops} chestshops</li><li>Sell ${rank.ah} items on AH</li>${rank.commands.map(command=>`<li>Access <code>${command}</code></li>`).join('')}</ul>${link('/store','Purchase in Store','button button-primary')}</article>`).join('')}</section><section class="section note-band"><span class="note-icon">ⓘ</span><p>These tiers are shown as provided. Upgrade price differences, automatic detection, and delivery remain inactive until the server backend supports them.</p>${link('/store','Store details','button button-secondary')}</section>`;
}

function storeCatalog() {
  const { minPoints, maxPoints, step, currency, prices } = server.store;
  const ranks = server.ranks.map((rank, index) => ({
    id: `rank-${rank.name.toLowerCase()}`, category: 'ranks', name: `${rank.name} Rank`, tone: rank.tone,
    mark: index === 0 ? '✧' : index === 1 ? '✳' : '❖', summary: 'A lifetime rank with no monthly fee.', points: rank.points,
    perks: [`Set up to ${rank.homes} homes`, `Create ${rank.shops} chestshops`, `Sell ${rank.ah} items on the auction house`, ...rank.commands.map(command => `Access ${command}`)]
  }));
  const reference = prices[0];
  const points = {
    id: 'points', category: 'points', name: 'WillowCraft Points', tone: 'gold', mark: '◈', from: true, points: minPoints,
    summary: 'Points are the unit that store rank prices are listed in.',
    perks: [`Choose from ${minPoints.toLocaleString()} to ${maxPoints.toLocaleString()} points, in steps of ${step}`, ...(reference ? [`Reference listing: ${reference.points.toLocaleString()} points for ${reference.price} ${currency}`] : [])]
  };
  return [...ranks, points];
}

function storePage() {
  const products = storeCatalog();
  const { minPoints, maxPoints, step, currency } = server.store;
  const defaultPoints = server.store.defaultPoints || minPoints;
  const initialPrice = server.store.prices.find(item => item.points === defaultPoints);
  const productCard = product => `<article class="product-card tone-${esc(product.tone)} reveal" data-product="${product.id}" data-category="${product.category}" data-search="${esc([product.name, product.summary, ...product.perks].join(' ').toLowerCase())}" data-sort-price="${product.points}" data-sort-name="${esc(product.name.toLowerCase())}">
      <div class="product-art" aria-hidden="true"><span>${product.mark}</span></div>
      <div class="product-body"><span class="card-eyebrow">${product.category === 'ranks' ? 'Lifetime rank' : 'Store currency'}</span><h3>${esc(product.name)}</h3><p>${esc(product.summary)}</p>
        <ul class="product-perks">${product.perks.slice(0, 3).map(perk => `<li>${esc(perk)}</li>`).join('')}</ul></div>
      <div class="product-foot"><div class="product-price"><small>${product.from ? 'From' : 'Price'}</small><b>${product.points.toLocaleString()}</b><span>Points</span></div>
        <div class="product-actions"><button class="button button-secondary" type="button" data-product-details="${product.id}">Details</button><button class="button button-primary" type="button" data-product-add="${product.id}">${product.category === 'ranks' ? 'Add to cart' : 'Choose amount'}</button></div></div></article>`;
  const compareRows = [
    ['Price', rank => `${rank.points.toLocaleString()} Points`], ['Homes', rank => rank.homes], ['Chestshops', rank => rank.shops],
    ['Auction house items', rank => rank.ah], ['Commands', rank => rank.commands.map(command => `<code>${esc(command)}</code>`).join(' ')]
  ];
  return `<div id="store-root">
  <section class="store-hero"><div class="store-hero-glow" aria-hidden="true"></div><div class="store-hero-inner">
    <div class="eyebrow"><span class="eyebrow-dot"></span>WillowCraft store</div>
    <h1>Your adventure.<br><em>Your upgrades.</em></h1>
    <p>Explore lifetime ranks and WillowCraft Points, and see exactly what each one includes before you decide.</p>
    <div class="hero-actions"><a class="button button-primary" href="#catalog">Browse the store<span aria-hidden="true">↓</span></a><a class="button button-secondary" href="#compare">Compare ranks</a><button class="button button-ghost store-cart-open" type="button" data-cart-open>Cart <span class="cart-badge" data-cart-count>0</span></button></div>
    <div class="store-status" role="note"><span aria-hidden="true">ⓘ</span><p><b>Checkout is not live yet.</b> You can build a cart to see what you want, but no payment is taken and nothing is delivered until a payment provider is connected.</p></div>
  </div></section>
  <section class="section store-catalog" id="catalog">
    <div class="section-heading"><div><div class="section-label">The catalog</div><h2>Find your <em>upgrade.</em></h2></div></div>
    <div class="store-toolbar">
      <div class="store-chips" role="group" aria-label="Filter products by category"><button class="filter-chip" type="button" data-store-category="all" aria-pressed="true">All</button><button class="filter-chip" type="button" data-store-category="ranks" aria-pressed="false">Ranks</button><button class="filter-chip" type="button" data-store-category="points" aria-pressed="false">Points</button></div>
      <label class="store-field store-search"><span class="sr-only">Search products</span><input id="store-search" type="search" placeholder="Search ranks and perks" autocomplete="off"></label>
      <label class="store-field store-sort"><span class="sr-only">Sort products</span><select id="store-sort"><option value="featured">Featured order</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name</option></select></label>
      <label class="store-field store-username"><span class="sr-only">Minecraft username</span><input id="store-username" name="username" autocomplete="username" maxlength="16" placeholder="Your Minecraft username" pattern="[A-Za-z0-9_]{3,16}"></label>
    </div>
    <p class="store-count" id="store-count" aria-live="polite">${products.length} products</p>
    <div class="product-grid" id="product-grid">${products.map(productCard).join('')}</div>
    <div class="store-empty" id="store-empty" hidden><span aria-hidden="true">✳</span><b>Nothing matches that search.</b><p>Try a different word or clear the filters.</p></div>
  </section>
  <section class="section store-compare" id="compare"><div class="section-heading"><div><div class="section-label">Side by side</div><h2>Compare the <em>ranks.</em></h2></div></div>
    <div class="compare-scroll"><table class="compare-table"><caption class="sr-only">Comparison of WillowCraft ranks</caption><thead><tr><th scope="col">Included</th>${server.ranks.map(rank => `<th scope="col" class="tone-${esc(rank.tone)}">${esc(rank.name)}</th>`).join('')}</tr></thead>
    <tbody>${compareRows.map(([label, value]) => `<tr><th scope="row">${label}</th>${server.ranks.map(rank => `<td>${value(rank)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    <p class="store-footnote">Rank details are shown as supplied by the server. Upgrade pricing between ranks has not been confirmed.</p></section>
  <section class="section store-topup" id="topup"><div class="topup-layout">
    <div class="topup-copy"><div class="section-label">Points</div><h2>Choose your <em>amount.</em></h2><p>Pick a points quantity from ${minPoints.toLocaleString()} to ${maxPoints.toLocaleString()}, in steps of ${step}. Only the reference listing of ${(server.store.prices[0]?.points || defaultPoints).toLocaleString()} points for ${server.store.prices[0]?.price ?? '—'} ${esc(currency)} has a confirmed price.</p></div>
    <form class="store-form" id="store-form" novalidate><label>Points quantity<input name="quantity" type="number" min="${minPoints}" max="${maxPoints}" step="${step}" value="${defaultPoints}" required><small>From ${minPoints.toLocaleString()} to ${maxPoints.toLocaleString()} points, in steps of ${step}.</small></label>
      <div class="store-price-note"><span>Price</span><b data-store-price>${initialPrice ? `${initialPrice.price} ${esc(currency)}` : 'Not configured'}</b><small data-store-price-note>${initialPrice ? `The reference listing for ${initialPrice.points.toLocaleString()} points; other quantities are unconfirmed.` : 'No approved price is available for this quantity.'}</small></div>
      <button class="button button-primary" type="submit">Add points to cart <span aria-hidden="true">＋</span></button></form></div></section>
  <section class="section store-trust"><div class="section-heading"><div><div class="section-label">Before you buy</div><h2>Know what to <em>expect.</em></h2></div></div>
    <div class="trust-grid">
      <article class="trust-card"><span aria-hidden="true">◈</span><h3>Digital items</h3><p>Everything here is a virtual, in-game item for WillowCraft. Nothing is shipped.</p></article>
      <article class="trust-card"><span aria-hidden="true">⌛</span><h3>Delivery</h3><p>Delivery is not set up yet, so no delivery time is promised. See the ${link('/shipping', 'delivery page')} for status.</p></article>
      <article class="trust-card"><span aria-hidden="true">↺</span><h3>Refunds</h3><p>Refund terms are still being written. Read the current ${link('/refunds', 'refund page')} before purchasing becomes available.</p></article>
      <article class="trust-card"><span aria-hidden="true">♡</span><h3>Support</h3><p>Questions about a rank or order are handled in Discord. Never share your password or payment details. ${link('/support', 'How support works')}</p></article>
    </div><p class="store-footnote">See also the ${link('/terms', 'Terms of service')} and ${link('/privacy', 'Privacy policy')} drafts.</p></section>
  <dialog class="store-dialog product-dialog" id="product-dialog" aria-labelledby="product-dialog-title"><div id="product-dialog-body"></div></dialog>
  <dialog class="store-dialog cart-drawer" id="cart-drawer" aria-labelledby="cart-title"><div class="cart-drawer-head"><h2 id="cart-title">Your cart</h2><button class="icon-button" type="button" data-close-dialog aria-label="Close cart">✕</button></div>
    <div class="cart-lines" id="cart-lines" aria-live="polite"></div><div class="cart-summary" id="cart-summary"></div>
    <button class="button button-secondary checkout-disabled" type="button" disabled>Checkout unavailable</button>
    <p class="cart-note">Checkout needs an approved price table, a payment provider and an order backend. This cart is a preview only; nothing is purchased or delivered.</p></dialog>
  </div>`;
}

function leaderboardPage() { return `${pageHead('WillowCraft supporters', 'Community, <em>celebrated.</em>', 'Only verified store purchases and approved public player names can appear here.') }<section class="section empty-state"><div class="empty-art" aria-hidden="true"><span>✧</span><i></i><i></i><i></i></div><div class="eyebrow"><span class="eyebrow-dot"></span>Leaderboard</div><h2>No verified entries yet.</h2><p>Supporter rankings will appear after the store backend provides verified, public records.</p></section>`; }

function galleryPage() { return `${pageHead('Made in WillowCraft', 'A world in <em>frames.</em>', 'Builds, landscapes, and community moments shared by WillowCraft players.')}${server.gallery.length ? `<section class="section gallery-grid">${server.gallery.map(item=>`<figure class="gallery-card"><img src="${esc(item.src)}" alt="${esc(item.alt || '')}"><figcaption>${esc(item.caption || '')}${item.creator?`<small>by ${esc(item.creator)}</small>`:''}</figcaption></figure>`).join('')}</section>` : `<section class="section empty-state"><div class="empty-art" aria-hidden="true"><span>⌂</span><i></i><i></i><i></i></div><div class="eyebrow"><span class="eyebrow-dot"></span>Community gallery</div><h2>The gallery is waiting for player creations.</h2><p>No community screenshots have been supplied yet. Approved images and creator credits will be featured here.</p>${discordLink('Share with the community')}</section>`}`; }

function policyInfoPage(kind) { const shipping=kind==='shipping'; return `${pageHead('Store information · Draft', shipping?'Shipping &amp; <em>delivery.</em>':'Returns &amp; <em>refunds.</em>', 'Owner confirmation required before offering purchases.')}<section class="section legal-layout"><div class="draft-banner"><span>!</span><p><b>No store policy is active.</b> Checkout is disabled; delivery, refunds, and payment processing have not been implemented.</p></div><article class="legal-article"><section><h2>${shipping?'Delivery details pending':'Refund details pending'}</h2><p>${shipping?'The owner must confirm how virtual goods are delivered, expected timing, and the support route before this page can describe a policy.':'The owner must provide and approve the actual refund and cancellation terms before purchases are offered.'}</p></section><section><h2>Need help?</h2><p>For existing questions, contact the WillowCraft team through the official Discord support route.</p>${discordLink('Contact support')}</section></article></section>`; }

function termsPage() { const sections=[['Using the website','This site provides public WillowCraft server information and connection guidance. The server owner should add any additional terms that apply to play.'],['Server rules','Players should read and follow the WillowCraft rules published on this site and in the designated Discord rules channel.'],['Owner details — required','[Owner: provide the legal entity or responsible party, if applicable.] [Owner: provide a contact route.]'],['Jurisdiction and disputes — required','[Owner/legal reviewer: specify applicable jurisdiction and dispute process, if any.]'],['Payments and purchases — required','No payment or purchase flow is provided by this frontend. [Owner: add any verified payment, rank purchase, or refund terms before offering such services.]'],['Review status','Draft only. This page is not legal advice. Owner and legal review is required before publication. No effective date has been supplied.']]; return `${pageHead('Legal · Draft for review', 'Terms of <em>service.</em>', 'This is a clearly marked draft framework. It is not ready to publish as a final legal document.')}<section class="section legal-layout"><div class="draft-banner"><span>!</span><p><b>Owner review required.</b> Complete the bracketed details and have this page reviewed before publication. No effective date has been supplied.</p></div><article class="legal-article">${sections.map(([h,p])=>`<section><h2>${h}</h2><p>${p}</p></section>`).join('')}</article></section>`; }

function privacyPage() { const sections=[['What this website stores','This frontend does not send personal information to a WillowCraft backend. The theme switcher stores your selected light or dark preference in browser local storage under “willowcraft-theme”.'],['Cookies and analytics','The website does not intentionally set cookies or include analytics, advertising, or third-party embeds.'],['External links','The Discord invitation opens an external service. Its handling of information is governed by Discord’s own policies.'],['Details the owner must complete','[Owner: identify the responsible data controller, contact route, hosting provider and logs, retention periods, and the process for privacy requests.]'],['Review status','Draft only. The owner should confirm hosting and operational data handling and obtain appropriate review before publication. No effective date has been supplied.']]; return `${pageHead('Legal · Draft for review', 'Privacy, made <em>clear.</em>', 'A plain-language draft based on the frontend as implemented. The owner must confirm hosting and operational details.')}<section class="section legal-layout"><div class="draft-banner"><span>!</span><p><b>Owner review required.</b> Confirm the hosting provider’s logs and fill in the responsible contact before publication.</p></div><article class="legal-article">${sections.map(([h,p])=>`<section><h2>${h}</h2><p>${p}</p></section>`).join('')}</article></section>`; }

function notFound() { return `<section class="not-found"><div class="not-found-num">404</div><div class="eyebrow"><span class="eyebrow-dot"></span>Lost in the woods?</div><h1>This path doesn’t<br><em>lead anywhere.</em></h1><p>The page may have moved, or the link may be out of date.</p><div class="hero-actions">${primary('/','Back to home')}${link('/guides','Browse the guides','text-link')}</div></section>`; }

const routes = {
  '/': home, '/about': about, '/features': featuresPage, '/how-to-join': joinPage,
  '/guides': guidesPage, '/rules': rulesPage, '/faq': faqPage, '/community': communityPage,
  '/support': supportPage, '/announcements': announcementPage, '/team': staffPage,
  '/ranks': ranksPage, '/store': storePage, '/leaderboard': leaderboardPage, '/gallery': galleryPage,
  '/shipping': () => policyInfoPage('shipping'), '/refunds': () => policyInfoPage('refunds'),
  '/terms': termsPage, '/privacy': privacyPage, '/maintenance': () => `${pageHead('A small pause', 'We’ll be back<br><em>before long.</em>', 'WillowCraft is taking a short break for a little care and maintenance.')}<section class="section empty-state"><div class="empty-art"><span>✳</span></div>${discordLink('Check Discord for updates')}</section>`
};
for (const g of guides) routes[g.path] = () => guidePage(g.path);

let currentPath = '/';
const storeCart = [];
let storeUsername = '';
function articleSlug(path) { try { return decodeURIComponent(path.slice('/announcements/'.length)); } catch { return null; } }
function render(path, animate = false, restoreY = 0) {
  let clean = path.replace(/\/$/, '') || '/';
  if (server.maintenanceMode && clean !== '/maintenance') clean = '/maintenance';
  currentPath = clean;
  const article = clean.startsWith('/announcements/') ? server.announcements.find(item=>item.slug===articleSlug(clean)) : null;
  const teamMember = clean.startsWith('/team/') ? teamBySlug(clean.slice('/team/'.length)) : null;
  const pageTitle = (titles[clean]?.[0] || article?.title || teamMember?.name || (routes[clean] ? clean.slice(1).replaceAll('-', ' ') : 'Page not found')).replaceAll('WillowCraft', siteName);
  document.title = `${pageTitle} · ${siteName}`;
  const description = (clean === '/' ? server.description : titles[clean]?.[1] || article?.summary || server.description).replaceAll('WillowCraft', siteName);
  $('meta[name="description"]').content = description;
  document.body.classList.remove('menu-open');
  $('#site-header').innerHTML = header(clean);
  $('#site-footer').innerHTML = applyConfiguredName(footer());
  main.innerHTML = applyConfiguredName(routes[clean] ? routes[clean]() : clean.startsWith('/announcements/') ? announcementArticle(clean) : clean.startsWith('/team/') ? teamProfilePage(clean) : notFound());
  main.classList.toggle('page-enter', animate);
  requestAnimationFrame(() => main.classList.remove('page-enter'));
  if (!location.hash) window.scrollTo({ top: restoreY, behavior: animate && !restoreY && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto' });
  bindInteractions();
  const hash = location.hash;
  if (hash) requestAnimationFrame(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView());
}

function bindStore(root) {
  const catalog = storeCatalog();
  const byId = id => catalog.find(product => product.id === id);
  const cards = [...root.querySelectorAll('.product-card')];
  const order = new Map(cards.map((card, index) => [card, index]));
  const grid = $('#product-grid', root); const empty = $('#store-empty', root); const count = $('#store-count', root);
  const usernameInput = $('#store-username', root);
  const cartDialog = $('#cart-drawer', root); const productDialog = $('#product-dialog', root);
  usernameInput.value = storeUsername;

  let category = 'all'; let query = ''; let sort = 'featured';
  const applyFilters = () => {
    let shown = 0;
    cards.forEach(card => { const match = (category === 'all' || card.dataset.category === category) && (!query || card.dataset.search.includes(query)); card.hidden = !match; if (match) shown++; });
    [...cards].sort((a, b) => sort === 'price-asc' ? a.dataset.sortPrice - b.dataset.sortPrice : sort === 'price-desc' ? b.dataset.sortPrice - a.dataset.sortPrice : sort === 'name' ? a.dataset.sortName.localeCompare(b.dataset.sortName) : order.get(a) - order.get(b)).forEach(card => grid.appendChild(card));
    empty.hidden = shown > 0; count.textContent = `${shown} ${shown === 1 ? 'product' : 'products'}`;
  };
  root.querySelectorAll('[data-store-category]').forEach(button => button.addEventListener('click', () => {
    category = button.dataset.storeCategory;
    root.querySelectorAll('[data-store-category]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    applyFilters();
  }));
  $('#store-search', root).addEventListener('input', event => { query = event.currentTarget.value.trim().toLowerCase(); applyFilters(); });
  $('#store-sort', root).addEventListener('change', event => { sort = event.currentTarget.value; applyFilters(); });

  const requireUsername = () => {
    const value = usernameInput.value.trim();
    if (!/^[A-Za-z0-9_]{3,16}$/.test(value)) {
      usernameInput.setCustomValidity('Enter a Minecraft username from 3 to 16 letters, numbers, or underscores.');
      usernameInput.reportValidity(); usernameInput.setCustomValidity(''); usernameInput.focus();
      return null;
    }
    storeUsername = value; return value;
  };

  const renderCart = () => {
    $('#cart-lines', root).innerHTML = storeCart.length ? storeCart.map(item => `<div class="cart-line"><span><b>${esc(item.label)}</b><small>For ${esc(item.username)}</small></span><span class="cart-line-price">${esc(item.priceLabel)}</span><button type="button" class="cart-remove" data-remove="${esc(item.id)}" aria-label="Remove ${esc(item.label)} for ${esc(item.username)}">Remove</button></div>`).join('') : '<p class="cart-empty">Your cart is empty. Add a rank or some points to see them here.</p>';
    const rankPoints = storeCart.filter(item => item.kind === 'rank').reduce((sum, item) => sum + item.points, 0);
    const topups = storeCart.filter(item => item.kind === 'points');
    const priced = topups.length > 0 && topups.every(item => item.price);
    $('#cart-summary', root).innerHTML = storeCart.length ? `${rankPoints ? `<div><span>Rank cost</span><b>${rankPoints.toLocaleString()} Points</b></div>` : ''}${topups.length ? `<div><span>Points top-up</span><b>${priced ? `${topups.reduce((sum, item) => sum + item.price, 0)} ${esc(server.store.currency)}` : 'Price not configured'}</b></div>` : ''}` : '';
    root.querySelectorAll('[data-cart-count]').forEach(badge => { badge.textContent = String(storeCart.length); });
    root.querySelectorAll('#cart-lines [data-remove]').forEach(button => button.addEventListener('click', () => { const index = storeCart.findIndex(item => item.id === button.dataset.remove); if (index >= 0) storeCart.splice(index, 1); renderCart(); }));
  };
  const addRank = product => {
    const username = requireUsername(); if (!username) return;
    if (storeCart.some(item => item.productId === product.id && item.username === username)) { showToast(`${product.name} is already in your cart.`); return; }
    storeCart.push({ id: crypto.randomUUID(), productId: product.id, kind: 'rank', label: product.name, username, points: product.points, priceLabel: `${product.points.toLocaleString()} Points` });
    renderCart(); showToast(`${product.name} added to your cart. Checkout is not configured.`);
  };
  const goToTopup = () => { $('#topup', root).scrollIntoView(); $('#store-form', root).elements.quantity.focus(); };

  const openDetails = id => {
    const product = byId(id); if (!product) return;
    $('#product-dialog-body', root).innerHTML = `<div class="product-dialog-art tone-${esc(product.tone)}" aria-hidden="true"><span>${product.mark}</span></div><div class="product-dialog-copy"><span class="card-eyebrow">${product.category === 'ranks' ? 'Lifetime rank' : 'Store currency'}</span><h2 id="product-dialog-title">${esc(product.name)}</h2><p>${esc(product.summary)}</p><h3>What is included</h3><ul class="product-perks product-perks-full">${product.perks.map(perk => `<li>${esc(perk)}</li>`).join('')}</ul><div class="product-price"><small>${product.from ? 'From' : 'Price'}</small><b>${product.points.toLocaleString()}</b><span>Points</span></div><div class="product-actions"><button class="button button-primary" type="button" data-dialog-add="${product.id}">${product.category === 'ranks' ? 'Add to cart' : 'Choose amount'}</button><button class="button button-secondary" type="button" data-close-dialog>Close</button></div></div>`;
    productDialog.querySelector('[data-dialog-add]').addEventListener('click', () => { if (product.category === 'ranks') { addRank(product); } else { productDialog.close(); goToTopup(); } });
    productDialog.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => productDialog.close()));
    productDialog.showModal();
  };
  root.querySelectorAll('[data-product-details]').forEach(button => button.addEventListener('click', () => openDetails(button.dataset.productDetails)));
  root.querySelectorAll('[data-product-add]').forEach(button => button.addEventListener('click', () => { const product = byId(button.dataset.productAdd); if (product.category === 'ranks') addRank(product); else goToTopup(); }));

  [cartDialog, productDialog].forEach(dialog => dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); }));
  cartDialog.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => cartDialog.close()));
  root.querySelectorAll('[data-cart-open]').forEach(button => button.addEventListener('click', () => { renderCart(); cartDialog.showModal(); }));

  const form = $('#store-form', root);
  const updatePrice = () => {
    const quantity = Number(form.elements.quantity.value);
    const price = server.store.prices.find(item => item.points === quantity);
    $('[data-store-price]', root).textContent = price ? `${price.price} ${server.store.currency}` : 'Not configured';
    $('[data-store-price-note]', root).textContent = price ? `This exact ${price.points.toLocaleString()}-point amount is currently listed on the reference store. Other tier prices are not verified.` : 'No configured price matches this quantity. No price is calculated for other amounts.';
  };
  form.elements.quantity.addEventListener('input', updatePrice);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const username = requireUsername(); if (!username) return;
    const quantity = Number(form.elements.quantity.value);
    if (!Number.isInteger(quantity) || quantity < server.store.minPoints || quantity > server.store.maxPoints || quantity % server.store.step !== 0) { form.elements.quantity.setCustomValidity(`Enter ${server.store.minPoints}–${server.store.maxPoints} points in increments of ${server.store.step}.`); form.reportValidity(); form.elements.quantity.setCustomValidity(''); return; }
    const price = server.store.prices.find(item => item.points === quantity)?.price ?? null;
    storeCart.push({ id: crypto.randomUUID(), productId: 'points', kind: 'points', label: `${quantity.toLocaleString()} Points`, username, quantity, price, priceLabel: price ? `${price} ${server.store.currency}` : 'Price not configured' });
    renderCart(); showToast('Points added to your cart. Checkout is not configured.');
  });
  renderCart();
}

function bindInteractions() {
  $('.theme-toggle')?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('willowcraft-theme', next); } catch {}
    updateThemeButton();
  });
  updateThemeButton();
  const menu = $('.menu-toggle'); const mobile = $('#mobile-nav');
  menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); mobile.hidden = !open; document.body.classList.toggle('menu-open', open); });
  const audioPanel = $('#audio-panel');
  const audioPanelToggle = $('.nav-audio-toggle');
  audioPanelToggle?.addEventListener('click', () => {
    const open = audioPanelToggle.getAttribute('aria-expanded') !== 'true';
    audioPanelToggle.setAttribute('aria-expanded', String(open));
    audioPanel.hidden = !open;
    if (open) updateMusicControls();
  });
  $('[data-audio-toggle]')?.addEventListener('click', async () => {
    if (backgroundAudio.paused) {
      try { await backgroundAudio.play(); musicAutoplayBlocked = false; }
      catch { musicAutoplayBlocked = true; }
    } else backgroundAudio.pause();
    updateMusicControls();
  });
  $('[data-audio-volume]')?.addEventListener('input', event => {
    backgroundAudio.volume = Number(event.currentTarget.value);
    if (backgroundAudio.volume > 0) backgroundAudio.muted = false;
    try { localStorage.setItem('willowcraft-volume', String(backgroundAudio.volume)); localStorage.setItem('willowcraft-muted', String(backgroundAudio.muted)); } catch {}
    updateMusicControls();
  });
  $('[data-audio-mute]')?.addEventListener('click', () => {
    backgroundAudio.muted = !(backgroundAudio.muted || backgroundAudio.volume === 0);
    try { localStorage.setItem('willowcraft-muted', String(backgroundAudio.muted)); } catch {}
    updateMusicControls();
  });
  updateMusicControls();
  document.querySelectorAll('[data-edition]').forEach(btn => btn.addEventListener('click', () => setEdition(btn.dataset.edition)));
  document.querySelectorAll('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(btn.dataset.copy); showToast(`Copied ${btn.dataset.copy}`); }
    catch { showToast('Copy unavailable. Select and copy the address.'); }
  }));
  document.querySelectorAll('.filter-chip').forEach(btn => btn.addEventListener('click', () => {
    const selected = btn.dataset.filter;
    document.querySelectorAll('.filter-chip').forEach(chip => chip.setAttribute('aria-pressed', String(chip === btn)));
    document.querySelectorAll('.announcement-card').forEach(card => { card.hidden = selected !== 'All' && card.dataset.category !== selected; });
    const feature = $('.announcements-featured');
    if (feature) feature.hidden = selected !== 'All' && feature.dataset.category !== selected;
  }));
  const storeRoot = $('#store-root');
  if (storeRoot) bindStore(storeRoot);
  document.querySelectorAll('[data-delay]').forEach(el => el.style.setProperty('--delay', `${el.dataset.delay}ms`));
  document.querySelectorAll('img[data-mc-art]').forEach(img => { if (img.complete) (img.naturalWidth ? settleArt(img) : fallbackArt(img)); });
  const teamGrid = $('#team-grid');
  if (teamGrid) {
    let dept = 'all'; let query = '';
    const applyTeamFilter = () => {
      let shown = 0;
      teamGrid.querySelectorAll('.team-card').forEach(card => {
        const match = (dept === 'all' || card.dataset.departments.split(' ').includes(dept)) && (!query || card.dataset.search.includes(query));
        card.hidden = !match; if (match) shown++;
      });
      $('#team-empty').hidden = shown > 0;
    };
    document.querySelectorAll('[data-team-filter]').forEach(btn => btn.addEventListener('click', () => {
      dept = btn.dataset.teamFilter;
      document.querySelectorAll('[data-team-filter]').forEach(other => other.setAttribute('aria-pressed', String(other === btn)));
      applyTeamFilter();
    }));
    $('#team-search')?.addEventListener('input', event => { query = event.currentTarget.value.trim().toLowerCase(); applyTeamFilter(); });
  }
  document.querySelectorAll('.faq-item summary').forEach(summary => summary.addEventListener('click', e => {
    const item = e.currentTarget.parentElement;
    if (!item.open) document.querySelectorAll('.faq-item[open]').forEach(other => { if (other !== item) other.open = false; });
  }));
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
}

function updateThemeButton() { const b = $('.theme-toggle'); if (!b) return; const dark = document.documentElement.dataset.theme === 'dark'; b.innerHTML = `<span aria-hidden="true">${dark ? '☼' : '☾'}</span>`; b.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`); b.title = `Switch to ${dark ? 'light' : 'dark'} theme`; }
function setEdition(edition) {
  document.querySelectorAll('[data-edition]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.edition === edition)));
  document.querySelectorAll('.edition-panel').forEach(p => p.hidden = p.id !== `panel-${edition}`);
}
let toastTimer;
function showToast(msg) { const toast = $('#toast'); toast.textContent = msg; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2400); }

function settleArt(img) { img.classList.remove('is-loading'); }
function fallbackArt(img) {
  if (img.dataset.fallback) return;
  img.dataset.fallback = '1';
  img.src = placeholderArt(img.dataset.ign);
  img.classList.remove('is-loading');
  img.classList.add('is-fallback');
}
document.addEventListener('load', event => { if (event.target?.dataset?.mcArt) settleArt(event.target); }, true);
document.addEventListener('error', event => { if (event.target?.dataset?.mcArt) fallbackArt(event.target); }, true);

history.scrollRestoration = 'manual';
document.addEventListener('keydown', e => {
  const menu = $('.menu-toggle');
  if (e.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') { menu.click(); menu.focus(); }
  const audioToggle = $('.nav-audio-toggle');
  if (e.key === 'Escape' && audioToggle?.getAttribute('aria-expanded') === 'true') { audioToggle.click(); audioToggle.focus(); }
});
document.addEventListener('click', e => {
  const menu = $('.menu-toggle');
  if (menu?.getAttribute('aria-expanded') === 'true' && !e.target.closest('.site-header')) {
    menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation');
    $('#mobile-nav').hidden = true; document.body.classList.remove('menu-open');
  }
  const audioToggle = $('.nav-audio-toggle');
  if (audioToggle?.getAttribute('aria-expanded') === 'true' && !e.target.closest('.nav-audio')) {
    audioToggle.setAttribute('aria-expanded', 'false'); $('#audio-panel').hidden = true;
  }
});
document.addEventListener('click', e => {
  const a = e.target.closest('a[href]');
  if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.origin !== location.origin) return;
  const url = new URL(a.href);
  const nextPath = url.pathname.replace(/\/$/, '') || '/';
  const knownPath = routes[nextPath] || (nextPath.startsWith('/announcements/') && server.announcements.some(item=>item.slug===articleSlug(nextPath))) || (nextPath.startsWith('/team/') && teamBySlug(nextPath.slice('/team/'.length)));
  if (!knownPath) return;
  e.preventDefault(); history.replaceState({ ...(history.state || {}), scrollY: window.scrollY }, ''); history.pushState({ scrollY: 0 }, '', `${url.pathname}${url.hash}`); render(url.pathname, true);
});
window.addEventListener('popstate', event => render(location.pathname, false, event.state?.scrollY || 0));
let saveScrollTimer;
document.addEventListener('scroll', () => {
  $('.site-header')?.classList.toggle('scrolled', window.scrollY > 24);
  clearTimeout(saveScrollTimer);
  saveScrollTimer = setTimeout(() => history.replaceState({ ...(history.state || {}), scrollY: window.scrollY }, ''), 100);
}, { passive: true });
initializeBackgroundAudio();
render(location.pathname);
requestAnimationFrame(() => setTimeout(() => $('#preloader')?.classList.add('loaded'), 180));
