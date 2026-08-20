---
title: "Managing and Distributing AI Agent Skills Across Teams Using GitHub Plugins  "
source_id: "2090176521335959721"
source_type: "x_video"
topic_slug: ai-agents
topic_label: "AI Agents"
source_handle: "@gregisenberg"
tweet_url: "https://x.com/gregisenberg/status/2090176521335959721"
has_transcript: true
generated_at: "2026-08-20T06:38:27.215Z"
---
# Managing and Distributing AI Agent Skills Across Teams Using GitHub Plugins  

## Overview  
This course teaches how to capture, share, and maintain AI agent skills—standard operating procedures (SOPs) encoded as markdown files—so that every member of a team can invoke the same expert‑level behavior in Claude or Codex. By turning a GitHub repository of skills into a plug‑in that auto‑updates, teams eliminate duplicate copies, version drift, and the manual overhead of sharing .skill files. The approach transforms the current “Microsoft Word era” of skills into a collaborative, single source of truth akin to Google Docs, guaranteeing consistent output and measurable time savings (e.g., two hours per week per skill).  

## Background & Context  
AI agents such as Claude and Codex can execute complex tasks, but without explicit guidance they produce inconsistent or low‑quality output (“slop”). Users therefore create **skills**—markdown documents that encode personal preferences, formatting rules, and step‑by‑step instructions—to steer the agent toward reliable results. Initially these skills live only on an individual’s machine, making teamwide adoption cumbersome: sharing via Slack, email, or cloud‑storage folders creates duplicate files that diverge when either party updates a skill. The lack of a central repository mirrors the early days of personal‑computer document collaboration before Google Docs solved the problem. The solution presented in the source is to host skills in a GitHub repository, expose that repository as a plug‑in consumable by Claude/Codex, and enable automatic updates so every teammate always runs the latest version of each skill.  

## Core Concepts  

### Skill  
A skill is a markdown file that functions as an SOP for an AI agent. It contains a name, a short description, and a detailed, step‑by‑step guide that tells the agent exactly how to perform a task (e.g., “create a proposal for Greg Eisenberg”). When the agent loads the skill, it reads the entire file before executing the task, thereby internalizing the user’s preferences (logo placement, color scheme, tone, formatting) without needing repeated clarification. A well‑crafted skill can save roughly two hours per week by eliminating re‑work and ensuring one‑shot correct output.  

### Plugin (Claude/Codex Skill Plugin)  
A plugin is a structured GitHub repository that the agent treats as a library of skills. The repository contains a folder (commonly `.claude/skills` or a similar designated path) where each skill markdown file resides. Optionally, a `plugin.json` manifest can list the skills and metadata such as version, author, and update frequency. When a user adds the repository as a plugin in Claude or Codex, the agent indexes all markdown files in the designated skill folder and makes them available for invocation via natural‑language commands (e.g., “use the Notion formatting skill”). The plugin mechanism also supports auto‑update: if the repository receives a new commit, the agent pulls the latest version on the next skill load, guaranteeing that all teammates run the same code.  

### Central Source of Truth  
By consolidating every skill in a single GitHub repository, the team establishes a single source of truth. Unlike scattered .skill files on individual laptops or duplicated copies in Slack, the repository guarantees that any change made to a skill is instantly visible to everyone who has the plugin installed and auto‑update enabled. This eliminates version skew, reduces the cognitive overhead of tracking which file is the “latest,” and enables collaborative improvement through pull requests, code review, and issue tracking—practices already familiar to software teams.  

### Auto‑Update Mechanism  
Auto‑update is a feature of the Claude/Codex plugin system that periodically checks the remote GitHub repository for new commits. When a change is detected, the agent automatically fetches the updated skill files and replaces the local copies. Users do not need to manually reinstall or re‑download the plugin; the skill they invoke is always the most recent version committed to the repository. This mirrors how browser extensions or npm packages stay current, but applied to AI agent SOPs.  

### Skill Chains  
A skill chain is the practice of combining multiple skills sequentially to accomplish a complex workflow. For example, a proposal generation workflow might first invoke a “research gathering” skill, then a “outline creation” skill, followed by a “brand‑voice polishing” skill, and finally a “Notion formatting” skill. By chaining skills, teams can reuse proven building blocks and guarantee that each substep adheres to the same standards, further amplifying productivity gains.  

## How It Works / Step‑by‑Step  

### Step 1: Create Individual Skill Files  
Write each skill as a markdown file. Use a consistent header format:  

```markdown
# Skill: Notion Formatting  
**Description:** Ensures all Notion pages produced by the agent follow the team’s readability standards (ample white space, divider lines, blue highlights).  

## Steps  
1. Start with a blank Notion page.  
2. Add a top‑level heading with the document title.  
3. Insert a horizontal divider (`---`) after the title.  
4. For each section, add a heading, then a blank line, then the content.  
5. Apply a blue highlight to key terms using Notion’s `{{blue:text}}` syntax (or the equivalent UI action).  
6. Add a final divider before the signature block.  
7. Insert the standard signature: “Best regards, [Name]”.  
```

Save the file with a descriptive name, e.g., `notion-formatting.skill.md`, inside a folder that will be exposed to the agent (commonly `skills/` or `.claude/skills/`).  

### Step 2: Initialize a GitHub Repository  
Create a new repository (e.g., `team-skills`) on GitHub. Clone it locally, copy all skill markdown files into the designated skill folder, and commit:  

```bash
git init team-skills
cd team-skills
mkdir -p .claude/skills
cp /path/to/your/skills/* .claude/skills/
git add .
git commit -m "Initial import of team Notion, brand voice, and email formatting skills"
git remote add origin https://github.com/yourorg/team-skills.git
git push -u origin master
```

### Step 3: Expose the Repository as a Plugin  
In Claude or Codex, open the plugin settings (often found under `Settings → Plugins`). Choose “Add Plugin from GitHub” and paste the repository URL. The agent will read the `.claude/skills` folder, index each markdown file, and list them as available skills.  

### Step 4: Enable Auto‑Update  
Within the same plugin dialog, toggle the “Auto‑update” switch. The agent will now schedule periodic checks (e.g., every hour) for new commits on the default branch. When a teammate pushes an improvement—say, adding a new divider style to the Notion skill—the agent automatically pulls the change and the next invocation of the skill uses the updated version.  

### Step 5: Invoking Skills in Workflows  
To use a skill, simply ask the agent to “use the Notion formatting skill” or invoke it via a shortcut if your interface supports it. The agent loads the markdown, reads the steps, and executes the task exactly as defined. For a skill chain, list multiple skills in sequence:  

```
Use the research gathering skill.  
Then use the outline creation skill.  
Then use the brand voice polishing skill.  
Finally use the Notion formatting skill.  
```  

Each step runs with its own SOP, guaranteeing consistent output across the entire pipeline.  

### Step 6: Collaborative Improvement  
Team members propose skill enhancements by forking the repository, editing a skill markdown file, opening a pull request, and requesting review. Once merged, the auto‑update mechanism propagates the improvement to everyone. This workflow mirrors standard software development practices, ensuring that skills evolve with peer review and version control.  

## Real‑World Examples & Use Cases  

### Notion Formatting Skill  
The author built a skill that teaches Claude how to produce Notion pages with lots of white space, divider lines, and blue highlights for key elements. Without the skill, Claude’s raw Notion output is a cramped, illegible block of text. After applying the skill, every generated Notion page matches the author’s preferred layout, making team documentation uniformly readable.  

### Brand Voice Skill  
A second skill encodes the “AI with Remy” brand voice for email assets, landing‑page copy, and other marketing copy. It specifies tone (friendly yet authoritative), preferred sentence length, use of active voice, and mandatory inclusion of the logo and tagline. When any team member invokes this skill before writing copy, the agent produces text that adheres to the brand guide without further editing.  

### Email Formatting Skill (Resend ESP)  
The third example formats outgoing emails sent via Resend. The skill dictates generous white space, blue call‑to‑action buttons, a signature block with logo at the top, and a consistent closing line. By loading this skill, the agent creates notification and marketing emails that look polished and match the company’s visual standards, eliminating the need for designers to tweak each output.  

### Skill Chain for Investor Updates  
A hypothetical chain could combine:  

1. **Data Retrieval Skill** – pulls latest metrics from internal databases.  
2. **Chart Generation Skill** – creates visualizations in a prescribed style.  
3. **Narrative Writing Skill** – writes a commentary using the brand voice skill.  
4. **Email Formatting Skill** – packages the narrative and charts into a Resend‑ready email.  

Invoking the chain yields a complete investor update with zero manual formatting, demonstrating how skill composition multiplies time savings.  

## Key Insights & Takeaways  

- Skills are markdown‑based SOPs that let AI agents reproduce expert‑level, preference‑driven output in a single shot.  
- Without a sharing mechanism, skills remain siloed on individual machines, leading to duplicate, divergent copies and wasted effort.  
- Hosting skills in a GitHub repository creates a central source of truth, enabling version control, peer review, and traceable evolution of each SOP.  
- Exposing the repository as a Claude/Codex plug‑in lets agents automatically discover and load skills; enabling auto‑update guarantees every teammate runs the latest version.  
- A well‑crafted skill can save roughly two hours per week per user; stacking multiple skills across workflows yields compounding productivity gains.  
- Skill chains allow teams to compose complex, repeatable processes from proven building blocks, ensuring consistency at each stage.  
- The plug‑in approach works for non‑technical teammates because it relies on familiar GitHub interactions (pull, push, pull request) rather than low‑level file‑system hacks like symlinks or manual folder sharing.  
- Adopting this method transforms the team’s AI usage from a “Microsoft Word era” of isolated files to a “Google Docs era” of collaborative, continuously improving SOPs.  

## Common Pitfalls / What to Watch Out For  

- **Sharing raw .skill files via Slack or email** creates duplicates that fall out of sync whenever either party edits a skill; avoid this method entirely.  
- **Using Google Drive, Dropbox, or Obsidian folders** requires the agent to read from a non‑standard location, which necessitates fragile symlinks or manual configuration that breaks for non‑technical users.  
- **Failing to enable auto‑update** means teammates will continue to run stale versions of skills after you push improvements, defeating the purpose of a central repo.  
- **Neglecting to include a clear name and description** at the top of each skill markdown file makes it difficult for the agent to surface the skill in prompts and for teammates to understand its purpose.  
- **Over‑loading a single skill with too many steps** can reduce readability and make debugging harder; prefer modular, single‑purpose skills that can be chained.  
- **Ignoring pull‑request review** risks introducing errors or inconsistencies into the skill base; treat skill changes like code changes and enforce review standards.  
- **Assuming the agent will infer formatting from context**—explicitly specify every preference (spacing, highlights, logo placement) inside the skill; otherwise the agent will default to its own style and produce slop.  

## Review Questions  

1. **Explain, in your own words, why a skill is more effective than repeatedly prompting an AI agent with the same request each time.**  
2. **Describe the complete workflow for turning a collection of skill markdown files into a plug‑in that auto‑updates in Claude/Codex, including the GitHub commands and agent‑side settings required.**  
3. **Imagine your team wants to add a new skill for generating standardized meeting minutes. Outline the steps you would take to create the skill, add it to the repository, propose the change via a pull request, and ensure all teammates receive the update without manual intervention.**  

## Further Learning  

- Advanced skill authoring: incorporating templating languages (e.g., Handlebars) inside skill markdown to dynamically insert variables such as dates, user names, or data from external APIs.  
- Building skill marketplaces: how to publish a plug‑in to a internal or public registry so other teams can discover and install your skills with a single command.  
- Integrating skills with MCP (Model Context Protocol) tools: linking skills to external data sources, APIs, or code executables to enable agents to fetch live information before executing a task.  
- Measuring skill impact: setting up telemetry to track time saved, error reduction, and adoption rates per skill across an organization.  
- Designing skill governance policies: defining review cycles, versioning schemes (semantic versioning for skills), and deprecation procedures for outdated SOPs.  

---
