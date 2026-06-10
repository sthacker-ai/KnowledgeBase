---
title: "Machine Learning"
topic_slug: machine-learning
course_count: 11
generated_at: "2026-06-09T10:51:03.753Z"
type: topic-summary
---
# Machine Learning

## Overview
Machine Learning (ML) is the scientific study of algorithms and statistical models that enable computers to perform tasks without explicit instructions, relying instead on patterns and inference. This reference page covers a broad spectrum of ML, ranging from the mathematical foundations of sequential decision-making via Markov Decision Processes to the cutting-edge architecture and economics of Large Language Models (LLMs). Readers will find detailed explorations of tokenization, the mechanics of Retrieval-Augmented Generation (RAG), the shift toward self-hosted local inference, and the scaling laws governing modern intelligence. This page serves as a definitive guide for understanding how ML is applied in high-stakes environments like [[finance]] and how it can be leveraged to build persistent, self-improving knowledge systems.

## Key Concepts

### Markov Decision Processes (MDPs)
MDPs provide a mathematical framework for modeling decision-making in stochastic environments where outcomes are partly random and partly under the control of a decision-maker. They are the cornerstone of reinforcement learning, allowing agents to determine an optimal sequence of actions to maximize cumulative rewards over time.

### The Markov Property
A fundamental assumption in MDPs stating that the future state of a system depends solely on the current state and the action taken, regardless of the system's past history. This simplification allows for the rigorous analysis of complex systems without needing to track every previous state transition.

### Tokens and Tokenization
Tokens are the atomic units of text processed by LLMs, acting as the bridge between raw human language and the numerical vectors required by neural networks. Tokenization is the process of breaking text into these sub-word sequences, and it fundamentally dictates how a model perceives meaning and efficiency.

### Scaling Laws
The principle that increasing training tokens, parameter counts, and compute power leads to a predictable decrease in loss and an increase in general intelligence. However, as the industry hits a "data wall," the focus is shifting toward "token efficiency"—extracting more intelligence from existing data rather than simply increasing volume.

### Retrieval-Augmented Generation (RAG)
A method where an LLM retrieves relevant document snippets from an external data source to ground its response in specific facts. While effective for search, standard RAG is often stateless, meaning it does not "learn" or build upon previous queries over time.

### LLM Wiki (Persistent Knowledge Base)
An evolution of RAG where the AI does not just retrieve information but actively builds and updates a structured, permanent knowledge base. This approach transforms a static folder of documents into a living expert system that compounds its understanding through incremental indexing and feedback loops.

### Local Inference and Self-Hosting
The practice of running LLMs on personal hardware rather than via cloud APIs. This shift democratizes access to ML infrastructure, eliminates recurring API costs, and ensures total data privacy by removing the reliance on centralized providers.

## Techniques & Methods

### Sequential Decision Optimization
Used primarily in systematic trading, this method applies MDPs to move beyond simple heuristics. By modeling market data as "states" and trades (buy/sell/hold) as "actions," practitioners can mathematically derive the optimal policy for maximizing long-term returns under uncertainty.

### Token Efficiency and Second-Order Optimization
Advanced architectural optimizations, such as those seen in the Kimi K2 model, involve moving from traditional optimizers to second-order methods. These techniques aim to push the upper bounds of intelligence (especially in specialized tasks like coding) without requiring exponentially larger compute budgets.

### Vector Embeddings and Incremental Indexing
The process of converting text into high-dimensional vectors to enable semantic search. In the context of a permanent knowledge base, incremental indexing allows the system to add new information without retraining the entire model, creating a self-improving loop of knowledge.

### Local Model Deployment via Ollama
A workflow for deploying open-weight models (like OpenAI Codex equivalents) locally. This involves using tools like Ollama to manage model weights and inference, allowing developers to bypass rate limits and integrate ML directly into their [[software-engineering]] pipelines.

## Insights & Lessons Learned

* **Intelligence is as much about economics as it is about algorithms.** I've learned that the development of frontier models is a massive capital undertaking; the ability to allocate resources and optimize training costs is just as critical as the underlying mathematical ingenuity.
* **The "Atom" of the system is the token.** I realized that many of the "weird" behaviors or hallucinations in LLMs can be traced back to how the tokenizer handles specific strings; mastering tokenization is the first step in effectively debugging any LLM.
* **Statelessness is the primary bottleneck of current AI.** Most LLM interactions are ephemeral. By shifting from a "prompt-and-response" model to a "permanent wiki" model, I can move from using AI as a search engine to using it as a compounding intellectual asset.
* **The "Data Wall" is forcing a paradigm shift.** Because high-quality training data is finite, the next leap in AI won't come from more data, but from better token efficiency and more sophisticated agent orchestration.
* **Privacy and cost are the primary drivers for local hosting.** Moving models from the cloud to local hardware isn't just a technical preference; it is a strategic move to ensure data sovereignty and eliminate the financial volatility of API pricing.
* **Mathematical rigor beats heuristics in volatile environments.** In fields like systematic trading, relying on "rules of thumb" is inferior to the rigorous framework of MDPs, which provide a provable path toward optimal decision-making.

## Cross-References
* [[openai-codex]] — The specific model architecture often used for coding tasks and a primary target for local self-hosting.
* [[ai-agents]] — The orchestration layer that allows LLMs to use tools and interact with the "LLM Wiki" to update knowledge bases.
* [[finance]] — The primary application area for MDPs in systematic trading and quantitative decision-making.
* [[data-engineering]] — The underlying infrastructure required to implement vector embeddings and incremental indexing for RAG systems.
* [[software-engineering]] — The discipline required to integrate local LLM inference into production-ready applications.

## Course Index

1. **Markov Decision Processes (MDPs) for Systematic Trading Decisions** (by @RohOnChain) — Explores the mathematical foundation of MDPs to move systematic trading from simple heuristics to optimal sequential decision-making.
2. **The Economics and Competitive Landscape of Large Language Models** (by @EvanLuthra) — Analyzes the massive financial investments required for SOTA models and the competitive dynamics between models like GPT, Claude, and Kimi.
3. **Building a Permanent AI‑Powered Knowledge Base with Karpathy’s LLM Wiki Approach** (by @polydao) — Teaches how to use RAG and vector embeddings to create a self-improving, persistent knowledge base that grows smarter over time.
4. **The Atom of LLMs: Understanding Tokens and Tokenization** (by @rohit4verse) — A deep dive into how text is converted into numerical tokens and how this process influences model behavior and efficiency.
5. **Self-Hosting Large Language Models: Running OpenAI Codex Locally with Ollama** (by @intheworldofai) — A practical guide to deploying powerful models locally to ensure privacy and eliminate API costs.
6. **Machine Learning: Deep Dive into Markov Decision Processes** (by @RohOnChain) — A theoretical exploration of the Markov Property and the formal modeling of states, actions, and rewards in uncertain environments.
7. **Scaling Intelligence: The Architecture and Optimization of Kimi K2** (by @EvanLuthra) — Examines token efficiency and second-order optimization methods to achieve frontier-level intelligence without massive compute.
8. **This beginner guide to Karpathy's LLM Wiki** (by @polydao) — A practical implementation guide on transforming a folder of documents into a structured, AI-driven wiki that avoids the redundancies of standard RAG.
