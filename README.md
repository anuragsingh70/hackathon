# HACKATHON PROJECT 

# 🏛️ JanSunaai — AI Civic Complaint Assistant

> *"Your voice, legally heard."*
---

## 📌 What is JanSunaai?

**JanSunaai** (meaning *"Public Hearing"* in Hindi/Telugu) is an AI-powered civic complaint assistant that empowers citizens to fight bureaucratic inaction — without needing a lawyer.

You describe your problem in plain language (in **English or Telugu**). JanSunaai instantly drafts a legally formatted **RTI application** or **government complaint letter** — complete with the correct authority, applicable legal sections, PIO address, and reply deadline — ready to **download as a PDF**.

No legal knowledge needed. No jargon. Just speak your problem.

---

## 🎯 The Problem

Every day, millions of Indian citizens face unresolved civic issues:

- Roads with potholes ignored for months
- Broken streetlights with no response from municipal bodies
- Water supply disruptions with no accountability
- Government offices that don't respond to informal complaints

Most citizens don't know **how to file an RTI**, **which authority to approach**, or **what legal language to use**. This gap in civic access is what JanSunaai bridges.

---

## 🚀 Demo Moment

> **User says:** *"My road has a pothole for 3 months and GHMC isn't responding."*

> **JanSunaai generates:** A formal RTI application to GHMC with Section 6 language, the correct PIO address, a 30-day reply deadline notice — ready to download as a PDF.

---

## ✨ Features

- 🗣️ **Plain Language Input** — Describe your problem naturally, in English or Telugu
- ⚖️ **Legal Drafting** — AI generates RTI / complaint letters with correct legal sections
- 🏢 **Smart Authority Routing** — Identifies the right government body (GHMC, HMWSSB, TSSPDCL, etc.)
- 📄 **PDF Export** — One-click download of the formatted letter
- 🌐 **Bilingual Support** — English and Telugu
- ⚡ **No Sign-up Required** — Works instantly in the browser
- 📶 **Offline Demo Ready** — No external data APIs needed

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML / CSS / JavaScript (or React) |
| AI Engine | Claude API (Anthropic) |
| PDF Generation | jsPDF / html2pdf |
| Language Support | Claude multilingual (Telugu + English) |
| Hosting | Vercel / Netlify |

> **Why no data APIs?** Claude does all the heavy lifting — no scraping, no government data access problems. Just a frontend + AI API call.

---

## 📂 Project Structure

```
jansunaai/
├── index.html          # Main app entry point
├── style.css           # Styling
├── app.js              # Core logic & Claude API integration
├── pdf.js              # PDF generation utilities
├── prompts/
│   └── rti_prompt.js   # RTI and complaint letter prompt templates
├── assets/
│   └── logo.png
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18+) — if using a build tool
- An [Anthropic API key](https://console.anthropic.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/team-intelli/jansunaai.git
cd jansunaai

# Install dependencies (if applicable)
npm install

# Add your API key
cp .env.example .env
# Edit .env and add: ANTHROPIC_API_KEY=your_key_here

# Start the dev server
npm run dev
```

### Or just open it directly

For a pure HTML/CSS/JS build, simply open `index.html` in your browser. Set your API key in `app.js`.

---

## 🧑‍💻 Team INTELLI

Built with ❤️ at the **CivicTech Hackathon** — Hyderabad, India

| Name | Role |
|------|------|
| **Anurag Singh** | AI Integration & Prompt Engineering |
| **Anvith** | Frontend Development & UI/UX |
| **Harshith Reddy** | Backend & PDF Generation |
| **lukesh reddy**| bug fixing
| ** abhilash yadav**| bug fixing 

---

## 📜 Legal Disclaimer

JanSunaai generates draft documents to assist citizens. The generated content is AI-assisted and should be reviewed before submission. This tool does not constitute legal advice. For complex legal matters, please consult a qualified legal professional.

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) to get involved.

---

## 📄 License

**open source free to use no lisecnce**
---

