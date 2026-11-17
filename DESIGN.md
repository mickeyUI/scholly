# Design System: Academic Collegiate Discovery (Oxford Navy)

## 1. Palette Architecture & Color Tokens
A stately, institutional palette inspired by heritage universities, archival library paper, and formal collegiate crests.

### Primary Swatches
- **`--ink-navy` (`#0d1b2a`)**: Primary typographic anchor, high-contrast badges, active search buttons, and headline serif text.
- **`--collegiate-navy` (`#1b263b`)**: Main brand color, active navigation tabs, university crest medallions, primary action buttons, and institutional footer background.
- **`--slate-blue` (`#415a77`)**: Secondary section headings (`EDUCATIONAL LEVELS`, `APPLICATION FEE`), uppercase tracking labels, metadata icons, and subtle badge borders.
- **`--muted-slate` (`#778da9`)**: Card borders, input stroke borders, unselected tab borders, and quote callout borders.
- **`--alabaster-canvas` (`#e0e1dd`)**: Warm, low-strain paper backdrop. Used for body background with a subtle dotted or stippled scholastic watermark texture.

### Semantic & Surface Mappings
- **Canvas / Background**: `#f9faf5` (warm ivory paper) to `#e0e1dd` (ambient slate wash).
- **Surface Cards (Container Lowest)**: `#ffffff` (pure white for crisp card separation).
- **Surface Muted (Container Low / Inputs)**: `#f3f4f0` or `rgba(224, 225, 221, 0.35)`.
- **Text Primary (on light)**: `#0d1b2a`.
- **Text Secondary / Metadata**: `#415a77`.
- **Borders & Dividers**: `1px solid rgba(119, 141, 169, 0.35)`.
- **Footer Surface**: `#0d1b2a` with text in `#e0e1dd` and muted links in `#778da9`.

---

## 2. Typography & Hierarchy
Combines academic editorial dignity with modern functional UI scanning.

- **Primary Headings (Display & Titles)**:
  - Font: `Newsreader`, `EB Garamond`, or classical Serif.
  - Weights: `600` (SemiBold) or `700` (Bold).
  - Use: University names, hero headlines, modal headings, metric values.
- **Body & Metadata (UI Elements)**:
  - Font: Inter, Plus Jakarta Sans, or system clean sans-serif.
  - Weights: `400` (Regular), `500` (Medium), `600` (SemiBold).
  - Metadata Labels: Uppercase, tracking `0.05em` (`letter-spacing: 0.05em`), font size `11px - 12px`, color `--slate-blue` (`#415a77`).
- **Quotes / Notes**:
  - Font: Italic serif or slanted sans (`font-style: italic`), encased in a low-contrast slate wash container.

---

## 3. Elevation & Depth
Replaces flat borders with tactile academic card depth:

- **Card Drop Shadow**:
  ```css
  box-shadow: 0 10px 30px -4px rgba(13, 27, 42, 0.08), 0 2px 6px -1px rgba(13, 27, 42, 0.04);
  ```
- **Card Hover Elevation**:
  ```css
  transform: translateY(-2px);
  box-shadow: 0 16px 36px -6px rgba(13, 27, 42, 0.12), 0 4px 10px -2px rgba(13, 27, 42, 0.06);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  ```
- **Card Corners**: `border-radius: 12px to 16px` (`rounded-2xl`).

---

## 4. Component Patterns

### University Crest Medallions
- Round avatar/crests (`w-12 h-12 rounded-full`).
- Background: `#1b263b`.
- Text: Serif initial in `#ffffff`, letterpressed feel with subtle border: `2px solid rgba(119, 141, 169, 0.25)`.

### Eligibility & Scholarship Badges
- Pill shape (`border-radius: 9999px`).
- Background: `rgba(65, 90, 119, 0.08)`.
- Border: `1px solid rgba(119, 141, 169, 0.35)`.
- Text: `#0d1b2a`, bold 12px, accompanied by micro-icons (star, shield, document).

### Navigation & Header
- Clean top navigation bar on `#ffffff` with a subtle bottom divider (`#e0e1dd` / `rgba(119, 141, 169, 0.25)`).
- Active pill indicator: Background `#1b263b`, text `#ffffff`.
- Inactive nav items: Text `#415a77`, hover background `rgba(224, 225, 221, 0.4)`.

### Background Canvas Treatment
- Base color: `#f9faf5` to `#e0e1dd`.
- Subtle radial stipple dot matrix:
  ```css
  background-image: radial-gradient(rgba(65, 90, 119, 0.18) 1px, transparent 1px);
  background-size: 24px 24px;
  ```
