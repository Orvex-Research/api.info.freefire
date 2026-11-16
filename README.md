# 🔥 Orvex Research - Free Fire Live Player API (Pure JS)

100% Real Live Free Fire Player Info API written entirely in **Pure JavaScript (Node.js)**.  
**Zero HTML | Zero Dependencies | Zero Dummy Data**

Repository: `https://github.com/Orvex-Research/api.info.freefire`

---

## 📁 প্রজেক্টের ফাইল স্ট্রাকচার (100% Pure JavaScript)

```text
github/
├── index.js              # মূল জাভাস্ক্রিপ্ট ইঞ্জিন ও CLI টুল (CLI: node index.js <UID>)
├── server.js             # পিওর Node.js REST API সার্ভার (node server.js)
├── worker.js             # ক্লাউড এজ সার্ভারলেস স্ক্রিপ্ট (Cloudflare Worker)
├── api/
│   ├── player.js         # সার্ভারলেস ফাংশন
│   └── account-info.js   # অল্টারনেটিভ রাউট
└── package.json          # নোড কনফিগারেশন
```

---

## ⚡ ১. টার্মিনাল / CMD-তে সরাসরি রান করার কমান্ড

কোনো সার্ভার ছাড়া সরাসরি যেকোনো প্লেয়ারের লাইভ ডাটা আনতে:

```bash
node index.js 949587293
```
*(অথবা অন্য কোনো প্লেয়ার: `node index.js 2651407194`)*

---

## 🌐 ২. পিওর JS লোকাল REST API সার্ভার চালানো

সার্ভার চালু করতে:

```bash
node server.js
```
*(সার্ভারটি পোর্ট `3000`-এ চালু হবে)*

এবার যেকোনো ব্রাউজার, পোস্টম্যান বা মোবাইল অ্যাপ থেকে কল করুন:
```http
GET http://localhost:3000/api/player?uid=949587293
```

---

## 📦 ৩. অন্য কোনো Node.js প্রজেক্টে মডিউল হিসেবে ব্যবহার

```javascript
const { getPlayerInfo } = require('./index');

async function run() {
  const player = await getPlayerInfo('949587293');
  console.log("Player Name :", player.name);
  console.log("Level       :", player.level);
  console.log("Likes       :", player.likes);
  console.log("Guild       :", player.guild_name);
}

run();
```

---

## 🚀 ৪. গিটহাবে পুশ করার CMD কমান্ড

```bash
cd "f:\my progect with Ai\free fire custome api\github"
git add .
git commit -m "Pure JavaScript API - HTML removed"
git push -u origin main
```
