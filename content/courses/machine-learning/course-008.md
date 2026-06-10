---
title: "This beginner guide to Karpathy's LLM Wiki is one of the most useful AI videos i've shared this year\n\nKarpathy's idea: instead of asking AI questions every time, make it build you a permanent knowledge base that grows smarter over time\n\n> drop your documents into a folder\n>"
source_id: "2055237756318781502"
source_type: "x_video"
topic_slug: machine-learning
topic_label: "Machine Learning"
source_handle: "@polydao"
tweet_url: "https://x.com/polydao/status/2055237756318781502"
has_transcript: true
generated_at: "2026-06-09T07:56:20.493Z"
---
Course Title: Building a Personal Knowledge Base with Karpathy's LLM Wiki
=========================================================================

Overview
--------

In this comprehensive guide, we will explore Karpathy's concept of the LLM (Language Model as a Knowledge Base) wiki, a novel approach to creating a permanent, self-updating knowledge base using AI. By the end of this course, you will be able to create your own LLM wiki and leverage its power to grow your personal knowledge base.

Background & Context
-------------------

The traditional way of interacting with AI involves asking questions and receiving answers based on a one-time search through your documents. However, this approach lacks the ability to build upon previous searches, resulting in redundant work and limited knowledge retention. Karpathy's LLM wiki aims to address this issue by creating a structured wiki from your documents, allowing the AI to build a persistent knowledge base that compounds its understanding over time.

Core Concepts
-------------

### Retrieval Augmented Generation (RAG)

RAG is the current standard method for AI-based document search, where the AI searches through your documents, pulls out relevant pieces, and generates an answer to your question. While functional, RAG lacks the ability to build upon previous searches, resulting in inefficiencies and limited knowledge retention.

### LLM Wiki

The LLM wiki is an alternative to RAG that addresses its limitations by having the AI read your documents once and build a structured wiki out of them. This wiki serves as a real, persistent knowledge base made of interlinked markdown files. As new sources are added, the AI reads them, extracts key ideas, and integrates them into the wiki, updating existing pages, creating new pages for new concepts, and linking related ideas together.

How It Works / Step-by-Step
------------------------

1. **Prepare your folder structure**: Create three folders in your LLM wiki vault: raw, wiki, and templates.
    - The raw folder contains your original documents (e.g., PDFs, articles, meeting notes).
    - The wiki folder is where the AI builds and maintains all of its pages.
    - The templates folder (optional) contains consistent formatting templates for manually creating notes in Obsidian.
2. **Create the schema file**: This file, called Claude.md (when using Claude Code), tells the AI how to structure the wiki, handle new sources, and format everything. It includes the following components:
    - Purpose: The knowledge base's subject matter.
    - Folder structure: Where raw resources and wiki output are located.
    - Ingest workflow: The steps the AI takes when a new source document is added (read, extract key concepts, create/update wiki pages, update the index, log changes).
    - Page formatting rules: Guidelines for formatting wiki pages (e.g., summaries, claim sources, linking to related concepts).
    - Question answering behavior: How the AI should respond when asked a question (consult the wiki, cite sources, indicate uncertainty).
3. **Ingest a new source document**: When a new source document is added to the raw folder, use the AI to read it, extract key concepts, create/update wiki pages, update the index, and log changes.
4. **Visualize the connections**: Use Obsidian's graph view to see the connections between wiki pages, providing a visual representation of the knowledge base's structure.

Real-World Examples & Use Cases
-----------------------------

* **Planning a trip to Japan**: Use an LLM wiki to organize travel blog posts, food guides, and other relevant sources into a comprehensive guide for your trip.
* **Researching renewable energy**: Create an LLM wiki to track and organize research papers, articles, and other sources related to renewable energy.
* **Literary analysis**: Use an LLM wiki to compile and analyze information from various books, articles, and literary critiques.

Key Insights & Takeaways
-----------------------

* Karpathy's LLM wiki offers a more efficient and comprehensive approach to creating a personal knowledge base compared to traditional RAG methods.
* By creating a structured wiki from your documents, the AI builds a persistent knowledge base that compounds its understanding over time.
* The LLM wiki can be easily visualized using tools like Obsidian, allowing you to see the connections between different pieces of information.

Common Pitfalls / What to Watch Out For
------------------------------------------

* Ensuring the AI correctly extracts key concepts and links related ideas together.
* Maintaining an organized folder structure for easy management and growth of the wiki.
* Regularly reviewing and refining the schema file as the wiki evolves.

Review Questions
----------------

1. How does the LLM wiki differ from the traditional RAG method for AI-based document search?
2. Describe the process of ingesting a new source document into the LLM wiki.
3. Provide an example of how the LLM wiki can be applied in a real-world scenario.

Further Learning
---------------

* Explore other AI-based tools and methods for creating and managing personal knowledge bases.
* Learn more about Obsidian and its features, including advanced graph view options and custom plugins.
* Research different AI coding agents, such as OpenAI Codex and Cursor, to compare their capabilities and limitations.
