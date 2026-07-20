---
title: "Building Consistent UI with AI: A Design System Workflow Using Claude Design  "
source_id: "2069967490575192401"
source_type: "x_video"
topic_slug: ui-ux-design
topic_label: "UI/UX Design"
source_handle: "@Rasmic"
tweet_url: "https://x.com/Rasmic/status/2069967490575192401"
has_transcript: true
generated_at: "2026-07-08T06:52:25.311Z"
---
# Building Consistent UI with AI: A Design System Workflow Using Claude Design  

## Overview  
This course teaches a repeatable, AI‑augmented workflow for creating beautiful, consistent user interfaces by establishing a design system and leveraging design tokens. You will learn how to gather visual inspiration, generate a token‑based design system from a screenshot using Claude Design, refine the output with markup tools, and apply the system across different app screens to eliminate visual inconsistency. The workflow is illustrated through the creator’s Pluto app, showing how a lack of a design system leads to mismatched buttons, spacing, and rounding, and how implementing tokens solves those problems globally. By the end of the course you will be able to produce a maintainable design system that supports light/dark theming, component reuse, and rapid brand updates without manual hex‑code hunting.  

## Background & Context  
Modern UI/UX design suffers from “AI‑smell” when designs are generated entirely by models without human‑guided constraints: odd borders, inconsistent spacing, and a generic aesthetic that feels off to experienced eyes. The root cause is often the absence of a centralized source of truth for design decisions. A design system aggregates UI components, guidelines, and brand identity (colors, typography, spacing, etc.) into a single reference, while design tokens encode those decisions as named variables (e.g., `spacing-medium`, `color-brand-primary`). Tokens enable global theming: changing a token value propagates updates everywhere, making dark mode adoption or brand color shifts trivial. The speaker’s Pluto app demonstrated inconsistency because no design system or tokens were used—each screen (hero, dashboard, chat) had independently chosen padding, radius, and colors. Recognizing this gap, the workflow presented combines human curation (inspiration gathering) with AI‑assisted generation (Claude Design) to bootstrap a token‑driven system that can be iteratively refined.  

## Core Concepts  

### Design System  
A design system is a single source of truth that contains all UI components, design guidelines, and brand assets (colors, copy, iconography, etc.). It ensures that every screen in an application shares the same visual language, reducing drift and cognitive load for users. In the transcript, the speaker defines it as “a single source of truth for all things design” and notes that it contains UI components, design guidelines, and brand identity such as colors and copy. Without a design system, the Pluto app exhibited mismatched hero sections, dashboards, and chat screens, each with its own button styling and spacing.  

### Design Tokens  
Design tokens are named variables that store specific design decisions, replacing hard‑coded values like `16px` or `#3B82F6`. Examples from the video include `spacing-medium` for padding and `color-brand-primary` for a brand’s main hue. Tokens act like constants in code: updating the token’s value automatically updates every instance where it is referenced. The speaker cites Google’s explanation that global theming tokens make dark mode trivial—just change the underlying token and the update propagates everywhere. In Pluto, the lack of tokens meant that altering a button’s roundness required manually editing each button instance.  

### Inspiration Gathering  
Before constructing a system, designers collect visual references to inform style, component patterns, and interaction ideas. The speaker uses Twitter (following devs, AI enthusiasts, and designer accounts), Mobbin (a subscription library of real‑world UI patterns), and specific sites like family.co (a crypto‑wallet app noted for its cute, cartoony yet tasteful aesthetic). Inspiration is stored in an app called Gather OS, which aggregates Twitter bookmarks into a searchable library. This step provides a concrete visual foundation that the AI can later interpret and abstract into tokens.  

### Claw Design (Claude Design)  
Claw Design is an AI‑powered tool that generates a design system from a visual input (screenshot or mockup). The speaker highlights its recent release and heavy personal use. The workflow involves: uploading a screenshot of an inspirational page, prompting the model to “create a design system with the attached page, please do create components using the design system and display the tokens I want this displayed on one page,” and then reviewing the generated output. Claude Design produces a one‑page artifact that lists colors, typography, spacing, radius, and sample components (buttons, badges, avatars, inputs). It is not expected to copy the source pixel‑perfectly; rather, it offers a canvas that can be tweaked.  

### Token‑Based Theming & Global Updates  
When design tokens are defined, theme changes become a matter of altering token values rather than hunting through CSS files. The speaker demonstrates this by imagining a brand‑color change: instead of searching and replacing hex codes, you update the `color-brand-primary` token, and all components referencing it shift automatically. This principle also applies to dark mode: swapping a set of token values (background, text, accent) yields a cohesive dark theme without touching each component individually.  

### Markup‑Driven Refinement  
Because AI‑generated design systems may include unwanted artifacts (e.g., decorative confetti, logos, or misaligned text), Claude Design allows users to annotate the generated output with markup. The speaker shows how to draw over elements they wish to remove (confetti‑like dots, the logo) and issue a command such as “please remove this from the design system.” The AI then strips those elements from the system. Similarly, alignment issues can be flagged (“please fix the alignment of the text in this badge”) and the AI adjusts the layout accordingly. This human‑in‑the‑loop step ensures the system reflects the designer’s intent.  

### Component Generation from Tokens  
Once the token set and basic layout are established, the same AI tool can be prompted to produce additional UI components (dialogues, forms, cards, etc.) that strictly adhere to the defined tokens. The speaker notes that after the initial design system is generated, one can “ask it to continue to generate more components like, you know, a dialogue or a form, this, that, and the third.” This enables rapid expansion of a component library while guaranteeing visual consistency because every new component inherits the same spacing, radius, typography, and color tokens.  

## How It Works / Step‑by‑Step  

**Step 1 – Gather Inspiration**  
- Open Twitter and bookmark UI patterns that resonate (e.g., a landing page by a designer named Jack).  
- Use Mobbin to explore full‑screen examples (onboarding flows, hero sections, dashboards).  
- Save specific sites like family.co for their distinctive visual language (cute, cartoony, tasteful).  
- Store all bookmarks in Gather OS for easy retrieval.  

**Step 2 – Capture a Reference Screenshot**  
- Open the chosen inspiration page in Zen Browser (noted for its built‑in screenshot feature).  
- Take a full‑page screenshot of family.co and download the image.  

**Step 3 – Upload to Claude Design & Prompt**  
- Navigate to Claude Design, click “Start with the file,” and select the downloaded screenshot.  
- Enter the prompt:  
  ```  
  Please create a design system with the attached page.  
  Please do create components using the design system and display the tokens.  
  I want this displayed on one page.  
  ```  
- Click “Start Project” and wait for the AI to process.  

**Step 4 – Review the Generated Design System**  
- Examine the output: color palette (multiple shades of blue, black, sticker accents, semantic colors for success/warning/danger/info), typography (font choices, heading sizes H1‑H3, body text), spacing and radius values, and sample components (button, badge, avatar, input).  
- Note any artifacts that do not match the desired aesthetic (e.g., decorative confetti dots, unwanted logo).  

**Step 5 – Refine via Markup**  
- Activate the markup tool in Claude Design.  
- Draw over the confetti‑like dots and issue the command: “please remove this from the design system.”  
- Draw over the logo and issue: “remove this logo; I will have no logo.”  
- If text in a badge appears misaligned, draw over it and request: “please fix the alignment of the text in this badge.”  
- The AI updates the design system, removing or adjusting the flagged elements.  

**Step 6 – Generate Additional Components**  
- With the cleaned token set, prompt the AI to create more UI pieces:  
  ```  
  Please generate a dialogue component using the current design system.  
  Please generate a form component with fields, labels, and buttons.  
  ```  
- Review each generated component to confirm it respects the defined tokens (spacing, radius, colors).  

**Step 7 – Apply the Design System to Your App**  
- Use the tokens to style all UI elements in your codebase (CSS variables, SCSS maps, or a design‑token library).  
- Example CSS variable definitions derived from the system:  
  ```css  
  :root {  
    --color-brand-primary: #2563eb;  
    --color-success: #10b981;  
    --color-warning: #f59e0b;  
    --color-danger: #ef4444;  
    --spacing-medium: 1rem;  
    --radius-sm: 0.25rem;  
    --radius-md: 0.5rem;  
    --font-base: 'Inter', sans-serif;  
    --font-heading: 'League Spartan', sans-serif;  
  }  
  ```  
- Apply them uniformly: buttons use `--radius-md` and `--spacing-medium` for padding; avatars use `--radius-sm` for circular cropping; headings use `--font-heading`.  

**Step 8 – Implement Dark Mode via Token Swap**  
- Define a dark‑mode token set (e.g., `--color-brand-primary: #3b82f6;` for a lighter blue on dark background).  
- Activate the dark theme by adding a `.dark` class or media query that overrides the token values.  
- Because every component references the tokens, the entire UI shifts to dark mode without additional edits.  

**Step 9 – Iterate and Maintain**  
- When brand guidelines change, edit the token values (e.g., update `--color-brand-primary`).  
- Add new components by prompting Claude Design with the existing token set, guaranteeing consistency.  
- Periodically revisit the inspiration library (Gather OS, Twitter, Mobbin) to refresh the system with emerging patterns.  

## Real‑World Examples & Use Cases  

- **Pluto App Hero Section** – The speaker shows a hero section with a video thumbnail, hover‑triggered emoji explosion, and a “glass liquid metal” overlay on buttons. These details were made possible because the design system defined precise spacing, radius, and token‑based color transitions for hover states.  

- **Dashboard “New Agent” Button** – Initially inconsistent (small, rounded) compared to the hero button. After implementing the design system, the button inherited the `--radius-md` and `--spacing-medium` tokens, aligning its appearance with the hero’s call‑to‑action.  

- **Chat Screen Message Bubbles** – Originally more rounded than other UI elements. Using the design system’s `--radius-sm` token for avatars and `--radius-md` for message containers unified the visual language across chat, dashboard, and hero sections.  

- **Family.co Inspiration** – The crypto‑wallet site’s playful yet refined aesthetic (soft blues, rounded corners, subtle accent strips) was screenshotted, fed into Claude Design, and abstracted into a token set that captured the essence without copying the exact logo or decorative confetti.  

- **Vercel Design System as Baseline** – The speaker mentions that one can copy the design tokens from `vercel.com/design.md` (light theme) and adapt them for dark mode, providing a ready‑made starting point for teams that lack inspiration.  

- **Scrimba AI Engineer Path** – Though a sponsor mention, it illustrates how learning to build AI agents (which often need configurable UIs) benefits from a solid design system: agents can expose settings panels that inherit the same tokens, ensuring a cohesive look across the product.  

## Key Insights & Takeaways  

- A design system is the single source of truth for UI components, guidelines, and brand identity, preventing visual drift across screens.  
- Design tokens replace hard‑coded values with named variables, enabling global updates and effortless theming (light/dark, brand changes).  
- Inspiration should be actively gathered from platforms like Twitter, Mobbin, and specific sites (e.g., family.co) and stored in a searchable library (Gather OS).  
- Claude Design (Claw Design) can generate a token‑based design system from a screenshot, providing a rapid bootstrap that still requires human refinement.  
- Markup‑based editing in Claude Design lets designers remove unwanted artifacts (logos, decorative elements) and correct alignment issues without leaving the tool.  
- Component generation from the token set guarantees that new UI pieces (dialogues, forms, cards) inherit the same spacing, typography, and color decisions.  
- Dark mode implementation is as simple as swapping token values; no component‑level CSS changes are needed when tokens are used consistently.  
- Maintaining a design system reduces the manual effort of hunting down hex codes or pixel values when a brand updates its colors or rounding preferences.  
- The workflow combines human curation (inspiration, markup) with AI speed (token generation, component creation) to achieve both consistency and creativity.  

## Common Pitfalls / What to Watch Out For  

- **Skipping the Design System** – Designing screens in isolation leads to inconsistent buttons, spacing, and rounding, as seen in the Pluto app’s dashboard versus hero.  
- **Expecting Pixel‑Perfect AI Output** – AI cannot yet reproduce a screenshot one‑to‑one; treat the generated system as a starting point, not a final design.  
- **Neglecting Markup Refinement** – Leaving unwanted confetti, logos, or misaligned text in the system introduces noise that propagates to all components.  
- **Hard‑Coding Values After Token Creation** – Reverting to raw pixel values or hex codes undermines the benefit of tokens and creates future maintenance debt.  
- **Overlooking Token Scope** – Forgetting to define tokens for certain properties (e.g., focus states, disabled colors) results in ad‑hoc styling that breaks consistency.  
- **Assuming Dark Mode Is Just a Color Invert** – Proper dark mode requires thoughtful token adjustments for contrast, accent colors, and elevation; merely inverting colors can produce illegible UI.  
- **Relying Solely on AI for Component Logic** – AI can generate visual structure but may miss interaction details (keyboard navigation, ARIA labels); designers must review and augment accessibility.  
- **Not Updating the Inspiration Library** – Stale sources lead to outdated design patterns; regularly refresh your bookmarks and Mobbin collections.  

## Review Questions  

1. **Explain how design tokens facilitate global theming and why this is advantageous over manually editing CSS values for a brand‑color change.**  
2. **Describe the complete step‑by‑step process of creating a design system using Claude Design, from inspiration gathering to applying the system in code, and indicate where human intervention is required.**  
3. **Given a scenario where a product team wants to add a dark mode to an existing application that currently uses hard‑coded color values, outline the concrete actions they should take to migrate to a token‑based approach and implement the dark theme safely.**  

## Further Learning  

- Study the W3C Design Tokens Community Group specification to understand the canonical JSON structure for tokens and how it integrates with tools like Style Dictionary.  
- Explore Figma’s Variables feature to see how design tokens can be managed directly within a design‑tool environment and exported to code.  
- Investigate Storybook for developing and documenting component libraries that consume design tokens, ensuring visual regression testing.  
- Learn about Zeroheight or Notion‑based design‑system documentation platforms to maintain guidelines, usage rules, and token definitions in a single source of truth.  
- Examine advanced AI‑assisted design tools beyond Claude Design (e.g., Galileo AI, Uizard) to compare their strengths in generating UI from sketches or prompts.  
- Follow blogs and newsletters from design‑system practitioners (e.g., Nathan Curtis, Alla Kholmatova) to stay current on best practices for token naming, versioning, and governance.  
- Practice by taking a public UI kit (such as Tailwind UI or Ant Design) and extracting its token set, then rebuilding a simple dashboard using only those tokens to internalize the workflow.
