---
title: "Cross-Agent Workflow: Seamlessly Switching Between Claude Code and Codex"
source_id: "2056457055754448938"
source_type: "x_video"
topic_slug: claude-ai
topic_label: "Claude AI Issues"
source_handle: "@nateherk"
tweet_url: "https://x.com/nateherk/status/2056457055754448938"
has_transcript: true
generated_at: "2026-06-09T09:52:55.461Z"
---
# Cross-Agent Workflow: Seamlessly Switching Between Claude Code and Codex

## Overview
This course provides a technical guide on how to maintain productivity when a primary AI coding agent, such as Claude Code, encounters technical failures or "500 errors." It teaches the strategy of utilizing multiple coding agents—specifically Claude Code and Codex—within the same project directory to avoid context loss. By understanding how different agents read project instructions, users can switch between tools without the need to duplicate files or restart their project from scratch.

## Background & Context
In the rapidly evolving landscape of AI-driven development, developers often rely on "coding agents" to manage complex tasks. However, these tools are not infallible; server outages or specific logic blocks can leave a developer stuck on a problem. Nate Herc champions a "multi-agent" approach to solve this, suggesting that instead of panicking when one tool fails, developers should have a secondary agent ready to step in.

The core problem this approach solves is the "context gap." Typically, switching tools requires migrating project data, duplicating folders, or re-explaining the project's goals to a new AI. By structuring a project to be "agent-agnostic," a developer can maintain a single source of truth that any agent—whether it be Claude Code, Codex, or future tools like Hermes—can read and act upon immediately.

## Core Concepts

### The Multi-Agent Strategy
The multi-agent strategy involves using different AI coding tools side-by-side to ensure continuous progress. As demonstrated by Nate Herc, this might look like having Claude Code open on the left side of the screen and Codex on the right. This redundancy ensures that if one agent gets stuck on a specific problem or suffers a system outage (like a 500 error), the developer can simply hand the task over to the other agent without losing momentum.

### Shared Knowledge Bases
The fundamental insight of this workflow is that while different agents have different "entry points," they all operate on the same shared knowledge. This shared knowledge consists of the actual project files, documentation, references, scripts, and various context files. Because the underlying code and documentation remain the same, the agent is simply a different "brain" reading the same "book."

### Agent-Specific Configuration Files
Every coding agent has its own specific terminology and file requirements to understand the project's rules and goals. These files act as the "instructions" or "system prompts" for the agent. For example, Claude Code looks for specific files to understand its role, while Codex looks for different filenames to achieve the same result. Understanding these naming conventions is the key to making a project compatible with multiple agents.

### The `cloud.md` and `agents.md` Files
These are the primary instruction files used to define the agent's persona and knowledge. In the source example, the `cloud.md` file is used by Claude Code to define the agent as "Nate Herc's executive assistant," providing it with the knowledge base and wiki paths. Codex performs the exact same function—injecting instructions at the beginning of a session—but it specifically searches for a file named `agents.md` to find those instructions.

## How It Works / Step-by-Step

To implement a project structure that allows for seamless switching between Claude Code and Codex, follow these steps:

### Step 1: Establish Your Shared Knowledge
Ensure all your project's core assets are in a centralized location. This includes your scripts, reference documents, and any wiki paths. Both agents will read these files regardless of their specific configuration files.

### Step 2: Configure Claude Code
To make your project compatible with Claude Code, you must provide the specific files the agent expects:
*   **Instruction File:** Create a `cloud.md` file. Inside this file, define the agent's role (e.g., "You are [Name]'s executive assistant") and provide paths to the knowledge base and wiki.
*   **Configuration Folder:** Ensure there is a `.cloud` folder in the project directory.

### Step 3: Configure Codex
To make the same project compatible with Codex, you must provide the files that Codex is programmed to look for:
*   **Instruction File:** Create an `agents.md` file. This file should contain the same (or similar) instructions found in your `cloud.md` file so that the agent has the same context.
*   **Configuration Folders:** Ensure the project contains a `.codex` folder and a `.agents` folder.

### Step 4: Execution and Switching
When you encounter a roadblock or a 500 error in Claude Code, you do not need to move your files. Simply activate Codex within the same directory. Because you have already provided the `agents.md` and `.codex` folders, Codex will immediately recognize the project context and can begin solving the problem where the previous agent left off.

## Real-World Examples & Use Cases

### Case Study: The "500 Error" Recovery
A developer is deep into a complex refactor using Claude Code. Suddenly, the service returns a 500 error, halting work. Instead of waiting for the service to recover or manually copying code into a web chat, the developer switches to Codex. Because the project has both `cloud.md` and `agents.md`, Codex picks up the context instantly, and the developer continues working without a break in flow.

### Scenario: The "Logic Block" Pivot
A developer finds that Claude Code is looping or unable to solve a specific bug despite multiple attempts. The developer opens Codex in a parallel window. Since both agents are reading the same shared scripts and documentation, the developer can ask Codex to look at the same file. Codex, using a different underlying model or logic, may find the solution that Claude Code missed.

### Scenario: Future-Proofing for New Agents
As new agents like "Hermes" or other future tools are released, the developer doesn't need to rebuild their project. They simply identify the specific configuration file the new agent requires (e.g., `hermes.md`) and add it to the project. This creates a "universal" project structure that is compatible with any AI agent that enters the ecosystem.

## Key Insights & Takeaways
- **Avoid Single-Tool Dependency:** Do not rely on one AI agent; having a secondary tool like Codex prevents productivity loss during outages.
- **Eliminate Redundancy:** You do not need to duplicate projects or files to use different agents; they can all work out of the same directory.
- **Standardize Instructions:** Use `cloud.md` for Claude Code and `agents.md` for Codex to ensure both agents have the necessary context.
- **Understand Folder Requirements:** Claude Code requires a `.cloud` folder, while Codex requires `.codex` and `.agents` folders.
- **Maintain a Shared Knowledge Base:** Keep documents, references, and scripts in a shared area so any agent can read them easily.
- **Context Injection:** Recognize that these `.md` files are used to "inject" the agent's persona and project rules at the start of a session.

## Common Pitfalls / What to Watch Out For
- **Missing Configuration Folders:** A common mistake is providing the `.md` instruction file but forgetting the hidden configuration folders (`.cloud`, `.codex`, `.agents`), which may cause the agent to fail to initialize correctly.
- **Inconsistent Instructions:** If the `cloud.md` and `agents.md` files contain conflicting instructions, the two agents may provide contradictory solutions, leading to confusion.
- **Context Overload:** While shared knowledge is helpful, ensure that the reference files are well-organized so that agents don't get lost in irrelevant data.

## Review Questions
1. What is the primary difference between how Claude Code and Codex identify project instructions?
2. Why is it unnecessary to duplicate a project when switching from Claude Code to Codex?
3. If a new AI agent called "Hermes" is released, what is the general process for making your existing project compatible with it based on the principles taught in this course?

## Further Learning
- **Agent-Agnostic Architecture:** Explore how to structure your project folders to be compatible with as many AI tools as possible.
- **Prompt Engineering for `.md` Files:** Learn how to optimize the content of `agents.md` and `cloud.md` to get better performance from AI agents.
- **Comparing LLM Logic:** Study the differences in how different models (Claude vs. GPT/Codex) approach coding problems to know when to switch agents.
