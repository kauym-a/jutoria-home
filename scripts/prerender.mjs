// ============================================================
// Build-time static prerendering for product pages AND key static marketing routes
// (/, /wholesale, /products, etc.).
//
// WHY THIS APPROACH (not react-snap / vite-plugin-prerender):
// Both of those are effectively unmaintained (last published 2022) and pin very old
// bundled Puppeteer/Chromium versions, which are unreliable to install and often fail
// to launch on modern OSes/CI. This script uses `puppeteer-core` instead — a real,
// actively maintained automation library — driving the Chrome/Chromium ALREADY
// installed on the build machine (no extra ~200MB browser download, no version-pinning
// risk). Functionally it's the same technique those tools use under the hood: run the
// real built app in a real browser, let React + react-helmet-async render for real, then
// serialize the final DOM to a static .html file per route.
//
// WHAT IT DOES:
//   1. Serves the already-built `dist/` folder locally (same SPA-fallback behaviour as
//      the site's public/.htaccess: unmatched paths fall back to index.html).
//   2. For every product SKU in Firestore, opens /product/<sku> in a real browser tab
//      and waits for it to fully render (see prerenderRoute) — covers the Firestore
//      fetch useProducts() kicks off (see src/hooks/useProducts.ts).
//   3. For every route in STATIC_ROUTES (below) — the marketing/info pages that matter
//      most for Core Web Vitals (LCP/FCP), since without this they ship as an empty
//      `<div id="root">` shell that waits for JS to download+execute+hydrate before any
//      content paints — does the same, writing dist/<route>/index.html (or dist/index.html
//      directly for '/').
//   4. Captures the fully-rendered HTML (React mounted, react-helmet-async's <title> and
//      <meta property="og:*"> tags baked into <head> for real) and writes it to disk.
//
// Real end users still get the normal client-rendered SPA (main.tsx calls
// createRoot(...).render(...), which simply re-renders over this prerendered markup —
// no hydration mismatch risk). This means crawlers AND the initial paint for real visitors
// now get real content (hero image, text, og:tags) without waiting on any JavaScript.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import serveStatic from 'serve-static';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const PORT = 4173; // arbitrary local-only port, not the app's real dev/preview port

function resolveChromePath() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  const candidates =
    process.platform === 'win32'
      ? [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
          'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
        ]
      : process.platform === 'darwin'
        ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
        : [
            '/usr/bin/google-chrome-stable',
            '/usr/bin/google-chrome',
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium',
          ];
  const found = candidates.find((p) => p && fs.existsSync(p));
  if (!found) {
    throw new Error(
      'কোনো Chrome/Chromium/Edge খুঁজে পাওয়া যায়নি prerendering-এর জন্য। ' +
        'PUPPETEER_EXECUTABLE_PATH env var দিয়ে ব্রাউজারের পাথ সেট করুন, ' +
        'অথবা এই মেশিনে Google Chrome ইনস্টল করুন।',
    );
  }
  return found;
}

function startStaticServer() {
  const serve = serveStatic(DIST_DIR, { index: ['index.html'] });
  const server = http.createServer((req, res) => {
    serve(req, res, () => {
      // SPA fallback — public/.htaccess-এ থাকা রুলের সমতুল্য: real file না পেলে index.html
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      fs.createReadStream(path.join(DIST_DIR, 'index.html')).pipe(res);
    });
  });
  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(PORT, () => resolve(server));
  });
}

function loadStaticFallbackRoutes() {
  const jsonPath = path.join(ROOT, 'src/data/products.json');
  const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  return products
    .filter((p) => p && p.sku)
    .map((p) => ({ sku: p.sku, route: `/product/${encodeURIComponent(p.sku)}` }));
}

/**
 * প্রোডাক্ট রুটের লিস্ট Firestore থেকেই আনা হয় (src/data/products.json থেকে নয়) —
 * কারণ ProductDetail.tsx/useProducts.ts-এর নিজস্ব লজিক অনুযায়ী Firestore-ই আসল সোর্স
 * অফ ট্রুথ (স্ট্যাটিক JSON শুধু Firestore fetch শেষ না হওয়া পর্যন্ত সাময়িক fallback)।
 *
 * ⚠️ আবিষ্কৃত পূর্ববর্তী বাগ (এই prerender কাজের বাইরে, কিন্তু prerender করতে গিয়ে ধরা
 * পড়েছে): Firestore-এর 'products' কালেকশনে এখন মাত্র হাতে-গোনা কয়েকটা প্রোডাক্ট আছে,
 * কিন্তু src/data/products.json-এ ৩৪টা লিগ্যাসি এন্ট্রি আছে। useProducts()-এর
 * fetchActiveProducts() রেজলভ হওয়ার পর পুরো products অ্যারে প্রতিস্থাপিত হয়ে যায়
 * (merge হয় না) — তাই যেসব SKU Firestore-এ নেই কিন্তু JSON fallback-এ আছে, সেগুলোর পেজ
 * প্রথমে ঠিকঠাক দেখালেও Firestore fetch শেষ হওয়ার পরপরই real ভিজিটরদের জন্যও
 * "Product Not Found"-এ পরিণত হয়ে যায়। এটা আলাদা করে ফিক্স করা দরকার
 * (useProducts.ts-এ merge-by-sku লজিক) — এই prerender স্ক্রিপ্টের কাজ না, তাই touch
 * করা হয়নি, কিন্তু ঠিক এই কারণেই route list Firestore থেকে আনা risক জরুরি: legacy-only
 * SKU-র জন্য fake/স্ট্যাটিক ডেটা বেক করলে ভুল দাবি করা হতো, প্রকৃত অবস্থা (Not Found)
 * প্রতিফলিত হতো না।
 */
async function loadProductRoutes() {
  try {
    const configPath = path.join(ROOT, 'src/services/firebase/config.ts');
    const configSrc = fs.readFileSync(configPath, 'utf8');
    const projectId = configSrc.match(/projectId:\s*"([^"]+)"/)?.[1];
    if (!projectId) throw new Error('config.ts থেকে projectId পার্স করা যায়নি');

    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products?pageSize=300`,
    );
    if (!res.ok) throw new Error(`Firestore REST ${res.status}`);
    const data = await res.json();
    const skus = (data.documents || []).map((d) => d.name.split('/').pop());
    if (skus.length === 0) throw new Error('Firestore-এ কোনো প্রোডাক্ট পাওয়া যায়নি');

    console.log(`[prerender] Firestore থেকে ${skus.length}টা প্রোডাক্ট SKU পাওয়া গেছে।`);
    return skus.map((sku) => ({ sku, route: `/product/${encodeURIComponent(sku)}` }));
  } catch (err) {
    console.warn(
      `[prerender] ⚠ Firestore থেকে প্রোডাক্ট লিস্ট আনতে ব্যর্থ (${err.message}) — ` +
        `src/data/products.json থেকে fallback রুট লিস্ট ব্যবহার হচ্ছে (নেটওয়ার্ক না থাকলে/বিল্ড অফলাইন হলে এটাই একমাত্র উপায়)।`,
    );
    return loadStaticFallbackRoutes();
  }
}

const DEFAULT_TITLE = 'JUTORIA | Premium Eco-Friendly Handmade Home Décor';

// ============================================================
// CRITICAL CSS INLINING — PageSpeed-এ "Render-blocking requests" সবসময় অ্যাপের নিজের
// bundled CSS (`/assets/index-*.css`, ~50KB raw / ~9KB gzip) নিয়ে ফ্ল্যাগ হচ্ছিল।
// prerender করা HTML-এ real content আগে থেকেই থাকা সত্ত্বেও ব্রাউজার প্রথম পেইন্ট আটকে
// রাখে যতক্ষণ না এই blocking <link rel="stylesheet"> নেটওয়ার্ক রাউন্ড-ট্রিপ শেষ হয়
// (CSSOM রেডি না হওয়া পর্যন্ত পেইন্ট না করাটাই standard browser behavior, FOUC এড়াতে) —
// থ্রটলড মোবাইলে এই একটা রিকোয়েস্টই FCP-তে সেকেন্ডখানেক যোগ করছিল।
//
// এই ফাইলটা ছোট (পুরো অ্যাপের Tailwind output, প্রতিটা রুটেই identical) বলে সরাসরি
// <head>-এ <style> ট্যাগ হিসেবে inline করে দেওয়া হচ্ছে — এতে আলাদা নেটওয়ার্ক
// রাউন্ড-ট্রিপের দরকারই পড়ে না, prerendered HTML-এর সাথেই একই রেসপন্সে আসে। Hostinger
// gzip/br দিয়ে HTML compress করে বলে wire-এ বাড়তি বাইট খরচও নগণ্য (~৯KB gzip যা আগে
// আলাদা CSS রিকোয়েস্টেও যেত)। ট্রেডঅফ: cross-page navigation-এ (client-side SPA route
// change নয়, ফ্রেশ পেজ লোডে) CSS আর browser HTTP cache থেকে reuse হবে না, প্রতিটা
// প্রথমবার-লোড-করা রুটেই আবার inline হয়ে আসবে — কিন্তু ফাইলটা ছোট বলে এটা একটা যুক্তিসঙ্গত
// trade-off, বিশেষত যেহেতু Lighthouse/PageSpeed ঠিক এই cold-load কেসটাই মাপে।
function inlineCriticalCss(html) {
  const match = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/);
  if (!match) return html; // না পাওয়া গেলে ডিফেন্সিভলি link-টাই অক্ষত রেখে দেওয়া হলো
  const [linkTag, href] = match;
  const css = fs.readFileSync(path.join(DIST_DIR, href), 'utf8');
  return html.replace(linkTag, `<style>${css}</style>`);
}

// স্ট্যাটিক মার্কেটিং রুট — এগুলোর কনটেন্ট বিল্ড-টাইমে ফিক্সড (Firestore-নির্ভর প্রোডাক্ট
// ডেটার মতো ইউজার-জেনারেটেড নয়), তাই Firestore থেকে লিস্ট আনার দরকার নেই, হার্ডকোড করাই
// যথেষ্ট। '/' রুটটা dist/index.html-কেই সরাসরি ওভাররাইট করে (Apache-এ "/" রিকোয়েস্ট
// DirectoryIndex দিয়ে ওই ফাইলেই রিজলভ হয়) — তাই সরাসরি ডোমেইন রুট ভিজিট করলেই এখন থেকে
// খালি loading shell-এর বদলে আসল Home কনটেন্ট (hero, ইত্যাদি) view-source-এই দেখা যাবে।
// GA PageSpeed রিপোর্টে সবচেয়ে বেশি ফ্ল্যাগ হওয়া /wholesale অগ্রাধিকারে প্রথমে।
const STATIC_ROUTES = [
  { route: '/wholesale', outFile: 'wholesale/index.html' },
  { route: '/', outFile: 'index.html' },
  { route: '/products', outFile: 'products/index.html' },
  { route: '/categories', outFile: 'categories/index.html' },
  { route: '/materials', outFile: 'materials/index.html' },
  { route: '/our-story', outFile: 'our-story/index.html' },
  { route: '/company-profile', outFile: 'company-profile/index.html' },
  { route: '/people', outFile: 'people/index.html' },
  { route: '/corporate-information', outFile: 'corporate-information/index.html' },
  { route: '/clients-markets', outFile: 'clients-markets/index.html' },
  { route: '/amazon-usa', outFile: 'amazon-usa/index.html' },
  { route: '/jutoria-ai', outFile: 'jutoria-ai/index.html' },
  { route: '/sustainability', outFile: 'sustainability/index.html' },
  { route: '/contact', outFile: 'contact/index.html' },
];

async function prerenderRoute(browser, baseUrl, route, debug = false) {
  const page = await browser.newPage();
  if (debug) {
    page.on('console', (msg) => console.log('  [console]', msg.type(), msg.text()));
    page.on('pageerror', (err) => console.log('  [pageerror]', err.message));
    page.on('requestfailed', (req) => console.log('  [requestfailed]', req.url(), req.failure()?.errorText));
    page.on('response', (res) => {
      if (!res.ok()) console.log('  [response]', res.status(), res.url());
    });
  }
  try {
    // App কোনো JS চালানোর আগেই এই ফ্ল্যাগ বসিয়ে দেয় — AuthProvider.tsx এটা দেখে Firebase
    // Auth resolve হওয়ার জন্য অপেক্ষা না করেই কনটেন্ট রেন্ডার করে (দেখুন সেই ফাইলের কমেন্ট)।
    await page.evaluateOnNewDocument(() => {
      window.__PRERENDER__ = true;
    });
    // NOTE: ইচ্ছাকৃতভাবে 'networkidle0' ব্যবহার করা হয়নি — Firebase Firestore SDK পেজের
    // পুরো লাইফটাইমে একটা persistent streaming/long-poll কানেকশন খোলা রাখে (এমনকি
    // এক-বারের getDocs() রিডেও), তাই "0টা কানেকশন" কখনো true হয় না আর networkidle0
    // চিরকাল অপেক্ষা করতেই থাকে। তার বদলে 'domcontentloaded' + নিচের waitForFunction
    // (নির্দিষ্ট শর্তের জন্য অপেক্ষা) ব্যবহার করা হচ্ছে।
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    if (debug) console.log('  [debug] after goto:', await page.evaluate(() => ({ href: location.href, title: document.title })));

    // প্রোডাক্টের static fallback ডেটা সিঙ্ক্রোনাসভাবেই পাওয়া যায় (useProducts.ts দেখুন),
    // তাই React-এর প্রথম রেন্ডারেই সঠিক title/og:title বসে যাওয়া উচিত — জেনেরিক ডিফল্ট
    // টাইটেল থেকে বদলানো পর্যন্ত অপেক্ষা করি।
    const changed = await page
      .waitForFunction((defaultTitle) => document.title && document.title !== defaultTitle, { timeout: 10000 }, DEFAULT_TITLE)
      .then(() => true)
      .catch(() => false);
    if (debug) console.log('  [debug] title changed before timeout:', changed, await page.evaluate(() => ({ href: location.href, title: document.title })));

    // Firestore থেকে আসল (সম্ভবত আপডেটেড/Storage-hosted) ডেটা দিয়ে upgrade হওয়ার জন্য
    // বাড়তি সময় — networkidle-এর বিকল্প হিসেবে একটা বাউন্ডেড fixed wait।
    await new Promise((r) => setTimeout(r, 1500));
    if (debug) console.log('  [debug] after fixed wait:', await page.evaluate(() => ({ href: location.href, title: document.title })));

    // ⚠️ index.html-এ static fallback হিসেবে বসানো og:*/twitter:* ট্যাগগুলো (crawler যেন
    // JS ছাড়াও কিছু একটা পায়) react-helmet-async মুছে ফেলে না — শুধু নতুন করে যোগ করে,
    // ফলে <head>-এ একই property-র দুইটা <meta> থাকে। querySelector/বেশিরভাগ crawler
    // (Facebook স্পষ্টভাবে) ডকুমেন্ট-অর্ডারে *প্রথম*টা পড়ে — যেটা স্ট্যাটিক জেনেরিকটাই,
    // Helmet-এর সঠিক প্রোডাক্ট-স্পেসিফিক ট্যাগ নয় (যেটা পরে অ্যাপেন্ড হয়)। তাই এখানে
    // প্রতিটা property/name-এর জন্য শুধু *শেষটা* (Helmet-এর) রেখে বাকিগুলো সরিয়ে দিচ্ছি।
    await page.evaluate(() => {
      const dedupe = (selector, attr) => {
        const seen = new Map();
        document.querySelectorAll(selector).forEach((el) => {
          const key = el.getAttribute(attr);
          if (!key) return;
          if (seen.has(key)) seen.get(key).remove(); // আগেরটা (স্ট্যাটিক/জেনেরিক) সরিয়ে ফেলা হলো
          seen.set(key, el); // সবসময় সর্বশেষটাই (Helmet-এর) রাখা হয়
        });
      };
      dedupe('meta[property^="og:"]', 'property');
      dedupe('meta[name^="twitter:"]', 'name');
      dedupe('link[rel="canonical"]', 'rel');
      // Helmet মাঝেমধ্যে rel="preload" লিংকও (যেমন Wholesale.tsx-এর hero-image preload)
      // ডাবল রেন্ডার করে ফেলে — href অনুযায়ী dedupe করা হচ্ছে যাতে prerendered HTML-এ
      // একই preload দুইবার না থাকে।
      dedupe('link[rel="preload"]', 'href');

      // ⚠️ আবিষ্কৃত বাগ: index.html-এর Google Fonts স্টাইলশিট non-blocking রাখার জন্য
      // media="print" + onload="this.media='all'" প্যাটার্ন ব্যবহার করা হয় (দেখুন
      // index.html-এর কমেন্ট)। কিন্তু এই prerender স্ক্রিপ্ট page.content() দিয়ে DOM-এর
      // *লাইভ* অবস্থা সেভ করে — ততক্ষণে onload ইতিমধ্যে ফায়ার হয়ে media="all" বসিয়ে
      // দিয়েছে, ফলে সেভ হওয়া HTML-এ প্রথম বাইট থেকেই media="all" থাকে আর ফন্ট CSS
      // আবার render-blocking হয়ে যায় — ঠিক সেই সমস্যাটাই যেটা এই প্যাটার্ন ফিক্স করার
      // কথা ছিল, প্রতিটা prerendered পেজে (/, /wholesale, প্রোডাক্ট পেজ...) ফিরে আসে।
      // তাই serialize করার ঠিক আগে media অ্যাট্রিবিউট আবার "print"-এ রিসেট করা হচ্ছে।
      document.querySelectorAll('link[rel="stylesheet"][href*="fonts.googleapis.com"]').forEach((el) => {
        el.setAttribute('media', 'print');
      });

      // ⚠️ আরেকটা একই ধরনের বাগ: Firestore/Storage/Auth এখন lazy dynamic import() (দেখুন
      // src/services/firebase/config.ts) — এই পেজ prerender করার সময় products/categories
      // ফেচ হওয়ার কারণে dynamic import() সত্যিকারেই ট্রিগার হয়, আর Vite-এর রানটাইম
      // preload হেল্পার তখন একটা নতুন <link rel="modulepreload"> DOM-এ ইনজেক্ট করে,
      // href resolve হয় *এই prerender ব্রাউজার সেশনের* origin (http://127.0.0.1:PORT)
      // দিয়ে — যেটা কখনোই আসল ভিজিটরের ব্রাউজারে কাজ করবে না (broken request)। শুধু URL
      // ঠিক করে রাখাটাও ভুল হবে — তাহলে Firestore চাংক আবার প্রতিটা পেজ-লোডে eagerly,
      // high-priority-তে preload হয়ে যাবে, ঠিক যেটা lazy-loading করে এড়ানো হয়েছিল।
      // তাই এই প্রি-রেন্ডার-সেশন-নির্দিষ্ট ইনজেক্টেড ট্যাগগুলো সরিয়ে দেওয়া হচ্ছে — আসল
      // ভিজিটরের ব্রাউজার প্রয়োজনমতো নিজেই এটা (সঠিক origin দিয়ে) ইনজেক্ট করবে dynamic
      // import() চলার সময়, prerendered HTML-এ static থাকার দরকার নেই।
      document.querySelectorAll('link[rel="modulepreload"]').forEach((el) => {
        const href = el.getAttribute('href') || '';
        if (href.startsWith(location.origin)) el.remove();
      });

      // <title>-এর কোনো attribute-key নেই dedupe করার জন্য — react-helmet-async DOM-এ
      // নতুন <title> বসায় প্রথম চাইল্ড হিসেবে (তাই document.title getter এটাই ঠিকভাবে
      // ধরে), কিন্তু index.html-এর আসল static <title>-টা দ্বিতীয় হিসেবে থেকেই যায়।
      // প্রথমটা (Helmet-এর, document.title-এর সাথে সামঞ্জস্যপূর্ণ) রেখে বাকিগুলো সরানো হলো।
      const titles = document.querySelectorAll('title');
      titles.forEach((el, i) => {
        if (i > 0) el.remove();
      });
    });

    const meta = await page.evaluate(() => ({
      title: document.title,
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') || null,
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || null,
      rootChildren: document.getElementById('root')?.children.length || 0,
    }));

    const html = inlineCriticalCss(await page.content());
    return { html, meta };
  } finally {
    await page.close();
  }
}

async function main() {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error('dist/ পাওয়া যায়নি — আগে `npm run build` (vite build অংশটা) চালান।');
  }

  let routes = await loadProductRoutes();
  const limit = Number(process.env.PRERENDER_LIMIT || 0);
  const debug = process.env.PRERENDER_DEBUG === '1';
  if (process.env.PRERENDER_ONLY) {
    routes = routes.filter((r) => r.sku === process.env.PRERENDER_ONLY);
  } else if (limit > 0) {
    routes = routes.slice(0, limit);
  }
  console.log(`[prerender] ${routes.length}টা প্রোডাক্ট রুট prerender করা হবে...`);

  const server = await startStaticServer();
  const baseUrl = `http://127.0.0.1:${PORT}`;
  const executablePath = resolveChromePath();
  console.log(`[prerender] ব্রাউজার: ${executablePath}`);

  const browser = await puppeteer.launch({ executablePath, headless: true });

  let ok = 0;
  let failed = 0;
  try {
    for (const { sku, route } of routes) {
      try {
        const { html, meta } = await prerenderRoute(browser, baseUrl, route, debug);
        const outDir = path.join(DIST_DIR, 'product', sku);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');

        const imageOk = Boolean(meta.ogImage);
        const titleOk = Boolean(meta.ogTitle) && meta.ogTitle !== 'JUTORIA | Premium Eco-Friendly Handmade Home Décor';
        console.log(
          `${titleOk && imageOk ? '✓' : '⚠'} ${sku} — title: "${meta.ogTitle}" | image: ${meta.ogImage || 'MISSING'}`,
        );
        if (titleOk && imageOk) ok += 1;
        else failed += 1;
      } catch (err) {
        failed += 1;
        console.error(`✗ ${sku} — prerender ব্যর্থ:`, err.message);
      }
    }

    // ============================================================
    // STATIC MARKETING ROUTES — Google PageSpeed Insights রিপোর্টে /wholesale-এর LCP
    // 8.8s/FCP 4.7s-এর মূল কারণ ছিল এটাই: এই রুটগুলো কখনো prerender হতো না, তাই সার্ভার
    // একটা খালি <div id="root">-সহ index.html পাঠাতো, ব্রাউজারকে JS ডাউনলোড+এক্সিকিউট+
    // React মাউন্ট হওয়া পর্যন্ত অপেক্ষা করতে হতো hero কনটেন্ট পেইন্ট হওয়ার আগে। এখন
    // প্রোডাক্ট পেজের মতোই এগুলোও পুরোপুরি রেন্ডার হওয়া HTML হিসেবে সার্ভ হবে।
    console.log(`[prerender] ${STATIC_ROUTES.length}টা স্ট্যাটিক মার্কেটিং রুট prerender করা হবে...`);
    for (const { route, outFile } of STATIC_ROUTES) {
      try {
        const { html, meta } = await prerenderRoute(browser, baseUrl, route, debug);
        const outPath = path.join(DIST_DIR, outFile);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, html, 'utf8');

        // নোট: title !== DEFAULT_TITLE চেক এখানে করা হয় না — Home ('/') পেজের নিজস্ব
        // সঠিক title-ই ঘটনাক্রমে index.html-এর generic default title-এর সাথে হুবহু
        // মেলে (দুটোই ইচ্ছাকৃতভাবে একই), তাই ওই চেক '/' রুটের জন্য false failure দিত।
        // React আসলেই মাউন্ট হয়ে কনটেন্ট রেন্ডার করেছে কিনা সেটাই এখানে আসল প্রশ্ন।
        const contentOk = Boolean(meta.title) && meta.rootChildren > 0;
        console.log(`${contentOk ? '✓' : '⚠'} ${route} — title: "${meta.title}" | root children: ${meta.rootChildren}`);
        if (contentOk) ok += 1;
        else failed += 1;
      } catch (err) {
        failed += 1;
        console.error(`✗ ${route} — prerender ব্যর্থ:`, err.message);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  const totalRoutes = routes.length + STATIC_ROUTES.length;
  console.log(`[prerender] সম্পন্ন — ${ok} সফল, ${failed} সমস্যাযুক্ত (মোট ${totalRoutes})।`);
  // একটাও রুট ব্যর্থ হলে বিল্ড আটকে দেওয়া হচ্ছে, যাতে ভাঙা/অসম্পূর্ণ prerender-সহ কোনো
  // পেজ চুপচাপ ডিপ্লয় হয়ে না যায়।
  if (failed > 0) {
    throw new Error(`${failed}টা পেজ সঠিকভাবে prerender হয়নি — বিল্ড ব্যর্থ ধরা হচ্ছে।`);
  }
}

main().catch((err) => {
  console.error('[prerender] ব্যর্থ:', err);
  process.exit(1);
});
