# ANSWERS.md

## 1. How to run

Requirements: Python 3, any modern browser.

```bash
git clone https://github.com/SyedUmer123/Frontend-Assessment.git
cd Frontend-Assessment
python -m http.server 9090
# Open http://localhost:9090
```

No build step, no package manager, no dependencies.

Deployed URL: https://frontend-assessment-kqctkmr7s-syed-umer-razis-projects.vercel.app

## 2. Stack & design choices

Stack: Vanilla HTML, CSS, and JavaScript.

This is a single-screen calculator with no routing or persistence, so a framework would add overhead without benefit. Vanilla JS keeps it light and fast.

Design decision 1 — Fixed totals panel on mobile.
On small screens the totals panel is fixed near the top and the card gets extra top padding, so the live totals stay visible even when the keyboard is open. This affects the mobile media query for `.card__right` and `.card`.

Design decision 2 — Per-person amount is the visual priority.
The per-person value uses the largest type and an accent color so the most important number stands out. This affects `.result.emphasis strong` in the totals panel.

## 3. Responsive & accessibility

360px phone vs 1440px laptop:
On 360px the layout stacks into one column, the totals panel moves to the top and stays fixed, and spacing tightens. On 1440px the layout shows inputs and totals side-by-side with no scrolling.

Accessibility handled:
The totals panel and inline errors use `aria-live="polite"` so updates are announced. Inputs have explicit labels and the preset buttons are grouped with an `aria-label`.

Accessibility skipped:
There is no skip link. The page is short and the tab order is already small, so it is lower priority here.

## 4. AI usage

Tool used: GitHub Copilot chat (GPT-5.2-Codex).

- Asked for help folding rounding overage into the tip so `per-person × people` matches the grand total, then implemented it.
- Asked for a bold heading; I changed the font import to include the needed weight.
- Asked for a mobile fix; I changed the suggestion to a fixed totals panel with extra top padding so the form stays visible under it.

## 5. Honest gap

The mobile keyboard can still cover some input fields on very short screens because the totals panel is fixed at the top. With another day I would switch to a bottom docked totals bar on focus, or dynamically shrink the totals panel while typing so the inputs remain fully visible.
