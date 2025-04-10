```markdown
# 🕵️‍♂️ TruthCheck – Combating Misinformation in Nigeria

TruthCheck is an intelligent claim verification system designed to fight misinformation across Nigeria. It allows users to verify the authenticity of claims submitted as text, article links, or images, and returns clear explanations in five local languages.

## 📦 Features (MVP)
- ✅ Accepts claims via **text**, **article link**, or **image**
- 🔎 Searches known databases and RSS feeds for verified claims
- 🤖 Falls back to **AI/NLP-based verification** if no known match is found
- 🗣️ Translates the result into **English, Yoruba, Hausa, Igbo, and Nigerian Pidgin**
- 📰 Article scraping for claims submitted via URL
- 🧠 Uses NLI (Natural Language Inference) to compare claims with found articles

---

## 🚀 API Endpoints

Base URL: `/api/v1`

### 1. Verify Text Claim
```http
POST /api/v1/claims/text
```
**Body:**
```json
{
  "claim_text": "The Nigerian government banned all social media platforms."
}
```

---

### 2. Verify Claim from Article Link
```http
POST /api/v1/claims/link
```
**Body:**
```json
{
  "url": "https://example.com/news/suspension-announcement"
}
```

---

### 3. Verify Claim from Image
```http
POST /api/v1/claims/image
```
**Form Data:**
- `image`: Image file (e.g. screenshot of a social media post)

---

## 📁 Folder Structure (TypeScript – Express)
```
src/
├── controllers/
│   └── verification.controller.ts
├── services/
│   └── verification.service.ts
├── utils/
│   ├── scraper.ts
│   ├── ocr.ts
│   └── nli.ts
├── routes/
│   └── claims.route.ts
├── middlewares/
├── config/
├── app.ts
└── server.ts
```

---

## 🧰 Tech Stack
- **Node.js + Express**
- **TypeScript**
- **Gemini / Bing Search APIs**
- **RSS Feed Parsers**
- **OCR (e.g. Tesseract.js for image text extraction)**
- **Translation API (e.g. Google Translate / Gemini)**
- **MongoDB / PostgreSQL** for storage

---

## 🛠️ Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/your-username/truthcheck.git

# 2. Install dependencies
cd truthcheck
npm install

# 3. Setup .env

# 4. Run the server
npm run dev
```

---



## 👥 Contributors
- **Okenwa Uchechukwu** – Backend Lead  
- *(Add others as necessary)*

