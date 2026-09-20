# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, dependency-free study site for WGU MBA courses, served by GitHub Pages at
https://tiflynn.github.io/wgu/. No package.json, no build step, no test suite, no linter — every page
is hand-written HTML that links three shared stylesheets and one shared JS engine. Work is measured in
*sections* (C213) or *topics* (C214): each one is a quiz page, a notes page, and a card on its course hub.

## Commands

```bash
python3 -m http.server 8000          # from the repo root, then open http://localhost:8000/
grep -c "type: '" c214/quizzes/section03.html   # question count for a quiz file
```

Always preview over `http://`, not by opening the file. Under `file://` the browser blocks `fetch`, so
the course hub's question-count script silently falls back to the hardcoded number in the HTML and you
cannot tell whether it actually works.

There are no tests. To check a new quiz before committing, run its question array through the real
engine in Node — load `assets/js/quiz.js` up to the `// ── STATE` marker, `eval` the `questions` array
out of the HTML, and call `buildDeck(questions)` a few hundred times. That catches the failure modes the
browser hides: a `dd` item whose `answer` is not one of `cols`, a gap in an `ord` sequence, an out-of-range
`correctSet`, or duplicate option text (the shuffle re-finds correct answers by string, so duplicates
silently corrupt grading).

## Architecture

Three levels, each with a different link convention — getting these wrong is the most common breakage:

| Level | File | Links |
|---|---|---|
| Landing | `index.html` | one card per course → `cNNN/index.html` |
| Course hub | `cNNN/index.html` | `quizzes/sectionNN.html`, `notes/sectionNN.html`, `../assets/...` |
| Quiz / notes | `cNNN/{quizzes,notes}/sectionNN.html` | `../index.html` (hub), `../../assets/...` |

`index.html` must stay at the root — it is the Pages entry point. `404.html` catches pre-restructure
`/quizzes/*` and `/notes/*` bookmarks and rewrites them into `c213/`; it also repoints its own
`/wgu/`-prefixed asset links at whatever base it is actually deployed under, so it works on a fork.

### The quiz engine contract

`assets/js/quiz.js` owns everything interactive: deck and option shuffling, per-type rendering and
grading, the progress bar, the live score chips, touch-drag support, the results screen, and the
missed-question review list. A quiz page is only a shell — it defines a `questions` array and calls
`initQuiz(questions, 'Topic 3')`. Never inline the CSS or the engine into a page, and never fork the
engine per course; a fix belongs in the shared file.

Question shapes, all of which also require `explanation` and `mnemonic`:

- `mc` / `tf` — `{ type, q, opts, correct, explanation, mnemonic }`; `tf` opts are always `["True","False"]`
- `ms` — `correctSet` is an array of indices into `opts`
- `dd` — `{ cols, items: [{ text, answer }] }`; every `answer` must exactly equal one of `cols`
- `ord` — `{ items: [{ text, order }] }`; `order` is the zero-indexed correct position, no gaps

The shell also has required DOM ids the engine reaches for by hand: `qLabel`, `qCounter`, `qText`,
`qHint`, `typeBadge`, `interactionZone`, `feedback`/`fbHead`/`fbBody`/`fbMnemonic`, `btnWrap`/`btnNext`,
`barFill`/`pctLabel`, `chipTotal`/`chipCorrect`/`chipWrong`, `results`/`bigScore`/`gradeMsg`/
`rcCorrect`/`rcWrong`/`rcTotal`, and `reviewList`. Copy a sibling quiz's shell verbatim rather than
retyping it — a missing id throws at render time.

### Question counts

Each course hub re-counts questions at load by fetching every card's quiz file and matching
`/[{,\s]type\s*:\s*['"]/g`. Consequences worth knowing:

- A card's `.hub-card-link` href **must** start with `quizzes/` or the script skips that card.
- The number written into `.hub-tag` is only the `file://` fallback — keep it accurate anyway.
- The regex matches `type:` followed by a quote, so avoid writing `type: '…'` inside a comment or an
  explanation string in a quiz file — it inflates the count.
- The **root** `index.html` section/topic tags have no script behind them. They are hardcoded and are
  the one number that must be bumped by hand when a topic lands.

### Styling

`assets/css/quiz.css` holds the design tokens (`--accent`, `--accent2`, `--correct`, `--wrong`,
`--muted`, `--content-w`, …) plus header, progress, option, and results styling, and is loaded by every
page including the hubs. `hub.css` adds the card grid; `notes.css` adds the notes vocabulary —
`.formula-card`, `.stacked-eq`, `.compare-table` (always wrapped in `.table-scroll`), `.callout`
(`.tip` / `.warn`), `.chain-flow`, `.pitfall-grid`, `.quicklist`, `.notes-toc`.

Build notes pages out of that existing vocabulary instead of adding CSS. Small one-off `style="…"`
attributes for font size and spacing are the established pattern inside notes sections; a new class in
`notes.css` is not, since it is shared by every course.

## Conventions

- Section files are zero-padded: `section03.html`, never `section3.html`.
- Filenames say `section` in both courses, but the user-facing vocabulary differs: C213 says
  "Section N" with a `← All Sections` back link, C214 says "Topic N" with `← All Topics`. Match the course.
- Hub cards carry a prose summary description and a **single** question-count tag. Question-type pills
  were deliberately removed — do not reintroduce them.
- Quiz pages carry a `.top-nav` with both the hub back link and a `📄 Topic N Notes` link; notes pages
  carry only the back link.
- `docs/PROMPT.md` is the authoritative spec for generating a new quiz — including the rule that a
  numbered "Step 1 / Step 2 / …" sequence in the notes becomes *one* `ord` question, not several `mc`
  questions. Read it before building a quiz.
- Distribute the five question types by what the content supports; don't force a type. Wrong answers
  should be plausible — ideally each distractor is a specific, nameable mistake (a skipped add-back, a
  flipped sign), and the `explanation` should say so.

## Adding a topic

1. Read `docs/PROMPT.md`, then build `cNNN/quizzes/sectionNN.html` by copying the nearest sibling's shell.
2. Build `cNNN/notes/sectionNN.html` from the sibling notes shell, reusing `notes.css` classes.
3. Add the card to `cNNN/index.html` (href relative, count tag accurate).
4. Bump the course's count tag on the root `index.html`.
5. Update `README.md` — the course status table and the per-course section/topic table.
