# 🤝 Contributing to JanSunaai

First off — thank you for your interest in making civic tech more accessible! JanSunaai is a community-driven project and we welcome contributions of all kinds.

---

## 👥 Team INTELLI

Core maintainers:

| Name | GitHub | Role |
|------|--------|------|
| **Anurag Singh** | [@anuragsingh](https://github.com/) | AI & Prompt Engineering |
| **Anvith** | [@anvith](https://github.com/) | Frontend & UI/UX |
| **Harshith Reddy** | [@harshithreddy](https://github.com/) | Backend & PDF Generation |
| **Abhilash Yadav** | [@abhilashyadav](https://github.com/) | Full Stack Development |
| **Lukesh Reddy** | [@lukeshreddy](https://github.com/) | Research & Testing |

---

## 🧭 Ways to Contribute

### 🐛 Report Bugs
Found something broken? Open an issue with:
- A clear title and description
- Steps to reproduce the bug
- Expected vs actual behavior
- Screenshots if relevant

### 💡 Suggest Features
Have an idea to improve JanSunaai? We'd love to hear it. Open a **Feature Request** issue with:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you considered

### 🌐 Add Language Support
JanSunaai currently supports **English** and **Telugu**. You can help us add more Indian languages:
- Hindi, Kannada, Tamil, Marathi, Bengali, etc.
- Translate the UI strings in `locales/`
- Test the AI prompts in your language and suggest improvements

### ⚖️ Improve Legal Accuracy
If you're familiar with Indian RTI law, government procedures, or civic complaint processes:
- Review and improve our prompt templates in `prompts/`
- Add support for new government authorities and departments
- Correct PIO addresses, legal section references, or procedural steps

### 🎨 UI/UX Improvements
Help make JanSunaai more accessible and beautiful:
- Improve mobile responsiveness
- Accessibility improvements (WCAG compliance)
- Better form UX for low-literacy users

### 🧪 Testing
- Write unit tests for utility functions
- Test AI output quality across different complaint types
- Report edge cases in complaint parsing or letter generation

---

## 🛠️ Development Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/jansunaai.git
cd jansunaai

# 3. Create a feature branch
git checkout -b feature/your-feature-name

# 4. Set up environment
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

# 5. Install dependencies
npm install

# 6. Start development server
npm run dev
```

---

## 📬 Submitting a Pull Request

1. **Fork** the repository and create a branch from `main`
2. **Make your changes** with clear, focused commits
3. **Test** your changes thoroughly
4. **Update docs** if your change affects usage or setup
5. **Open a PR** with:
   - A clear title (e.g., `feat: add Hindi language support`)
   - Description of what you changed and why
   - Link to the related issue (if any)
   - Screenshots for UI changes

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add support for HMWSSB water complaints
fix: correct RTI Section 6 language in prompt
docs: update README with new authority list
style: improve mobile layout for complaint form
refactor: extract PDF generation into utility module
test: add edge case for empty complaint input
```

---

## 🔍 Code Review Process

- All PRs require review from at least **one core team member**
- Be respectful and constructive in review comments
- We aim to review PRs within **3–5 business days**
- For large features, open a discussion issue first to align on approach

---

## 🚫 What We Don't Accept

- PRs that add paid/proprietary dependencies without discussion
- Changes that compromise user privacy or data security
- Content that promotes misinformation or misuse of RTI law
- Disrespectful or exclusionary behavior (see our Code of Conduct)

---

## 📋 Code of Conduct

We are committed to a welcoming and inclusive community. All contributors are expected to:

- Be respectful and kind in all interactions
- Welcome diverse perspectives and experiences
- Focus on what is best for the community and users
- Show empathy toward other contributors

Harassment, discrimination, or abusive behavior of any kind will not be tolerated.

---

## 🙏 Recognition

All contributors will be acknowledged in our [README.md](./README.md). Significant contributors may be invited to join the core team.

---

## 💬 Get in Touch

Have questions before contributing? Open a GitHub Discussion or reach out to the team:

- Open an [Issue](https://github.com/team-intelli/jansunaai/issues)
- Start a [Discussion](https://github.com/team-intelli/jansunaai/discussions)

---

*Together, let's make civic access a right — not a privilege.*

**— Team INTELLI** 🧠
