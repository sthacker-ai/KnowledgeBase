---
title: "Building AI Agents with Computer Use in Gemini 3.5 Flash  "
source_id: "2069818951513653618"
source_type: "x_linked_source"
topic_slug: ai-agents
topic_label: "AI Agents"
source_handle: "@GoogleAIStudio"
tweet_url: "https://x.com/GoogleAIStudio/status/2069818951513653618"
has_transcript: false
generated_at: "2026-07-11T10:54:38.755Z"
---
# Building AI Agents with Computer Use in Gemini 3.5 Flash  

## Overview  
This course teaches how to leverage the newly integrated computer‑use capability in Gemini 3.5 Flash to create AI agents that can perceive, reason, and act across browser, mobile, and desktop environments. You will learn why computer use is now a native tool in the Flash model, how it improves performance for long‑horizon and enterprise automation tasks, and what safety mechanisms Google has built to mitigate prompt‑injection risks. By the end of the course you will be able to set up a development environment, run the provided demo, and start building your own agents using the Gemini API and the Gemini Enterprise Agent Platform.  

## Background & Context  
Computer use—the ability for an AI model to control a graphical user interface, read screen content, and issue mouse/keyboard commands—has historically been offered only as a separate, specialized model (the Gemini 2.5 computer‑use model). Developers who wanted agents that could interact with real‑world software had to stitch together disparate components, often sacrificing latency, cost, or reliability. Google AI Studio recognized that the core strengths of Gemini 3.5 Flash—strong function calling, built‑in tools like Search and Maps grounding, and high throughput—could be combined with computer use to create a unified, production‑ready agent platform.  

The announcement on X (formerly Twitter) on June 24 2026 highlighted that computer use is now a built‑in tool in Gemini 3.5 Flash, delivering the best performance yet for agentic computer‑use tasks. The tweet garnered 85 likes, 282 replies, 2 K quote tweets, and 193.7 K views, indicating strong community interest. Early adopters such as Browserbase, Browser Use, and UiPath reported measurable gains in accuracy, cost‑efficiency, and scalability, confirming that the integrated approach solves the fragmentation problem while preserving the speed and price profile that makes Google’s Flash series attractive for large‑scale deployments.  

## Core Concepts  

### Computer Use as a Built‑in Tool  
Computer use in Gemini 3.5 Flash is not an external plug‑in; it is a native tool that the model can invoke just like any other function call. When the model decides it needs to interact with a GUI, it generates a structured command that the underlying runtime executes in a sandboxed environment (browser, mobile emulator, or desktop VM). The tool returns observations such as screenshots, DOM trees, or accessibility trees, which the model can then reason over. Because the tool is built into the model’s inference pipeline, latency is reduced compared to a two‑model setup where a separate computer‑use model must be queried and its results fed back into the main model.  

### Gemini 3.5 Flash Model Enhancements  
Gemini 3.5 Flash already excelled at function calling and leveraging built‑in tools such as Search and Maps grounding. The integration of computer use adds a third modality—direct GUI interaction—without altering the core architecture. This means the same 3.5 Flash checkpoint that processes text, images, and audio can now also emit computer‑use actions. The model’s training data includes adversarial examples specifically designed to teach it how to safely operate computer‑use tools, which improves reliability on long‑horizon tasks where mistakes can compound.  

### Function Calling and Existing Built‑in Tools  
Before computer use, developers relied on function calling to access external APIs (e.g., a weather service) and built‑in tools like Search (for web retrieval) and Maps grounding (for location‑based queries). These tools are invoked via a JSON schema that the model fills out. Computer use follows the same pattern: the model outputs a JSON object describing the desired action (e.g., `{ "action": "click", "target": { "type": "css", "value": "#submit-button" } }`). The runtime then translates that into low‑level input events. Because the invocation mechanism is identical, existing agent frameworks that already support function calling can adopt computer use with minimal code changes.  

### Agentic Computer Use Tasks and Long‑Horizon Automation  
Agentic computer use refers to agents that not only perceive a GUI but also formulate goals, plan sequences of actions, and adapt based on feedback. Examples include continuous software testing (repeatedly navigating a web app, filling forms, verifying outputs), knowledge‑work automation (copy‑pasting data between CRM and spreadsheet applications), and UI‑accessibility auditing (scanning screens for contrast violations). Long‑horizon tasks are those that require hundreds or thousands of steps over extended periods; the integrated computer‑use tool in 3.5 Flash maintains consistent performance across such sequences, reducing drift and error accumulation that plagued earlier pipelined approaches.  

### Safety Measures and Defense‑in‑Depth  
Google employed targeted adversarial training to teach Gemini 3.5 Flash to resist prompt‑injection attacks that could cause the model to execute harmful or unintended computer‑use commands. In addition, two optional enterprise safeguard systems are provided:  

1. **Explicit User Confirmation** – Before any action deemed sensitive or irreversible (e.g., deleting a file, submitting a purchase), the system pauses and asks a human operator to approve.  
2. **Automatic Stop on Indirect Prompt Injection** – If the model detects a subtle injection pattern (e.g., hidden instructions embedded in page text), it halts the current task and raises an alert.  

Google recommends a defense‑in‑depth strategy that combines these safeguards with secure sandboxing (isolating the GUI environment), human‑in‑the‑loop verification for critical steps, and strict access controls (least‑privilege OS accounts, network restrictions). Detailed best‑practice documentation is available in the Gemini AI Studio safety guide.  

### Enterprise Safeguard Systems  
The two safeguard systems are offered as optional modules that developers can enable via the Gemini Enterprise Agent Platform. When explicit user confirmation is turned on, the platform inserts a confirmation dialog into the action pipeline; the agent proceeds only after receiving a positive acknowledgment from a designated approver. The indirect prompt‑injection detector runs a lightweight classifier on the model’s internal reasoning traces and on observable UI changes; if the classifier’s score exceeds a threshold, the task is aborted and an incident log is generated. Both systems are configurable—administrators can define which action types are considered “sensitive” and adjust the sensitivity of the injection detector.  

### Customer Validation and Performance Benchmarks  
Early adopters shared quantitative and qualitative results:  

* **Browserbase** – On the OnlineMind2Web benchmark and private internal tests, Gemini 3.5 Flash with computer use achieved accuracy comparable to frontier models while delivering better cost and latency. This makes large‑scale, long‑horizon browsing automation economically viable.  
* **Browser Use** – Compared to the previous Flash generation, the new model shows a clear step up in agentic browser‑use harnesses, reaching frontier‑level performance without sacrificing the speed and cost profile that makes Google the preferred provider at scale.  
* **UiPath** – When integrated with the UiPath computer‑use harness that powers agents like Delegate and ScreenPlay, Gemini 3.5 Flash delivered high throughput, strong reliability, and the best price‑performance ratio among all evaluated models, while remaining easy to steer via natural‑language prompts.  

These testimonials underscore that the integrated tool does not merely match prior performance; it improves the trade‑off curve for enterprises that need both accuracy and operational efficiency.  

### Getting Started: Demo and Reference Implementation  
Google provides two entry points for developers:  

1. **Demo Environment** – Hosted by Browserbase, a live sandbox lets you test computer‑use capabilities without installing any software. You can issue natural‑language prompts such as “open https://example.com and capture a screenshot of the header” and observe the model’s actions in real time.  
2. **Reference Implementation** – Available through the Gemini API and the Gemini Enterprise Agent Platform, the reference repo includes sample code for initializing the model, enabling the computer‑use tool, defining action schemas, and handling safety callbacks. The documentation walks you through setting up authentication, configuring sandbox limits, and deploying the agent to a Kubernetes cluster or a managed Cloud Run service.  

By following the “Try it now” and “Start building” links in the announcement, you can move from experimentation to production within a single day.  

## How It Works / Step‑by‑Step  

1. **Set Up the Development Environment**  
   - Create a Google Cloud project and enable the Gemini API.  
   - Install the Gemini SDK (`pip install google-generativeai`) and authenticate with a service account that has the `generativeai.languageModel` permission.  
   - If you plan to use the enterprise safeguards, also enable the Gemini Enterprise Agent Platform API.  

2. **Initialize the Model with Computer‑Use Tool**  
   ```python
   import google.generativeai as genai

   genai.configure(api_key="YOUR_API_KEY")
   model = genai.GenerativeModel(
       model_name="gemini-3.5-flash",
       tools=[{"type": "computer_use"}]   # declares the built‑in tool
   )
   ```  
   The `tools` list tells the inference server to load the computer‑use runtime alongside the model.  

3. **Define an Action Schema**  
   Computer‑use actions follow a JSON schema similar to function calling. Example for a click action:  
   ```json
   {
     "name": "click",
     "description": "Click an element identified by a CSS selector",
     "parameters": {
       "type": "object",
       "properties": {
         "selector": {"type": "string", "description": "CSS selector of the target element"},
         "button": {"type": "string", "enum": ["left", "right", "middle"], "default": "left"}
       },
       "required": ["selector"]
     }
   }
   ```  
   Register this schema with the model so it knows how to generate valid action JSON.  

4. **Craft a Prompt that Triggers Computer Use**  
   Provide a clear goal and let the model decide when to invoke the tool:  
   ```python
   prompt = """
   You are an agent tasked with checking the accessibility of the login page at https://example.com/login.
   1. Open the URL in a browser.
   2. Take a screenshot of the page.
   3. Identify any input fields with insufficient contrast.
   4. Return a list of problematic elements with their contrast ratios.
   """
   ```  

5. **Run the Model and Handle Tool Calls**  
   The SDK will automatically intercept any `computer_use` tool calls generated by the model:  
   ```python
   response = model.generate_content(prompt)
   for part in response.parts:
       if part.tool_call:
           # Execute the tool call in a sandbox
           result = execute_computer_use_tool(part.tool_call)
           # Feed the result back to the model
           response = model.generate_content([part, {"tool_response": result}])
   ```  
   `execute_computer_use_tool` is a helper that launches a headless browser (e.g., Playwright), performs the requested action (click, type, scroll), and returns an observation (screenshot, DOM snapshot, accessibility tree).  

6. **Apply Safety Safeguards (Optional)**  
   - **Explicit Confirmation:** Wrap calls to high‑risk actions (e.g., file delete) with a confirmation prompt that pauses execution until a human approves.  
   - **Injection Detection:** After each model response, run the indirect‑prompt‑injection classifier; if the score > 0.8, abort and log the event.  

7. **Iterate and Observe**  
   The agent will loop: reason → tool call → observe → reason again, until the goal condition is met (e.g., all contrast issues logged).  

8. **Deploy to Production**  
   Package the agent as a container image, push to Google Artifact Registry, and deploy via Cloud Run or GKE. Configure IAM roles to restrict the agent’s network access to only the necessary endpoints and enable audit logging for all computer‑use invocations.  

## Real‑World Examples & Use Cases  

### Example 1: Analyzing the Gemini App for Feature Categorization  
The source notes that “3.5 Flash uses computer use to analyze Gemini app and return a categorized list of features.” In practice, an agent could:  

1. Launch the Gemini web app.  
2. Scroll through the sidebar, capturing each section’s heading.  
3. Use OCR or DOM parsing to extract feature names.  
4. Group them into categories (e.g., “Multimodal Input”, “Tool Use”, “Safety”).  
5. Output a JSON catalog that product managers can consume for release notes.  

Because the model can reason about the UI hierarchy, it adapts if the app layout changes, reducing maintenance overhead compared to brittle selector‑based scripts.  

### Example 2: Auditing Documentation for Accessibility Issues  
“Flash with computer use audits its own documentation for accessibility issues.” An agent built for this task would:  

- Open the documentation portal.  
- Navigate to each page.  
- Inject an accessibility audit script (e.g., axe-core) via the computer‑use tool, or manually inspect contrast, heading order, and ARIA labels using the model’s visual reasoning.  
- Collect violations, prioritize them by severity, and generate a remediation report.  

This use case demonstrates how computer use can replace manual QA cycles with continuous, automated checks that run on every commit.  

### Example 3: Continuous Software Testing (Browserbase Quote)  
Browserbase reported:  

> “On OnlineMind2Web and private benchmarks, Gemini 3.5 Flash with Computer Use delivers comparable accuracy to frontier models with better cost and latency, making complex, long‑horizon browsing tasks affordable to run at scale.”  

A concrete scenario: an e‑commerce site wants to verify that the checkout flow works after every code push. The agent:  

1. Opens the staging site.  
2. Adds a product to the cart.  
3. Proceeds through shipping, payment, and order confirmation steps.  
4. Validates that the order number appears in the confirmation email (by opening a test mailbox).  
5. Repeats the flow with different product combinations, currencies, and promo codes.  

Because the model can handle unexpected pop‑ups or modal dialogs by reasoning on screen content, the test suite is far more resilient than traditional Selenium scripts that break on UI changes.  

### Example 4: Agentic Browser‑Use Harness (Browser Use Quote)  
Browser Use’s CEO Magnus Müller said:  

> “Gemini 3.5 Flash is a clear step up from the previous Flash generation on agentic browser‑use harnesses. It catches up to frontier‑level performance while keeping the speed and cost profile that makes Google our #1 choice at scale.”  

An agentic harness might:  

- Receive a high‑level goal like “Find the cheapest flight from NYC to Tokyo for next month.”  
- Open a travel aggregator site, fill in origin/destination dates, invoke the computer‑use tool to interact with calendars, click “Search”, parse the results table, and iterate through pages to locate the lowest price.  
- If a CAPTCHA appears, the agent can request human intervention (via the explicit confirmation safeguard) or attempt to solve it using an external vision model, then continue.  

The improved reasoning of 3.5 Flash reduces the number of steps needed to reach the goal, cutting latency and cost.  

### Example 5: UiPath‑Powered Agents (UiPath Quote)  
Alvin Stanescu of UiPath noted:  

> “Gemini 3.5 Flash adapted particularly well to the UiPath computer use harness that powers agents like Delegate and ScreenPlay. Gemini 3.5 Flash delivers high throughput, strong reliability, and the best price‑performance ratio among the models we evaluated for computer use, all while being easy to steer.”  

In a UiPath workflow, the agent could:  

- Launch a legacy desktop application (e.g., an ERP system).  
- Use computer use to navigate menus, fill forms, and extract data from grids.  
- Pass the extracted data to downstream UiPath robots for further activities (e.g., data validation, report generation).  
- Because the model is steerable via natural language, business analysts can adjust the agent’s behavior by simply editing the prompt, without rewriting low‑level automation scripts.  

These examples illustrate the breadth of environments—browser, mobile emulator, desktop—where the integrated computer‑use tool can be applied.  

## Key Insights & Takeaways  

- Gemini 3.5 Flash now includes computer use as a native built‑in tool, eliminating the need for a separate model and reducing latency.  
- The model retains its strengths in function calling and existing tools (Search, Maps grounding) while gaining direct GUI interaction capabilities.  
- Developers can build agents that see, reason, and act across browser, mobile, and desktop environments for long‑horizon tasks such as continuous software testing and knowledge‑work automation.  
- Safety is addressed through targeted adversarial training and two optional enterprise safeguards: explicit user confirmation for sensitive actions and automatic stoppage on detected indirect prompt injection.  
- A defense‑in‑depth approach is recommended, combining the built‑in safeguards with sandboxing, human‑in‑the‑loop verification, and strict access controls.  
- Early adopters (Browserbase, Browser Use, UiPath) report comparable or superior accuracy to frontier models, better cost/latency, high throughput, strong reliability, and the best price‑performance ratio.  
- To get started, developers can test capabilities in a Browserbase‑hosted demo or dive into the reference implementation via the Gemini API and Gemini Enterprise Agent Platform.  
- The announcement received 85 likes, 282 replies, 2 K quote tweets, and 193.7 K views, indicating strong community interest and validation.  
- Computer use enables agents to perform tasks like analyzing the Gemini app for feature categorization and auditing its own documentation for accessibility, showcasing introspective capabilities.  
- Integrating computer use with existing agent frameworks (e.g., UiPath) is straightforward because the invocation pattern mirrors function calling.  

## Common Pitfalls / What to Watch Out For  

- **Overreliance on the Model’s Visual Reasoning:** Assuming the model will always correctly interpret complex UI states can lead to mistakes; always validate critical observations with fallback checks (e.g., OCR confidence thresholds).  
- **Neglecting Sandbox Boundaries:** Running computer‑use actions in an unsandboxed environment exposes the host system to potential malware or data leakage; always enforce strict OS‑level isolation.  
- **Skipping Human‑in‑the‑Loop for High‑Risk Actions:** Even with explicit confirmation safeguards, failing to define which actions are “sensitive” can result in unintended deletions or financial transactions.  
- **Ignoring Latency Accumulation:** Long‑horizon tasks can accumulate latency if each step waits for a full model round‑trip; batch observations where possible and use asynchronous tool execution.  
- **Misconfiguring the Indirect Prompt‑Injection Detector:** Setting the sensitivity too low may cause false positives that halt benign tasks; tune the detector on a validation set of normal UI interactions.  
- **Assuming Full Compatibility with All Legacy Apps:** Some desktop applications use custom rendering technologies that are not fully accessible via standard accessibility trees; test early and consider hybrid approaches (model + scripting).  
- **Neglecting Audit Logging:** Without logging each computer‑use invocation, debugging failures or investigating security incidents becomes difficult; enable detailed logs in the Gemini Enterprise Agent Platform.  
- **Underestimating Prompt Engineering Effort:** Crafting prompts that reliably trigger the correct tool usage at the right steps requires iteration; invest in prompt testing and version control.  

## Review Questions  

1. **Explain how the integration of computer use as a built‑in tool in Gemini 3.5 Flash differs from the previous approach of using a standalone Gemini 2.5 computer‑use model, and why this integration improves latency and reliability for agentic tasks.**  
2. **Describe the two optional enterprise safeguard systems released alongside Gemini 3.5 Flash, and illustrate how each would be applied in a real‑world agent that performs online purchases.**  
3. **Given the goal “Audit the contrast ratios of all text
