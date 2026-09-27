---
title: "Building Trust in AI Agents: From Babysitting to Autonomous Software Factories"
source_id: "2103431302527508886"
source_type: "x_video"
topic_slug: ai-agents
topic_label: "AI Agents"
source_handle: "@mattpocockuk"
tweet_url: "https://x.com/mattpocockuk/status/2103431302527508886"
has_transcript: true
generated_at: "2026-09-27T06:37:06.241Z"
---
# Building Trust in AI Agents: From Babysitting to Autonomous Software Factories

## Overview
This course explores how to transform AI agents from unreliable tools that require constant supervision into trusted autonomous workers capable of producing high-quality software at scale. We'll examine the journey of Lauren (Potato), an engineer at SpaceX AI, who increased her productivity from manual debugging to shipping 2,000 pull requests per month by systematically building trust in her AI agents. The course covers practical strategies for agent verification, skill development, and architectural changes that enable agents to work effectively with minimal human intervention.

## Background & Context
The concept of AI agents as software development assistants represents a paradigm shift in how we approach coding. Traditionally, developers have relied on their own expertise and manual processes to build and maintain software. However, as AI capabilities advance, there's growing potential for agents to handle significant portions of development work. This shift mirrors historical transformations in manufacturing, where automation changed how products were made, but with a crucial difference: software development remains fundamentally creative and artistic.

Lauren's experience at Cursor (now part of SpaceX AI) demonstrates how AI agents can transform software development workflows. Her journey from manual performance debugging to creating autonomous verification systems highlights the potential of agent-assisted development. The "Michelin kitchen" analogy she presents underscores that while agents can handle many tasks, developers still play a crucial role as chefs overseeing the entire process - setting up the right environment, tools, and workflows to ensure high-quality outcomes.

## Core Concepts

### The Trust Spectrum in AI Agents
Trust in AI agents exists on a spectrum that evolves as agents become more capable and reliable. At the beginning of the journey, developers typically work with 1-5 agents that require constant supervision and intervention. This "babysitting" phase is characterized by:
- Frequent course corrections
- Manual verification of every output
- Limited agent autonomy

As trust grows, developers can scale to dozens or even hundreds of agents working simultaneously. This progression depends on several key factors:
1. Verification capabilities that allow agents to validate their own work
2. Comprehensive skill sets that enable sophisticated development tasks
3. Architectural changes that make codebases more agent-friendly

### Verification Skills
Verification skills form the foundation of trust by enabling agents to empirically validate their work. These skills range from basic debugging to advanced formal verification:

**Basic Verification Skills:**
- Running applications and collecting performance traces
- Using debugging protocols (e.g., Chrome DevTools Protocol)
- Taking heap snapshots and analyzing memory usage

**Advanced Verification:**
- Formal methods using languages like Lean or TLA+
- Business logic invariant checking
- Automated correctness proofs

The Control Glass skill developed by Lauren exemplifies basic verification, allowing agents to:
- Reproducibly run applications
- Collect empirical evidence of performance
- Identify hotspots and bottlenecks

### Feature Maps
Feature maps serve as materialized memory for AI agents, providing structured information about:
- Application features and their locations
- User interaction patterns (keyboard shortcuts, DOM elements)
- Feature functionality and purpose

These maps enable agents to:
1. Understand vague user requests by mapping screenshots to specific features
2. Navigate applications more effectively
3. Provide consistent responses to similar queries

### Agent-Friendly Architecture
To fully leverage AI agents, software architecture must evolve to:
1. **Encode best practices** in the codebase itself
2. **Standardize patterns** that agents can easily extend
3. **Provide clear documentation** within the code
4. **Implement guardrails** that prevent common mistakes

This architectural approach ensures that agents "do the right thing by default," reducing the need for human intervention.

### The PSAC Plugin
The PSAC (Potato's Software Agent Collection) plugin represents a comprehensive set of skills that teach agents to:
- Debug effectively
- Develop features
- Prototype solutions
- Maintain code quality

These skills codify expert workflows and best practices, enabling agents to:
1. Follow established development patterns
2. Maintain consistent code quality
3. Adapt to team-specific requirements

## How It Works / Step-by-Step

### Building Trust in AI Agents: A Progressive Approach

**Step 1: Establish Basic Verification**
1. Create a verification skill with a CLI interface
2. Implement application control through debugging protocols
3. Develop basic performance tracing capabilities
4. Example: Control Glass skill using Chrome DevTools Protocol

```javascript
// Example CLI command structure for Control Glass
const { Command } = require('commander');
const program = new Command();

program
  .command('trace')
  .description('Run application and collect performance traces')
  .option('-d, --duration <ms>', 'Trace duration in milliseconds')
  .option('-o, --output <file>', 'Output file path')
  .action(async (options) => {
    // Implementation would use Chrome DevTools Protocol
    // to control the application and collect traces
  });

program.parse(process.argv);
```

**Step 2: Develop Comprehensive Feature Maps**
1. Create a structured representation of application features
2. Include interaction patterns and navigation paths
3. Automate feature map maintenance
4. Integrate with verification skills

```json
// Example feature map entry
{
  "name": "Checkout Button",
  "description": "Initiates the checkout process for items in cart",
  "location": {
    "dom": "#cart-checkout",
    "shortcut": "Ctrl+Shift+C"
  },
  "dependencies": ["cart-service", "payment-gateway"],
  "related_features": ["shopping-cart", "payment-form"]
}
```

**Step 3: Implement Advanced Verification**
1. Add performance metrics collection
2. Incorporate code quality checks
3. Develop automated testing integration
4. Implement business logic validation

```python
# Example performance metric collection
def collect_performance_metrics():
    metrics = {
        'load_time': measure_load_time(),
        'memory_usage': measure_memory(),
        'cpu_usage': measure_cpu(),
        'network_requests': count_network_requests()
    }
    return metrics
```

**Step 4: Develop Agent Skills**
1. Codify expert workflows in PSAC
2. Create playbooks for common tasks
3. Implement team-specific best practices
4. Standardize development patterns

```yaml
# Example PSAC skill configuration
- name: feature_development
  description: "Develop a new application feature"
  steps:
    - analyze_requirements
    - design_architecture
    - implement_code
    - write_tests
    - verify_performance
  dependencies:
    - verification_skills
    - code_quality_skills
```

**Step 5: Refactor Architecture for Agents**
1. Standardize code patterns
2. Document architectural decisions
3. Implement guardrails
4. Create agent-friendly interfaces

```typescript
// Example agent-friendly interface
interface IAgentTask {
  execute(): Promise<ExecutionResult>;
  verify(): Promise<VerificationResult>;
  getDependencies(): Dependency[];
  getMetadata(): TaskMetadata;
}
```

## Real-World Examples & Use Cases

### Performance Optimization at Cursor
Lauren's initial challenge at Cursor involved improving the performance of the agent window. By developing verification skills, she:
1. Automated performance tracing and analysis
2. Identified and fixed bottlenecks
3. Established continuous performance monitoring
4. Reduced manual debugging effort by 80%

### Feature Development Automation
In a typical feature development scenario, agents equipped with PSAC skills can:
1. Parse vague user requests using feature maps
2. Generate multiple implementation options
3. Verify each option against performance and quality metrics
4. Select the optimal solution
5. Implement and test the feature automatically

### Bug Triage and Resolution
For bug reports, agents can:
1. Analyze error reports and stack traces
2. Reproduce issues using verification skills
3. Identify root causes
4. Suggest and implement fixes
5. Verify the fixes resolve the issue

## Key Insights & Takeaways
- Trust in AI agents develops progressively through verification, skill development, and architectural improvements.
- Verification skills provide the foundation for autonomous agent work by enabling self-validation.
- Feature maps serve as critical memory structures that enhance agent understanding of applications.
- Agent-friendly architecture reduces the need for human intervention by encoding best practices.
- The PSAC plugin demonstrates how expert workflows can be codified to improve agent performance.
- The Michelin kitchen analogy highlights the creative role developers play in overseeing agent work.
- Productivity gains from agents compound as trust increases and agents become more autonomous.
- Architectural changes to support agents represent a long-term investment in development efficiency.
- Verification exists on a spectrum from basic debugging to advanced formal methods.
- The transition from manual work to agent-assisted development requires systematic skill building.

## Common Pitfalls / What to Watch Out For
- **Over-reliance on agents without proper verification**: Without verification skills, agents may produce incorrect or low-quality work.
- **Insufficient feature documentation**: Poorly maintained feature maps limit agent effectiveness in understanding applications.
- **Resistance to architectural changes**: Failing to adapt codebases for agents limits their potential.
- **Underestimating the importance of skill development**: Generic agents perform poorly compared to those with specialized skills.
- **Scaling too quickly**: Attempting to use many agents before establishing trust leads to poor results.
- **Ignoring performance metrics**: Verification must include both correctness and performance considerations.
- **Neglecting code quality**: Agents need skills to maintain high code standards.
- **Overlooking team-specific requirements**: Generic skills may not align with team workflows.
- **Failing to maintain verification infrastructure**: Outdated verification skills become ineffective.
- **Underestimating the creative role**: Developers must remain engaged as overseers of the process.

## Review Questions
1. Explain the trust spectrum in AI agents and describe the characteristics of each stage in the progression from manual supervision to autonomous work.
2. How do verification skills differ from formal verification methods, and what role does each play in building trust in AI agents?
3. Describe the components of a feature map and explain how they enhance an agent's ability to understand and work with an application.
4. What architectural changes are necessary to make codebases more agent-friendly, and why are these changes important for long-term productivity?
5. Using the Michelin kitchen analogy, explain the relationship between developers and AI agents in modern software development.
6. How does the PSAC plugin demonstrate the concept of codifying expert workflows for AI agents?
7. What are the potential consequences of attempting to scale agent usage before establishing proper verification and skill development?
8. Describe a scenario where an agent equipped with verification skills and a feature map could handle a vague user request more effectively than a human developer.
9. How do performance metrics factor into the verification process, and why are they important for maintaining application quality?
10. What role does continuous maintenance play in the effectiveness of verification skills and feature maps?

## Further Learning
- **Advanced Verification Techniques**: Explore formal methods and advanced verification approaches using languages like Lean or TLA+.
- **Agent Skill Development**: Study techniques for creating specialized agent skills tailored to specific development tasks.
- **Architectural Patterns for Agents**: Investigate design patterns that make codebases more amenable to agent interaction.
- **Performance Optimization**: Deepen understanding of performance metrics and optimization techniques.
- **Team Workflow Integration**: Learn how to incorporate agents into existing team workflows and development processes.
- **Ethical Considerations**: Examine the ethical implications of agent-assisted development and autonomous software creation.
- **Future of Agent Development**: Explore emerging trends and research in AI agent capabilities and applications.
- **Case Studies**: Analyze other real-world implementations of agent-assisted development.
- **Tooling Ecosystem**: Investigate complementary tools and platforms that enhance agent capabilities.
- **Human-Agent Collaboration**: Study best practices for effective collaboration between developers and AI agents.
