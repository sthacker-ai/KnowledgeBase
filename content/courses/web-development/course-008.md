---
title: "Building Interactive Animated 3D Websites with AI: Using Claude Fable 5 and Prompt‑Driven Development  "
source_id: "2076603705323892815"
source_type: "x_video"
topic_slug: web-development
topic_label: "Web Development"
source_handle: "@mikenevermiss"
tweet_url: "https://x.com/mikenevermiss/status/2076603705323892815"
has_transcript: true
generated_at: "2026-07-17T06:33:03.749Z"
---
# Building Interactive Animated 3D Websites with AI: Using Claude Fable 5 and Prompt‑Driven Development  

## Overview  
This course teaches how to create fully interactive, animated websites—complete with hero‑video scroll effects, product grids, and expanding video reveals—without touching traditional design tools like Figma, Framer, or Webflow. By leveraging AI models (Claude, GPT Image 2, Cdens2/Higgsville) and the Fable 5 framework, you can generate images, videos, fonts, and layout code from natural‑language prompts. The workflow demonstrated in the source video shows a complete end‑to‑end process that produces a polished, responsive landing page in minutes, proving that sophisticated web design is now accessible to anyone who can write clear prompts.  

## Background & Context  
The rise of large language models and multimodal AI has shifted web development from manual pixel‑pushing to prompt‑driven asset generation. Traditionally, building a site with animated hero sections, synchronized video scrubbing, and responsive grids required expertise in design software, CSS animation libraries, and JavaScript frameworks. The presenter, @mikenevermiss, demonstrates that by using a single AI chat session (Claude) together with specialized image‑to‑video tools (Cdens2/Higgsville) and a prompt repository (motionsize.ai), the same result can be achieved purely through conversation. This approach eliminates licensing costs for design tools, reduces iteration time, and opens the field to developers who may lack formal design training. The techniques shown are applicable to any modern AI model (Gemini, GPT‑4, Claude 3, etc.), making the method broadly portable.  

## Core Concepts  

### AI‑Generated Visual Assets  
The foundation of the workflow is creating custom images and videos solely from textual prompts. First, a reference screenshot of an existing Fable 5‑built site is captured. This image is fed into GPT Image 2 (or any comparable image model) with a prompt such as “create me an image like this first person in 8k but instead of girl make it a man.” The model outputs a high‑resolution, royalty‑free illustration that matches the composition but swaps the subject. To prepare the asset for animation, all UI overlays (text, icons, buttons) are stripped via a second prompt: “create me an image like this but without any text… remove all of the icons, text, buttons, etc.” The resulting clean background serves as the base for video generation.  

### Prompt‑Based Website Construction with Claude & Fable 5  
Claude, accessed via its web interface or desktop app, acts as a coding partner. By opening a new session and creating a folder (e.g., `3D website`), the developer issues natural‑language commands that Claude translates into HTML, CSS, and JavaScript. The Fable 5 library—referenced by selecting it in the Claude session—provides pre‑built components for scroll‑driven animations, video scrubbing, and responsive grids. Because the AI retains context, subsequent prompts can refine earlier output (e.g., changing fonts, adjusting section heights) without rewriting code from scratch.  

### Video Scroll‑Scrub Effect (500vh Hero Section)  
The hero section is given a height of `500vh` (five times the viewport height) to create a long scrollable area. As the user scrolls, the background video is synchronized to the scroll position, producing a “scrubbing” effect where the video plays forward or backward in lockstep with the scroll offset. This is achieved by linking the video’s `currentTime` property to `window.scrollY` scaled to the video’s duration. The technique ensures smooth playback across browsers because the video is pre‑loaded and the scroll‑driven update is lightweight.  

### Horizontal Product Grid  
Below the hero, a full‑viewport‑height (`100vh`) section displays a responsive grid of product cards. Each card occupies roughly one‑third of the width (`33vh` per column) with a small gap. Inside each card: an image (~280 px wide, centered), a product name (≈18 px font), and a price (≈16 px font). The grid is defined via CSS Flexbox or Grid, and the AI populates it with data supplied in a simple list (name, price, image URL) pasted into the Claude chat.  

### Dynamic Video Reveal (Expanding Center Video)  
After the product grid, a second video expands from the center to fill the width of the screen, revealing a scrubbed video underneath. The effect is built in two stages: first, a div block starts at zero width and animates to `100vw` (full width) using a CSS transition or JavaScript‑driven animation; second, the video element, initially hidden with `opacity:0` or `transform:scale(0)`, becomes visible and synchronized to the same scroll‑based scrub logic as the hero video. The prompt to Claude specifies: “after the horizontal scroll completes add a centered kind of div block and expand it like in sync to the left and the right side from zero width to a hundred width and then reveal a scrubbed video underneath.”  

### Font Customization and Responsiveness  
Typography is adjusted via a direct prompt to Claude: “please change the fonts on our hero section to be Helvetica Nua (or whichever font you prefer).” Because the AI edits the generated CSS, the change propagates globally. The resulting site is tested on mobile devices; the hero video, product grid, and expanding video all retain layout integrity and performance, confirming that the AI‑generated CSS includes appropriate media queries or flexible units (`vh`, `vw`, `%`).  

### Asset Integration Workflow  
The end‑to‑end pipeline is:  
1. Capture reference screenshot.  
2. Generate subject‑specific image via AI image model.  
3. Remove UI overlays via second image prompt.  
4. Animate the still image to match reference motion using Cdens2/Higgsville (image‑to‑video).  
5. Feed the final video link into Claude to build the website.  
6. Iteratively refine layout, fonts, and interactions through additional prompts.  
7. Test across devices and publish.  

Each step is repeatable, allowing the creator to produce dozens of sites (the presenter claims >300 AI‑built websites) with consistent quality.  

## How It Works / Step‑by‑Step  

**Step 1 – Gather Reference**  
- Open the target Fable 5 site in a browser.  
- Take a full‑width screenshot (e.g., using OS screenshot tool).  

**Step 2 – Generate Base Image**  
- Open GPT Image 2 (or comparable model).  
- Paste the screenshot.  
- Prompt: “create me an image like this first person in 8k but instead of girl make it a man.”  
- Click **Generate** and download the output.  

**Step 3 – Strip UI Elements**  
- Upload the generated image back to the model.  
- Prompt: “create me an image like this but without any text… remove all of the icons, text, buttons, etc.”  
- Download the clean background.  

**Step 4 – Animate to Match Reference Motion**  
- Open Cdens2/Higgsville (image‑to‑video tool).  
- Upload the clean background as the first frame.  
- Upload the original reference video (or its first frame) as motion reference.  
- Prompt: “animate the image the same way as the video attached; the motion should be the same.”  
- Set duration to match source video (e.g., 5 seconds).  
- Click **Generate** and download the resulting video clip.  

**Step 5 – Initialize Claude Project**  
- Go to Claude.ai, start a new session.  
- Click the code icon → **Create a new session**.  
- Create a folder named `3D website` and drag it into the workspace.  

**Step 6 – Build Hero Section**  
- Prompt Claude: “build me a hero section. It should be 500vh for allowing video to scrub while you scroll.”  
- Claude returns a starter HTML/CSS skeleton with a `<section style="height:500vh;">`.  

**Step 7 – Insert Hero Video**  
- Prompt: “add the video we just generated as the background of this hero section, make it play in sync with scroll.”  
- Claude inserts a `<video>` element, sets `position:fixed; top:0; left:0; width:100%; height:100%; object-fit:cover;` and adds JavaScript:  

```javascript
const video = document.querySelector('#hero-video');
window.addEventListener('scroll', () => {
  const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  video.currentTime = video.duration * scrollPercent;
});
```  

**Step 8 – Refine Typography**  
- Prompt: “change the fonts on our hero section to be Helvetica Nua.”  
- Claude updates the CSS: `font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;`  

**serif;` (note: the presenter’s pronunciation “Helvetica Nua” maps to Helvetica Neue).  

**Step 9 – Add Product Grid Section**  
- Prompt: “under hero section create a full viewport height section 100vh with grids of products… width of 33 bh so it kind of allows three grids in a row… gap… image 280px centered… product name 18px… price 16px.”  
- Claude outputs a `<section style="height:100vh; display:flex; gap:1rem;">` containing three `<div class="card">` elements, each with an `<img>`, `<h2>`, and `<p>`.  

**Step 10 – Populate Grid with Data**  
- Paste a list of products (name, price, image URL) into the chat.  
- Prompt: “use this data to fill the product cards.”  
- Claude maps each item to the corresponding card, generating markup like:  

```html
<div class="card">
  <img src="https://example.com/product1.jpg" alt="Product 1">
  <h2>Product Name</h2>
  <p>$49.99</p>
</div>
```  

**Step 11 – Create Second Expanding Video**  
- Prompt: “after the horizontal scroll completes add a centered kind of div block and expand it like in sync to the left and the right side from zero width to a hundred width and then reveal a scrubbed video underneath this video uses the same video seeking guard as the previous video for smooth playback.”  
- Claude adds a wrapper `<div id="expand-wrapper">` with an inner `<div id="expand-bar">` and a `<video id="expand-video">`.  
- CSS/JS for expansion:  

```css
#expand-bar {
  width:0;
  height:100vh;
  background:rgba(0,0,0,0.5);
  transition:width 1s ease;
}
#expand-bar.expanded { width:100vw; }
```  

```javascript
const bar = document.querySelector('#expand-bar');
const expandVideo = document.querySelector('#expand-video');
window.addEventListener('scroll', () => {
  const trigger = document.querySelector('.product-section').getBoundingClientRect().bottom;
  if (window.innerHeight > trigger) {
    bar.classList.add('expanded');
    // sync video to scroll as before
    const scrollPercent = (window.scrollY - trigger) / (window.innerHeight);
    expandVideo.currentTime = expandVideo.duration * scrollPercent;
  }
});
```  

**Step 12 – Test Responsiveness**  
- Prompt: “preview how the animation works here… also works on mobile.”  
- Claude may add meta viewport tag and adjust font sizes via `clamp()` or media queries.  

**Step 13 – Export and Deploy**  
- Copy the generated HTML/CSS/JS from the Claude session into a local folder.  
- Host on any static provider (Netlify, Vercel, GitHub Pages).  

## Real-World Examples & Use Cases  

- **Product Launch Landing Page** – The exact example shown in the video: a hero with a scrolling model video, a horizontal grid of three featured products, and an expanding central video that reveals a demo clip. This pattern drives high engagement for tech gadgets, fashion drops, or SaaS feature announcements.  
- **Portfolio Showcase** – Replace the product grid with project thumbnails; the hero video could be a looping showreel; the expanding video could play a case‑study walkthrough.  
- **E‑commerce Category Page** – Use the grid for product listings, the hero video for a brand story, and the expanding video for a 360° product view.  
- **Event Promotion** – Hero video displays a teaser trailer, grid shows speaker cards or session times, expanding video reveals the full trailer or venue tour.  
- **Educational Course Landing** – Hero video shows an instructor intro, grid lists lesson modules, expanding video plays a sample lecture.  

In each case, the same prompt‑driven workflow eliminates the need for manual timeline‑based animation tools; the AI handles the heavy lifting of layout, synchronization, and responsive adjustments.  

## Key Insights & Takeaways  

- Use a reference screenshot to guide AI image generation, ensuring visual consistency with your desired aesthetic.  
- Strip all UI overlays from generated images before animation to avoid baking unwanted text or buttons into the motion clip.  
- Match the duration of the AI‑generated video to the reference video (e.g., 5 seconds) to preserve the exact motion timing.  
- Set hero section height to a multiple of `vh` (e.g., `500vh`) to create sufficient scroll distance for smooth video scrubbing.  
- Synchronize video playback to scroll by linking `video.currentTime` to scroll percentage; this yields lag‑free scrubbing across browsers.  
- Leverage Fable 5’s built‑in scroll‑driven animation primitives via Claude to avoid writing complex interpolation logic from scratch.  
- Adjust typography through direct AI prompts; the AI updates the CSS globally, ensuring consistent font usage.  
- Build product grids with flexible units (`vh`, `%`, `fr`) so they automatically adapt to any screen size.  
- Create expanding reveals by animating a wrapper’s width from `0` to `100vw` and simultaneously revealing a second scrubbed video.  
- Test the final output on both desktop and mobile; the AI‑generated media queries or fluid units should preserve layout and performance.  
- Store successful prompts in a repository (e.g., motionsize.ai) for reuse; a single prompt can regenerate an entire site with identical results.  
- The entire process is tool‑agnostic: any capable multimodal AI (Claude, Gemini, GPT‑4) paired with an image‑to‑video service yields the same outcome.  

## Common Pitfalls / What to Watch Out For  

- **Mismatched Video Durations** – If the AI‑generated video is shorter or longer than the reference, the scroll‑scrub will feel rushed or sluggish; always enforce the same duration in the prompt.  
- **Forgotten UI Removal** – Leaving text or icons in the base image will cause them to appear in the animated video, cluttering the visual. Always run the “remove all text, icons, buttons” prompt.  
- **Incorrect Height Units** – Using `px` or `em` for the hero section instead of `vh` breaks the scroll‑scrub effect on different viewport sizes. Stick to viewport‑relative units.  
- **Font Fallback Issues** – Specifying an obscure font without a fallback can cause invisible text on devices lacking that font; include web‑safe fallbacks (e.g., `Helvetica Neue, Arial, sans-serif`).  
- **Overlooking Mobile Touch Scroll** – Some browsers treat touch scroll differently; test that the `scroll` event fires consistently or use a passive event listener with `{passive:true}`.  
- **Excessive Video File Size** – High‑resolution 8k images can produce large video files, harming load time; compress the final video (e.g., using H.264 CRF 18) before integrating.  
- **CSS Specificity Conflicts** – Manual edits to the AI‑generated CSS may be overridden by later AI prompts; either lock the CSS via a comment or re‑apply changes after each AI iteration.  
- **Assuming AI Knows Intent** – Vague prompts like “make it look better” lead to unpredictable results; be explicit about measurements, durations, and styling.  
- **Neglecting Accessibility** – Auto‑generated media may lack `alt` text or captions; add these manually after generation to meet WCAG standards.  
- **Ignoring Performance Budget** – Multiple full‑background videos can strain low‑end devices; consider lazy‑loading or providing a static fallback for users with reduced motion preferences.  

## Review Questions  

1. **Explain why setting the hero section’s height to `500vh` is essential for the video scroll‑scrub effect, and describe what would happen if you used a fixed pixel height instead.**  
2. **Detail the sequence of prompts you would give to Claude to transform a basic hero section into a fully functional scroll‑synchronized video background, including the exact JavaScript logic you would expect the AI to generate.**  
3. **Suppose you want to replace the horizontal product grid with a vertical carousel that shows one product at a time with swipe gestures. Outline the modifications you would make to the AI‑generated HTML/CSS/JS, and specify which additional prompt(s) you would give to Claude to achieve this behavior.**  

## Further Learning  

- **CSS Scroll‑Driven Animations** – Explore the new `scroll-timeline` and `animation-timeline` properties to achieve scroll‑linked effects without JavaScript.  
- **Three.js for True 3D** – Learn how to integrate WebGL‑based 3D models into AI‑generated pages for richer interactive experiences.  
- **Advanced Prompt Engineering** – Study techniques for chaining prompts, using temperature and token limits, and refining outputs via iterative feedback loops.  
- **Fable 5 Documentation** – Dive deeper into the library’s built‑in components for parallax, scroll‑based triggers, and responsive layouts to extend beyond the examples shown.  
- **Performance Optimization for Media** – Investigate modern video codecs (AV1, VP9), adaptive streaming, and the `preload` attribute to keep AI‑generated sites fast on all devices.  
- **Cross‑Model Prompt Portability** – Experiment with transferring the same prompts to Gemini, GPT‑4 Turbo, or open‑source models to validate consistency and discover model‑specific quirks.  

By mastering the concepts, workflow, and best practices outlined above, you will be able to produce sophisticated, animated websites entirely through AI‑driven prompting—opening a new frontier in rapid, accessible web development.
