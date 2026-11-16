# 🔥 Orvex Research - Free Fire 100% Real Live Player Info API

Garena Free Fire (OB55) এর আসল লাইভ প্লেয়ার প্রোফাইল ডাটা (IGN, Level, Likes, Guild, Rank, Credit Score, Outfits, Skills) ফেচ করার ওপেন সোর্স REST API এবং GitHub Pages চেকার।

**GitHub Repository:** `https://github.com/Orvex-Research/api.info.freefire`  
**GitHub Pages URL:** `https://orvex-research.github.io/api.info.freefire/`

---

## 📁 ফোল্ডারের ফাইল তালিকা (Project Structure)

```text
github/
├── index.html            # GitHub Pages ওয়েব চেকার (https://orvex-research.github.io/api.info.freefire/)
├── server.js             # আপনার নিজের লোকাল / VPS Node.js সার্ভার (Zero Dependencies)
├── direct_api.py         # ডিরেক্ট পাইথন স্ক্রিপ্ট
├── worker.js             # Cloudflare Worker সার্ভারলেস স্ক্রিপ্ট
├── api/
│   ├── player.js         # API এন্ডপয়েন্ট (/api/player?uid=...)
│   └── account-info.js   # অল্টারনেটিভ এন্ডপয়েন্ট (/api/account-info?uid=...)
├── package.json          # নোড প্যাকেজ কনফিগ
└── README.md             # পূর্ণাঙ্গ গাইড
```

---

## 🚀 ১. এই রিপোজিটরিতে সরাসরি পুশ করার CMD কমান্ড

আপনার CMD বা টার্মিনালে নিচের কমান্ডটি রান করুন:

```bash
cd "f:\my progect with Ai\free fire custome api\github"
git push -u origin main
```

*(যদি গিটহাব পাসওয়ার্ড চায়, আপনার GitHub Personal Access Token ব্যবহার করুন)*

---

## 🌐 ২. GitHub Pages অন করার ধাপ

১. আপনার রিপোজিটরিতে যান: [https://github.com/Orvex-Research/api.info.freefire/settings/pages](https://github.com/Orvex-Research/api.info.freefire/settings/pages)  
২. **Build and deployment** সেকশনে:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` সিলেক্ট করুন এবং ফোল্ডার `/ (root)` রেখে **Save** দিন।  
৩. সাথে সাথে লাইভ হয়ে যাবে আপনার GitHub Pages:  
   👉 `https://orvex-research.github.io/api.info.freefire/`

---

## 💡 ৩. GitHub Pages দিয়ে কীভাবে API কাজ করবে? (Vercel ও Render ছাড়া)

GitHub Pages সরাসরি ব্রাউজারে সুন্দর UI এবং ডাটা লোড করে।  
আপনার কোনো থার্ড পার্টি সাইট (যেমন Vercel বা Render) লাগবে না। আপনি নিচের ২টি সহজ উপায়ে API চালাতে পারবেন:

### পদ্ধতি A: আপনার নিজস্ব লোকাল / VPS সার্ভার চালানো (সবচেয়ে ফাস্ট ও নিরাপদ)
আপনার কম্পিউটারে বা কোনো ভিপিএসে শুধু চালান:
```bash
node server.js
```
এবার যেকোনো অ্যাপ বা সফটওয়্যার থেকে কল করুন:
```http
GET http://localhost:3000/api/player?uid=949587293
```

### পদ্ধতি B: Cloudflare Workers (১০০% ফ্রি ক্লাউড API)
Vercel বা Render এর বদলে ক্লাউডফ্লেয়ার সম্পূর্ণ ফ্রি:
- [workers.cloudflare.com](https://workers.cloudflare.com)-এ যান।
- `worker.js` এর কোড পেস্ট করে **Save and Deploy** দিন।
- ইনস্ট্যান্ট পার্মানেন্ট API পেয়ে যাবেন:
  `https://freefire-api.<your-name>.workers.dev/?uid=949587293`

---

## 💻 ৪. লোকাল কম্পিউটারে রান করার নিয়ম

### Node.js সার্ভার:
```bash
node server.js
```
ব্রাউজারে বা অ্যাপে হিট করুন:
`http://localhost:3000/api/player?uid=949587293`

### Python স্ক্রিপ্ট:
```bash
python direct_api.py 949587293
```

---

## 📱 ৫. Flutter / Dart ইন্টিগ্রেশন কোড

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<void> fetchPlayer(String uid) async {
  // লোকাল সার্ভার অথবা আপনার Vercel লাইভ API লিংক বসান
  final url = Uri.parse('http://localhost:3000/api/player?uid=$uid');
  final response = await http.get(url);

  if (response.statusCode == 200) {
    final data = jsonDecode(response.body);
    print("Player Name : ${data['name']}");
    print("Level       : ${data['level']}");
    print("Likes       : ${data['likes']}");
    print("Guild Name  : ${data['guild_name']}");
  }
}
```
