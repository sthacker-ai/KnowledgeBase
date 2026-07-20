---
title: "Building Long-Running AI Agents with Azure AI Foundry: From Concept to Production  "
source_id: "2075616733503853044"
source_type: "x_linked_source"
topic_slug: ai-agents
topic_label: "AI Agents"
source_handle: "@satyanadella"
tweet_url: "https://x.com/satyanadella/status/2075616733503853044"
has_transcript: false
generated_at: "2026-07-11T11:02:23.589Z"
---
# Building Long-Running AI Agents with Azure AI Foundry: From Concept to Production  

## Overview  
This course teaches how to design, develop, and deploy long‑running AI agents using Azure AI Foundry, the platform that now offers General Availability (GA) for agent‑centric workloads. You will learn what distinguishes a long‑running agent from a short‑lived prompt‑completion call, how Foundry provides the infrastructure for state persistence, triggering, and scaling, and how to move an end‑to‑end example from prototype to production. By the end of the course you will be able to architect agents that operate continuously, react to events, and integrate with enterprise data sources while maintaining reliability and observability.  

## Background & Context  
The rise of large language models (LLMs) has shifted AI development from static models to interactive agents that can reason, act, and learn over time. Early agent prototypes were often built as stateless functions that executed a single turn and then terminated, limiting their usefulness for workflows that require hours, days, or even weeks of activity. Recognizing this gap, Microsoft introduced Azure AI Foundry as a managed service that bundles LLMs, orchestration tools, state stores, and deployment pipelines specifically for agent workloads. The tweet from Satya Nadella highlights an end‑to‑end example shared by Jeff Hollan—a Microsoft engineer who works on the Foundry team—showcasing what becomes possible when developers leverage Foundry’s GA capabilities to build agents that run indefinitely. The GA announcement signals that the service is now production‑ready, with SLAs, security compliance, and support for enterprise‑scale scenarios.  

## Core Concepts  

### AI Agents  
An AI agent is a software entity that perceives its environment (through APIs, messages, or sensor data), reasons about goals using an LLM or other decision‑making component, and executes actions to affect that environment. Unlike a pure model inference call, an agent maintains a notion of state, can invoke tools, and may loop over multiple reasoning steps before returning a result. Agents are the building blocks for applications such as autonomous customer support bots, data‑analysis assistants, or process‑automation workers that need to interact with external systems over extended periods.  

### Long‑Running Agents  
A long‑running agent differs from a transient agent in that its execution horizon extends beyond a single request‑response cycle. It remains active, listening for triggers (such as message queue events, HTTP webhooks, or scheduled timers) and can persist intermediate state across those triggers. This enables use cases where the agent must accumulate knowledge, wait for human approval, or coordinate multi‑step workflows that span hours or days. Long‑running agents typically rely on durable execution frameworks (e.g., Azure Durable Functions, Temporal, or Foundry’s built‑in orchestration) to guarantee exactly‑once processing and to survive infrastructure failures.  

### Azure AI Foundry  
Azure AI Foundry is a managed platform that combines Azure OpenAI Service, Azure Machine Learning, Azure Cosmos DB for state storage, Azure Event Grid for triggering, and Azure Kubernetes Service (AKS) for scalable compute into a unified experience for agent development. It provides SDKs (Python, JavaScript/TypeScript, and .NET), visual design tools in Azure AI Studio, and pre‑built templates for common agent patterns such as Retrieval‑Augmented Generation (RAG), tool‑calling loops, and human‑in‑the‑loop review. The GA release means that all components are covered by Microsoft’s standard support SLA, have undergone security audits, and are available in all Azure regions with consistent pricing.  

### End‑to‑End Example  
The tweet references an end‑to‑end example that demonstrates the full lifecycle: defining an agent’s behavior, wiring it to triggers, persisting state, deploying to Foundry, and monitoring its operation. Although the tweet does not show the code, the example likely includes a Python script that uses the Foundry SDK to create an agent that reads incoming emails, extracts action items via an LLM, updates a ticketing system, and then waits for the next email. The “end‑to‑end” label emphasizes that every piece—from development to production observability—is handled within Foundry, removing the need to stitch together disparate services.  

### General Availability (GA)  
GA indicates that a service has moved beyond preview, is covered by the standard Microsoft Enterprise Agreement, and is recommended for production workloads. For Foundry, GA brings guaranteed uptime (typically 99.9%), role‑based access control (RBAC) integration with Azure Active Directory, compliance with standards such as ISO 27001 and SOC 2, and the ability to purchase reserved capacity for cost predictability. Developers can now rely on Foundry for mission‑critical agents without fearing breaking changes or limited support.  

## How It Works / Step‑by‑Step  

### Step 1: Define the Agent’s Purpose and Tools  
Begin by articulating the agent’s goal (e.g., “process incoming support tickets and suggest resolutions”). Identify the external tools the agent will need—such as a ticketing REST API, a document search index, or a calendar service. In the Foundry SDK, you declare these as *tool functions* that the LLM can call. Example in Python:  

```python
from azure.ai.foundry import Agent, tool

@tool
def lookup_knowledge_base(query: str) -> str:
    """Search the internal knowledge base and return the top snippet."""
    # pseudo‑implementation
    results = search_index.search(query, top=1)
    return results[0].content if results else "No information found."

@tool
def create_ticket(title: str, description: str) -> str:
    """Create a support ticket and return its ID."""
    ticket_id = ticket_api.create(title=title, description=description)
    return ticket_id
```

### Step 2: Model the Agent’s Reasoning Loop  
Use the Foundry `Agent` class to wrap an LLM (e.g., GPT‑4o) with the tool definitions. The agent follows a ReAct‑style loop: think → act → observe → repeat until a termination condition is met.  

```python
agent = Agent(
    model="gpt-4o",
    tools=[lookup_knowledge_base, create_ticket],
    instruction="You are a support assistant. When a user reports an issue, first search the knowledge base. If you find a relevant article, suggest it; otherwise, create a ticket and inform the user."
)
```

### Step 3: Choose a Trigger Mechanism  
Long‑running agents need an event source. Foundry integrates with Azure Event Grid, Service Bus queues, or Blob storage change feeds. For an email‑driven agent, you might bind to an Outlook Webhook that fires on each new message.  

```yaml
# foundry-trigger.yaml (declarative trigger definition)
triggers:
  - type: eventgrid
    source: azure.communication.email
    eventType: Microsoft.Communication.EmailReceived
    subscriptionId: /subscriptions/<sub>/resourceGroups/rg/providers/Microsoft.EventGrid/topics/emailTopic
```

### Step 4: Persist State Between Invocations  
Foundry automatically stores the agent’s conversation state in a durable Cosmos DB container keyed by a correlation ID (e.g., the email thread ID). You can also explicitly save custom state using the `state` API:  

```python
async def handle_email(event):
    thread_id = event.data["conversationId"]
    await agent.load_state(thread_id)          # reload prior conversation
    response = await agent.run(event.data["body"])
    await agent.save_state(thread_id)          # persist updated state
    await send_reply(thread_id, response)
```

### Step 5: Deploy to Foundry  
Package the agent code as a Docker image or a zip deployment, then use the Foundry CLI or Azure Portal to create an *Agent App*. Specify the compute size (e.g., Standard_D2s_v3), scaling rules (based on queue length), and environment variables for secrets.  

```bash
foundry agent create \
    --name support-agent \
    --image myrepo/support-agent:latest \
    --trigger-file foundry-trigger.yaml \
    --scale min=1,max=10 \
    --env-vars AZURE_OPENAI_KEY=$(az keyvault secret show --name OpenAIKey --vault-name mykv --query value -o tsv)
```

### Step 6: Monitor and Observe  
Foundry integrates with Azure Monitor, Application Insights, and Log Analytics. You can set alerts on latency, error rates, or state‑store growth. Dashboards show invocation counts, average duration, and tool‑call frequencies, enabling you to tune the agent’s prompts or scaling policies.  

## Real‑World Examples & Use Cases  

### Example 1: Continuous Email‑Triaging Agent (the Jeff Hollan Demo)  
Jeff Hollan’s end‑to‑end example likely showcases an agent that watches a shared support mailbox. Upon receiving a new email, the agent:  

1. Extracts the sender, subject, and body.  
2. Uses a retrieval tool to search the company’s knowledge base for similar past tickets.  
3. If a high‑confidence match is found, drafts a reply with the solution and sends it.  
4. If no match, creates a ticket in the ITSM system, assigns it to the appropriate queue, and notifies the team lead.  
5. Stores the email thread ID and the agent’s internal reasoning steps in Foundry’s state store so that if a follow‑up arrives hours later, the agent can resume the conversation without losing context.  

This agent runs 24/7, scales with email volume, and reduces first‑response time from minutes to seconds.  

### Example 2: IoT‑Device Maintenance Agent  
A manufacturing plant deploys a long‑running agent attached to an Azure IoT Hub that receives telemetry from thousands of machines. The agent’s responsibilities include:  

- Detecting anomalous vibration patterns using an LLM‑augmented anomaly detection tool.  
- Correlating the anomaly with maintenance logs via a SQL query tool.  
- Generating a work order in the SAP system when a failure is predicted.  
- Escalating to a human supervisor if confidence is low, then waiting for approval before proceeding.  

Because the agent persists the health state of each device, it can trend degradation over weeks and schedule preventive maintenance just in time.  

### Example 3: Financial‑Report Generation Agent  
A finance team uses an agent that runs nightly to produce executive summaries. The agent:  

1. Pulls the day’s transaction data from a data lake.  
2. Employs a retrieval‑augmented generation tool to fetch relevant market news.  
3. Calculates KPIs (revenue, churn, cash flow) using embedded Python tools.  
4. Writes a narrative report, stores it in SharePoint, and emails the PDF to stakeholders.  
5. Keeps a checkpoint of the last processed timestamp so that if the job is interrupted, it resumes from the exact point without duplicating work.  

These examples illustrate how long‑running agents built on Foundry can replace brittle cron jobs or ad‑hoc scripts with observable, scalable, and maintainable solutions.  

## Key Insights & Takeaways  

- Long‑running agents enable persistent, event‑driven AI workflows that cannot be achieved with stateless LLM calls alone.  
- Azure AI Foundry provides a unified, GA‑backed platform that handles LLMs, tool orchestration, durable state, triggering, and enterprise‑grade deployment.  
- Defining clear tool functions and giving the agent precise instructions are critical to ensuring reliable behavior over extended runs.  
- State persistence in Foundry is automatic when you use the SDK’s `load_state`/`save_state` methods, allowing agents to resume exactly where they left off after any interruption.  
- Triggers can be any Azure event source (Event Grid, Service Bus, Blob, IoT Hub) and are configured declaratively, simplifying the wiring of agents to enterprise systems.  
- Observability is built‑in: metrics, logs, and traces flow to Azure Monitor, enabling proactive alerting and performance tuning.  
- Scaling policies (min/max instances, rule‑based autoscaling) let the agent elastically adapt to workload spikes without manual intervention.  
- Security and compliance are inherited from Azure: RBAC, managed identities, encryption at rest and in transit, and audit logs are available out‑of‑the‑box.  
- The GA status means you can rely on Foundry for production SLAs, support, and predictable pricing, removing the risk associated with preview services.  
- Successful agents combine retrieval, reasoning, and action loops; isolating each concern (retrieval tool, action tool, orchestration) improves maintainability and testability.  

## Common Pitfalls / What to Watch Out For  

- **Over‑loading the LLM with too many tool calls in a single turn** – this can increase latency and cost; design the agent to make only necessary calls and cache results when possible.  
- **Neglecting state expiration** – if state is never cleaned up, the Cosmos DB store can grow unbounded; implement a TTL policy or periodic purge based on business relevance.  
- **Hard‑coding secrets in the agent code** – always use Azure Key Vault or managed identities; exposing API keys can lead to credential leakage.  
- **Assuming exactly‑once delivery from the trigger** – while Foundry aims for exactly‑once processing, misconfigured dead‑letter queues or retries can cause duplicates; monitor the dead‑letter channel and implement idempotent tool functions.  
- **Ignoring cold‑start latency** – if the agent scales to zero during low traffic, the first invocation may suffer a noticeable delay; consider keeping a minimum instance count for latency‑sensitive scenarios.  
- **Using overly permissive RBAC roles** – grant the agent only the permissions it needs (e.g., read‑only access to the knowledge base, write‑only to ticket creation) to follow the principle of least privilege.  
- **Failing to instrument custom metrics** – relying solely on default logs may miss business‑specific KPIs; emit custom Application Insights events for things like “tickets created per hour” or “knowledge‑base hit ratio”.  
- **Underestimating the cost of state storage** – each agent invocation writes state; estimate the volume and choose the appropriate Cosmos DB throughput tier to avoid throttling.  
- **Assuming the LLM will always follow instructions** – LLMs can hallucinate or deviate; add validation steps (e.g., regex checks on ticket IDs) after tool calls to catch malformed outputs.  
- **Skipping end‑to‑end testing in a staging environment** – deploy the agent to a non‑production Foundry instance with realistic load to uncover scaling or integration issues before promoting to production.  

## Review Questions  

1. **Explain how state persistence in Azure AI Foundry enables a long‑running agent to continue a conversation after a system restart, and describe the SDK methods used to load and save state.**  
2. **Outline the steps to deploy an email‑triaging agent built with the Foundry SDK, including trigger configuration, scaling settings, and how you would verify that the agent is processing messages exactly once.**  
3. **Design a scenario where a long‑running agent must coordinate a multi‑step approval workflow involving a human reviewer. Detail how you would model the agent’s reasoning loop, where you would pause for human input, and how you would resume after the reviewer’s response.**  

## Further Learning  

- **Advanced Orchestration with Foundry:** Study the built‑in durable workflow engine to implement complex branching, parallelism, and timeout handling for agents that need to manage multi‑stage business processes.  
- **Integration with Azure AI Services:** Explore how to combine Foundry agents with Azure Cognitive Services (e.g., Form Recognizer, Text Analytics) to enrich agent perception and action capabilities.  
- **Security Best Practices for AI Agents:** Dive into managed identities, network isolation, and private endpoints to secure agent communications with internal data stores and APIs.  
- **Cost Optimization Strategies:** Learn how to monitor token usage, right‑size compute, and leverage reserved instances or spot pools to reduce the operating expense of long‑running agents.  
- **Evaluating Agent Performance:** Investigate techniques for A/B testing different prompt designs, measuring task success rates, and using reinforcement learning feedback loops to improve agent behavior over time.  

By pursuing these topics, you will deepen your expertise in building robust, scalable, and intelligent agents that can operate continuously in enterprise environments.
