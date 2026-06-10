---
title: "Building a Persistent Knowledge Base: The LLM Wiki Method"
source_id: "2055237756318781502"
source_type: "x_video"
topic_slug: machine-learning
topic_label: "Machine Learning"
source_handle: "@polydao"
tweet_url: "https://x.com/polydao/status/2055237756318781502"
has_transcript: true
generated_at: "2026-06-09T08:35:50.605Z"
---
# Building a Persistent Knowledge Base: The LLM Wiki Method

## Overview
This course teaches the "LLM Wiki" method, a paradigm shift in how users interact with Large Language Models (LLMs) and personal documentation. Instead of treating AI as a temporary search engine for documents, this method transforms the AI into a curator that builds a permanent, interlinked, and evolving knowledge base. By moving from transient retrieval to persistent synthesis, learners can create a "second brain" that compounds in value as more information is added.

## Background & Context
The LLM Wiki concept was championed by Andre Karpathy, a prominent figure in the AI field who co-founded OpenAI and served as the AI Director at Tesla. The method was developed to solve a fundamental inefficiency in how most people currently use AI tools like ChatGPT or NotebookLM. 

Traditionally, users rely on a process called RAG (Retrieval Augmented Generation). While RAG is useful for simple queries, it is "stateless" in the sense that every single question starts from zero. If you ask a question today and a similar one tomorrow, the AI must search, retrieve, and synthesize the same information all over again. There is no accumulation of knowledge and no synthesis that persists between sessions. Karpathy’s LLM Wiki flips this by treating the AI as a programmer and the knowledge base as a codebase, ensuring that the synthesis happens once and is stored permanently in a structured format.

## Core Concepts

### Retrieval Augmented Generation (RAG)
RAG is the current industry standard for interacting with documents. In this workflow, a user uploads files, and when a question is asked, the AI searches the files for relevant "chunks" of text and generates an answer based on those pieces. While effective for basic tasks, RAG lacks memory and accumulation. If a question requires connecting ideas across five different documents, the AI must find and stitch those pieces together every single time, meaning nothing "compounds" over time.

### The LLM Wiki
The LLM Wiki is a persistent knowledge base made of interlinked Markdown files. Unlike RAG, where the AI reads raw documents on the fly, the LLM Wiki involves the AI reading documents once to extract key ideas and integrating them into a structured system. This system includes index pages, concept pages, and entity pages. When new information is added, the AI doesn't just store the file; it updates existing pages, creates new ones for new concepts, and flags contradictions between new sources and existing knowledge.

### The "IDE" Analogy
To understand the relationship between the tools used in this system, Karpathy uses a software development analogy. In this framework, **Obsidian** acts as the IDE (Integrated Development Environment) where the data is viewed and organized. The **LLM** (such as Claude Code) acts as the programmer who does the actual writing and organizing. The **Wiki** itself is the codebase—the permanent record of knowledge. The user's role is not to write the wiki, but to curate what goes into it and determine which questions to ask.

### The Three-Layer Architecture
The system is organized into three distinct layers to ensure data integrity and organization:
1. **Raw Sources:** This is the "source of truth." It contains original PDFs, articles, and notes. This layer is strictly read-only; the AI reads these files but never modifies them.
2. **The Wiki:** This is the output layer consisting of Markdown files created and maintained by the AI. It contains the synthesized knowledge, summaries, and interlinks.
3. **The Schema:** This is the rules document (e.g., a `Claude.md` file). It provides the AI with instructions on how to structure the wiki, how to handle new sources, and how to format the output.

## How It Works / Step-by-Step

### Phase 1: Tool Setup
To implement this system, you need two primary tools:
1. **Obsidian:** A free note-taking application that works with plain Markdown files. It is used as the viewer and is particularly valuable for its "Graph View," which visually maps the connections between different notes.
2. **An AI Coding Agent:** You need a tool capable of reading and writing files directly on your local machine. Examples include **Claude Code**, **OpenAI Codex**, or **Cursor**.

### Phase 2: Folder Structure
Once Obsidian is installed, create a new "Vault" (which is simply a folder on your computer). Inside this vault, create the following three folders:
- `/raw`: For your original, read-only source documents.
- `/wiki`: Where the AI will build and maintain the synthesized pages.
- `/templates`: (Optional) For manual note formats, though the AI generally handles this via the schema.

### Phase 3: Defining the Schema
The schema is the most critical part of the system. If using Claude Code, you create a file called `Claude.md` in the root of the vault. This file must contain:
- **Purpose:** A clear statement of what the knowledge base is about (e.g., "Planning a trip to Japan" or "Researching renewable energy").
- **Folder Structure:** Directions on where the raw resources are located and where the wiki output should go.
- **Ingest Workflow:** A step-by-step instruction for the AI: Read document $\rightarrow$ Extract concepts $\rightarrow$ Create/Update wiki pages $\rightarrow$ Update index $\rightarrow$ Log changes.
- **Formatting Rules:** Requirements such as "every page must have a summary at the top" and "every claim must reference its source."
- **QA Behavior:** Instructions that the AI must consult the wiki first before answering and must cite sources or admit uncertainty.

### Phase 4: The Ingestion Process
1. **Add Source:** Drop a document (PDF, text file, or Markdown) into the `/raw` folder. (Tip: Use a web clipper extension to convert web articles to Markdown).
2. **Trigger Ingestion:** Using the AI agent (e.g., Claude Code), issue a command such as: *"I just added a new source to the raw folder. Please read it and update the wiki."*
3. **AI Processing:** The AI reads the source, identifies key concepts, and proposes new pages or updates to existing pages.
4. **Verification:** The user reviews the proposed changes and tells the AI to "go ahead."
5. **Visualization:** Open Obsidian's Graph View to see the nodes and connections growing as the knowledge base becomes richer.

## Real-World Examples & Use Cases

### Example: Travel Planning (The Japan Trip)
In the provided demo, the user adds a travel blog post about Tokyo. The AI creates pages for specific neighborhoods. When a second source (a food guide) is added, the AI doesn't just create a "Food" page; it goes back to the "Neighborhood" pages created from the first source and adds the food recommendations to those specific locations. This demonstrates **synthesis**—the AI is connecting information across multiple documents to enrich a single concept.

### Use Case: Academic Research
A researcher reading dozens of papers on a specific scientific topic could drop every PDF into the `/raw` folder. The AI would build a wiki of "Core Theories," "Key Researchers," and "Conflicting Evidence." Instead of searching for a specific quote in one PDF, the researcher can look at a "Comparison" page created by the AI that synthesizes the arguments of five different authors.

### Use Case: Personal Learning/Book Tracking
A student reading a series of books on a subject (e.g., Philosophy) can ingest the books' summaries and notes. The AI can create a "Concept Map" where different philosophers' views on the same topic are linked, allowing the student to see the evolution of an idea across different texts.

## Key Insights & Takeaways
- **Move from RAG to Synthesis:** Stop asking AI to search files every time; instead, have it build a permanent knowledge base that grows smarter over time.
- **Persistence is Power:** The value of the LLM Wiki is that the synthesis is done upfront, meaning the AI doesn't start from scratch with every query.
- **Maintain a Source of Truth:** By keeping the `/raw` folder read-only, you ensure that the original data is never corrupted or altered by the AI.
- **The Schema is Evolvable:** The `Claude.md` file is not static; you should refine the rules as the wiki grows and you discover better ways to organize the information.
- **Visualizing Knowledge:** Using Obsidian's Graph View allows you to see the "nodes" of your knowledge, making the connections between disparate pieces of information visible.
- **Interlinked Logic:** The system's strength lies in the AI's ability to update existing pages based on new information, creating a compounding effect of knowledge.

## Common Pitfalls / What to Watch Out For
- **Over-complicating the Schema:** Beginners may try to make the rules too complex. Start with a basic template and refine it as you go.
- **Ignoring the Source of Truth:** Modifying files in the `/raw` folder can lead to confusion; always keep raw sources separate from the AI's synthesized output.
- **Trusting Without Verification:** While the AI does the writing, the user must still oversee the "scope" of the updates to ensure the AI isn't hallucinating or misinterpreting the source.

## Review Questions
1. How does the LLM Wiki method differ from standard Retrieval Augmented Generation (RAG) in terms of "memory" and "compounding"?
2. Explain the role of the "Schema" file. What would happen to the organization of the wiki if this file were missing or vague?
3. If you were building a wiki for a professional project, how would you utilize the three-layer architecture (Raw, Wiki, Schema) to ensure your data remains accurate?

## Further Learning
- **Claude Code & AI Agents:** Explore how to use terminal-based AI agents that have file-system access to automate the ingestion process.
- **Markdown Mastery:** Learn advanced Markdown syntax to better customize the templates the AI uses.
- **Knowledge Graph Theory:** Study how networked thought (non-linear note-taking) differs from traditional folder-based organization.
