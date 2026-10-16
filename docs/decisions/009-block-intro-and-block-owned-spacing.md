# ADR-009: Every block owns its intro and its spacing

**Status:** Proposed
**Date:** 2026-10-15
**Issue:** INTORG-1154

---

## Context

Spacing between blocks is inconsistent. Each block either has no title or renders one ad hoc, so related content sits behind jarring gaps. To title a block, editors fake an intro with a `<Paragraph>` that ends in `## Heading`, and `prose/rhythm.css` carries dedicated rules (`:has(> h2:last-child)`) just to make that pattern look right.

Today the gaps belong to the container. `--space-section` (64 / 80 / 120) is a margin on every top-level block. Text keeps the 32px prose rhythm, and adjacent margins collapse. Block titles are inconsistent: some blocks use a `title` field, others a `heading`, and they render with different markup.

The approved design (Figma file `Tjtpc6NlHguR9DUcemSVb5`, "ILF New Design") replaces this with two rules:

1. **Every block accepts the same optional intro:** Heading (H2), Subheading (H3) and Description.
2. **Every block owns its spacing:** a top spacer from the intro and a fixed bottom padding. The design also defines how headings, paragraphs and media are spaced inside the Paragraph block.

The designer is explicit: _"between H2, H3 and description, is using spacer containers (not spacing). To be built exactly like this."_ Gaps **add up and never collapse**, which margins cannot express.

The work spans Strapi (schema, serializers, MDX ↔ Strapi sync, content migration) and Astro (components, CSS), so it ships in phases. The phase plan lives in [the task document](../tasks/block-intro-and-paragraph-spacing.md), not here.

All values in this ADR are **Mobile / Tablet / Desktop** in px unless a table says otherwise. Breakpoints are `tablet:` (810) and `desktop:` (1200).

### Figma sources

All designs are in the [ILF New Design](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5474-74250) Figma file (`Tjtpc6NlHguR9DUcemSVb5`). Each node ID below links to its frame. The master board is **"Spacing Consistency – based on Strapi building model"** ([`5474:74250`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5474-74250)). It contains everything below:

| Part                                                                                                                              | Node                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Intro master ("Standalone accessories")                                                                                           | [`5297:65020`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5297-65020) (component set [`5034:18595`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5034-18595))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| H2 / H3 containers                                                                                                                | [`5298:65102`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5298-65102)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| H4 container                                                                                                                      | [`5353:17361`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5353-17361)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Paragraph body                                                                                                                    | [`5034:18528`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5034-18528) (component set [`5033:17962`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5033-17962))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| H1 (hero only)                                                                                                                    | [`5432:61853`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5432-61853)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Block sub-components (image, table, list, …)                                                                                      | [`5420:28545`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5420-28545)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Q&A with design                                                                                                                   | [`5392:27351`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5392-27351)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Strapi blocks** (section [`5474:74127`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5474-74127)) | Paragraph [`5420:28552`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5420-28552), CTA buttons [`5432:61858`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5432-61858), Image/Video [`5431:42614`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5431-42614), Agenda [`5432:62257`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5432-62257), Split layout [`5441:63402`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5441-63402), Quote [`5466:66281`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5466-66281), Blockquote [`5467:66429`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5467-66429), Profile Grid [`5464:65604`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5464-65604), PDF [`5468:66900`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5468-66900), FAQ [`5474:71806`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5474-71806), Number tiles [`5471:67951`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5471-67951), Card Grid [`5474:68122`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5474-68122), Logo carousel [`5474:71790`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5474-71790), Event card [`5474:73345`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5474-73345), CTA strip [`5474:73965`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5474-73965) |

---

## Decision

| #   | Decision                                                                                                                                                                                                                                                                                                                                                                                | Status           |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| D1  | **Data model.** A shared Strapi component `shared.block-intro` = `{ heading: string, subheading: string, description: CKEditor basicMarkdown }`, added as an optional `intro` field on each block. It is serialized to MDX as one `intro={{…}}` prop. Existing `title`/`heading` values migrate into `intro.heading`.                                                                   | Agreed           |
| D2  | **Spacing ownership.** A block whose root carries `data-intro-variant` owns its top (the intro) and its bottom (`--block-pb`, [A2](#a2-block-padding-bottom-every-block-including-paragraph)). It sits out the `--space-section` rhythm, both in `prose/rhythm.css` and in the Strapi preview (`DynamicZone.astro`). All spacers are padding, never margin.                             | Agreed           |
| D3  | **Paragraph spec scope.** The paragraph rules ([A3](#a3-paragraph-block-headings)–[A5](#a5-paragraph-block-media-image--video-table-list)) apply only to `[data-component='Paragraph']`. Blog and profile (`.max-w-narrow`) running text is untouched.                                                                                                                                  | Agreed           |
| D4  | **Rollout.** Blocks adopt the intro one at a time, piloting on CardGrid, FAQ and NumberTiles. While pages mix migrated and legacy blocks, transitional rules keep the gap between the two kinds at `--space-section` (see below).                                                                                                                                                       | Agreed           |
| D5  | **Agenda days.** Agenda gets `intro` plus a repeatable `days: blocks.agenda-day = { date: date, items: agenda-item[] }`. "Day N" is rendered from the index (an i18n string), not stored. Editors pick the date with Strapi's native date picker. Consecutive per-day Agenda blocks are merged into one by migration.                                                                   | Pending sign-off |
| D6  | **CTA strip.** `heading` moves into `intro.heading`. The strip keeps its own `description` (the in-strip copy) and buttons.                                                                                                                                                                                                                                                             | Proposed         |
| D7  | **Split layout.** Split layout gets `intro`. The first column becomes intro + an optional button group (primary + secondary, replacing the single `cta`). The media is always 4:3. The second column holds media, or a list of FAQ accordions, which flips the column widths ([B5](#b5-split-layout-544163402-split-layout-intro)). The FAQ option is new to the Strapi model.          | Pending sign-off |
| D8  | **Blockquote `source`.** Blockquote keeps its Strapi structure, `source` included, and its current rendering. Only the spacing rules change (designer, 2026-10-16).                                                                                                                                                                                                                     | Agreed           |
| D9  | **Spacing only, existing components unchanged.** This work is about spacing between and within sections. Components that are already built keep their internal design and layout: FAQ, Number tiles, Event card, Logo carousel, Blockquote, Profile Grid (grid rules) and the PDF embed (no design; see [B8](#b8-pdf-embed-546866900)). They gain the intro and the block spacing only. | Agreed           |

### How spacing ownership works

- **Tokens.** `src/styles/base/variables.css` defines `--intro-top`, `--intro-h2-pt`, `--intro-h2-h3`, `--intro-h3-pt`, `--intro-h3-desc`, `--intro-desc`, `--block-pb` and `--media-pt`, per breakpoint, from the existing spacing tokens. They are declared on `:root` and again on every `[data-intro-variant]`, so a nested block starts from the defaults. Variants override only what differs ([A1](#a1-intro-every-block)).
- **Intro.** `src/components/shared/BlockIntro.astro` renders a `<header>` with the h2, h3 and description. Each spacer is padding on the element above it, so it disappears with that element. An empty intro renders nothing.
- **Block.** `[data-intro-variant]` gets `padding-block-end: var(--block-pb)` (`components/block-intro.css`). At the end of the prose that padding drops, like the trailing margins today.
- **Mixed pages (transitional).** A legacy element before an intro block keeps only `--block-pb` below it. A legacy element after one takes `--space-section − --block-pb` above it. Both rules reach across the `<script>` Astro emits after a component, and CTAs apply the same rule through a utility. On desktop, with a heading in the intro, every pair of blocks therefore stays 120 apart. These rules are deleted once every block owns its spacing.

### A. Global spec

#### A0. Tokens

All the typography tokens already exist in `src/styles/theme.css`. Bare `h1`–`h4` pick them up from `reset.css`.

| Style                     | Mobile | Tablet | Desktop | Weight    |
| ------------------------- | ------ | ------ | ------- | --------- |
| H1 (hero only)            | 40/48  | 56/64  | 76/84   | 700       |
| H2                        | 32/40  | 40/48  | 56/64   | 600       |
| H3                        | 24/32  | 28/36  | 40/48   | 500       |
| H4                        | 20/30  | 22/32  | 28/40   | 500       |
| Body / description ("H5") | 18/28  | 18/28  | 20/30   | 400       |
| body-lg                   | 16/26  | 16/26  | 16/26   | 400 / 600 |
| body-sm                   | 14/22  | 14/22  | 14/22   | 400       |

Colours:

| Use                         | Token         | Hex     |
| --------------------------- | ------------- | ------- |
| Headings                    | `neutral-900` | #000    |
| Body and description        | `neutral-100` | #292929 |
| **List text** (intentional) | `neutral-150` | #0d0d0d |
| Quote text and some labels  | `neutral-75`  | #595959 |

Breakpoints are `tablet:` (810) and `desktop:` (1200).

Figma padding names map to the project's spacing tokens like this (Figma name → value → project token):

| Figma | Value | Project token   |
| ----- | ----- | --------------- |
| xs    | 4     | `xs`            |
| sm    | 8     | `sm`            |
| md    | 12    | `md`            |
| lg    | 16    | `lg`            |
| xl    | 24    | `xl`            |
| 2xl   | 32    | `2xl`           |
| 3xl   | 40    | **`3xl-tight`** |
| 4xl   | 60    | `4xl`           |
| 5xl   | 80    | `5xl`           |
| 6xl   | 120   | `6xl`           |

No new spacing tokens are needed.

#### A1. Intro (every block)

Stack, top to bottom:

`top spacer → H2 (pt) → H2→H3 spacer → H3 (pt) → H3→desc spacer → description → description spacer → block content → block padding-bottom`

|                                                     | Mobile | Tablet | Desktop |
| --------------------------------------------------- | ------ | ------ | ------- |
| Top spacer (renders whenever the intro has content) | 24     | 32     | 40      |
| H2 padding-top                                      | 24     | 32     | 40      |
| H2→H3 spacer (with H2)                              | 40     | 48     | 60      |
| H3 padding-top                                      | 16     | 24     | 32      |
| H3→desc spacer (with H3)                            | 24     | 32     | 40      |
| Description spacer (with description)               | 24     | 32     | 60      |

The real distance from the top of the block to the H2 text is the top spacer plus the H2 padding-top: **48 / 64 / 80**.

Variant overrides:

| Variant          | Used by                                                                                                         | Differences from the table above                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Universal**    | PDF, Number tiles, Quote, Blockquote, Event card, Card Grid, Logo carousel, FAQ, CTA strip, Image/Video, Agenda | none                                                              |
| **Button CTA**   | CTA buttons block                                                                                               | description spacer **0**                                          |
| **Profile Grid** | Profile Grid                                                                                                    | none; same values as Universal since the latest pass              |
| **Split layout** | Split layout                                                                                                    | desktop: top spacer **0**, H2→H3 **40**, description spacer **0** |

Rules:

- An intro with all three fields empty renders nothing, not even the top spacer.
- Heading is always `<h2>` and Subheading always `<h3>`. Visual size stays tied to the level.
- The description is rich text: paragraphs, links and bold.

#### A2. Block padding-bottom (every block, including Paragraph)

**24 / 32 / 40**, confirmed by design. This is the minimum spacing a block owns even when it has no intro.

Gap between two blocks, from the end of one block's content to the next block's H2 text: pb + top spacer + H2 pt = **72 / 96 / 120**. Desktop equals today's `--space-section` (120).

#### A3. Paragraph block: headings

| Element | Context           | Mobile pt/pb | Tablet pt/pb | Desktop pt/pb |
| ------- | ----------------- | ------------ | ------------ | ------------- |
| H2      | first in the flow | 60 / 12      | 80 / 16      | 120 / 24      |
| H2      | not first         | 40 / 12      | 60 / 16      | 80 / 24       |
| H3      | first             | 60 / 8       | 80 / 12      | 120 / 16      |
| H3      | not first         | 24 / 8       | 32 / 12      | 40 / 16       |
| H4      | first             | 60 / 4       | 80 / 8       | 120 / 12      |
| H4      | not first         | 16 / 4       | 24 / 8       | 32 / 12       |

- **"First"** means nothing sits above it in the flow, which is the top of the content. A heading after any block, including another Paragraph block, uses "not first", because that block's padding-bottom (40) supplies the rest: 40 + 80 = 120.
- **Stacked headings** need no special rule. They add up, e.g. H2 → H2 = 24 + 80 = 104.

#### A4. Paragraph block: body

Padding-bottom is **8 / 12 / 16**. Paragraphs inside one container stack with gap 16. Padding-top depends on what is directly above:

| Above                                     | Mobile | Tablet | Desktop |
| ----------------------------------------- | ------ | ------ | ------- |
| nothing (block starts with a paragraph)   | 60     | 80     | 120     |
| H1 (see [A6](#a6-h1-hero-only-543261853)) | 32     | 40     | 60      |
| H2                                        | 24     | 32     | 40      |
| H3                                        | 16     | 24     | 32      |
| H4                                        | 12     | 16     | 24      |
| Paragraph                                 | 16     | 24     | 32      |
| Image, table or list                      | 32     | 40     | 60      |

Resulting desktop gaps:

| Transition | Calculation | Gap                                           |
| ---------- | ----------- | --------------------------------------------- |
| H2 → p     | 24 + 40     | 64                                            |
| H3 → p     | 16 + 32     | 48                                            |
| H4 → p     | 12 + 24     | 36                                            |
| **p → p**  | 16 + 32     | **48** (today 32: an intended visible change) |
| p → H2     | 16 + 80     | 96                                            |
| media → p  | 0 + 60      | 60                                            |

#### A5. Paragraph block: media (image / video, table, list)

These are "used under a paragraph" sub-components ([`5420:28545`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5420-28545)).

|                          | Mobile | Tablet | Desktop |
| ------------------------ | ------ | ------ | ------- |
| Container padding-top    | 24     | 32     | **60**  |
| Container padding-bottom | 0      | 0      | 0       |

- Media inside a paragraph has **no padding-bottom** (designer, 2026-10-16). What follows supplies the whole gap: a paragraph uses its "Image, table or list on top" padding-top ([A4](#a4-paragraph-block-body), 32 / 40 / 60), and a heading uses its "not first" padding-top ([A3](#a3-paragraph-block-headings)).
- **Image:** full content width, radius 24, aspect ratio kept (the heights drawn are sample-specific).
- **List:**
  - custom orange triangle bullet, 16×24, with a 16 gap to the text
  - text 18/28 on mobile and tablet, 20/30 on desktop, `neutral-150` (#0d0d0d)
  - item gap 12 / 16 / 16
  - full content width
- **Table:**
  - cell padding 12
  - first column 60, the rest equal
  - scrolls horizontally on mobile, via the existing `wrapScrollableTables`

#### A6. H1 (hero only), [`5432:61853`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5432-61853)

Padding-top / padding-bottom:

|            | Mobile  | Tablet  | Desktop |
| ---------- | ------- | ------- | ------- |
| H1 pt / pb | 24 / 12 | 32 / 16 | 40 / 24 |

- **Content starts the same way under every hero**, with or without an image (designer, 2026-10-16). The gap between the hero (or a bare H1) and the first block is **0**. The perceived space comes only from the first block's own top: its intro's top spacer, or the "first" padding-top of the Paragraph's first element ([A3](#a3-paragraph-block-headings), [A4](#a4-paragraph-block-body)). For example, a page whose first block is a Paragraph starting with an H2 uses H2 "first" (60 / 80 / 120).
- When the "H1 on top" paragraph value ([A4](#a4-paragraph-block-body)) applies is still open ([E-Q19](#still-open)).

### B. Per-block spec

Each block below is: Universal intro (A1), then its content, then pb 24 / 32 / 40 (A2), unless noted. Figma anomalies are listed under [Open design items](#open-design-items-2026-10-16), not repeated here.

#### B1. Paragraph ([`5420:28552`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5420-28552))

- A3–A5 apply.
- Six examples are drawn: H2/H3/H4 nesting, H2-p-H3-p-p, H2-p-H2-p, plus image, table and list variants.
- Block pb 24 / 32 / 40.

#### B2. CTA buttons ([`5432:61858`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5432-61858)), Button CTA intro

**Buttons:**

- **Button group:** pt 24 / 24 / 32, gap 24. Side by side on tablet and desktop; **stacked full width on mobile**.
- **Primary:**
  - `orchid-100` #80409d, h 48, radius 8
  - padding pl 24 / pr 16
  - 14/22 white text, with a 20px arrow-forward icon
- **Secondary:**
  - 1px border in `neutral-75`
  - padding 16
  - 14/22 text in `neutral-100`

#### B3. Image / Video embed ([`5431:42614`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5431-42614))

- Media is full width, radius 24, aspect ratio kept.
- This one block covers both ImageBlock and VideoEmbed.

#### B4. Agenda ([`5432:62257`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5432-62257))

**Layout and spacing:**

|                                                  | Mobile                 | Tablet                              | Desktop                             |
| ------------------------------------------------ | ---------------------- | ----------------------------------- | ----------------------------------- |
| Gap between days                                 | 60                     | 60                                  | 60                                  |
| Day heading → items                              | 24                     | 24                                  | 24                                  |
| Day heading type / padding-block                 | 20/30, py 8            | 22/32 (Tablet H4), py 16            | 28/40, py 16                        |
| Spacer between cards (carries the timeline line) | 24                     | 24                                  | 24                                  |
| Card padding left / right                        | 12 / 16                | 16 / 24                             | 24 / 24                             |
| Activity title                                   | 18/28                  | 18/28                               | 20/30                               |
| Description                                      | 14/22, under the title | 16/26, right column after a divider | 16/26, right column after a divider |

**Day heading:**

- "Day N" in `neutral-900`, then the date in `neutral-100`, with a 16 gap. Semantically an `<h3>`.
- **"Day N" is not editable.** It is numbered automatically from 1, in order. **The date is the editable field**, ideally a date picker (designer).

**Card:**

- radius 16
- backgrounds alternate between `ice-indigo-50` #f2f3ff and `rose-mint-100` #fff2f2
- 24px clock icon on a vertical timeline line
- time 16/26 semibold, `neutral-900`
- activity title in `orchid-100`
- left column max width 280 (desktop) / 260 (tablet)
- a card with no description has no right column

**Field mapping:** `time` → time, `activity` → title, `additionalInfo` → description bullets.

#### B5. Split layout ([`5441:63402`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5441-63402)), Split layout intro

**Desktop:** 2 columns, gap 60.

| Second column holds | First column (intro + buttons) | Second column |
| ------------------- | ------------------------------ | ------------- |
| Media               | full width, max **60%**        | max **40%**   |
| FAQ accordions      | max **40%**                    | max **60%**   |

- The intro column is top-aligned; the media column is vertically centred.
- Media is on the right.
- Media aspect ratio is **4:3**, the only ratio for now.

**Tablet and mobile:** stacked, in the order **intro → buttons → media** (designer, 2026-10-16).

**Details:**

- Media: radius 24. **Only with a CTA**, the media sits in a wrapper with the paragraph-media padding (desktop pt 60 / pb 40, tablet py 32, mobile py 24). Without a CTA there is no wrapper.
- Buttons: same as B2 (primary + secondary, pt 24 / 24 / 32, stacked on mobile).
- The Split layout intro variant drops the top and description spacers on desktop and uses a 40 H2→H3 spacer. On tablet and mobile it matches Universal. Both are intentional ([A1](#a1-intro-every-block)).
- Canvas note: _"Any component that can fit into a split layout"_, and _"the sub-component will use top and bottom padding just like in the paragraph block"_.
- Figma still differs on columns, image ratio and mobile pb ([E-Q20](#still-open)).

#### B6. Quote ([`5466:66281`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5466-66281)) and Blockquote ([`5467:66429`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5467-66429))

Whether Quote is restyled to this drawing or stays as built is open ([E-Q21](#still-open)).

**Shared "blog quote" component:**

- A 2px raspberry rule (#d3295b) on each side.
- Rule ↔ text gap 12 / 16 / 24.
- Text 18/28, 18/28, 20/30, colour `neutral-75` (#595959).
- No margin.

**Quote only:** an author row above the text, then a 24 gap:

- avatar 40, round
- gap 8
- name 14/22 in `neutral-100`
- 24px link icon

**Blockquote:** an existing component. It keeps its current rendering, `source` included (D8), and follows the same padding rules as Quote. Figma draws it without attribution.

Block pb is 24 / 32 / 40 for both (fixed by design).

#### B7. Profile Grid ([`5464:65604`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5464-65604))

**The grid and card layout stay as built today** (D9). Only the Universal intro and the block spacing change. The canvas drew a deprecated intro above the grid; it is now Universal. The mobile frame still uses the tablet intro ([E-Q18](#still-open)).

#### B8. PDF embed ([`5468:66900`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5468-66900))

- There is no design for the PDF embed. The Figma frame is a placeholder that shows the block (designer, 2026-10-16).
- Build it without design, using what is standard: **both the frame and its content are responsive**.
- Universal intro and block spacing as usual.

#### B9. FAQ ([`5474:71806`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5474-71806))

- **The FAQ component stays as built** (D9): open and closed states, items and content are unchanged. The Figma frame uses the existing component as a placeholder.
- Only the Universal intro and the block spacing change.

#### B10. Number tiles ([`5471:67951`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5471-67951))

- **The tiles stay as built** (D9), on every device. The frame only shows how the block wraps them.
- Only the Universal intro and the block spacing change. Block pb 24 / 32 / 40.

#### B11. Card Grid ([`5474:68122`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5474-68122))

**Grid:**

|         | Mobile | Tablet | Desktop |
| ------- | ------ | ------ | ------- |
| Columns | 1      | 2      | 3       |
| Gap     | 16     | 24     | 32      |

**Card:** only the "Grant card" is drawn. It is an Info card with no image and no CTA:

- background `ice-indigo-100` #eaecfe
- radius 24
- padding 24, and a 24 gap between title and body
- title H3, black
- body H5, `neutral-100`

The Title, Resource and Navigation card variants are not drawn, so keep their current styling.

The block uses the Universal intro. Whether the drawn Grant card styling is a restyle or the existing card, and the remaining canvas issues, are open ([E-Q18](#still-open)).

#### B12. Logo carousel ([`5474:71790`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5474-71790))

- **The carousel stays as built** (D9). The desktop border-top drawn in Figma is not meant to be there; the existing component doesn't have it.
- The heading moves into the Universal intro.
- Block pb is **40 on every device**, on purpose (designer, 2026-10-16). With the core's own pb that leaves 80 below the ticker.

#### B13. Event card ([`5474:73345`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5474-73345))

- **The event card stays as built** (D9); the Figma frame is the existing component.
- Only the Universal intro and the block spacing change.

#### B14. CTA strip ([`5474:73965`](https://www.figma.com/design/Tjtpc6NlHguR9DUcemSVb5/ILF-New-Design?node-id=5474-73965))

- **The heading moves out of the strip, into the intro above it.**
- **Strip:**
  - background `pistachio-100` #b9e188
  - radius 24, centred column, gap 16
  - padding px 16 / py 24 (mobile), 32 (tablet), 40 (desktop)
- **Text:** one centred paragraph, **H5 type** (today H4), `neutral-100`.
- **Button:** primary + arrow; full width on mobile.
- **Motif:** the network graphic centred on the left edge, opacity 30%.

---

## Alternatives considered

- **Keep container-owned margins (`--space-section`) and add a heading to each block.** Rejected. Margins collapse, so the stacked spacers the design specifies (top spacer + H2 padding + H2→H3 spacer…) can't be expressed. The fake-intro rules in `rhythm.css` show how much special-casing that model already needs.
- **A standalone "Intro" block placed before any block.** This is the fake-intro pattern made official. Rejected: the intro and its content would be two blocks, so the editor can separate them, and the gap between them stays a rhythm problem instead of belonging to one block.
- **Per-block heading fields, each block rendering its own title.** This is the status quo (`title` on some blocks, `heading` on others). Rejected: it gives inconsistent markup and spacing, and no subheading or description.
- **One global rhythm rewrite for all prose, blog and profile included.** Rejected for now (D3). The paragraph spec is drawn for the Paragraph block only, and the narrow templates have their own type scale.
- **Migrate every block in one release.** Rejected (D4). Each block touches schema, serializer, sync handler, component and content, so a phased rollout with transitional rules keeps each change reviewable.

---

## Consequences

**Positive**

- One intro component, one data shape and one set of tokens for every block. Editors stop faking intros.
- Gaps are predictable and match the design: 72 / 96 / 120 from block to block, heading included.
- Blocks are self-contained, so a block renders the same in the MDX page and the Strapi preview.

**Negative / costs**

- Every block needs a schema change, serializer, sync handler, component change and a content migration. Legacy `title`/`heading` fields live alongside `intro` until each migration has run on staging and production.
- During the rollout, mixed pages depend on transitional CSS, and `SELF_SPACED_BLOCKS` must be kept in step with the components by hand. A few edge cases differ from the target. A fake-intro Paragraph before an intro block gives 128 on desktop, and an intro block with an empty intro sits 40 below a legacy one.
- The paragraph spec changes visible spacing on every rich-text page. For example, p → p becomes 48 on desktop, up from 32.
- Under the hero the gap becomes 0, and the first block supplies its own top. The templates' current gap below the hero or bare H1 (for example `mb-2xl tablet:mb-3xl` on the hero-less H1) has to go, or it stacks on that top.

---

## Open design items (2026-10-16)

### Resolved with design

- ~~Top spacer~~: 40 / 32 / 24, and the master is updated.
- ~~Paragraph block pb~~: 24 / 32 / 40.
- ~~H1 variant names~~: fixed.
- ~~List text #0d0d0d~~: intentional.
- ~~Agenda "Day N"~~: automatic, with the date editable.
- ~~E-Q1 Paragraph examples 4–5, tablet pb~~: fixed to 32.
- ~~E-Q2 Paragraph after media~~: "Image, table or list on top" stays (32 / 40 / 60), and media in a paragraph now has pb 0.
- ~~E-Q3 Paragraph examples 5–6, mobile~~: fixed to the Mobile variant.
- ~~E-Q4 Agenda tablet day heading~~: fixed, 22/32.
- ~~E-Q5 Number tiles~~: the tiles stay as built (D9).
- ~~E-Q7 Content under the hero~~: the gap is 0 and the first block supplies its own top ([A6](#a6-h1-hero-only-543261853)). Follow-up in E-Q19.
- ~~E-Q8 Mobile pb~~: Quote and Blockquote fixed to 24. Logo carousel's 40 on every device is on purpose. Split layout is still 32 (E-Q20).
- ~~E-Q9 Blockquote attribution~~: `source` stays; Blockquote is an existing component with Quote's padding rules (D8).
- ~~E-Q10 Profile Grid~~: the intro is Universal now and the grid rules stay as built (D9). Mobile intro still off (E-Q18).
- ~~E-Q11 Split layout~~: order is intro → buttons → media; media padding only with a CTA; 4:3 only; columns 60 / 40 with gap 60, flipped for FAQ accordions ([B5](#b5-split-layout-544163402-split-layout-intro)). Figma doesn't match yet (E-Q20).
- ~~E-Q12 PDF embed~~: no design; responsive frame and content.
- ~~E-Q13 FAQ~~, ~~E-Q14 Event card~~, ~~E-Q15 Logo carousel~~: existing components, unchanged (D9).
- ~~E-Q16 Split layout description spacer~~: intentional.

### Still open

1. **E-Q6 / E-Q18. Card Grid and Profile Grid frames.** Checked in Figma on 2026-10-16:
   - Both mobile frames still use the **Tablet** Universal intro (Card Grid instance `5477:74751`, Profile Grid `5465:65859`).
   - Card Grid's tablet and mobile frames are still 597 and 310 wide, not 1000 and 400. Profile Grid's desktop frame is 1420.
   - Card Grid: is the drawn Grant card (`ice-indigo-100`, padding 24) a restyle, or the existing card that stays as built (D9)?
2. **E-Q19. "H1 on top" paragraph variant.** Content under a hero or bare H1 starts with the "first" values, so when does the "H1 on top" paragraph padding (32 / 40 / 60) apply? If never, can it be removed?
3. **E-Q20. Split layout, Figma vs the agreed rules:**
   - The desktop columns are `1fr 0.75fr` (about 57 / 43%), not 60 / 40, and have no max-width.
   - No image is 4:3. They are fixed heights with `object-cover`, e.g. 591×398 on desktop.
   - Mobile block pb is 32, while every other block uses 24.
   - The FAQ-accordions variant (40 / 60) is not drawn.
   - Every CTA image wrapper has a 1px black border, which looks like an annotation leftover.
4. **E-Q21. Quote.** Is the drawn "blog quote" (2px raspberry rules, author row with a 40 avatar) a restyle of the existing Quote component, or does Quote stay as built like Blockquote (D9)?
5. **E-Q22. Paragraph table on mobile.** The table is clipped in its 400 container. The site makes it scroll horizontally (`wrapScrollableTables`). Please confirm scroll is the intent.
6. **E-Q17. Canvas details (no action):**
   - Spacer layers are named "Spacer between H1 & H2" but sit between H2 and H3.
   - Some spacers have opacity equal to their height (60%, 48%).
   - Several layers are named `his`.
   - Paragraph block: the mobile row label still reads "padding 32" (blocks measure 24).
   - Paragraph block: list containers are named "Table container", and the list sub-components are 993 and 581 wide.
   - Paragraph block: the mobile table text uses Desktop style names at mobile sizes, and its last row has a stray `#fcc` border.
   - Paragraph block: the desktop image is 1431 wide, and tablet example 4 reads "H2 H eading".
