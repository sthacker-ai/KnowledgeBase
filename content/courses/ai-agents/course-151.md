---
title: "Building AI Agents with Google's Agent Development Kit (ADK): From Concepts to Multi-Agent Systems  "
source_id: "2080725015012811253"
source_type: "x_video"
topic_slug: ai-agents
topic_label: "AI Agents"
source_handle: "@DealsDhamaka"
tweet_url: "https://x.com/DealsDhamaka/status/2080725015012811253"
has_transcript: true
generated_at: "2026-08-01T14:39:33.445Z"
---
# Building AI Agents with Google's Agent Development Kit (ADK): From Concepts to Multi-Agent Systems  

## Overview  
This course walks you through the full content of a 104‑minute Google video on AI Agents, as highlighted in a tweet by @DealsDhamaka. You will learn what AI agents are, how they reason, act, and adapt, and you will build a functional blog‑writing agent step‑by‑step using Google’s Agent Development Kit (ADK). The video also introduces multi‑agent systems, explains how ADK supports them, and describes agent hierarchies. By the end of this course you will have runnable code, a clear mental model of agent patterns, and the knowledge to extend these ideas to your own projects.  

## Background & Context  
The rise of large language models has shifted the focus from static chatbots to autonomous software that can decide and act on behalf of users. Researchers formalized this shift in the ReAct paper, which showed that language models can interleave reasoning with tool use and observation. Google responded by releasing the Agent Development Kit (ADK), a framework designed to make it easy to construct agents, compose them into workflows, and scale to multi‑agent systems. The tweet emphasizes that the entire video consumes only 3.6 % of a typical weekend (2,880 minutes), positioning the material as a high‑impact, low‑time‑investment way to become “AI‑aware.” Understanding these concepts is valuable because agents are now being deployed in customer support, code generation, travel planning, scientific discovery, and many other domains where decision‑making and tool interaction are required.  

## Core Concepts  

### AI Agent Definition  
An AI agent is software that does more than generate a single response; it can decide what actions to take, execute those actions, observe the results, and then decide what to do next. Unlike a traditional chatbot that returns one answer per prompt, an agent loops through a cycle of reasoning, acting, and observing until a goal is satisfied. The video cites the ReAct paper as a clear explanation: language models can reason step‑by‑step, call a tool or API, observe the output, and then continue reasoning based on that observation. This cycle gives agents the ability to adapt to changing conditions and to perform multi‑step tasks such as drafting a blog post, validating an outline, or booking a trip.  

### Reasoning‑Acting‑Observing (ReAct) Loop  
The ReAct loop consists of four phases: (1) **Reason** – the model thinks about what needs to be done given the current state; (2) **Act** – the model selects and invokes a tool (e.g., an API, a code snippet, a database query); (3) **Observe** – the model receives the result of that action; (4) **Adjust** – the model updates its internal state and decides the next action or terminates. This loop is the foundation of modern AI agents because it provides a structured way to intermix cognition with external interaction. In the blog‑writing agent, the planner reasons about the topic, acts by generating an outline, observes the outline’s validity via a checker, and adjusts by regenerating if needed.  

### Agent Patterns (Sequential, Reactive, Planning/Deliberate)  
The video describes three broad behavioral patterns that agents can exhibit:  

* **Sequential agents** execute a fixed series of steps, like an assembly line. Step 1 must finish before step 2 begins. They are predictable and easy to debug but lack flexibility when the environment changes.  
* **Reactive agents** make decisions solely based on the current state, without maintaining a plan. They might choose tool A one moment and tool B the next, depending on what they perceive. This yields high adaptability but can lead to inefficiencies because no look‑ahead is performed.  
* **Planning (or deliberate) agents** pause to construct a plan before acting. For example, a travel‑booking agent first selects dates, then hotels, then flights, following a logical order. Planning agents excel when tasks have dependencies and require foresight.  

The appropriate pattern depends on the problem: simple, linear flows suit sequential agents; highly dynamic environments benefit from reactive agents; multi‑step goals with constraints are best handled by planning agents.  

### Multi‑Agent System (MAS) Fundamentals  
A multi‑agent system arises when multiple agents operate together without a central controller. The video breaks MAS into three key ideas:  

1. **Decentralized control** – each agent makes its own decisions; there is no “boss” agent issuing orders. The analogy is a flock of birds where no single bird leads, yet the flock exhibits coordinated motion.  
2. **Local view** – each agent only perceives a subset of the environment (its neighbourhood). In a crowded stadium, you can see and react to people nearby but not the entire crowd. Agents must rely on limited information and negotiate or infer the rest.  
3. **Emergent behavior** – global patterns arise from simple local rules. The flock’s V‑formation or a market’s price equilibrium are examples of complex system‑level behavior that no single agent designs explicitly.  

These properties enable MAS to solve problems that are too large or too uncertain for a single agent, such as distributed sensor networks, robotic swarms, or collaborative software engineering.  

### ADK Agent Types  
Google’s Agent Development Kit provides built‑in abstractions that map directly to the concepts above:  

* **LM Agent** – the “brain” of the system. It wraps a large language model (e.g., Gemini) to understand input, reason about it, and decide which tool to invoke or what action to take.  
* **Workflow Agent** – the “manager” that coordinates other agents. ADK supplies three concrete workflow agent types:  
  * **Sequential Agent** – runs child agents one after another in a fixed order.  
  * **Parallel Agent** – launches multiple child agents concurrently, useful for calling several APIs at once.  
  * **Loop Agent** – repeats a child agent until a termination condition is met (e.g., validation passes) or a maximum iteration count is reached.  
* **Custom Agent** – a specialist created by subclassing ADK’s base agent class, allowing you to inject arbitrary Python logic when the built‑in types are insufficient.  

These types let developers compose agents declaratively while still being able to drop down to custom code for edge cases.  

### Agent Hierarchy and the Single‑Parent Rule  
In ADK, agents are organized in a tree‑like hierarchy reminiscent of an organizational chart. Every agent (except the root) has exactly one parent. The root agent sits at the top (like a CEO) and can manage multiple sub‑agents (VPs, managers, workers). Sub‑agents inherit configuration and shared state from their parents but cannot have more than one parent, which prevents ambiguous responsibility. This hierarchy simplifies debugging, enables clear ownership of tasks, and makes it possible to propagate configuration (e.g., model selection, safety settings) down the tree.  

### Shared State and Tool Wrapping  
ADK agents communicate through a shared state dictionary. When an agent writes a value (e.g., a blog outline) it stores it under a key (e.g., `blog_outline`). Downstream agents can read that key directly. To hide internal complexity, ADK lets you expose a loop agent or any composite agent as a **tool**. The root agent then calls the tool as a black‑box operation, trusting that the tool will handle retries, validation, and internal looping. This encapsulation yields a clean root‑agent workflow: *topic → planner tool → writer tool → post‑processing*.  

## How It Works / Step‑by‑Step  

### Setting Up the Environment  
1. Install **UV** (a fast Python package installer) as shown in the video:  
   ```bash
   pip install uv
   ```  
2. Install the Google ADK package:  
   ```bash
   uv add google-adk
   ```  
3. Create a file named `agent.py` in your IDE (e.g., VS Code, PyCharm).  

### Defining the Blog Planner Agent  
The planner’s sole responsibility is to convert a user‑supplied topic into a markdown outline.  

```python
from adk import Agent, LoopAgent, Tool

# Planner LM Agent
blog_planner = Agent(
    name="blog_planner",
    model="gemini-pro",                     # pulled from .env
    description="Generates a markdown outline for a blog post.",
    instruction=(
        "You are a blog planner. Given a topic, produce a markdown outline "
        "containing: a title, a short introduction, four to six sections with bullet points, "
        "and a conclusion. Store the result in shared state under the key 'blog_outline'."
    ),
    output_key="blog_outline"
)
```

### Outline Validation Checker  
This agent does not generate new content; it validates the outline stored in `blog_outline`.  

```python
outline_checker = Agent(
    name="outline_validation_checker",
    model="gemini-pro",
    description="Validates that the outline meets structural requirements.",
    instruction=(
        "Read the value of shared state key 'blog_outline'. "
        "If it contains a title, an introduction, four to six sections, and a conclusion, "
        "reply with the exact word 'okay'. "
        "If anything is missing, reply with 'retry' followed by a brief explanation of what is wrong."
    )
)
```

### Robust Blog Planner (Loop Agent)  
Wrap the planner and checker in a loop that retries up to three times if validation fails.  

```python
robust_blog_planner = LoopAgent(
    name="robust_blog_planner",
    agents=[blog_planner, outline_checker],
    max_iterations=3,
    # The loop stops early if the checker returns 'okay'
    completion_condition=lambda state: state.get("last_checker_output") == "okay"
)
```

### Blog Writer Agent  
Takes the validated outline and expands it into a full markdown blog post.  

```python
blog_writer = Agent(
    name="blog_writer",
    model="gemini-pro",
    description="Turns an outline into a full blog post.",
    instruction=(
        "You are a blog writer targeting software engineers. "
        "Assume the audience knows the basics; focus on practical insights, explain both how and why, "
        "and include short code snippets where helpful. "
        "Follow the exact structure of the outline stored in 'blog_outline', using proper markdown headings. "
        "Save the finished draft under shared state key 'blog_post'."
    ),
    output_key="blog_post"
)
```

### Blog Post Validation Checker  
Ensures the generated post satisfies the outline and contains required sections.  

```python
post_checker = Agent(
    name="blog_post_validation_checker",
    model="gemini-pro",
    description="Validates the blog post.",
    instruction=(
        "Read shared state key 'blog_post'. "
        "Check that the article includes an introduction, sections that match the outline, "
        "a conclusion, and clear explanations. "
        "If all good, reply 'okay'. Otherwise reply 'retry' and list the specific fixes needed."
    )
)
```

### Robust Blog Writer (Loop Agent)  
Same pattern as the planner loop, but for writing.  

```python
robust_blog_writer = LoopAgent(
    name="robust_blog_writer",
    agents=[blog_writer, post_checker],
    max_iterations=3,
    completion_condition=lambda state: state.get("last_post_checker_output") == "okay"
)
```

### Exposing Planner and Writer as Tools  
The root agent will call these as black‑box operations.  

```python
planner_tool = Tool.from_agent(robust_blog_planner, name="planner_tool")
writer_tool  = Tool.from_agent(robust_blog_writer,  name="writer_tool")
```

### Root Agent: Blogger  
Orchestrates the high‑level workflow: topic → outline → post → alternative titles & hooks.  

```python
blogger = Agent(
    name="Blogger",
    model="gemini-pro",
    description="Root agent that produces a polished blog post plus variants.",
    instruction=(
        "When the user provides a topic: "
        "1. Call the planner_tool to generate an outline. "
        "2. Call the writer_tool to turn the outline into a full post. "
        "3. Generate three alternative titles and two tweet‑length hooks (≤280 characters) based on the final post. "
        "Return the final post, the alternative titles, and the hooks."
    ),
    # The root agent only sees the two tools we exposed.
    tools=[planner_tool, writer_tool]
)
```

### Running the Agent  
Launch the ADK web interface to interact with the agent visually:  

```bash
adk web   # starts a local server, typically at http://127.0.0.1:8080
```

Open the provided URL in a browser, type a topic (e.g., “Top 10 use cases for AI agents”), and watch the planner, writer, and their validation loops execute. The UI shows the shared state at each step, making the reasoning‑acting‑observing cycle transparent.  

## Real‑World Examples & Use Cases  

* **Blog Writing Agent (detailed above)** – demonstrates a planning agent that uses loops for quality control, a pattern applicable to any document generation pipeline (technical reports, marketing copy, legal summaries).  
* **Travel‑Booking Planning Agent** – a deliberate agent that first selects dates, then hotels, then flights, respecting dependencies (e.g., hotel check‑in must precede flight arrival). This mirrors the “planning agent” pattern described in the video.  
* **Reactive Customer‑Support Agent** – examines the latest user utterance, decides whether to call a knowledge‑base API, a ticket‑creation API, or to escalate to a human, based solely on the current conversation state. No long‑term plan is stored; the agent reacts in real time.  
* **Sequential Data‑Processing Pipeline** – ingest raw data → clean → transform → load into a warehouse. Each stage must finish before the next begins; a sequential agent guarantees ordering and simplifies error handling.  
* **Multi‑Agent Robotic Swarm** – each robot (agent) has only local sensor data (local view), follows simple avoidance and alignment rules (decentralized control), and collectively exhibits flocking or formation‑flying behavior (emergent behavior). ADK could model each robot as an LM agent with a custom policy, coordinated via a parallel workflow agent for simultaneous sensor reads.  
* **Distributed Sensor Network** – agents represent sensor nodes; they exchange readings with neighbors, run a loop agent to detect anomalies, and use a sequential agent to trigger actuation when a threshold is crossed for a sustained period.  

## Key Insights & Takeaways  

- An AI agent is defined by its ability to reason, act, observe, and adjust—not merely to generate a static response.  
- The ReAct framework formalizes the reasoning‑acting‑observing loop that underlies all modern autonomous agents.  
- Agents fall into three behavioral patterns: sequential (fixed order), reactive (state‑driven), and planning (deliberate with forethought). Choose the pattern that matches the problem’s predictability and dependency structure.  
- In a multi‑agent system, decentralized control, local perception, and emergent behavior enable scalability and robustness beyond what a single agent can achieve.  
- Google ADK provides ready‑made building blocks: LM agents for cognition, workflow agents (sequential, parallel, loop) for coordination, and custom agents for specialized logic.  
- ADK enforces a single‑parent hierarchy, making the agent tree intuitive to reason about and simplifying configuration propagation.  
- Shared state is the communication medium; agents write to and read from named keys (e.g., `blog_outline`, `blog_post`).  
- Loop agents give automatic retry mechanics: they repeat a child agent until a validation signal (“okay”) is received or a maximum attempt count is reached, greatly improving reliability.  
- Exposing a loop agent as a tool lets the root agent treat a complex internal workflow as a single atomic operation, preserving clarity in high‑level orchestration.  
- The video’s example shows that a complete, runnable agent can be built in under 150 lines of code once the environment is set up, demonstrating ADK’s low barrier to entry.  
- Understanding agent hierarchy helps you design systems where responsibility is clear, debugging is tractable, and reuse is natural (sub‑agents can be repurposed across different parents).  

## Common Pitfalls / What to Watch Out For  

- **Skipping validation loops** – relying on a single LLM call to produce correct outlines or posts often leads to missing sections; always pair generators with checkers and a loop agent.  
- **Misusing shared‑state keys** – forgetting to set an `output_key` or reading from the wrong key causes silent failures; double‑check key names in both writer and reader agents.  
- **Exceeding loop limits without feedback** – if the validation checker never returns “okay,” the loop will exhaust its retries and halt; ensure the checker’s criteria are achievable given the model’s capabilities.  
- **Over‑centralizing control** – putting too much logic in the root agent defeats the purpose of a hierarchy; keep the root thin and delegate detailed work to sub‑agents.  
- **Ignoring the single‑parent rule** – attempting to give a sub‑agent two parents creates ambiguous state updates and can cause runtime errors in ADK.  
- **Using the wrong workflow type** – selecting a parallel agent when steps have dependencies can cause race conditions; match the workflow agent to the data flow (sequential for ordered steps, parallel for independent tasks).  
- **Neglecting environment configuration** – ADK agents pull model names and API keys from `.env` or similar; missing these leads to authentication errors at runtime.  
- **Assuming LLMs are infallible** – even with validation loops, models can repeatedly produce the same flawed output; consider adding a fallback or human‑in‑the‑loop after a certain number of failures.  

## Review Questions  

1. **Explain the difference between a reactive agent and a planning (deliberate) agent in terms of how they handle future actions.**  
2. **Describe how the Loop Agent in ADK enables automatic retries, and specify what condition must be met for the loop to terminate early in the blog‑writing example.**  
3. **Imagine you need to build an agent that fetches live stock prices, calculates a moving average, and then decides whether to buy or sell. Which ADK agent types (LM, workflow, custom) would you use for each subtask, and why?**  

## Further Learning  

- Study advanced ADK features such as **middleware** for logging, tracing, and error handling across agent calls.  
- Explore how to connect an ADK agent to an **MCP (Model Context Protocol) server** to enable persistent memory and tool discovery, as hinted at in the video’s next‑episode teaser.  
- Investigate **reinforcement‑learning‑based agents** and how they can be wrapped as custom ADK agents to combine LLM reasoning with learned policies.  
- Read research on **agent communication languages** (e.g., FIPA‑ACL, KQML) to understand how agents in a multi‑agent system can negotiate and exchange complex messages beyond simple shared‑state keys.  
- Practice building **heterogeneous multi‑agent systems** where some agents are LM‑powered, others are rule‑based, and others are traditional microservices, all coordinated via ADK workflow agents.  
- Delve into **agent safety and alignment**: techniques for constraining agent actions, implementing oversight loops, and defining utility functions that guide emergent behavior toward desired outcomes.
