# C213 Accounting for Decision Makers — Quiz Hub

A self-study quiz site for **C213 Accounting for Decision Makers** (MBA program). Built section by section as the course progresses, with interactive multiple choice, select-all, drag-and-drop, true/false, and ordering questions.

**Live site:** https://tiflynn.github.io/wgu/

---

## Repo layout

```
.
├── index.html              Home page — lists every section as a clickable card
├── assets/
│   ├── css/quiz.css        Shared styling for every page (light theme, cards, buttons, drag & drop)
│   └── js/quiz.js          Shared quiz engine — shuffling, scoring, rendering, results screen
├── quizzes/
│   ├── section02.html …    One quiz per course section
│   └── practice-exam.html  Comprehensive practice exam
├── notes/
│   ├── section02.html …    Study notes per section
│   ├── formulas-provided.html   Formulas available during testing
│   └── formulas-memorize.html   Formulas to memorize
└── docs/PROMPT.md          Reusable prompt for generating a new section quiz
```

`index.html` stays at the root because that is the GitHub Pages entry point. Section files are
zero-padded (`section02`, not `section2`) so they sort correctly.

| Section | Topic |
|---|---|
| 2 | The Nature & Purpose of Accounting |
| 3 | Overview of Financial Statements |
| 4 | Individual Accounts & Transaction Analysis |
| 5 | The Income Statement |
| 6 | The Statement of Cash Flows |
| 7 | Introduction to Financial Statement Analysis |
| 8 | Cash Budgeting |
| 9 | Internal Controls |
| 10 | Management Accounting & Cost Concepts |
| 11 | Activity-Based Costing (ABC) |
| 12 | Cost Behavior & C-V-P Analysis |

Every quiz and notes page reuses `assets/css/quiz.css` and `assets/js/quiz.js` rather than
duplicating code, so pages reference them one level up (`../assets/...`).

---

## Question types

- **Multiple Choice** — pick one correct answer out of four
- **Select All That Apply** — pick every correct answer from a list, then submit
- **Drag & Drop Matching** — drag items from a bank into the correct labeled column
- **True/False** — decide whether a statement is true or false
- **Ordering** — drag items into the correct sequence

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

1. Share your notes for the section (see `docs/PROMPT.md` for the generation prompt)
2. A new `quizzes/sectionNN.html` file gets built that links to `../assets/css/quiz.css` and `../assets/js/quiz.js`
3. Notes go in `notes/sectionNN.html`
4. `index.html` gets a new card linking to `quizzes/sectionNN.html` — the question count on the card is
   counted from the quiz file at page load, so there is no number to keep in sync
5. Push to this repo — GitHub Pages updates automatically within a minute or two

---

## Studying on mobile

Bookmark the live site URL, or use **Share → Add to Home Screen** in Safari on iPhone so it behaves like an app icon on your home screen.
