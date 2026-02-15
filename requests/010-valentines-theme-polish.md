# Request #010 — Valentine's Day Theme & Polish

**Status**: Not Started
**Dependencies**: Request #007, #008, #009

## Description

Apply a cohesive Valentine's Day aesthetic across the entire app. Polish animations, transitions, and responsive design. Make it feel festive and fun.

## Requirements

### Color Palette
- **Primary**: Deep rose `#E91E63`
- **Secondary**: Soft pink `#F8BBD0`
- **Accent**: Rich red `#C62828`
- **Background**: Cream/blush `#FFF5F5`
- **Surface**: White `#FFFFFF`
- **Text primary**: Dark charcoal `#2D2D2D`
- **Text secondary**: Warm gray `#757575`
- **Success**: Soft green `#66BB6A`
- **Warning**: Amber `#FFA726`

### Typography
- Clean, modern sans-serif (Inter or similar)
- Headings can use a slightly romantic serif or script for emphasis

### Visual Elements
- Subtle heart shapes in backgrounds (CSS or SVG)
- Floating heart particle effect on the home page (lightweight, not distracting)
- Heart-shaped progress indicators where appropriate
- Cupid arrow dividers between sections
- Card borders with subtle rose/pink gradients

### Animations
- Page transitions: smooth fade-in
- Cards: subtle hover lift with shadow
- Date table: smooth row transitions when pairs change
- Progress bars: 1-second CSS transition (sync with server ticks)
- Early exit: broken heart pop animation
- New round: gentle table shuffle
- Simulation complete: confetti or heart burst

### Responsive Design
- Desktop: full layout with sidebar
- Tablet: stacked layout, table scrollable
- Mobile: single column, collapsible sections
- Charts resize responsively

### Loading States
- Heart-themed loading spinner
- Skeleton screens for cards and charts
- Smooth transitions from loading to loaded

### Empty States
- "No simulations yet" with a lonely heart illustration
- "Create your first simulation" CTA

### Favicon & Branding
- Heart-themed favicon
- App title: "Site Unseen" with tagline "Speed Dating Simulator"

## Acceptance Criteria

- [ ] Consistent Valentine's Day color palette across all pages
- [ ] All animations are smooth and don't cause layout shifts
- [ ] Responsive on mobile, tablet, and desktop
- [ ] Loading and empty states are themed
- [ ] Charts use the Valentine's color palette
- [ ] Page transitions are smooth
- [ ] Performance: no jank from animations or particles
- [ ] Favicon and title are set
