import { server, nav, footerNav, guides, rules, faq } from './config.js';

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
function staffPage() {
  const groups = ['Owner', 'Management', 'Development', 'Moderation', 'Former Staff'];
  return `${pageHead('Community team', 'The people behind<br><em>the forest.</em>', 'The WillowCraft roster as supplied by the server team. Minecraft skin artwork can be added when approved assets are available.')}${groups.map(group=>`<section class="section staff-group"><div class="section-heading"><div><div class="section-label">WillowCraft team</div><h2>${group}</h2></div></div><div class="staff-grid">${server.staff.filter(person=>person.group===group).map(person=>`<article class="staff-card ${person.group==='Owner'?'staff-featured':''}"><div class="staff-avatar" aria-hidden="true">${esc(person.name.slice(0,1).toUpperCase())}</div><span class="card-eyebrow">${esc(person.role)}</span><h3>${esc(person.name)}</h3></article>`).join('') || `<div class="owner-note">No roster entries supplied for this group.</div>`}</div></section>`).join('')}`;
}

function ranksPage() {
  return `${pageHead('Choose your path', 'Ranks for the <em>long run.</em>', 'The supplied rank tiers are lifetime ranks with no monthly fee. Purchase, upgrade, and delivery actions require a configured store backend.')}
    <section class="section rank-grid">${server.ranks.map((rank,i)=>`<article class="rank-card rank-${rank.tone}"><div class="rank-art" aria-hidden="true"><span>${i===0?'✧':i===1?'✳':'❖'}</span></div><span class="card-eyebrow">Lifetime rank</span><h2>${rank.name}</h2><div class="rank-price"><b>${rank.points.toLocaleString()}</b><span>Points</span></div><ul><li>Set up to ${rank.homes} homes</li><li>Create ${rank.shops} chestshops</li><li>Sell ${rank.ah} items on AH</li>${rank.commands.map(command=>`<li>Access <code>${command}</code></li>`).join('')}</ul>${link('/store','Purchase in Store','button button-primary')}</article>`).join('')}</section><section class="section note-band"><span class="note-icon">ⓘ</span><p>These tiers are shown as provided. Upgrade price differences, automatic detection, and delivery remain inactive until the server backend supports them.</p>${link('/store','Store details','button button-secondary')}</section>`;
}

function storePage() {
  const { minPoints, maxPoints, step } = server.store;
  const packages = server.store.packages || [];
  const defaultPoints = server.store.defaultPoints || minPoints;
  const initialPrice = server.store.prices.find(item => item.points === defaultPoints);
  return `${pageHead('WillowCraft Points', 'A store, ready when<br><em>the server is.</em>', 'The reference store lists 700 points for 330 BDT. Prices for other quantities are unconfirmed, and checkout needs a complete price catalog and payment provider.')}
    <section class="section store-layout"><div class="store-main"><form class="store-form" id="store-form" novalidate><label>Minecraft username<input name="username" autocomplete="username" maxlength="16" placeholder="Your in-game name" required pattern="[A-Za-z0-9_]{3,16}"><small>Enter the username that should receive the points. Never enter your password.</small></label><label>Points quantity<input name="quantity" type="number" min="${minPoints}" max="${maxPoints}" step="${step}" value="${defaultPoints}" required><small>From ${minPoints.toLocaleString()} to ${maxPoints.toLocaleString()} points, in steps of ${step}.</small></label><div class="store-price-note"><span>Price</span><b data-store-price>${initialPrice ? `${initialPrice.price} ${server.store.currency}` : 'Not configured'}</b><small data-store-price-note>${initialPrice ? `The reference listing for ${initialPrice.points.toLocaleString()} points; prices for other tiers are unconfirmed.` : 'Approved package prices are not available, so no monetary total is shown.'}</small></div><button class="button button-primary" type="submit">Add points to cart <span aria-hidden="true">＋</span></button></form><div class="store-packages"><div class="section-label">Points packages</div><h2>${packages.length ? 'Choose a package' : 'Packages are not configured'}</h2><p>${packages.length ? 'Configured quantities and prices come from the approved store catalog.' : 'No full package price table is configured. Matching bundles can be priced when the official tiers are confirmed.'}</p>${packages.length ? `<div class="package-grid">${packages.map(pack=>`<button type="button" class="package-card" data-amount="${Number(pack.points)}"><b>${Number(pack.points).toLocaleString()}</b><span>Points</span><small>${esc(pack.price)} ${esc(server.store.currency)}</small></button>`).join('')}</div>` : ''}</div></div><aside class="cart-panel"><div class="section-label">Your cart</div><h2>Order summary</h2><div class="cart-items" aria-live="polite"><p class="cart-empty">Your cart is empty.</p></div><div class="cart-total"><span>Order total</span><b>Unavailable</b></div><button class="button button-secondary checkout-disabled" type="button" disabled>Checkout unavailable</button><p>Checkout needs the approved price table, a payment provider, and an order backend. This site will not simulate a purchase or delivery.</p><div class="support-note">Need help with an existing store order? ${link('/support','Contact support','arrow-link')}</div></aside></section>`;
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
function articleSlug(path) { try { return decodeURIComponent(path.slice('/announcements/'.length)); } catch { return null; } }
function render(path, animate = false, restoreY = 0) {
  let clean = path.replace(/\/$/, '') || '/';
  if (server.maintenanceMode && clean !== '/maintenance') clean = '/maintenance';
  currentPath = clean;
  const article = clean.startsWith('/announcements/') ? server.announcements.find(item=>item.slug===articleSlug(clean)) : null;
  const pageTitle = (titles[clean]?.[0] || article?.title || (routes[clean] ? clean.slice(1).replaceAll('-', ' ') : 'Page not found')).replaceAll('WillowCraft', siteName);
  document.title = `${pageTitle} · ${siteName}`;
  const description = (clean === '/' ? server.description : titles[clean]?.[1] || article?.summary || server.description).replaceAll('WillowCraft', siteName);
  $('meta[name="description"]').content = description;
  document.body.classList.remove('menu-open');
  $('#site-header').innerHTML = header(clean);
  $('#site-footer').innerHTML = applyConfiguredName(footer());
  main.innerHTML = applyConfiguredName(routes[clean] ? routes[clean]() : clean.startsWith('/announcements/') ? announcementArticle(clean) : notFound());
  main.classList.toggle('page-enter', animate);
  requestAnimationFrame(() => main.classList.remove('page-enter'));
  if (!location.hash) window.scrollTo({ top: restoreY, behavior: animate && !restoreY && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto' });
  bindInteractions();
  const hash = location.hash;
  if (hash) requestAnimationFrame(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView());
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
  const storeForm = $('#store-form');
  if (storeForm) {
    const renderCart = () => {
      const host = $('.cart-items');
      host.innerHTML = storeCart.length ? storeCart.map(item => `<div class="cart-line"><span><b>${esc(item.quantity.toLocaleString())} points</b><small>For ${esc(item.username)}</small></span><button type="button" class="cart-remove" data-remove="${item.id}" aria-label="Remove ${esc(item.quantity)} points for ${esc(item.username)}">Remove</button><small>${item.price ? `${item.price} ${esc(server.store.currency)}` : 'Price not configured'}</small></div>`).join('') : '<p class="cart-empty">Your cart is empty.</p>';
      const knownTotal = storeCart.length === 1 ? storeCart[0].price : null;
      $('.cart-total b').textContent = knownTotal ? `${knownTotal} ${server.store.currency}` : 'Unavailable';
      host.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => { const i=storeCart.findIndex(item=>item.id===button.dataset.remove); if(i>=0) storeCart.splice(i,1); renderCart(); }));
    };
    renderCart();
    const updatePrice = () => {
      const quantity = Number(storeForm.elements.quantity.value);
      const price = server.store.prices.find(item => item.points === quantity);
      $('[data-store-price]').textContent = price ? `${price.price} ${server.store.currency}` : 'Not configured';
      $('[data-store-price-note]').textContent = price ? `This exact ${price.points.toLocaleString()}-point amount is currently listed on the reference store. Other tier prices are not verified.` : 'No configured price matches this quantity. No price is calculated for other amounts.';
    };
    storeForm.elements.quantity.addEventListener('input', updatePrice);
    storeForm.querySelectorAll('[data-amount]').forEach(button => button.addEventListener('click', () => { storeForm.elements.quantity.value = button.dataset.amount; }));
    document.querySelectorAll('.package-card').forEach(button => button.addEventListener('click', () => { storeForm.elements.quantity.value = button.dataset.amount; storeForm.elements.quantity.focus(); }));
    storeForm.addEventListener('submit', event => {
      event.preventDefault();
      const username = storeForm.elements.username.value.trim();
      const quantity = Number(storeForm.elements.quantity.value);
      if (!/^[A-Za-z0-9_]{3,16}$/.test(username)) { storeForm.elements.username.setCustomValidity('Enter a Minecraft username from 3 to 16 letters, numbers, or underscores.'); storeForm.reportValidity(); storeForm.elements.username.setCustomValidity(''); return; }
      if (!Number.isInteger(quantity) || quantity < server.store.minPoints || quantity > server.store.maxPoints || quantity % server.store.step !== 0) { storeForm.elements.quantity.setCustomValidity(`Enter ${server.store.minPoints}–${server.store.maxPoints} points in increments of ${server.store.step}.`); storeForm.reportValidity(); storeForm.elements.quantity.setCustomValidity(''); return; }
      const price = server.store.prices.find(item => item.points === quantity)?.price ?? null;
      storeCart.push({ id: crypto.randomUUID(), username, quantity, price }); renderCart(); showToast('Added to your cart. Checkout is not configured.');
    });
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
  const knownPath = routes[nextPath] || (nextPath.startsWith('/announcements/') && server.announcements.some(item=>item.slug===articleSlug(nextPath)));
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
