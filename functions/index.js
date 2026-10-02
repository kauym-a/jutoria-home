// ============================================================
// Admin Panel-এ প্রোডাক্ট বা ক্যাটাগরি সেভ/ডিলিট হলেই GitHub Actions-এ সাইট রিবিল্ড ট্রিগার করে।
//
// কেন দরকার: পাবলিক পেজগুলো (astro-site) বিল্ড-টাইমে Firestore থেকে ডেটা নিয়ে static HTML হয় —
// তাই Admin-এর কোনো পরিবর্তন লাইভ সাইটে দেখাতে একটা রিবিল্ড+ডিপ্লয় লাগে। এই ফাংশন GitHub-এর
// repository_dispatch API কল করে (.github/workflows/deploy.yml-এর
// `repository_dispatch: types: [content-updated]` ট্রিগার), ফলে ~১-২ মিনিটে পরিবর্তন লাইভ হয়।
// পরপর অনেকগুলো সেভ হলে workflow-এর `concurrency` নিজেই সেগুলোকে একটা রিবিল্ডে মিলিয়ে নেয়।
//
// 'leads' কালেকশন (ইনকোয়ারি ফর্ম) ইচ্ছাকৃতভাবে নেই — ওগুলো পাবলিক পেজে দেখায় না।
// সেটআপ: রিপোর CLAUDE.md-এর "Auto-rebuild Cloud Function" অংশ দেখুন।
// ============================================================

const { setGlobalOptions } = require("firebase-functions");
const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const axios = require("axios");

const GITHUB_DEPLOY_TOKEN = defineSecret("GITHUB_DEPLOY_TOKEN");
const REPO = "kauym-a/jutoria-home";

// Firestore ডেটাবেস 'nam5' (US multi-region)-এ — Firestore ট্রিগারের জন্য us-central1 সঠিক।
setGlobalOptions({ region: "us-central1", maxInstances: 10 });

async function triggerRebuild(reason) {
  try {
    await axios.post(
      `https://api.github.com/repos/${REPO}/dispatches`,
      { event_type: "content-updated", client_payload: { reason } },
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${GITHUB_DEPLOY_TOKEN.value()}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "jutoria-auto-rebuild",
        },
        timeout: 15000,
      },
    );
    logger.info("Site rebuild triggered", { reason });
  } catch (err) {
    // টোকেন মেয়াদোত্তীর্ণ/ভুল হলে এখানে 401/403 আসবে — লগে দেখা যাবে। শিডিউলড রিবিল্ড
    // (কয়েক ঘণ্টা পর পর) সেফটি নেট হিসেবে থাকায় পরিবর্তন হারিয়ে যায় না, শুধু দেরিতে লাইভ হয়।
    logger.error("GitHub dispatch failed", {
      reason,
      status: err.response?.status,
      body: err.response?.data,
      message: err.message,
    });
    throw err;
  }
}

const options = (document) => ({ document, secrets: [GITHUB_DEPLOY_TOKEN] });

exports.rebuildOnProductChange = onDocumentWritten(options("products/{sku}"), (event) =>
  triggerRebuild(`product ${event.params.sku}`),
);

exports.rebuildOnCategoryChange = onDocumentWritten(options("categories/{slug}"), (event) =>
  triggerRebuild(`category ${event.params.slug}`),
);
