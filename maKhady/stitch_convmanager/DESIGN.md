# Design System Strategy: Precision & Depth

## 1. Overview & Creative North Star: "The Analytical Atelier"
This design system moves beyond the generic "SaaS Dashboard" to create a space that feels like a high-end architectural studio. We are not just managing KPIs; we are curating data. 

**The Creative North Star: "The Analytical Atelier."** 
While the base follows a clean, Shadcn-inspired aesthetic, we elevate it through **Tonal Layering** and **Intentional Asymmetry**. Instead of a rigid grid of identical boxes, we use varied surface heights and "breathing room" (generous white space) to guide the eye. The interface should feel like high-quality stationery—precise, tactile, and premium.

---

## 2. Colors & Surface Logic
We utilize a sophisticated Material-based palette to move away from flat, "out-of-the-box" UI.

### Color Palette
*   **Primary (Warm Ember):** `#cc4d36` (Primary) | `#e65f47` (Primary Container) - *Reflecting the updated theme's primary focus.*
*   **Surface (Slate-50 Base):** `#f7f9fb` (Surface) | `#ffffff` (Surface Container Lowest)
*   **Status:** `#009a9d` (Success/Tertiary) | `#ba1a1a` (Error/Alert) - *Tertiary color aligned with updated theme.*

### The "No-Line" Rule
**Explicit Instruction:** Do not use `1px` solid borders to separate sections. We define boundaries through **Background Shifts**. 
*   **Action:** A sidebar sitting on `surface` should be `surface-container-lowest`. 
*   **Action:** A data table should sit on `surface-container-low` to distinguish it from the global background without a single stroke of a pen.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of paper:
1.  **Level 0 (Base):** `surface` (#f7f9fb) - The foundation.
2.  **Level 1 (Sections):** `surface-container-low` (#f2f4f6) - Large content areas.
3.  **Level 2 (Cards):** `surface-container-lowest` (#ffffff) - Actionable modules.
4.  **Level 3 (Popovers/Modals):** `surface-bright` (#f7f9fb) with high-diffusion shadows.

### The "Glass & Gradient" Rule
To add "soul" to the B2B experience, main CTAs and "Active States" should use a subtle linear gradient: `primary` to `primary_container`. For floating notifications, use **Glassmorphism**: `surface-container-lowest` at 80% opacity with a `12px` backdrop-blur.

---

## 3. Typography: The Editorial Hierarchy
We use **Inter** exclusively, but we treat it with editorial intent. The contrast between tight `label-sm` and expansive `display-md` creates the "Pixel-Perfect" look.

*   **Display (KPIs & Metrics):** `display-sm` (2.25rem) / Medium Weight / -0.02em tracking. Use this for the "Hero" numbers in convention management.
*   **Headlines (Page Titles):** `headline-sm` (1.5rem) / Semibold. High contrast against the background.
*   **Body (Data & Content):** `body-md` (0.875rem) / Regular. The workhorse of the system.
*   **Labels (Metadata):** `label-md` (0.75rem) / Medium / Uppercase / +0.05em tracking. Use for table headers and category tags.

---

## 4. Elevation & Depth
We replace structural lines with **Tonal Layering** and **Ambient Light**.

*   **The Layering Principle:** A white card (`surface-container-lowest`) should sit on a light grey section (`surface-container-low`). The contrast is the border.
*   **Ambient Shadows:** When a card must "float" (e.g., a hovered KPI card), use an extra-diffused shadow: `box-shadow: 0 10px 30px -5px rgba(25, 28, 30, 0.04)`. Note the low opacity; it should feel like a soft glow, not a dark smudge.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline-variant` at **15% opacity**. It should be felt, not seen.

---

## 5. Component Guidelines

### Buttons (The Interaction Core)
*   **Primary:** Gradient from `primary` to `primary-container`. `rounded-lg`. White text.
*   **Secondary:** `surface-container-high` background with `on-surface` text. No border.
*   **Tertiary:** Ghost style. `on-surface-variant` text, shifting to `surface-container-low` on hover.

### Input Fields
*   **State Logic:** Default background is `surface-container-lowest`. 
*   **Focus:** Instead of a thick border, use a `2px` outer ring of `primary` at 20% opacity and shift the background to `#ffffff`.

### Cards & Lists (Convention Items)
*   **Forbid Dividers:** Use `1.5` (0.375rem) or `2` (0.5rem) vertical spacing to separate list items. 
*   **Nesting:** Inside a "Convention Card," use `surface-container-highest` for small metadata badges to create depth within the white card.

### Sidebar & Topnav
*   **Sidebar:** `surface-container-lowest` (pure white). Icons (`Lucide`) use `on-surface-variant`. Active state uses a `primary` vertical "pill" (4px width) on the far left.
*   **Topnav:** Transparent background with a `backdrop-blur-md` effect. This allows the page content to subtly bleed through as the user scrolls, maintaining the "high-end" feel.

---

## 6. Do's and Don'ts

### Do
*   **Do** use `20` (5rem) spacing between major sections to give the "Atelier" feel.
*   **Do** use `surface-variant` for "Disabled" states rather than just lowering opacity.
*   **Do** align all Lucide icons to a 20px optical center within a 24px frame.

### Don't
*   **Don't** use `#000000` for text. Use `on-surface` (#191c1e) for better readability and a premium "ink" feel.
*   **Don't** use standard `shadow-md`. Always prefer a tonal shift (background color change) over a shadow.
*   **Don't** use "Alert Red" for anything other than critical errors. Use `secondary` for neutral status updates to keep the UI calm.