# reidmd.net QA Stabilization Checklist (v8 lock)

## Goal
Confirm live theme matches stabilization guardrails (homepage cinematic only; product pages Dawn-like).

## Preconditions
- Theme path: C:\Users\sean\Desktop\reidmd-theme
- Live store URL: https://86248b-36.myshopify.com

## Checks (Browser)
1) Home
- Hero video/visuals render
- Cinematic CSS does NOT leak to non-home pages

2) Collection / Search
- Grid spacing OK
- No layout shifts

3) Product page (critical)
- Title, price, variant picker, quantity, buy buttons visible WITHOUT excessive scrolling
- Media not oversized; no broken gallery behavior
- Description renders
- No custom product gallery JS re-enabled during stabilization

## Evidence
Capture: screenshots + notes (what URL, what browser).

## Result
- PASS if product flow feels Dawn-like and homepage stays cinematic-only.
- FAIL: log exact URL + symptom + suspected file (theme.liquid / CSS scope) and open a small fix task.
