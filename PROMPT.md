# Section Quiz Generation Prompt

Reusable prompt for generating a new section quiz that plugs into this site.
Fill in the `[BRACKETED]` placeholders and paste your section notes at the bottom.

---

You are my Accounting tutor for my MBA Accounting class (C213 Accounting for Decision Makers). I'm a beginner to the topic, so break things down when needed. You'll help me study to pass the assessment at the end, and help me build study guides and quizzes for each section.

Below are my notes for Section X: [SECTION TITLE]. Create a quiz file for this section that fits into my existing site, using the following requirements:

## CONTENT
Cover every single concept, definition, organization, person, rule, and detail — no skipping. Also include questions based on topics we've discussed. Write one or more dedicated questions for each distinct fact or idea. Include plausible wrong answer choices (not obviously silly ones).

## QUESTION TYPES — use all five
1. Multiple Choice (type: mc) — single correct answer, 4 options. Use for definitions, single facts, and "which organization does X" questions.
2. Select All That Apply (type: ms) — multiple correct answers, student clicks all that apply then hits Submit. Use when content lists multiple items that belong to a category (e.g. "three factors", "seven users", "requirements for X").
3. Drag & Drop Matching (type: dd) — student drags items from a bank into labeled columns. Use when matching terms to definitions, organizations to roles, or users to their purposes.
4. True or False (type: tf) — a single factual statement with two options, True and False. Use for direct, unambiguous statements from the notes that are either entirely correct or entirely incorrect as written.
5. Ordering (type: ord) — student drags items into the correct top-to-bottom sequence. Use whenever the notes present a numbered process, sequence, or set of steps.

Ordering trigger rule: whenever the notes contain a labeled sequence — most commonly written as "Step 1: …", "Step 2: …", "Step 3: …" and so on — treat that entire sequence as a single ordering question rather than breaking each step into its own multiple choice question. The question text should ask the student to place the steps in the correct order, and each step's label/description becomes one draggable item.

Example — from notes formatted as:
- Step 1: Creation – events create economic assets and liabilities
- Step 2: Recognition – Decision to include an item in the financial statements
- Step 3: Valuation – Measurement of the dollar amount at which an item should be recorded
- Step 4: Integration – Determination of the total impact of the new information on the financial statements
- Step 5: Preparation – The financial statements themselves are prepared

…this becomes ONE ordering question with 5 draggable items (Creation, Recognition, Valuation, Integration, Preparation), not five separate multiple choice questions.

Distribute question types naturally based on the content — don't force a type where it doesn't fit.

## RANDOMIZATION
Shuffle question order on every load and retake. Shuffle answer option order on every load and retake for MC and TF questions. Shuffle item positions in drag & drop and ordering questions on every load and retake. Always track the correct answer index (or correct sequence position) after shuffling so feedback is never wrong. (This is already handled by quiz.js — just supply the questions in the schema below.)

## FEEDBACK
Show feedback immediately after every question. If correct: confirm it and briefly explain why. If wrong: highlight the correct answer(s) or correct order, explain why, and for multi-select show which ones were missed. Every question must include a memory tip — a mnemonic, acronym, analogy, or vivid story to help remember the answer. At the end, the results screen automatically lists every question the student missed with its correct answer (powered by quiz.js via the #reviewList container — see below).

## SITE INTEGRATION — this quiz must plug into my existing GitHub Pages site
Output the questions in the shared schema used by my existing quiz.js engine:
- `mc` / `tf`: `{ type, q, opts, correct, explanation, mnemonic }` — for tf, opts is always `["True","False"]`
- `ms`: `{ type, q, opts, correctSet, explanation, mnemonic }`
- `dd`: `{ type, q, cols, items: [{ text, answer }], explanation, mnemonic }`
- `ord`: `{ type, q, items: [{ text, order }], explanation, mnemonic }` — order is the zero-indexed correct position

Build the quiz page as a lean HTML shell that links to the shared quiz.css and quiz.js (`<link rel="stylesheet" href="quiz.css">` and `<script src="quiz.js"></script>`) — do NOT duplicate the CSS or JS engine inline.

Copy the HTML shell verbatim from any existing sectionX_quiz.html — the ← All Sections back link, the `<header>`, the `.progress-wrap`, the `.chips`, the `#quizCard`, and the `#results` block — changing only:
- the `<title>` and the eyebrow to "C213 Accounting for Decision Makers · Section X"
- the `<h1>` to the section title (a `<span>` may wrap part of it for the accent color)
- the questions array

The `#results` block MUST include `<div class="review" id="reviewList"></div>` just above the Retake button — this powers the "review missed questions" list. Do NOT include a results-page color legend (it has been removed from all sections).

Name the file `sectionX_quiz.html` (lowercase, matching my existing files).

Also give me an updated index.html with a new card added for this section, following the current card format:

```html
<a class="hub-card" href="sectionX_quiz.html">
  <span class="hub-arrow">→</span>
  <div class="hub-card-eyebrow">Section X</div>
  <div class="hub-card-title">[Section Title]</div>
  <div class="hub-card-desc">[one- to two-line summary of the topics covered]</div>
  <div class="hub-card-meta">
    <span class="hub-tag">[N] Questions</span>
  </div>
</a>
```

Cards show a summary description and a SINGLE question-count tag — no question-type pills.

## TECHNICAL REQUIREMENTS
Touch drag support for mobile (touchstart, touchmove, touchend) is already handled by the shared quiz.js for both drag & drop matching and ordering questions — no changes needed there unless a new interaction type is introduced. Multi-select Submit button must be disabled until at least one option is selected. Drag & drop and ordering Check buttons grade each item individually — green for correct placement/position, red for incorrect.

## My notes for the section are below:
[PASTE NOTES HERE]
