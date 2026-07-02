# C213 Accounting for Decision Makers — Quiz Hub

A self-study quiz site for **C213 Accounting for Decision Makers** (MBA program). Built section by section as the course progresses, with interactive multiple choice, select-all, and drag-and-drop questions.

**Live site:** `https://yourusername.github.io/your-repo-name/`

---

## What's here

| File | Purpose |
|---|---|
| `index.html` | Home page — lists every section as a clickable card |
| `quiz.css` | Shared styling used by every quiz page (dark theme, cards, buttons, drag & drop) |
| `quiz.js` | Shared quiz engine — shuffling, scoring, question rendering, results screen |
| `section2_quiz.html` | Section 2: The Nature & Purpose of Accounting (29 questions) |
| `section3_quiz.html` | Section 3: Overview of Financial Statements (92 questions) |

Each new section gets its own `sectionX_quiz.html` file, and reuses `quiz.css` and `quiz.js` rather than duplicating code.

---

## Question types

- **Multiple Choice** — pick one correct answer out of four
- **Select All That Apply** — pick every correct answer from a list, then submit
- **Drag & Drop Matching** — drag items from a bank into the correct labeled column

Every question includes an explanation and a memory tip (mnemonic, acronym, or analogy) to help the answer stick.

---

## How each quiz works

- Question order shuffles every time you load or retake a quiz
- Answer option order also shuffles, so you can't memorize "the answer is always B"
- Score, correct count, and wrong count update live as you go
- Wrong answers show the correct answer plus an explanation immediately
- A results screen shows your final score with a grade message
- Works on mobile — drag & drop supports touch as well as mouse

---

## Adding a new section

1. Share your notes for the section
2. A new `sectionX_quiz.html` file gets built that links to the existing `quiz.css` and `quiz.js`
3. `index.html` gets updated with a new card linking to that section
4. Upload the new/updated files to this repo — GitHub Pages updates automatically within a minute or two

---

## Studying on mobile

Bookmark the live site URL, or use **Share → Add to Home Screen** in Safari on iPhone so it behaves like an app icon on your home screen.
