---
title: "Transitioning from AI Tools to AI Teammates: Mastering Claude Code Routines"
source_id: "2060728613872234644"
source_type: "x_video"
topic_slug: claude-ai
topic_label: "Claude AI"
source_handle: "@zodchiii"
tweet_url: "https://x.com/zodchiii/status/2060728613872234644"
has_transcript: true
generated_at: "2026-06-09T11:10:38.079Z"
---
# Transitioning from AI Tools to AI Teammates: Mastering Claude Code Routines

## Overview
This course explores the evolution of Claude Code from a reactive tool into a proactive "coding teammate" through the implementation of a feature called Routines. You will learn how to move beyond manual prompting and terminal-based sessions to create automated, remote agents that operate independently on managed infrastructure. By the end of this course, you will understand how to trigger autonomous workflows, manage agent context, and implement steerability to ensure high-quality AI-driven shipments.

## Background & Context
Historically, coding agents have functioned as tools: they wait for a human to enter a prompt and press "Enter" before taking action. While powerful, this creates a bottleneck where the agent's productivity is limited by the user's presence. If a developer closes their laptop or a local session dies, the agent stops working. This creates a "reactive" workflow where the human is the primary driver and the AI is merely an assistant.

To solve this, Anthropic's applied AI team—specifically engineers like Maya—developed "Routines." The goal was to eliminate the cumbersome infrastructure typically required to run agents proactively. Previously, developers had to manually manage hosting, data persistence, authentication, and cron jobs to achieve automation. Routines shift this burden from the user to Anthropic's managed infrastructure, allowing agents to "wake up" and work while the developer is away, effectively turning the AI into a teammate that notices when something breaks and takes action without being asked.

## Core Concepts

### Proactive Agents
A proactive agent is an AI system that does not wait for a manual trigger to begin a task. Unlike standard LLM interactions, which are request-response based, proactive agents operate on a set of predefined triggers. The fundamental shift here is moving from a "tool" (which waits for a prompt) to a "teammate" (which monitors environments and initiates work). This allows for continuous shipping and maintenance, meaning the agent can perform tasks like auditing code or updating documentation while the human developer is offline.

### Claude Code Routines
Routines are a specific feature within Claude Code that allow users to kick off remote sessions by defining four primary parameters: the prompts, the connected repositories, the available connectors, and a trigger. Once these are defined, Claude Code handles the underlying infrastructure. This means the agent runs on managed servers, ensuring that the session state is preserved and the agent remains available regardless of the user's local machine status.

### Managed Infrastructure
Managed infrastructure refers to the backend environment provided by Anthropic that hosts the Routine. This removes the "boilerplate" work typically associated with building autonomous agents. Users no longer need to worry about:
*   **Hosting:** No need to spin up servers or manage cloud instances.
*   **Session State:** The agent's progress and memory are maintained across sessions.
*   **Connector Management:** The integration with external tools is handled natively.
*   **Persistence:** The agent does not stop working when a laptop is closed or loses power.

### Steerability and Interactivity
Steerability is the ability of a human to intervene, guide, or correct an agent's path during an autonomous session. Even though Routines are designed to be "human-out-of-the-loop," they remain fully interactive. Every Routine is essentially a Claude Code session under the hood. Users can open these sessions via the web, CLI, or desktop to watch the agent's progress in real-time, ask questions mid-session, nudge the agent in a different direction, or resume a past session to continue a conversation.

## How It Works / Step-by-Step

### Setting Up a Routine
To create a Routine, a user initiates the process through the Claude Code terminal. The process follows these steps:

1.  **Initiation:** Use the `/schedule` command in the terminal.
2.  **Defining the Goal:** Provide a natural language instruction of what the routine should do. 
    *   *Example:* `/schedule once a week, please review all the new changes merged to main against our documentation repo and create a PR to update docs if you see any changes.`
3.  **Configuration Dialogue:** Claude will respond with clarifying questions to refine the routine. This may include:
    *   **Timing:** "What time every week do you want me to kick this off?"
    *   **Notification:** "Once I create a PR, do you want me to notify you in any way, maybe ping you on Slack?"
4.  **Deployment:** Once the parameters are confirmed, Claude creates the routine, which can then be managed and monitored via the Claude.ai web interface under the "Code" button and "Routines" panel.

### The Three Critical Design Decisions
When building any routine, the developer must make three strategic decisions to ensure the agent is successful:

**1. The Trigger (The "When")**
*   **Time-based triggers:** Running on a specific cadence (e.g., every Monday at 9 AM).
*   **Event-based triggers:** Running based on specific actions. This includes native GitHub events (e.g., when a release is cut) or custom events sent via webhooks and endpoints with a specific event payload as context. For example, a routine could trigger whenever a PR is merged with a specific label like "need docs."

**2. Context (The "What")**
Context defines the "ceiling" of the agent's success. If the agent doesn't have the right information, it cannot perform the task. Necessary context includes:
*   **Code Repositories:** Granting access to the source code and the target repository (e.g., the source code repo for analysis and the docs repo for PR creation).
*   **External Connectors:** Integrating tools like Google Drive (for marketing briefs or style guides) or Slack (for notifications).

**3. Steerability (The "How")**
To ensure quality and "keep the agent honest," developers use steerability techniques:
*   **Agent-on-Agent Review:** Implementing a "Generator-Critiquer" pattern. One routine generates the output (e.g., a documentation PR), and a second routine is triggered by that PR to review and leave comments before a human ever sees it.
*   **Human-in-the-Loop Monitoring:** Using the web interface to monitor live sessions and provide mid-session nudges.
*   **Output Verification:** Manually rendering and confirming the final output (e.g., rendering a documentation page to ensure it looks correct).

## Real-World Examples & Use Cases

### Case Study: Automating Documentation at Anthropic
Anthropic faced a scaling problem: weekly PRs for Claude Code increased by 200% since the start of the year. While this indicated high productivity, it overwhelmed the single engineer responsible for documentation.

**The Solution:**
The engineer ("Sarah") set up a Routine to automate the documentation pipeline.
*   **Trigger:** Weekly schedule.
*   **Action:** Review differences between the source code and the documentation repo.
*   **Output:** Automatically create a PR to update the documentation.
*   **Context:** Access to the source code, the docs repo, and marketing briefs via Google Drive to ensure the language and verbiage match external marketing materials.
*   **Notification:** A Slack ping upon PR creation.

### Additional Application Scenarios
*   **Automated Bug Triage:** An event-based routine that triggers whenever a new GitHub issue is labeled "Bug." The agent analyzes the issue, searches the codebase for the likely cause, and creates a draft PR with a proposed fix.
*   **Dependency Audits:** A time-based routine that runs every Sunday to check for outdated dependencies, analyze the changelogs of the updates, and create a summary report of potential breaking changes for the team to review on Monday morning.

## Key Insights & Takeaways
*   **Shift in Paradigm:** The goal is to move from using AI as a tool (reactive) to using AI as a teammate (proactive).
*   **Infrastructure Abstraction:** Routines eliminate the need for manual hosting, cron jobs, and boilerplate code for agent persistence.
*   **Context is the Ceiling:** The quality of the agent's output is strictly limited by the context (repos, connectors, and files) provided during setup.
*   **Hybrid Loop:** The most effective workflows use a mix of "human-out-of-the-loop" for execution and "human-in-the-loop" for steering and final verification.
*   **Multi-Agent Synergy:** Using the Generator-Critiquer pattern (one agent creates, another reviews) significantly increases the reliability of autonomous shipments.
*   **Visibility:** The ability to watch a live remote session in the web UI prevents the "black box" problem common in headless agent sessions.

## Common Pitfalls / What to Watch Out For
*   **The "Closed Laptop" Trap:** Beginners often try to run agents locally, which causes the session to die when the machine sleeps. Routines solve this by using managed infrastructure.
*   **Context Under-provisioning:** Failing to provide all necessary connectors (like Google Drive or Slack) leads to agents that cannot complete the full workflow or cannot communicate their progress.
*   **Over-reliance on Autonomy:** Assuming the agent is 100% accurate without implementing a review layer. The source emphasizes the need for either agent-on-agent review or human verification of the final rendered output.
*   **Lack of Steering:** Letting a routine run blindly without utilizing the web interface to "nudge" the agent when it deviates from the desired path.

## Review Questions
1. What is the fundamental difference between a "tool" and a "teammate" in the context of Claude Code?
2. Explain the "Generator-Critiquer" pattern and how it can be implemented using Routines.
3. If you wanted to create a routine that updates a project's README every time a new feature is merged into the main branch, what trigger, context, and steerability measures would you implement?

## Further Learning
*   **Multi-Agent Systems:** Explore the "Generator-Critiquer" pattern further to understand how to build self-correcting AI workflows.
*   **Webhook Integration:** Learn how to set up custom endpoints to trigger Claude Code Routines based on external business events.
*   **Prompt Engineering for Agents:** Study how to write "steering" prompts that guide an agent's behavior over long-running, autonomous sessions.
