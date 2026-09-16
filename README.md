# WGU MBA Study Hub

Self-study quiz and notes site for my WGU MBA courses. Built section by section as each course
progresses, with interactive multiple choice, select-all, drag-and-drop, true/false, and ordering
questions.

**Live site:** https://tiflynn.github.io/wgu/

| Course | Status |
|---|---|
| **C213** Accounting for Decision Makers | 11 sections, 2 practice exams, 2 formula sheets |
| **C214** Financial Management | Topic 1 — more added as the course progresses |

---

## Repo layout

One directory per course. Everything shared — the stylesheets and the quiz engine — lives at the
root and is used by every course, so a fix lands once.

```
.
├── index.html              Landing page — one card per course
├── 404.html                Redirects pre-restructure /quizzes/* and /notes/* links into c213/
├── assets/
│   ├── css/quiz.css        Design tokens + shared styling for every page
│   ├── css/hub.css         Card grid and hub layout, shared by the landing page and course hubs
│   ├── css/notes.css       Notes-page styling
│   └── js/quiz.js          Shared quiz engine — shuffling, scoring, rendering, results screen
├── c213/
│   ├── index.html          Course hub — lists every section as a clickable card
│   ├── quizzes/
│   │   ├── section02.html …    One quiz per course section
│   │   └── practice-exam.html, practice-exam-2.html
│   └── notes/
│       ├── section02.html …    Study notes per section
│       ├── formulas-provided.html   Formulas available during testing
│       └── formulas-memorize.html   Formulas to memorize
├── c214/                   Same shape — Topic 1 built, more to come
└── docs/PROMPT.md          Reusable prompt for generating a new section quiz
```

`index.html` stays at the root because that is the GitHub Pages entry point. Section files are
zero-padded (`section02`, not `section2`) so they sort correctly.

Quiz and notes pages sit two levels deep, so they reach the shared files with `../../assets/...`.
Their `← All Sections` back link and their cross-links to notes stay at `../` — one level up is the
course hub, which is where they should go. Course hub cards link with plain `quizzes/sectionNN.html`
relative paths; the hub's question-count script keys off that `quizzes/` prefix.

### C213 sections

| Section | Topic |
|---|---|
| 2 | The Nature & Purpose of Accounting |
| 3 | Overview of Financial Statements |
| 4 | The Balance Sheet |
| 5 | The Income Statement |
| 6 | The Statement of Cash Flows |
| 7 | Introduction to Financial Statement Analysis |
| 8 | Cash Budgeting |
| 9 | Internal Controls |
| 10 | Management Accounting & Cost Concepts |
| 11 | Activity-Based Costing (ABC) |
| 12 | Cost Behavior & C-V-P Analysis |

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
2. A new `<course>/quizzes/sectionNN.html` file gets built that links to `../../assets/css/quiz.css`
   and `../../assets/js/quiz.js`
3. Notes go in `<course>/notes/sectionNN.html`
4. `<course>/index.html` gets a new card linking to `quizzes/sectionNN.html` — the question count on
   the card is counted from the quiz file at page load, so there is no number to keep in sync
5. Push to this repo — GitHub Pages updates automatically within a minute or two

## Adding a new course

1. `mkdir -p cNNN/quizzes cNNN/notes`
2. Copy any course's `index.html` as the starting hub. Update the `<title>` and `<h1>`, and keep the
   `← All Courses` back link and both `../assets/` stylesheet links. Until the first quiz exists,
   swap the card grid for a single `<article class="hub-card hub-empty">` placeholder — `hub.css`
   styles it as a dashed, non-clickable empty state
3. Add a card for the course to the root `index.html`, pointing at `cNNN/index.html`
4. Add sections using the steps above

## Studying on mobile

Bookmark the live site URL, or use **Share → Add to Home Screen** in Safari on iPhone so it behaves like an app icon on your home screen.
