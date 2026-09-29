// এই খালি config ফাইলটা ইচ্ছাকৃতভাবে রাখা — astro-site/ প্যারেন্ট Vite প্রজেক্টের
// (Jutoria_v5/) ভেতরেই একটা সাবফোল্ডার হওয়ায়, postcss-load-config নিজে থেকে উপরের
// দিকে হাঁটতে গিয়ে প্যারেন্টের postcss.config.js (Tailwind v3-এর ক্লাসিক PostCSS
// প্লাগিন প্যাটার্ন) তুলে নিচ্ছিল, যেটা এই প্রজেক্টের Tailwind v4 (@tailwindcss/vite
// প্লাগিন-ভিত্তিক, কোনো PostCSS প্লাগিন দরকার নেই) সেটআপের সাথে সাংঘর্ষিক। এই খালি
// ফাইলটা এখানে থাকা মানেই postcss-load-config আর উপরে হাঁটবে না — প্যারেন্টের config
// আর পিক হবে না।
export default {
  plugins: {},
}
