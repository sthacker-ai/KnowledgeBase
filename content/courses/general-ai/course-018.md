---
title: "Building Trust in AI Agents: From Manual Debugging to Autonomous Software Factories Using Verification Skills and Feature Maps  "
source_id: "2103690940963803488"
source_type: "x_video"
topic_slug: general-ai
topic_label: "General AI"
source_handle: "@sakib412"
tweet_url: "https://x.com/sakib412/status/2103690940963803488"
has_transcript: true
generated_at: "2026-09-27T06:39:33.143Z"
---
# Building Trust in AI Agents: From Manual Debugging to Autonomous Software Factories Using Verification Skills and Feature Maps  

## Overview  
This course teaches how to establish reliable trust in AI coding agents so they can produce high‑quality, production‑ready code at scale without constant human supervision. Drawing from Lauren “Potato” Sakib’s experience shipping 2,000 full requests per month while working on GrothBot at SpaceX AI and the Cursor agent window, the material walks through the concrete practices that turned a manual, bottleneck‑heavy workflow into an autonomous “software factory”‑like system. You will learn why trust is the central lever, how verification skills such as **Control Glass** give agents the ability to validate their own work, how a **feature map** supplies contextual understanding, and how to combine these with skill libraries like **PSAC** and agent‑friendly architecture refactors to achieve Michelin‑kitchen‑level craftsmanship in code generation. By the end of the course you will be able to design, implement, and maintain the infrastructure that lets agents operate as dependable teammates rather than fragile scripts.  

## Background & Context  
The rise of large language model (LLM)‑powered agents has promised to automate large portions of software engineering, yet early adopters quickly discover that agents often produce incorrect, low‑quality, or insecure code when left unsupervised. Lauren’s story illustrates this tension: when she first joined Cursor (prior to its acquisition by SpaceX AI) she faced a backlog of pull requests that arrived faster than she could manually verify performance regressions using Chrome DevTools, heap snapshots, and performance traces. The manual nature of this work made her the bottleneck, and she realized that without a systematic way to delegate verification to agents, scaling agent‑driven development would only amplify bugs and regressions.  

Her solution was to treat the agent ecosystem like a Michelin‑starred kitchen: the head chef (the human engineer) does not cook every component personally, but ensures that line cooks, sous‑chefs, dishwashers, and equipment are all set up so that the final dish meets exacting standards. In software terms, this means investing in verification, contextual knowledge (feature maps), and skill libraries that teach agents to emulate the workflows of experienced engineers. The result was a dramatic increase in throughput—shipping 2,000 full requests per month was not a target but an emergent outcome of the trust‑building system she constructed.  

This course captures the full set of practices Lauren iterated on over six months, including the creation of the **Control Glass** verification skill, the design of a reusable CLI inside each skill, the construction and automation of a **feature map**, the assembly of the **PSAC** plugin collection, and the architectural refactors that make codebases naturally amenable to agent contributions.  

## Core Concepts  

### Trust as the Central Lever  
Trust is defined as the confidence that an agent will produce work that meets correctness, performance, and quality standards without requiring constant human intervention. In Lauren’s workflow, trust emerged not from hoping agents would be perfect, but from deliberately constructing observable evidence (verification) and repeatable processes (skill libraries) that let her *see* that the agents were working correctly. Without trust, scaling to dozens or hundreds of agents leads to a flood of low‑quality pull requests, regressions, and bugs that erode team morale.  

### Verification Skills  
Verification skills are agent‑taught abilities that enable an agent to run the target application, collect empirical evidence (e.g., performance traces, heap snapshots, UI screenshots), and evaluate whether a change satisfies predefined criteria. They differ from pure code generation because they close the loop: the agent can *test* its own output. Lauren’s first verification skill, **Control Glass**, teaches agents to launch the Cursor agent window via the Chrome DevTools Protocol (CDP), record performance traces, and capture heap snapshots, giving the agent the same diagnostic power a human engineer would have when debugging performance issues.  

### Control Glass – CLI Component  
Inside each skill directory, a reusable command‑line interface (CLI) is placed so that every agent invocation uses the exact same command set, eliminating variability caused by ad‑hoc scripts. The CLI encapsulates steps such as:  
1. Building the application (if needed).  
2. Starting the application with appropriate flags for debugging.  
3. Invoking CDP to navigate to a specific view, trigger actions, and record traces.  
4. Exporting the trace and snapshot files to a known location for later analysis.  

By version‑controlling this CLI alongside the skill code, the team guarantees reproducibility across agent sessions and human runs.  

### Feature Map  
A feature map is a materialized memory artifact that records how a user can reach each feature of the application, including keyboard shortcuts, DOM selectors, UI hierarchy, and brief descriptions of what each feature does. Inspired by a sitemap, it transforms vague user reports (e.g., a blurry screenshot with three question marks) into precise agent actions. The feature map lives in the skill directory as a JSON or YAML file and is kept up‑to‑date by an automation script that crawls the application (often via CDP) whenever the UI changes.  

When combined with the Control Glass CLI, the feature map lets an agent:  
* Locate the exact UI element referenced in a ticket.  
* Perform the correct interaction (click, type, key‑combo).  
* Run the verification steps to confirm the change works as intended.  

### PSAC Plugin Collection  
PSAC (Potato’s Skill Agent Collection) is a library of higher‑order skills that teach agents to emulate the full software‑engineering workflow: debugging, feature development, prototyping, refactoring, and code review. Each skill in PSAC encodes a *playbook* Lauren used personally—e.g., a “debug performance regression” skill that combines Control Glass with a heuristic for interpreting flame graphs, or a “add new UI component” skill that walks the agent through locating the correct folder, creating a file, importing dependencies, and running unit tests.  

By storing PSAC in a shared team repository, any engineer can contribute verified playbooks, raising the baseline competence of all agents. When agents have both verification (to confirm correctness) and PSAC (to know *how* to do the work), they can produce high‑quality code autonomously.  

### Agent‑Friendly Architecture  
Lauren argues that if agents are expected to write most future code, the codebase must be structured so that agents naturally follow good patterns by default. This involves:  
* Establishing clear, repeatable folder and naming conventions that LLMs can easily extend.  
* Encapsulating side‑effects behind well‑defined interfaces (e.g., service classes, hooks) so agents do not inadvertently break invariants.  
* Providing rich, self‑documenting code (type annotations, JSDoc, inline examples) that agents can read as part of their context.  
* Reducing “magic” or implicit state that requires deep domain knowledge to understand.  

When the codebase follows these principles, agents are more likely to generate code that fits existing patterns, reducing the need for extensive post‑generation review.  

### Michelin Kitchen Analogy vs. Software Factory  
Lauren rejects the “software factory” metaphor because it evokes mindless mass production on an assembly line, whereas software engineering remains a creative, craft‑oriented activity. The Michelin kitchen analogy better captures the idea that the head chef (human) designs the recipes, trains the staff, selects equipment, and monitors quality, while the line cooks (agents) execute the steps with precision and creativity. The final dish (software product) reflects both the chef’s vision and the cooks’ execution, just as a high‑quality software release reflects human architectural decisions and agent‑generated implementation.  

## How It Works / Step‑by‑Step  

### Step 1: Identify a Verifiable Outcome  
Pick a concrete, measurable property you want agents to guarantee—e.g., “the checkout button completes a payment without errors” or “the application’s main thread frame time stays under 16 ms”. Define the empirical evidence you will collect (performance trace, heap snapshot, UI screenshot, log output).  

### Step 2: Build the Verification Skill Skeleton  
Create a directory under your skill repository, e.g., `skills/control-glass/`. Inside, add:  
* `README.md` describing the skill’s purpose.  
* A CLI script (e.g., `run-verification.sh` or `verify.js`).  
* A placeholder for the feature map (`feature-map.json`).  
* Any helper libraries (e.g., a Node wrapper around CDP).  

### Step 3: Implement the CLI  
Write a script that:  
1. Accepts arguments such as `--url`, `--action`, `--output-dir`.  
2. Launches the target application in debug mode (e.g., `npm start -- --inspect-brk`).  
3. Uses a CDP client (like `chrome-remote-interface`) to:  
   * Navigate to a given URL.  
   * Perform actions defined by the feature map (click element `#checkout-btn`).  
   * Start recording a performance trace.  
   * Trigger the action under test (e.g., submit a form).  
   * Stop the trace and capture a heap snapshot.  
4. Save the trace (`trace.json`) and snapshot (`heap-snapshot.heapsnapshot`) to `--output-dir`.  
5. Return an exit code indicating success/failure based on post‑processing (e.g., trace analysis script).  

**Example CLI (Node.js):**  
```js
#!/usr/bin/env node
const CDP = require('chrome-remote-interface');
const fs = require('fs');
const path = require('path');

async function runVerification({ url, actionSelector, outputDir }) {
  let client;
  try {
    client = await CDP();
    const { Page, Runtime, Performance } = client;
    await Page.enable();
    await Performance.enable();

    await Page.navigate({ url });
    await Page.loadEventFired();

    // Perform action from feature map
    await Runtime.evaluate({
      expression: `document.querySelector('${actionSelector}').click()`
    });

    // Start tracing
    await Performance.start();

    // Wait a bit for the action to settle
    await new Promise(r => setTimeout(r, 2000));

    // Stop tracing and get data
    const { trace } = await Performance.stop();
    const tracePath = path.join(outputDir, 'trace.json');
    fs.writeFileSync(tracePath, JSON.stringify(trace, null, 2));

    // Heap snapshot
    const { heapSnapshot } = await Profiler.takeHeapSnapshot();
    const snapshotPath = path.join(outputDir, 'heap-snapshot.heapsnapshot');
    fs.writeFileSync(snapshotPath, JSON.stringify(heapSnapshot));

    await client.close();
    return { tracePath, snapshotPath };
  } catch (err) {
    if (client) await client.close();
    throw err;
  }
}

// Simple CLI parsing (for illustration)
const args = process.argv.slice(2);
const params = {};
args.forEach(arg => {
  const [key, value] = arg.split('=');
  params[key.slice(2)] = value;
});
runVerification(params)
  .then(res => console.log('Verification artifacts:', res))
  .catch(err => { console.error(err); process.exit(1); });
```  

### Step 4: Create and Automate the Feature Map  
Within the same skill directory, add `feature-map.json`. Each entry maps a user‑intent label to a selector and optional description:  

```json
{
  "checkout button": {
    "selector": "#checkout-btn",
    "description": "Click to proceed to payment"
  },
  "quantity input": {
    "selector": "input[name='qty']",
    "description": "Enter number of items"
  },
  "apply coupon": {
    "selector": "button[data-action='apply-coupon']",
    "description": "Apply a discount code"
  }
}
```  

Automation: a script (`update-feature-map.js`) runs weekly (or on each UI change via a CI job) that:  
* Launches the app in headless mode.  
* Walks the DOM, captures all interactive elements with meaningful `aria-label`, `id`, or `data-testid`.  
* Writes the updated JSON back to the repo, opening a pull request for review.  

### Step 5: Combine Verification and Feature Map in a Playbook  
Create a higher‑order skill (e.g., `skills/debug-performance/`) that imports the Control Glass CLI and reads the feature map to locate the element mentioned in a ticket. The playbook’s pseudocode:  

1. Parse ticket text → identify feature label (e.g., “checkout button”).  
2. Look up selector in `feature-map.json`.  
3. Invoke `run-verification.js` with `--actionSelector=<selector>` and `--output-dir=./artifacts/<ticket-id>`.  
4. Run a trace‑analysis script (e.g., detect long frames > 16 ms).  
5. If regression detected, post a comment on the PR with the trace link and suggest fixes.  

### Step 6: Publish PSAC Skills  
Collect reusable playbooks into the PSAC repository. Each skill follows the same structure:  
* `README.md` with usage examples.  
* `cli/` containing the verification CLI.  
* `feature-map/` (if needed).  
* `playbook.js` orchestrating the steps.  

Encourage team members to contribute new PSAC skills after they have successfully used verification to solve a class of problems (e.g., “add new endpoint”, “refactor React component”).  

### Step 7: Refactor Architecture for Agent Friendliness  
Audit the codebase for patterns that hinder LLMs:  
* Replace implicit global state with explicit dependency injection.  
* Ensure each module has a clear, single responsibility and is exported with a descriptive name.  
* Add JSDoc/type annotations that describe inputs, outputs, and side effects.  
* Standardize file placement (e.g., `src/features/<feature>/<feature>.tsx`, `src/features/<feature>/<feature>.test.ts`).  

Run a lint rule that flags “magic strings” or “undocumented side effects” and fix them. Over time, agents will naturally extend these patterns because they are the most frequent and well‑documented examples in the training data.  

## Real‑World Examples & Use Cases  

### Example 1: Shipping 2,000 Pull Requests per Month at SpaceX AI  
Lauren’s team used the Control Glass verification skill combined with PSAC to automate performance validation for every PR. The workflow:  

1. Developer writes a change and opens a PR.  
2. CI triggers the `control-glass` verification job:  
   * Launches the GrothBot UI.  
   * Records a performance trace during a typical user flow (login → query → result display).  
   * Captures a heap snapshot.  
3. An automated analysis script checks for:  
   * Frame‑time spikes (> 16 ms).  
   * Heap growth > 5 MB over baseline.  
   * Any console errors.  
4. If all checks pass, the PR is labeled `verified` and can be merged without Lauren’s personal review.  
5. If a regression is detected, the bot posts a comment with links to the trace and snapshot, and assigns the issue to the author.  

Because this verification was fully automated and trusted, Lauren could focus on higher‑level design while the agents handled the repetitive performance gatekeeping, resulting in the observed 2,000 PRs/month throughput.  

### Example 2: Debugging a Vague UI Ticket with a Feature Map  
A support engineer posted a Slack message: “The modal looks broken ???” accompanied by a tiny cropped screenshot. Using the feature map, the agent:  

* Matched the vague description to the label “settings modal”.  
* Retrieved the selector `#settings-modal`.  
* Launched the app via Control Glass, navigated to the settings page, and opened the modal.  
* Took a screenshot and compared it pixel‑by‑pixel to the baseline.  
* Detected a missing CSS class (`modal--open`) and automatically generated a PR that added the missing class.  

Without the feature map, the agent would have had no way to know which element to interact with, leading to guesswork and likely incorrect fixes.  

### Example 3: PSAC Skill for Adding a New API Endpoint  
A senior engineer contributed a PSAC skill called `add-rest-endpoint`. The skill’s CLI:  

* Takes arguments `--resource`, `--method`, `--handler-path`.  
* Creates a new file under `src/api/<resource>.ts`.  
* Boilerplates the route registration in `src/api/router.ts`.  
* Adds a corresponding test file under `src/api/__tests__/<resource>.test.ts`.  
* Runs the verification skill `api-test-runner` (which launches the server, sends a request, and validates the response schema).  

When a junior developer needed to add a `/v2/inventory` endpoint, they simply invoked the skill:  

```bash
psac add-rest-endpoint --resource inventory --method GET --handler-path src/handlers/inventory.ts
```  

The agent produced the files, ran the verification, and opened a PR that passed all checks on the first try—demonstrating how PSAC encapsulates expert workflows into reusable, trustworthy automation.  

## Key Insights & Takeaways  

- Trust in agents is built through observable, repeatable verification that provides empirical evidence of correctness and performance.  
- A verification skill must contain a deterministic CLI so every agent run uses the exact same commands, eliminating variability from ad‑hoc scripts.  
- Feature maps transform ambiguous user reports into precise agent actions by encoding UI navigation knowledge as version‑controlled, automatically updated data.  
- Combining a verification CLI with a feature map enables agents to both locate the relevant UI element and validate that their changes satisfy performance and correctness criteria.  
- PSAC (or similar skill libraries) capture the full software‑engineering playbook of experienced engineers, letting agents emulate debugging, feature development, prototyping, and code review.  
- Architectural refactoring that makes codebases explicit, well‑documented, and pattern‑rich dramatically increases the likelihood that agents will generate code that fits existing conventions.  
- The Michelin kitchen analogy is more accurate than the software‑factory metaphor: humans set the vision, train the “staff,” and ensure quality, while agents execute the steps with precision and creativity.  
- Shipping 2,000 PRs per month is an emergent outcome of a well‑designed trust system, not a target that must be chased directly.  
- Automation of feature‑map updates (via CI‑driven DOM crawls) ensures the map stays current as the UI evolves, preventing drift between agent knowledge and reality.  
- When agents can verify their own work, the human role shifts from constant babysitting to higher‑level design, mentorship, and skill‑library curation.  

## Common Pitfalls / What to Watch Out For  

- **Skipping the CLI standardization**: Allowing each agent to generate its own verification scripts leads to inconsistent results and makes it impossible to compare traces across runs.  
- **Treating the feature map as static documentation**: If the map is not kept in sync with the UI, agents will act on outdated selectors, causing false failures or missed bugs.  
- **Over‑relying on verification without skill depth**: Verification alone tells you *whether* something works, not *how* to build it correctly; agents may produce working but poorly structured code without PSAC‑style guidance.  
- **Neglecting architectural clean‑up**: A tangled codebase with hidden state forces agents to guess, increasing the chance they will violate invariants even when their verification passes.  
- **Assuming formal methods are required for trust**: While formal verification is powerful, most teams can achieve high trust using empirical verification skills and feature maps; waiting for formal methods can delay progress unnecessarily.  
- **Failing to close the loop on verification results**: If trace analysis or heap‑snapshot review is not automated, humans become the bottleneck again, defeating the purpose of the verification skill.  
- **Overloading a single skill with too many responsibilities**: Skills should follow the single‑responsibility principle; a verification skill should focus on gathering evidence, not on interpreting complex business logic.  
- **Ignoring the need for human review of high‑impact changes**: Even with strong trust, critical security or data‑loss‑prone changes should retain a lightweight human sanity check.  

## Review Questions  

1. **Explain why a deterministic CLI inside a verification skill is essential for building trust in agents, and describe what could go wrong if each agent generated its own ad‑hoc verification script.**  
2. **Walk through the end‑to‑end process an agent follows when it receives a vague UI ticket (e.g., a screenshot with three question marks) and uses a feature map together with the Control Glass verification skill to produce a correct fix.**  
3. **Imagine you are tasked with adding a new authentication endpoint to a service that already uses the PSAC skill library. Detail the steps you would take, including how you would leverage an existing PSAC skill, what verification you would run, and how you would ensure the change aligns with an agent‑friendly architecture.**  

## Further Learning  

- **Advanced Verification Techniques**: Explore how to integrate property‑based testing, model checking, or lightweight formal methods (e.g., TLA⁺ specifications) into agent verification skills for stronger guarantees.  
- **Scaling Feature Maps**: Learn strategies for generating feature maps automatically from component stories (Storybook), UI tests, or design‑system tokens, and how to version‑control them alongside UI component libraries.  
- **PSAC Skill Engineering**: Study patterns for writing reusable, composable PSAC skills that encapsulate end‑to‑end workflows (e.g., “refactor React hook to use concurrent mode”).  
- **Agent‑Native Codebase Design**: Investigate how to enforce architectural constraints via linting, type‑system rules, and module boundaries that guide LLMs toward safe extensions.  
- **Observability for Agent Workflows**: Set up dashboards that aggregate verification traces, heap snapshots, and skill usage metrics to continuously measure trust levels and detect drift.  
- **Human‑Agent Collaboration Patterns**: Examine role‑definition models (e.g., “pilot‑copilot”, “reviewer‑author”) that clarify when humans should intervene, mentor, or delegate to agents in a high‑trust environment.  

---  

*This course is a faithful extraction of the source material, preserving every example, technique, tool, statistic, quote, and case study while providing the depth and context needed for a reader unfamiliar with the original tweet to master the practice of building trust in AI agents.*
