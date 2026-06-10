---
title: "Building a Self-Running Business: Integrating Obsidian, Claude Code, and n8n"
source_id: "2054405527312969840"
source_type: "x_video"
topic_slug: ai-agents
topic_label: "AI Agents"
source_handle: "@cyrilXBT"
tweet_url: "https://x.com/cyrilXBT/status/2054405527312969840"
has_transcript: true
generated_at: "2026-06-09T05:51:10.821Z"
---
# Building a Self-Running Business: Integrating Obsidian, Claude Code, and n8n

## Overview
This course explores a powerful architectural synergy between Obsidian, Claude Code, and n8n to create a "business that runs itself." By combining a personal knowledge base (Second Brain) with a command-line AI agent and automation tools, users can move beyond simple chat interfaces to create a system that possesses deep, persistent context. This course teaches how to feed "the beast" (the LLM) with high-quality, structured context to generate superior ideas and automate complex workflows while you sleep.

## Background & Context
The modern challenge with AI agents is the "context gap." Most users interact with LLMs via web interfaces (like ChatGPT or Claude.ai) where memory is opaque; the user doesn't know exactly what the AI remembers or forgets, and they often find themselves repeating the same project descriptions and constraints in every new session. This inefficiency slows down delegation and limits the AI's ability to perform complex tasks.

This system, championed by Vin (Internet Vin) and discussed by Cyril, solves this by moving the AI's "memory" out of the LLM's internal memory and into a local, user-controlled environment. By using Obsidian as a structured repository of thought and Claude Code as the execution engine, the user creates a "thinking partner" that can access a lifetime of notes, relationships, and project specifications instantly. This shifts the AI from a generic assistant to a specialized agent that understands the user's specific patterns of thinking and business needs.

## Core Concepts

### Claude Code
Claude Code is an AI agent that operates within a Command Line Interface (CLI). Unlike a web-based chatbot, Claude Code has the ability to control your computer directly. It can perform system-level tasks using natural language commands, such as creating files, reading directories, and editing text. For example, a user can simply tell the agent to "make a file on my desktop that says, hello, Greg, in plain text," and the agent will execute the command and create the file without the user needing to open a text editor manually.

### Obsidian (The Second Brain)
Obsidian is a knowledge management tool that acts as an interface sitting on top of a collection of local Markdown files. While it may look like a standard folder of notes, its primary power lies in its ability to create "interrelationships" between files via backlinks. This allows users to connect disparate ideas—such as linking a note about a specific person (e.g., Greg Eisenberg) to a note about a specific project or a daily log. This structure mimics the human brain's associative thinking, allowing for a non-linear organization of information.

### The Obsidian Vault
A "Vault" is the central repository where all Obsidian files are stored. Unlike a standard computer folder, a Vault is an ecosystem where Obsidian tracks the connections between files. This creates a "Graph View," a visualization where each circle represents a file and the lines represent the links between them. This allows the user to see how different domains—such as "Personal Agent Infrastructure," "Agentic AI," and "Startup Patterns"—intersect and overlap.

### Contextual Feeding ("Feeding the Beast")
The central thesis of this system is that the quality of AI output is directly proportional to the quality of the context provided. "Feeding the beast" refers to the process of passing specific, robust files into the AI agent rather than relying on the agent's internal memory. By passing a detailed project description file (e.g., a `todo-app.md` file), the user eliminates the need to re-explain the project scope in every new session, allowing the agent to hit the ground running immediately.

### Obsidian CLI
The Obsidian CLI (Command Line Interface) is the bridge that allows Claude Code to interact with the Obsidian Vault. It enables the AI agent to not only read the text within the Markdown files but also to understand the *relationships* (the backlinks) between those files. This means the AI can see that File A is connected to File B and File C, allowing it to synthesize information across the entire knowledge base to find latent patterns that the human user might have missed.

## How It Works / Step-by-Step

### Step 1: Structuring the Knowledge Base (Obsidian)
The process begins by building a robust Vault in Obsidian. The user creates Markdown files for various categories:
- **Daily Notes:** Tracking daily activities and thoughts.
- **Project Descriptions:** Detailed specifications for what a project should be (e.g., a to-do list app that reads from calendars, messages, and Slack).
- **People Notes:** Notes on individuals, their insights, and patterns observed during interactions.
- **Interlinking:** Using `[[links]]` to connect these files, creating a web of knowledge.

### Step 2: Implementing Claude Code via CLI
Once the knowledge base is established, the user employs Claude Code in the terminal. Instead of typing a long prompt, the user references specific files from the Vault.
- **Example:** Instead of explaining a project for ten minutes, the user tells Claude Code: "I want to work on this project: `todo-app.md`."
- **Result:** Claude Code reads the file, understands the scope, and immediately begins scoping the first session with relevant questions.

### Step 3: Leveraging the Obsidian CLI for Pattern Recognition
By using the Obsidian CLI, the user allows Claude Code to analyze the relationships within the Vault. The agent can then perform "latent idea discovery." The agent scans the interrelationships and can alert the user to patterns, such as: *"You've been writing about this same pattern in startups across every single note you've made over the last year."*

### Step 4: Creating Custom Context Commands
To streamline the process, the user can create custom terminal commands to load specific "context packages." 
- **Example Command:** `context / context load full context about my life work and current state`
- **Execution:** This command triggers a script that reads context files, daily notes, and follows backlinks to build a complete, 360-degree picture of the user's current state before the AI begins its task.

## Real-World Examples & Use Cases

### Use Case 1: Rapid Project Initiation
Imagine you are building a complex app. Instead of starting a new chat and spending 30 minutes explaining the tech stack and goals, you have a `project_spec.md` file in your Obsidian Vault. You open Claude Code and say, "Reference `project_spec.md` and implement the login logic." The AI has the full context instantly and produces code that aligns perfectly with the established project goals.

### Use Case 2: Latent Pattern Discovery
A user has been journaling for two years about various business failures. By allowing Claude Code to analyze the Obsidian Vault via the CLI, the AI notices that every failure was preceded by a specific mistake in "customer acquisition strategy." The AI surfaces this pattern, providing a "light bulb effect" that leads to a breakthrough in the user's business strategy.

### Use Case 3: The "Self-Running Business" (Integration with n8n)
While the transcript focuses on the Obsidian/Claude Code link, the overarching goal is integrating these with **n8n** (a workflow automation tool). 
- **Scenario:** n8n triggers a process based on an external event (e.g., a new lead comes in). 
- **Action:** n8n triggers Claude Code.
- **Context:** Claude Code reads the user's "Sales Strategy" and "Client Personas" files from Obsidian.
- **Output:** Claude
