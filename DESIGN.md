---
name: Fingerboard Timer
description: A focused hangboard interval timer for rock climbers
colors:
  surface-void: "#0B0D13"
  surface-base: "#0F1117"
  surface-raised: "#181A21"
  surface-row: "#191B22"
  surface-overlay: "#1E2028"
  surface-chip: "#263238"
  text-primary: "#EDF0F5"
  text-secondary: "#CFD8DC"
  text-tertiary: "#B0BEC5"
  text-muted: "#78909C"
  text-ghost: "#546E7A"
  text-disabled: "#455A64"
  phase-effort: "#D64040"
  phase-rest: "#3A8C5C"
  phase-done: "#3B82F6"
  danger: "#EF5350"
typography:
  display:
    fontFamily: "-apple-system, system-ui, sans-serif"
    fontSize: "92px"
    fontWeight: 200
    lineHeight: 1
    fontVariant: "tabular-nums"
  headline:
    fontFamily: "-apple-system, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 900
    letterSpacing: "2px"
  title:
    fontFamily: "-apple-system, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 800
    lineHeight: 1.1
  body:
    fontFamily: "-apple-system, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.4
  label:
    fontFamily: "-apple-system, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: "2px"
rounded:
  sm: "8px"
  md: "12px"
  lg: "14px"
  xl: "20px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "20px"
  xl: "28px"
components:
  button-primary:
    backgroundColor: "#D64040"
    textColor: "#EDF0F5"
    rounded: "14px"
    padding: "18px 20px"
  button-primary-done:
    backgroundColor: "#3B82F6"
    textColor: "#EDF0F5"
    rounded: "14px"
    padding: "18px 20px"
  button-outlined:
    backgroundColor: "#141825"
    textColor: "#3B82F6"
    rounded: "14px"
    padding: "16px 20px"
  button-secondary:
    backgroundColor: "#1E2028"
    textColor: "#8898AA"
    rounded: "14px"
    padding: "18px 18px"
  exercise-card:
    backgroundColor: "#191B22"
    rounded: "12px"
    padding: "14px"
  preset-card:
    backgroundColor: "#181A21"
    rounded: "16px"
    padding: "16px"
---

# Design System: Fingerboard Timer

## 1. Overview

**Creative North Star: "The Dim Gym at 6am"**

This is a tool for people whose hands are tired, chalk-dusted, and gripping. The interface is designed for the moment before and after a hard set: ambient light is low, focus is absolute, and there is no room for cognitive friction. Every element either earns its presence or disappears. The countdown is the product. Everything else is support structure.

The surface family steps from near-black to dark-gray in six controlled stops, and depth is expressed entirely through tonal difference. There are no shadows. Phase colors (effort, rest, done) are absorbed into the background at 9% opacity during active sessions so the countdown is the loudest thing on screen. At full weight, they appear only where the information is load-bearing: the phase label, the primary CTA.

This system rejects loud sports branding, electric gradients, and anything that would feel at home in an ESPN or Nike app. It also rejects the opposite failure: sterile hospital minimalism or SaaS dashboard energy. The app has opinions. It expresses them through precision, not decoration.

**Key Characteristics:**
- Six-stop tonal surface family; depth without shadows
- Phase-semantic colors at 9% opacity during sessions, full weight only on controls and labels
- Extreme weight contrast: 200 for numerics, 900 for phase labels — the span IS the hierarchy
- System font throughout; no custom display typeface needed at this density
- Touch targets sized for chalked hands (48pt minimum, 56pt+ for primary controls)

## 2. Colors: The Low-Light Palette

Six surface stops and three semantic signals. Nothing decorative.

### Primary
- **Effort Crimson** (#D64040): The work phase, the hang state, all primary CTAs. The color of exertion. At 9% opacity as the timer card tint during a hang; at full weight on the Start button and phase label.

### Secondary
- **Recovery Moss** (#3A8C5C): The rest phase exclusively. Absorbed, never alarming. At 9% opacity during rest intervals; full weight only on the REST phase label and its button state.

### Tertiary
- **Completion Slate** (#3B82F6): Done state and the outlined add-exercise action. Calmer than the other two signals. The color that says the session is over, or that an additive action is safe.

### Neutral
- **Surface Void** (#0B0D13): Tab bar and the absolute floor. The darkest surface.
- **Surface Base** (#0F1117): Primary app background. Every screen sits on this.
- **Surface Raised** (#181A21): Preset cards. One stop lighter than base.
- **Surface Row** (#191B22): List rows and exercise cards. The step from raised matters even when subtle.
- **Surface Overlay** (#1E2028): Secondary buttons, footer bars, border accents. The fifth stop.
- **Surface Chip** (#263238): Meta chips. The lightest neutral surface.
- **Text Primary** (#EDF0F5): Screen titles, hold names, primary labels. Near-white, tinted blue-gray.
- **Text Secondary** (#CFD8DC): Secondary headings, next-up exercise labels.
- **Text Tertiary** (#B0BEC5): Input text, hold pill labels.
- **Text Muted** (#78909C): Metadata, notes, timer header routine name.
- **Text Ghost** (#546E7A): Section labels (EXERCISES, UP NEXT), progress dot done state.
- **Text Disabled** (#455A64): Placeholder text, inactive/disabled states.

### Named Rules

**The Tonal Depth Rule.** Depth is expressed through surface-tone steps, not shadows. Never add a box shadow to express elevation; use the next surface stop instead. The six-stop family is the complete depth vocabulary.

**The Signal Absorption Rule.** Phase colors are never decorative. During a session, they appear at 9% opacity as card tints. At full weight they appear only on controls and phase labels where the information is load-bearing. A phase color on a purely decorative element is prohibited.

**The Hold Palette Rule.** The eight hold-type colors (Jug #4CAF50, Crimp #F44336, Open Hand #2196F3, Pinch #FF9800, Sloper #9C27B0, 3 Finger Drag #00BCD4, 2 Finger Drag #FF5722, 2 Finger Pocket #E91E63) are a categorical data dimension, not a design accent palette. They appear as 8% background tints on exercise cards, 13% on index badges, and as solid fills only on the hold badge in the active timer. They are never used as decorative accents on neutral surfaces.

## 3. Typography

**Body / Display Font:** System (-apple-system, SF Pro on iOS; Roboto on Android)

No custom typeface is loaded. The system font at extreme weights (200 and 900) does more work than any display face would. The countdown is the product; the phase label names it.

**Character:** Ultra-light digits paired with ultra-black labels. The weight contrast is the entire hierarchy. A reader's eye falls on the countdown first because it is large and fragile; the phase label HANG commands because it is heavy and tight. Nothing in the middle uses anything outside 600–800.

### Hierarchy
- **Display** (weight 200, 92px, line-height 1, tabular-nums): The countdown exclusively. Its fragility is intentional — the number is large but does not shout. Tabular nums prevent layout shift as digits change.
- **Headline** (weight 900, 30px, ls 2px, uppercase): Phase labels: HANG, REST, DONE, READY. The heaviest element in the type system. Used in exactly one place.
- **Title** (weight 800, 28px, line-height 1.1): Screen titles. Card titles use the same weight at 20px.
- **Body** (weight 600–700, 14–16px, line-height 1.4): Hold names, exercise meta, button labels. Never regular weight at this size — everything at body scale is semi-bold.
- **Label** (weight 700, 10–13px, ls 2px, uppercase): Section markers (EXERCISES, UP NEXT, HOLD TYPE). Tracked and uppercased. Always muted (Text Ghost or Text Muted).

### Named Rules

**The 200-to-900 Rule.** The timer display sits at weight 200. The phase label sits at weight 900. No weight between 200 and 600 exists in this system. No weight above 900. The span from 200 to 900 IS the hierarchy. Don't collapse it by adding medium-weight decorative text.

## 4. Elevation

This system is completely flat. No box shadows exist anywhere in the app. Depth is expressed through the six-stop surface family: darker surfaces recede, lighter surfaces advance. The timer card uses phase-colored tinting at 9% opacity to signal active state without lifting off the plane.

**The Flat-By-Default Rule.** Surfaces never cast shadows, at rest or on interaction. If a surface needs to feel elevated, use the next surface color stop. The only visual layering is tonal. This is not restraint for its own sake — a dim gym has flat surfaces. The interface matches the physical context.

## 5. Components

### Buttons

Tool-grade, no polish for its own sake. Rounded enough for forgiving touch targets; not so rounded they feel casual.

- **Shape:** 14px radius on all button variants
- **Primary (Effort):** Effort Crimson (#D64040) background, Text Primary label, 18px vertical padding. The dominant CTA. Minimum touch height 56pt.
- **Primary (Done state):** Completion Slate (#3B82F6) background, same treatment. Contextually replaces the effort button when the session ends.
- **Outlined (Add Exercise):** #141825 background, Completion Slate border (1px) and text label, 16px vertical padding. Used for additive actions that need distinction from the neutral secondary.
- **Secondary:** Surface Overlay (#1E2028) background, #8898AA text, 18px vertical padding. Reset and Skip. Matched height to primary for consistent control row rhythm.

### Exercise Cards

Colored by hold type at 8% opacity background tint. The hold type provides categorical identity; the rest of the card is neutral. Index badge uses the same hold color at 13% opacity for slightly more presence at small scale.

- **Radius:** 12px
- **Padding:** 14px
- **Hold identity:** Background tint + index badge tint. Never a full-weight border.
- **Actions:** Icon-only buttons (edit, delete, reorder) at 16px, color #78909C. Delete in danger (#EF5350).

### Preset Cards

Accordion. Collapsed shows quick-start row beneath the header. Expanded reveals exercise list and a full-width Start button.

- **Background:** Surface Raised (#181A21)
- **Radius:** 16px
- **Hold pills:** Hold color at 13% bg, 33% border, 10px radius — shows hold distribution at a glance without overwhelming the card.
- **Meta chips:** Surface Chip (#263238) background, Text Muted labels, 8px radius.

### Timer Card (Signature Component)

The dominant element during a session. Phase tint makes the card feel different in each state without structural change.

- **Background tint:** Phase color at 9% opacity (rgba(214,64,64,0.09) during hang; rgba(58,140,92,0.09) during rest)
- **Radius:** 20px
- **Phase Label:** Full phase color, weight 900, 30px, ls 2px — the heaviest text in the app
- **Timer Digits:** Text Primary (#EDF0F5), weight 200, 92px, tabular-nums — the lightest text at the largest size
- **Hold Badge:** Solid hold color background, 20px radius pill, weight 700, 16px — the only fully-saturated element in the session view

### Hold Chips (Exercise Modal)

Selector for hold type in the exercise editor.

- **Default:** #1E1E1E background, #37474F border (1px), #90A4AE text, 20px radius pill
- **Selected:** Solid hold color background and border, #FFF text

### Meta Chips

Workout summary tags (duration, sets, exercise count).

- **Background:** Surface Chip (#263238)
- **Radius:** 8px
- **Padding:** 3px vertical, 8px horizontal
- **Text:** Text Muted (#78909C), 11px

### Navigation (Tab Bar)

- **Background:** Surface Void (#0B0D13)
- **Border:** 1px top, #1A1C24
- **Height:** 64px with 8px bottom padding
- **Active:** Text Primary (#EDF0F5) label, icon at full opacity
- **Inactive:** #4A5568 label, icon at 45% opacity
- **Label style:** 11px, weight 600

### Progress Dots

Exercise completion indicator in the timer header.

- **Diameter:** 10px
- **Incomplete:** #37474F
- **Done:** #546E7A (complete is visible, not celebrated)
- **Current:** Hold type color at full weight

## 6. Do's and Don'ts

### Do:
- **Do** use Effort Crimson (#D64040) for primary CTAs and the hang phase exclusively. Its rarity gives it authority.
- **Do** size all touch targets at minimum 48pt height; prefer 56pt for primary controls. Hands are chalked and tired.
- **Do** use weight 200 for the countdown display and weight 900 for phase labels, without exception.
- **Do** express depth through the six-stop surface family, never through shadows.
- **Do** tint the timer card background with the phase color at 9% opacity to communicate state without demanding attention.
- **Do** use `tabular-nums` for all countdown and time values to prevent layout shift.
- **Do** apply hold-type color as background tint at 8–13% opacity on cards and badges, not as borders or solid fills outside the active hold badge.
- **Do** use Text Ghost (#546E7A) or Text Muted (#78909C) for all section labels, at 10–13px with weight 700 and 2px letter-spacing.

### Don't:
- **Don't** add box shadows anywhere. The system is flat by design and by context.
- **Don't** use loud sports branding: heavy drop shadows, electric gradients, aggressive display type, ESPN or Nike-App energy. This app is not trying to hype anyone up.
- **Don't** add gamification chrome: streak counters, badge icons, confetti animations, neon green progress bars. Generic fitness app gamification is explicitly prohibited.
- **Don't** use a white or light background. This app lives in dim gyms under effort. Dark surfaces are not a stylistic choice — they are correct.
- **Don't** use border-left or border-right greater than 1px as a colored stripe on cards, list rows, or callouts. Hold identity is expressed through background tinting, not side stripes.
- **Don't** use gradient text or background-clip: text effects.
- **Don't** introduce a second custom typeface. The system font at extreme weights provides the complete hierarchy.
- **Don't** use the hero-metric template: big number, small label, supporting stats, gradient accent. This is not a SaaS dashboard.
- **Don't** use hospital white and teal, sterile clinical colors, or anything that reads as generic health-app styling.
- **Don't** center-align body text or metadata. Only the timer display and phase label are centered; everything else is left-aligned.
