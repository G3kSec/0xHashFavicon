# 0xHashFavicon
> **Advanced Favicon Fingerprinting for Infrastructure Mapping & Asset Discovery.**

![Next.js](https://img.shields.io/badge/Next.js-000-white?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000?style=flat-square&logo=shadcnui)
![License](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)

**0xHashFavicon** is a minimalist OSINT tool designed to convert website favicons into Shodan/Fofa compatible MurmurHash3 signatures. In the world of Bug Bounty, this allows you to pivot from a single visual identity to a full list of an organization's exposed infrastructure.

---

## 🚀 Features

* **URL-to-Hash:** Extract and hash favicons directly from a target domain.
* **File Upload:** Upload local `.ico` or image files to generate signatures.
* **Shodan & Fofa Integration:** One-click pivots to search the generated hash across global infrastructure.
* **Local History:** Keep track of your last 10 scans (saved in `localStorage`).
* **Precise Hashing:** Implements Shodan's specific logic (Base64 encoding with 76-character line breaks).
* **Minimalist UI:** Built with Poppins font and a dark "hacker-centric" aesthetic.

---

## 🛠️ Tech Stack

| Tool | Purpose |
| :--- | :--- |
| **Next.js 15** | React Framework (App Router) |
| **Tailwind CSS v4** | Styling & Theme Engine |
| **shadcn/ui** | Accessible UI Components |
| **MurmurHash3.js** | Non-cryptographic hashing algorithm |
| **Axios/Cheerio** | Favicon scraping & metadata extraction |

---

## 📖 Methodology

To ensure hashes match **Shodan's** database, this tool follows the specific Python `base64.encodebytes()` logic:
1. Fetch/Load the favicon image.
2. Encode binary data to **Base64**.
3. Insert a **newline (\n) every 76 characters** (MIME standard).
4. Apply **MurmurHash3 (x86 32-bit)** to the resulting string.

---

## ⚙️ Installation

1. **Clone the repo:**
   ```bash
   git clone https://github.com/g3ksec/0xhashfavicon.git
   cd 0xhashfavicon
   ```

2. **Install dependencies:**
   ```bash
   npm install murmurhash3js cheerio axios
   ```

3. **Run in development mode:**
   ```bash
   npm run dev
   ```

---

## 🛡️ Usage for Bug Bounty

1. Find a target's favicon (e.g., `https://target.com/favicon.ico`).
2. Paste the URL or upload the file to **0xHashFavicon**.
3. Click the **Shodan** button to find:
   * Dev/Staging servers.
   * Hidden admin panels.
   * Forgotten cloud buckets.
   * Phishing sites impersonating the target.

---

## 👤 Author

Developed by **Luciano Griffa (Aka. G3kSec)**.
* Security Researcher / Bug Bounty Hunter.

---

## ⚖️ License

This project is licensed under the MIT License.
