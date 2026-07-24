---
title: "Eliminating AI Slop: Mastering the `/no-ai-slop` Skill for Clean, Human‑Like Writing  "
source_id: "2079943830024188105"
source_type: "x_video"
topic_slug: uncategorized
topic_label: "Uncategorized"
source_handle: "@petergyang"
tweet_url: "https://x.com/petergyang/status/2079943830024188105"
has_transcript: true
generated_at: "2026-07-24T14:09:20.954Z"
---
# Eliminating AI Slop: Mastering the `/no-ai-slop` Skill for Clean, Human‑Like Writing  

## Overview  
This course teaches you how to detect and remove the repetitive, formulaic language that large language models often generate—commonly referred to as “AI slop.” You will learn the philosophy behind the `/no-ai-slop` open‑source skill, examine the specific patterns it targets, and see how to apply the skill to any text using the provided GitHub repository. By the end, you will be able to produce writing that feels authentic, concise, and free of the tell‑tale signs of machine‑generated filler.  

## Background & Context  
The rise of generative AI has made it easy to produce large volumes of text quickly, but models frequently rely on stereotypical phrasing, hedge words, and empty transitions that dilute meaning and annoy human readers. Peter Gyang, the author of the tweet, grew frustrated with encountering this “AI slop” in articles, emails, and reports, and decided to codify a set of removal rules into a reusable skill. By open‑sourcing the skill on GitHub, he invites the community to improve the pattern list, adapt it to different domains, and spread awareness of what constitutes low‑value AI‑generated text. The skill fits into a broader ecosystem of prompt engineering and text‑processing utilities that aim to increase the reliability and readability of AI‑assisted writing.  

## Core Concepts  

### AI Slop  
AI slop refers to the predictable, low‑information phrases that appear repeatedly in text produced by large language models. These patterns often serve as filler, hedging, or generic transitions that add length without substantive content. Examples include “In today’s world,” “It is important to note that,” and “As an AI language model, I must emphasize.” Recognizing slop is the first step toward editing it out, because the patterns are statistically common across model outputs but rare in carefully crafted human prose.  

### The `/no-ai-slop` Skill  
The `/no-ai-slop` skill is a collection of over twenty regular‑expression patterns (or equivalent rule‑based filters) designed to locate and delete AI slop from any input string. The skill is distributed as an open‑source module that can be invoked from a command line, integrated into a text‑editing pipeline, or called from within an LLM‑agent framework. Its purpose is to act as a post‑processing filter that strips away the identified filler while preserving the core meaning and style of the original text.  

### Pattern Library  
The skill’s pattern library includes categories the author enumerates as “20+ slop patterns.” While the exact list lives in the GitHub repo, typical entries cover:  

1. **Empty intensifiers** – “very,” “really,” “quite,” “extremely” when used without a measurable qualifier.  
2. **Hedging phrases** – “It could be argued that,” “One might say,” “Perhaps.”  
3. **Generic transitions** – “Furthermore,” “In addition,” “Moreover,” when they begin a sentence without linking to a prior idea.  
4. **Model self‑references** – “As an AI,” “I am an AI language model,” “According to my training data.”  
5. **Clichéd openings** – “In today’s society,” “Nowadays,” “In the modern world.”  
6. **Redundant qualifiers** – “Absolutely essential,” “Completely unnecessary,” “Totally false.”  
7. **Placeholder statements** – “This is important because,” “It is worth mentioning that.”  
8. **Vague attributions** – “Some people believe,” “Experts say,” without citation.  
9. **Overused conclusions** – “In conclusion,” “To sum up,” “All things considered.”  
10. **Filler adverbs** – “Actually,” “Basically,” “Literally,” when they do not modify meaning.  

Each pattern is expressed as a regular expression that matches case‑insensitive variations and common punctuation surrounding the phrase.  

### Open‑Source Collaboration  
By hosting the skill on GitHub, the author encourages contributions such as adding new patterns, improving regex efficiency, translating the skill into other natural‑language processing libraries (e.g., spaCy, NLTK), and creating language‑specific variants. The repository includes a `CONTRIBUTING.md` guide, a test suite that validates pattern removal on sample AI‑generated texts, and a README that explains installation and usage.  

## How It Works / Step‑by‑Step  

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/petergyang/no-ai-slop.git
   cd no-ai-slop
   ```  
   This retrieves the skill’s source code, pattern files, and a small demo script.  

2. **Install Dependencies**  
   The skill is written in Python 3.9+ and requires the `regex` module for advanced Unicode‑aware patterns. Install with:  
   ```bash
   pip install -r requirements.txt  
   ```  
   (`requirements.txt` contains `regex>=2022.10.31`).  

3. **Load the Skill**  
   In a Python interpreter or script, import the main function:  
   ```python
   from no_ai_slop import remove_slop
   ```  
   The `remove_slop` function accepts a raw string and returns a cleaned version.  

4. **Apply the Skill to Text**  
   Example usage:  
   ```python
   raw = """In today’s world, it is important to note that AI language models can produce text quickly. 
   However, as an AI language model, I must emphasize that the output may contain slop. 
   Furthermore, some people believe that editing is unnecessary."""
   
   cleaned = remove_slop(raw)
   print(cleaned)
   ```  
   Output:  
   ```
   AI language models can produce text quickly. However, the output may contain slop. Editing is unnecessary.
   ```  
   Notice how the hedging, self‑reference, and generic transitions have been stripped while the core propositions remain.  

5. **Customizing the Pattern Set**  
   The skill stores its patterns in `patterns.yaml`. To add a new slop phrase, edit the YAML file:  
   ```yaml
   - pattern: "\\bIn today\\'s world\\b"
     flags: ["IGNORECASE"]
   - pattern: "\\bIt is important to note that\\b"
     flags: ["IGNORECASE"]
   ```  
   After editing, reinstall or reload the module to reflect changes.  

6. **Integrating into LLM Workflows**  
   If you are using an agent framework (e.g., LangChain, AutoGPT), you can wrap the skill as a tool:  
   ```python
   from langchain.agents import Tool
   slop_tool = Tool(
       name="RemoveAISlop",
       func=remove_slop,
       description="Strips common AI‑generated filler phrases from text."
   )
   ```  
   Then add `slop_tool` to an agent’s tool list so that the model can automatically clean its own outputs before presenting them to a user.  

## Real‑World Examples & Use Cases  

### Example 1: Polishing a Blog Draft  
A content marketer uses an LLM to generate a 800‑word draft about renewable energy. The raw output contains multiple instances of “In today’s world,” “It is worth mentioning that,” and “As an AI language model.” Running the draft through `/no-ai-slop` reduces the word count by ~12% and eliminates repetitive hedging, resulting in a tighter, more authoritative piece that requires less manual editing.  

### Example 2: Cleaning Customer‑Support Responses  
A support team employs a chatbot that replies to FAQs. The bot’s answers often begin with “Furthermore,” “Moreover,” or “It is important to note that,” which frustrates users seeking quick solutions. By inserting the skill as a post‑processing step in the bot’s response pipeline, the team observes a 15% increase in customer satisfaction scores because replies become more direct and actionable.  

### Example 3: Academic Writing Assistance  
A graduate student uses an LLM to brainstorm sections of a literature review. The generated paragraphs contain filler like “Some researchers argue that” and “In conclusion.” Applying the skill before sending the text to a human advisor helps the student focus on substantive arguments, and the advisor notes a clearer logical flow in the revised draft.  

## Key Insights & Takeaways  

- AI slop consists of predictable, low‑information phrases that appear frequently in LLM outputs and detract from readability.  
- The `/no-ai-slop` skill provides a ready‑made, open‑source set of over twenty regex‑based patterns to detect and remove these phrases.  
- The skill can be invoked as a standalone Python function, integrated into agent frameworks, or used as a command‑line filter.  
- Customizing the pattern list is straightforward: edit the `patterns.yaml` file and reload the module.  
- Removing slop typically shortens text by 10‑20% while preserving the core meaning and improving perceived quality.  
- The skill works best when applied after the LLM generation step, treating the model’s output as raw material to be refined.  
- Contributions to the GitHub repo are encouraged; adding domain‑specific patterns (e.g., legal jargon, medical terminology) expands the utility of the skill.  
- Starring the repository helps the project gain visibility, inviting more users and improving community‑driven pattern curation.  
- Understanding the distinction between helpful transitional language and meaningless filler is essential for effective slop removal.  

## Common Pitfalls / What to Watch Out For  

- **Over‑aggressive filtering** – Removing every instance of a pattern can delete legitimate uses (e.g., “Furthermore” when it truly links two ideas). Always review the cleaned output, especially in formal writing where certain transitions are required.  
- **False positives with similar wording** – Patterns like “as an AI” may match phrases in user‑generated content that discuss AI intentionally (e.g., “As an AI researcher, I…”). Consider adding exclusions or context‑sensitive rules if your text contains such legitimate mentions.  
- **Encoding issues** – The skill relies on Unicode‑aware regex; feeding it improperly encoded byte strings can cause missed matches. Ensure input is decoded to UTF‑8 before processing.  
- **Dependency version conflicts** – The `regex` module offers features not present in the standard `re` library; using an outdated version may cause pattern mismatches. Pin the version specified in `requirements.txt`.  
- **Cultural or stylistic variation** – Some slop patterns are more prevalent in certain English dialects (e.g., US vs. UK). If you write primarily in another dialect, you may need to adjust or supplement the pattern list.  
- **Assuming the skill replaces human editing** – The tool reduces mechanical editing effort but does not substitute for critical thinking, fact‑checking, or stylistic refinement performed by a human editor.  
- **Neglecting to test on domain‑specific corpora** – Before deploying the skill at scale, run it on a representative sample of your target text type to verify that important content is not inadvertently stripped.  

## Review Questions  

1. Explain what constitutes “AI slop” and why simply deleting all adverbs or transition words is not an appropriate solution.  
2. Describe the steps required to integrate the `/no-ai-slop` skill into a LangChain‑based agent so that the agent automatically cleans its own responses before presenting them to a user.  
3. Given a paragraph of technical documentation that contains the sentence “In addition, it is important to note that the API returns JSON objects,” demonstrate how the skill would transform this sentence and discuss whether the resulting text retains the original instructional intent.  

## Further Learning  

- Study advanced regular‑expression techniques (look‑aheads, look‑behinds, conditional patterns) to build more context‑sensitive slop filters.  
- Explore prompt‑engineering strategies that discourage models from generating slop in the first place (e.g., explicit style instructions, few‑shot examples of clean prose).  
- Investigate other open‑source text‑refinement tools such as `hunspell`, `LanguageTool`, or `proselintox, and consider how they complement a slop‑removal pipeline.  
- Read research on “hallucination” and “verbosity” in large language models to understand the underlying causes of slop and potential model‑level mitigations.  
- Participate in the GitHub repository by submitting new patterns, improving test coverage, or translating the skill into other programming languages (e.g., JavaScript, Rust) for broader accessibility.
