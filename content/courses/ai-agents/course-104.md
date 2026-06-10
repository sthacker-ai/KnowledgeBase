---
title: "A Comprehensive Guide to Loop Engineering with AI Agents"
source_id: "2064127981161959567"
source_type: "x_linked_source"
topic_slug: ai-agents
topic_label: "AI Agents"
source_handle: "@addyosmani"
tweet_url: "https://x.com/addyosmani/status/2064127981161959567"
has_transcript: false
generated_at: "2026-06-10T07:16:52.527Z"
---
# A Comprehensive Guide to Loop Engineering with AI Agents

## Overview

Loop engineering is a new approach to working with AI coding agents, where you design a system that prompts the agent instead of manually doing it yourself. In this course, you will learn about the five building blocks of loop engineering, how they work together, and how to use them to create efficient and effective AI-powered workflows.

## Background & Context

Loop engineering is a concept introduced by Addy Osmani, a senior staff engineer at Google. It is a response to the limitations of manually prompting AI coding agents, which can be time-consuming and error-prone. By designing a system that prompts the agent, you can automate and optimize the process, making it more efficient and effective.

## Core Concepts

### Loop Engineering

Loop engineering is the process of designing a system that prompts an AI coding agent, instead of manually doing it yourself. A loop can be thought of as a recursive goal, where you define a purpose and the AI iterates until complete.

### Five Building Blocks

There are five building blocks of loop engineering:

1. **Automations**: Automations are tasks that go off on a schedule and do discovery and triage by themselves. They can call a skill, which is a reusable set of instructions and metadata, to keep the recurring task maintainable.
2. **Worktrees**: Worktrees are separate working directories on their own branches, sharing the same repo history. They allow multiple agents to work on the same repo at once without bumping into each other.
3. **Skills**: Skills are how you stop re-explaining the same project context every session. They are a folder with a SKILL.md inside, holding instructions and metadata, and optional scripts, references, and assets.
4. **Plugins and connectors**: Plugins and connectors allow you to plug the agent into the tools you already use.
5. **Sub-agents**: Sub-agents are separate agents that each have a specific role, such as having an idea and checking it.

### Memory

Memory is a place to remember stuff, such as a markdown file or a Linear board. It holds what's done and what is next, and is essential for long-running agents because the agent forgets everything between runs.

## How It Works / Step-by-Step

To create a loop engineering workflow, you need to:

1. Define your purpose and the AI's goal.
2. Create automations to do discovery and triage.
3. Set up worktrees to allow multiple agents to work on the same repo at once.
4. Define skills to write down the project knowledge the agent would otherwise just guess.
5. Use plugins and connectors to plug the agent into the tools you already use.
6. Create sub-agents for specific roles.
7. Set up a memory to hold what's done and what is next.

## Real-World Examples & Use Cases

Here are some examples of how loop engineering can be used:

- Automating daily issue triage in a large codebase.
- Summarizing CI failures and writing commit briefings.
- Hunting bugs that were added last week.
- Writing tests and linting code.
- Collaborating on a large codebase with multiple team members.

## Key Insights & Takeaways

- Loop engineering is the future of how we work with coding agents.
- It is important to be careful about token costs and ensure quality doesn't drop.
- The five building blocks of loop engineering are automations, worktrees, skills, plugins and connectors, and sub-agents.
- Memory is essential for long-running agents.
- Both Codex and Claude Code have all five building blocks of loop engineering.

## Common Pitfalls / What to Watch Out For

- Be careful about token costs and usage patterns.
- Make sure to ensure quality and address concerns about slop.
- Be aware of the orchestration tax, which is the review bandwidth that decides how many agents you can actually run, not the tool.

## Review Questions

1. What is loop engineering and how does it work?
2. What are the five building blocks of loop engineering?
3. How do automations, worktrees, skills, plugins and connectors, and sub-agents work together in a loop engineering workflow?
4. Why is memory important for long-running agents?
5. What are some examples of how loop engineering can be used?
6. What are some potential pitfalls to watch out for when using loop engineering?

## Further Learning

- Learn more about AI coding agents and their capabilities.
- Explore different tools and systems for working with AI coding agents.
- Experiment with creating your own loop engineering workflows.
- Read more about the orchestration tax and how to manage it.
- Stay up-to-date with the latest developments in loop engineering and AI coding agents.
