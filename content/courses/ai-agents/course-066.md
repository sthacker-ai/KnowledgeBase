---
title: "Building a Compounding Second Brain: Integrating Hermes, Obsidian, and NotebookLM"
source_id: "2062562402386813313"
source_type: "x_video"
topic_slug: ai-agents
topic_label: "AI Agents"
source_handle: "@cyrilXBT"
tweet_url: "https://x.com/cyrilXBT/status/2062562402386813313"
has_transcript: false
generated_at: "2026-06-05T08:23:48.389Z"
---
# Building a Compounding Second Brain: Integrating Hermes, Obsidian, and NotebookLM

## Overview
This course explores the transition from passive AI usage—characterized by repetitive, manual prompting—to the creation of an autonomous, compounding "Second Brain." By integrating specific AI agents and knowledge management tools, users can move beyond the "copy-paste" cycle and build a system that evolves independently. This course teaches how to leverage the synergy between Hermes, Obsidian, and NotebookLM to create a system that writes its own skills, maps its own knowledge, and retains a permanent memory of user interactions.

## Background & Context
For the majority of AI users, the current workflow is fragmented. Most people engage in a "morning ritual" of copy-pasting data into ChatGPT, treating the AI as a stateless calculator that forgets the context of the previous session once the window is closed. This creates a "knowledge leak" where the user does the heavy lifting of organizing information, and the AI provides a one-off answer without contributing to a long-term knowledge asset.

The concept championed by @cyrilXBT represents a shift toward **Agentic Knowledge Management**. Instead of using AI as a chatbot, this approach treats AI as an agent that lives within a personal knowledge base. The goal is to solve the problem of "context decay" by creating a loop where the AI doesn't just answer questions but actively manages and expands the user's intellectual capital. This fits into the broader landscape of "Personal Knowledge Management" (PKM) and "Agentic Workflows," where the AI becomes a collaborator that evolves alongside the user.

## Core Concepts

### The "Copy-Paste" Trap
The "copy-paste" trap refers to the inefficient habit of manually transferring data between sources and a LLM (Large Language Model) every single day. This workflow is linear and ephemeral; once the chat session ends, the "intelligence" generated during that session is often lost unless the user manually saves it. This creates a ceiling on productivity because the user is spending more time on data entry than on high-level synthesis.

### Hermes (The Agentic Engine)
Hermes refers to a class of high-performance, fine-tuned models (often based on Llama or Mistral architectures) designed specifically for agentic tasks. Unlike standard chat models, Hermes-style models are optimized for function calling, following complex instructions, and acting as an "orchestrator." In this ecosystem, Hermes acts as the "brain" that can execute tasks, write its own scripts, and interact with other tools to automate the expansion of the knowledge base.

### Obsidian (The Knowledge Graph)
Obsidian is a local-first, Markdown-based knowledge base that uses a graph structure rather than a traditional folder hierarchy. By using bidirectional linking (`[[Link]]`), Obsidian allows for the emergence of non-linear connections between ideas. In this system, Obsidian serves as the "long-term memory" or the "hard drive" where the AI agent stores its findings, maps relationships between concepts, and maintains a permanent record of everything the user has taught it.

### NotebookLM (The Synthesis Layer)
NotebookLM is Google's AI-powered research assistant that allows users to ground an LLM in a specific set of documents (Source-grounding). Unlike a general chatbot, NotebookLM only answers based on the provided sources, eliminating hallucinations and ensuring high fidelity. In this triad, NotebookLM acts as the "synthesis engine," allowing the user to upload their Obsidian vault or specific research papers to generate insights, summaries, and connections across massive datasets instantly.

### Compounding Knowledge
Compounding knowledge is the process where every new piece of information added to the system increases the value of all existing information. When an AI agent can "map its own knowledge" and "write its own skills," the system becomes an asset that grows in utility over time. Instead of starting from zero every morning, the user starts from a position of strength, leveraging a system that remembers every previous insight and has already built the tools necessary to process new data.

## How It Works / Step-by-Step

### Step 1: Establishing the Local Knowledge Base (Obsidian)
The process begins by migrating all fragmented notes, research, and thoughts into Obsidian. Because Obsidian uses plain Markdown files, the data is portable and machine-readable.
*   **Action:** Create a structured vault with folders for "Inputs" (raw data), "Processing" (active thinking), and "Permanent Notes" (synthesized truths).
*   **Example:** Instead of a note titled "AI Notes," create linked notes like `[[AI Agents]]` $\rightarrow$ `[[Agentic Workflows]]` $\rightarrow$ `[[Hermes Model]]`.

### Step 2: Integrating the Agentic Layer (Hermes)
Once the knowledge base is established, an agentic model like Hermes is connected to the vault (often via plugins like *Smart Connections* or *Text Generator*).
*   **Action:** Configure the agent to have read/write access to the Obsidian vault.
*   **Example:** You can prompt the agent: *"Analyze my notes on 'Market Trends' and write a new Markdown file that identifies three gaps in my current research."* The agent then writes the file directly into your vault, effectively "writing its own skills" by creating new templates or workflows for you to use.

### Step 3: Grounding and Synthesis (NotebookLM)
To handle massive amounts of data that would exceed a standard context window, the Obsidian vault (or specific exports) is uploaded to NotebookLM.
*   **Action:** Upload your Markdown files as sources in NotebookLM.
*   **Example:** Ask NotebookLM, *"Based on my last three months of research notes in Obsidian, what are the recurring themes I've been ignoring?"* The AI synthesizes the data and provides a high-level overview grounded strictly in your own data.

### Step 4: The Feedback Loop (The Compounding Cycle)
The final step is the loop: NotebookLM identifies a gap $\rightarrow$ Hermes researches the gap and writes a new note in Obsidian $\rightarrow$ Obsidian updates the knowledge graph $\rightarrow$ NotebookLM synthesizes the new graph. This creates a self-evolving system that "remembers everything you taught it."

## Real-World Examples & Use Cases

### Scenario 1: The Academic Researcher
A researcher uses Obsidian to store thousands of paper abstracts. Instead of manually searching for connections, they use Hermes to automatically tag and link related papers. They then upload the curated vault to NotebookLM to generate a comprehensive literature review that is 100% grounded in their actual sources, ensuring no hallucinations in their academic writing.

### Scenario 2: The Software Engineer
An engineer uses this system to map a complex codebase. They use Hermes to write custom scripts (skills) that automatically document their code and save those documents into Obsidian. When they need to onboard a new team member, they use NotebookLM to create a "Knowledge Guide" based on the Obsidian documentation, allowing the new hire to ask questions and get answers based on the actual project history.

### Scenario 3: The Content Creator
A creator captures "sparks" of ideas in Obsidian. Hermes analyzes these sparks to suggest content pillars. The creator then uses NotebookLM to synthesize these pillars into a full course outline, ensuring that the final output is a reflection of their unique perspective and previous thoughts, rather than generic AI-generated content.

## Key Insights & Takeaways
- **Stop the "Copy-Paste" Cycle:** Moving away from stateless chat interfaces is essential for long-term intellectual growth.
- **Local-First is Key:** Using Obsidian ensures that you own your data and that the AI is augmenting your brain, not replacing it.
- **Agentic Autonomy:** The goal is to move from "AI as a tool" to "AI as an agent" that can write its own skills and organize its own files.
- **Source-Grounding Prevents Hallucinations:** By using NotebookLM, you ensure the AI stays within the boundaries of your specific knowledge base.
- **Knowledge as an Asset:** When a system "compounds forever," the effort spent today makes every future task easier and faster.
- **Synergy of Three:** The power comes from the combination: Hermes (Execution) + Obsidian (Storage) + NotebookLM (Synthesis).

## Common Pitfalls / What to Watch Out For
- **Over-Engineering the Vault:** Beginners often spend too much time on Obsidian plugins and "perfect" folder structures rather than actually capturing and synthesizing information.
- **Ignoring Data Privacy:** When uploading local notes to cloud-based tools like NotebookLM, users must be mindful of sensitive or proprietary information.
- **The "Garbage In, Garbage Out" Problem:** If the initial notes in Obsidian are disorganized or low-quality, the AI agents will synthesize low-quality insights.
- **Over-Reliance on Automation:** Users may stop thinking critically if they let the AI "map its own knowledge" without reviewing the connections for accuracy.

## Review Questions
1. **How does the "copy-paste" workflow differ from the "compounding second brain" workflow in terms of data retention and utility?**
2. **Explain the specific role Hermes plays in this ecosystem. Why is a standard chatbot insufficient for this specific setup?**
3. **If you were building a system to track a year-long project, how would you use the interaction between Obsidian and NotebookLM to ensure you don't lose track of early project insights?**

## Further Learning
- **RAG (Retrieval-Augmented Generation):** Learn how RAG works to understand how NotebookLM and Obsidian plugins retrieve specific data to answer questions.
- **Zettelkasten Method:** Study the Zettelkasten method of note-taking to better structure your Obsidian vault for AI agent consumption.
- **Local LLM Deployment:** Explore tools like Ollama or LM Studio to run Hermes-style models locally for maximum privacy and speed.
