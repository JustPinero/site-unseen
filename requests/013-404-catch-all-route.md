# Request #013 — 404 Catch-All Route

**Status**: Not Started
**Dependencies**: None

## Description

Add a catch-all route to the React Router so unknown paths show a friendly "Page not found" message instead of a blank page below the nav.

## Requirements

### Route
- Add a `<Route path="*">` as the last route in `App.tsx`
- Render a `NotFoundPage` component

### NotFoundPage
- Create `front/src/pages/not-found-page.tsx`
- Show a centered message with the Valentine's theme aesthetic
- Include a "Go Home" link back to `/`
- Keep it simple — no animations needed

### Test
- Add `front/src/pages/__tests__/not-found-page.test.tsx`
- Test that the message renders and the link points to `/`

## Verification
- Navigate to `/nonexistent` and see the 404 page
- The "Go Home" link returns to the homepage
- All existing tests still pass
