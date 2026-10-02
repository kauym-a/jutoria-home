// ============================================================
// Admin Panel-এ প্রোডাক্ট বা ক্যাটাগরি সেভ/ডিলিট হলেই GitHub Actions-এ সাইট রিবিল্ড ট্রিগার করে।
//
// কেন দরকার: নতুন (Astro) সাইটে পাবলিক পেজগুলো বিল্ড-টাইমে Firestore থেকে ডেটা নিয়ে static HTML
// হয় — তাই Admin-এর কোনো পরিবর্তন লাইভ সাইটে দেখাতে একটা রিবিল্ড+ডিপ্লয় লাগে। এই ফাংশন
// GitHub-এর repository_dispatch API কল করে (.github/workflows/deploy.yml-এর
// `repository_dispatch: types: [content-updated]` ট্রিগার), ফলে ~১-২ মিনিটে পরিবর্তন লাইভ হয়।
// পরপর অনেকগুলো সেভ হলে workflow-এর `concurrency` নিজেই সেগুলোকে একটা রিবিল্ডে মিলিয়ে নেয়।
//
// 'leads' কালেকশন (ইনকোয়ারি ফর্ম) ইচ্ছাকৃতভাবে নেই — ওগুলো পাবলিক পেজে দেখায় না।
//
// সেটআপ (একবার): রিপোর CLAUDE.md-এর "Auto-rebuild Cloud Function" অংশ দেখুন — Firebase Blaze
// প্ল্যান, GITHUB_DEPLOY_TOKEN সিক্রেট, তারপর `firebase deploy --only functions`।
// ============================================================

import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { defineSecret } from 'firebase-functions/params';
import { logger } from 'firebase-functions';

const GITHUB_DEPLOY_TOKEN = defineSecret('GITHUB_DEPLOY_TOKEN');
const REPO = 'kauym-a/jutoria-home';

// Firestore ট্রিগার ফাংশন ডেটাবেসের লোকেশনেই চলতে হয়। ডিপ্লয়ের সময় লোকেশন না মিললে Firebase
// CLI স্পষ্ট এরর দিয়ে জানিয়ে দেবে — তখন এখানে Firebase Console → Firestore-এ দেখানো লোকেশন
// (যেমন 'asia-south1') বসিয়ে আবার ডিপ্লয় করুন।
const REGION = 'us-central1';

async function triggerRebuild(reason) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/dispatches`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${GITHUB_DEPLOY_TOKEN.value()}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'jutoria-auto-rebuild',
    },
    body: JSON.stringify({ event_type: 'content-updated', client_payload: { reason } }),
  });
  if (!res.ok) {
    // throw করলে Cloud Functions লগে এরর হিসেবে দেখায়; শিডিউলড রিবিল্ড (কয়েক ঘণ্টা পর পর) সেফটি নেট
    // হিসেবে থাকায় একটা ব্যর্থ ট্রিগারে পরিবর্তন হারিয়ে যায় না, শুধু দেরিতে লাইভ হয়।
    throw new Error(`GitHub dispatch failed: ${res.status} ${await res.text()}`);
  }
  logger.info('Site rebuild triggered', { reason });
}

const options = (document) => ({ document, region: REGION, secrets: [GITHUB_DEPLOY_TOKEN] });

export const rebuildOnProductChange = onDocumentWritten(options('products/{sku}'), (event) =>
  triggerRebuild(`product ${event.params.sku}`),
);

export const rebuildOnCategoryChange = onDocumentWritten(options('categories/{slug}'), (event) =>
  triggerRebuild(`category ${event.params.slug}`),
);
