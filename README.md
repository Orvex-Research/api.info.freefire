# 🔥 Free Fire 100% Real Live Player Info API & GitHub Page

Garena Free Fire (OB55) এর আসল লাইভ প্লেয়ার প্রোফাইল ডাটা (IGN, Level, Likes, Guild, Rank, Credit Score, Outfits, Skills) ফেচ করার ওপেন সোর্স REST API এবং ওয়েব চেকার।

---

## 📁 ফোল্ডারের ফাইল তালিকা (Project Structure)

```text
github/
├── index.html            # GitHub Pages এ হোস্টিং করার জন্য রেডি ওয়েব ইন্টারফেস
├── api/
│   ├── player.js         # Vercel Serverless REST API (/api/player?uid=...)
│   └── account-info.js   # অল্টারনেটিভ এন্ডপয়েন্ট (/api/account-info?uid=...)
├── worker.js             # Cloudflare Worker স্ক্রিপ্ট (ফ্রি এজ রানটাইম)
├── server.js             # লোকাল Node.js স্ট্যান্ডঅ্যালোন সার্ভার (Zero Dependencies)
├── direct_api.py         # সরাসরি পাইথন স্ক্রিপ্ট
├── vercel.json           # Vercel ডেপ্লয় ও CORS কনফিগারেশন
├── package.json          # নোড প্যাকেজ কনফিগ
└── README.md             # পূর্ণাঙ্গ গাইড
```

---

## 🚀 ১. গিটহাবে পুশ করার নিয়ম (How to Push to GitHub)

আপনার টার্মিনাল বা CMD ওপেন করে `github` ফোল্ডারে প্রবেশ করুন:

```bash
cd "f:\my progect with Ai\free fire custome api\github"
git init
git add .
git commit -m "Free Fire Live API initial commit"
git branch -M main
git remote add origin https://github.com/আপনার-ইউজারনেম/আপনার-রেপো-নাম.git
git push -u origin main
```

---

## 🌐 ২. GitHub Pages চালু করার নিয়ম (Enable GitHub Pages)

১. আপনার GitHub রিপোজিটরির **Settings** ট্যাবে যান।  
২. বাম পাশের মেনু থেকে **Pages** সিলেক্ট করুন।  
৩. **Build and deployment** সেকশনে:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` এবং ফোল্ডার `/ (root)` সিলেক্ট করে **Save** বাটনে ক্লিক করুন।  
৪. ১-২ মিনিটের মধ্যে আপনার ফ্রি সাইট লাইভ হয়ে যাবে:  
   `https://<your-username>.github.io/<your-repo-name>/`

---

## ⚡ ৩. ২৪/৭ লাইভ পাবলিক API বানানোর নিয়ম (100% Free Vercel API)

> **মনে রাখবেন:** GitHub Pages শুধুমাত্র স্ট্যাটিক ফাইল (HTML/JS) হোস্ট করে। কোনো ব্যাকএন্ড সার্ভার ছাড়া অ্যাপ্লিকেশনের জন্য ২৪/৭ ফ্রি পাবলিক REST API লিংক পেতে:

১. [Vercel.com](https://vercel.com)-এ ফ্রি একাউন্ট খুলুন (Login with GitHub)।  
২. **Add New Project** এ গিয়ে আপনার গিটহাবের এই রিপোজিটরিটি ইমপোর্ট করুন।  
৩. কোনো সেটিং পরিবর্তন না করে সরাসরি **Deploy** বাটনে ক্লিক করুন।  
৪. সাথে সাথে আপনি পেয়ে যাবেন একটি পার্মানেন্ট গ্লোবাল লাইভ API URL:
   ```http
   GET https://your-project.vercel.app/api/player?uid=949587293
   ```
   *(এটিতে অলরেডি CORS এনাবল করা আছে, যা Flutter, Android বা যেকোনো অ্যাপ থেকে সরাসরি কাজ করবে)*

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
