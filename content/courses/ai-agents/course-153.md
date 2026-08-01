---
title: "Getting Cheap Vision for AI Agents: Using Gemini 2.5 Flash‑Lite as Eyes for Fable/Opus  "
source_id: "2081849012815343669"
source_type: "x_linked_source"
topic_slug: ai-agents
topic_label: "AI Agents"
source_handle: "@WiFiMoneyGuy"
tweet_url: "https://x.com/WiFiMoneyGuy/status/2081849012815343669"
has_transcript: false
generated_at: "2026-08-01T14:47:22.893Z"
---
# Getting Cheap Vision for AI Agents: Using Gemini 2.5 Flash‑Lite as Eyes for Fable/Opus  

## Overview  
This course teaches how to give a powerful reasoning model—such as Fable 5 or Opus 5—the ability to “see” images and video without incurring the prohibitive token costs of sending raw pixels to the model itself. You will learn why frontier models are blind to video, how the cost of vision explodes when images are repeatedly fed into conversation history, and how to offload the visual work to a dirt‑cheap multimodal model (Gemini 2.5 Flash‑Lite via OpenRouter) that returns concise text descriptions. By the end of the course you will be able to wire a single‑tool setup that lets your agent call the cheap eyes, receive a textual witness, and reason over that text—saving orders of magnitude on cost while preserving the analytical power of your primary model.  

## Background & Context  
Modern large language models (LLMs) excel at reasoning, planning, and language generation, but most frontier models lack native video input capability. Even when they can accept images, each image is encoded as thousands of tokens, and because LLMs resend the entire conversation history on every turn, a single image can be charged dozens or hundreds of times. Developers have historically worked around this blindness by manually screenshotting, hand‑transcribing video frames, or pasting screenshots into the model—processes that are tedious, error‑prone, and expensive.  

Andres (@WiFiMoneyGuy) discovered that the real bottleneck is not model intelligence but economic efficiency. By separating the “seeing” task from the “reasoning” task, he could keep his expensive reasoning model (Fable/Opus) focused on high‑level judgment while delegating pixel‑level perception to a cheap, fast multimodal model. This division of labor mirrors human cognition: we rely on a quick, low‑resolution visual system to gather data and a slower, deliberative system to interpret it. The approach became viable once open‑router‑style APIs made it trivial to swap models per agent, a capability that was previously locked inside closed‑source harnesses like Claude Code or Codex.  

## Core Concepts  

### Model Blindness and the Hidden Cost of Vision  
Fable 5 and Opus 5 cannot process video directly; they only accept image inputs via the Claude API. A full‑resolution image sent to Opus 5 consumes roughly 4,784 tokens. At the Opus 5 input price of $5 per million tokens, that equals about $0.02 (2 cents) per image. For Fable 5, priced at $10 per million input tokens, the same image costs closer to $0.05 (5 cents). While two cents per image sounds trivial, agents typically examine many frames—dozens of screenshots for a single browsing session or video breakdown. More critically, every image placed in the conversation history is re‑transmitted on each subsequent turn. In a 20‑turn dialogue that includes 10 images, the model does not pay for 10 image charges; it pays for roughly 10 × 20 = 200 image charges, turning a few‑cent expense into a dollar‑level cost. This hidden multiplication is the primary reason naïve vision integration becomes untenable at scale.  

### Division of Labor: Reasoner vs. Eyes  
The solution is to treat visual perception as a separate service. The expensive reasoning model (the “reasoner”) receives only textual descriptions of what is seen, while a low‑cost, multimodal model (the “eyes”) handles the actual pixel analysis and returns a concise summary. Text is the natural lingua franca of LLMs; a 300‑token description captures the essential signal of a 4,784‑token image at roughly 6 % of the weight, and because text is cheap to resend, the cost explosion disappears. This mirrors how humans use a fast, low‑fidelity visual stream to gather data and a slower, high‑fidelity cognitive stream to interpret it. By keeping the reasoner blind to raw pixels but well‑informed via textual witnesses, you preserve analytical power while drastically reducing token usage.  

### Token‑Level Economics of Gemini 2.5 Flash‑Lite  
Gemini 2.5 Flash‑Lite, accessed through OpenRouter, is a fast, lightweight multimodal model that accepts images, MP4, MOV, WEBM, and even public YouTube links. Its pricing is $0.10 per million input tokens and $0.40 per million output tokens, with a 1 million‑token context window. At default resolution it samples video at approximately 1 frame per second, yielding roughly 300 tokens per second of footage. Consequently:  

* A 60‑second TikTok ≈ 18,000 tokens 000 tokens → ≈ $0.002 (a fifth of a cent).  
* A 3‑minute video ≈ ½ cent.  
* A full hour of low‑resolution YouTube video ≈ 4 cents.  
* A single image ≈ 258 tokens → ≈ $0.000003 (three‑thousandths of a cent), about 1,000× cheaper than feeding the same image to Opus 5.  

Because Flash‑Lite is not intended to be a “smart” model, its role is purely that of a witness: it describes what is on screen, timestamps, on‑screen text, cuts, framing, hook structure, etc. The reasoner then performs judgment, comparison, and decision‑making over that textual witness.  

### One‑Tool Integration Pattern  
OpenRouter exposes a standard Chat Completions endpoint, so the entire visual‑perception capability can be wrapped in a single shell tool. The basic curl request looks like:  

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer <OPENROUTER_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "google/gemini-2.5-flash-lite:free",
        "messages": [
          {
            "role": "user",
            "content": [
              { "type": "text", "text": "<YOUR_QUESTION>" },
              { "type": "image_url", "image_url": { "url": "file:///path/to/image.jpg" } }
            ]
          }
        ]
      }'
```

For video, replace the `image_url` block with a `video_url` pointing to the local file or a public YouTube URL. The response contains a `choices[0].message.content` field holding the textual description.  

A convenient wrapper script (`look.sh`) can be created:  

```bash
#!/usr/bin/env bash
# look.sh <file_path> <question>
FILE="$1"
QUESTION="$2"

RESPONSE=$(curl -s https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
        \"model\": \"google/gemini-2.5-flash-lite:free\",
        \"messages\": [
          {
            \"role\": \"user\",
            \"content\": [
              { \"type\": \"text\", \"text\": \"$QUESTION\" },
              { \"type\": \"image_url\", \"image_url\": { \"url\": \"file://$FILE\" } }
            ]
          }
        ]
      }")

# Extract the assistant's reply (adjust jq filter if needed)
echo "$RESPONSE" | jq -r '.choices[0].message.content'
```

Make the script executable (`chmod +x look.sh`) and ensure the `OPENROUTER_API_KEY` environment variable is set.  

### Prompt Engineering for the Visual Witness  
The usefulness of the cheap eyes depends heavily on the question you ask. Generic prompts like “describe this video” yield verbose, unfocused output. Instead, ask for specific, structured observations:  

* Timestamps of key events.  
* On‑screen text (titles, subtitles, UI elements).  
* Cut types (jump cuts, cross‑dissolves).  
* Framing (close‑up, wide shot, rule‑of‑thirds).  
* Hook structure (how the first 3 seconds grab attention).  

By constraining the output, you reduce token usage and increase the signal‑to‑noise ratio for the reasoner. The prompt becomes a contract: the eyes must return only the requested data, which the reasoner can then safely consume.  

### Hybrid Approach: When to Call the Reasoner Directly  
Flash‑Lite, while cheap and fast, may miss subtle details that a frontier model would catch (e.g., micro‑expressions, fine‑grained text, low‑contrast objects). Andres recommends a fallback: if a single frame is deemed critical—for instance, a legal document, a product label, or a safety signal—send that frame directly to the reasoner (Fable/Opus) and accept the ~2 cent cost. All other frames and video streams flow through the cheap eyes. This hybrid strategy guarantees correctness where it matters while preserving overall cost efficiency.  

## How It Works / Step‑by‑Step  

1. **Obtain an OpenRouter API key** – Sign up at openrouter.ai, create a key, and export it as `OPENROUTER_API_KEY` in your shell environment.  

2. **Install dependencies** – You need `curl` and `jq` (for JSON parsing). On Ubuntu/Debian: `sudo apt-get install curl jq`.  

3. **Create the look.sh script** – Copy the script shown above into a file named `look.sh`, make it executable, and place it in a directory on your `$PATH`.  

4. **Define the agent’s tool call** – In your agent framework (e.g., a custom wrapper around Claude Code, or a simple REPL), add a rule: when the agent needs visual input, invoke `look.sh <path> "<question>"` and capture the stdout as a text variable.  

5. **Formulate the visual question** – Decide what you need from the eyes. Example for a TikTok analysis:  
   ```
   look.sh video.mp4 "Give me timestamps (in seconds) of each scene change, any on-screen text, and a brief description of the visual hook in the first 3 seconds."
   ```  

6. **Feed the output to the reasoner** – Append the returned text to the conversation history as a normal user message. The reasoner (Fable/Opus) now reasons over the description instead of raw pixels.  

7. **Optional: Critical‑frame fallback** – If the agent detects low confidence or a high‑stakes decision, bypass `look.sh` and send the specific image/video segment directly to the reasoner via the standard Claude API, accepting the higher token cost for that single piece.  

8. **Loop and scale** – Repeat steps 4‑7 for each visual query. Because each call to Flash‑Lite costs only fractions of a cent, you can process thousands of images or hours of video at a negligible budget.  

## Real‑World Examples & Use Cases  

### TikTok Trend Analysis at Scale  
Andres runs a business that monitors thousands of TikTok videos daily to detect emerging audio trends, visual motifs, and call‑to‑action patterns. Using the described pipeline, each 60‑second TikTok costs roughly $0.002 to process with Flash‑Lite. Analyzing 10 000 videos per day amounts to about $20 in visual‑perception cost, compared to ≈ $200 if each frame were sent to Opus 5 (assuming 10 frames per video and 20‑turn history). The reasoner then extracts hashtags, detects product placements, and scores engagement potential—all from the textual witnesses.  

### Automated Video‑Based Research  
A market‑research team needs to scan hours of YouTube product reviews to identify sentiment and feature mentions. By setting the question to “list every spoken mention of the product name, any on‑screen text showing price, and timestamp of each sentiment shift (positive/negative)”, the eyes produce a compact transcript‑style summary. The reasoner clusters sentiments, computes feature frequency, and generates a report—all while spending only a few cents per hour of video.  

### Image‑Heavy Documentation Review  
A legal team reviews scanned contracts where each page is an image. Instead of sending each page (≈ 258 tokens) to Opus 5 at ~2 cents per page, they call `look.sh contract_page.png "Extract all clauses, dates, and party names; output as bullet list."` The eyes return a ~150‑token textual summary per page, reducing cost to a few‑tenths of a cent per page and eliminating the multiplicative history cost.  

### Real‑Time Assistive Agent  
A personal assistant agent helps a user navigate a complex software UI by watching the screen. The agent asks the eyes: “What button is currently highlighted, what tooltip text appears, and what menu is open?” The eyes return a short description like “Blue ‘Save’ button highlighted, tooltip ‘Save changes’, File menu open.” The reasoner then decides the next action (e.g., click Save, open Help). Because the agent queries the eyes every few seconds, the ongoing cost remains under a cent per minute.  

## Key Insights & Takeaways  

- **Vision is expensive when pixels are sent to a reasoning model**; each image can cost cents and gets multiplied by conversation‑history turns.  
- **Separating perception (eyes) from reasoning (reasoner) eliminates the cost explosion** because text is cheap to resend and captures the essential signal.  
- **Gemini 2.5 Flash‑Lite via OpenRouter provides the cheapest working eyes**: ~300 tokens/sec video (~$0.002 per minute) and ~258 tokens/image (~$0.000003).  
- **A single‑tool setup (curl/OpenRouter) is sufficient**; wrap it in a script like `look.sh` and call it from your agent whenever visual input is needed.  
- **Prompt design matters more than model power** for the eyes; ask for timestamps, on‑screen text, cuts, framing, hook structure to get maximal utility per token.  
- **Flash‑Lite is a witness, not a judge**; it excels at describing what is present but may miss subtle details.  
- **Adopt a hybrid approach**: use the cheap eyes for bulk work, and fall back to the reasoner for critical frames where subtlety decides the outcome.  
- **The pipeline enables previously infeasible scale**: analyzing thousands of TikTok videos or hours of YouTube content for just a few dollars per day.  
- **Cost awareness must include conversation history**; always account for re‑transmission of visual tokens on every turn.  
- **Effective agent design treats perception as a service**, mirroring human cognition: fast, low‑fidelity input feeds a slower, high‑fidelity reasoning system.  

## Common Pitfalls / What to Watch Out For  

- **Ignoring history multiplication**: Failing to realize that each image is resent on every turn leads to severe under‑estimation of cost.  
- **Using vague prompts**: Asking “describe this video” yields long, unfocused outputs that waste tokens and reduce signal quality for the reasoner.  
- **Over‑reliance on Flash‑Lite for critical details**: Missing subtle cues (e.g., fine print, micro‑expressions) can cause erroneous decisions; always verify high‑stakes frames with the reasoner.  
- **Neglecting API rate limits**: OpenRouter may enforce per‑minute request limits; batch calls or implement retry‑with‑backoff to avoid throttling.  
- **Hard‑coding file paths**: Ensure the script resolves relative paths correctly and sanitizes inputs to prevent injection attacks.  
- **Assuming Flash‑Lite understands context**: The model treats each request independently; it does not retain memory of prior frames unless you explicitly pass them in the prompt.  
- **Forgetting to set the API key**: The script will fail silently if `OPENROUTER_API_KEY` is not exported, leading to debugging frustration.  
- **Misestimating token usage**: Remember that output tokens from Flash‑Lite also incur cost ($0.40 per million); keep prompts concise to limit output length.  
- **Using the wrong model identifier**: OpenRouter model strings must match exactly (e.g., `google/gemini-2.5-flash-lite:free`). Typos cause 404 errors.  
- **Neglecting error handling**: Always check the HTTP status code and JSON structure; network errors or malformed responses should trigger a fallback or retry.  

## Review Questions  

1. **Why does sending a raw image to a reasoning model like Opus 5 become prohibitively expensive in a multi‑turn agent conversation?**  
   Explain the token cost per image, the price per million tokens, and how conversation history causes the image to be resent on each turn, providing a numerical example.  

2. **Describe the step‑by‑step process of integrating Gemini 2.5 Flash‑Lite as a visual “eyes” tool for an agent that uses Fable/Opus as its reasoner.**  
   Include obtaining the API key, creating the `look.sh` script, forming a prompt, calling the script, and feeding the returned text back to the reasoner.  

3. **You are tasked with analyzing a collection of 5 000 YouTube videos (average length 4 minutes) to detect brand logos and on‑screen text. Using the numbers from the source, estimate the total visual‑perception cost if you process every video through Gemini 2.5 Flash‑Lite, and compare it to the cost if you sent each frame (assuming 1 frame per second) directly to Opus 5.**  
   Show your calculations, state assumptions, and discuss the cost‑savings factor.  

## Further Learning  

- Study **model routing and agent frameworks** (e.g., LangChain, LlamaIndex, AutoGPT) to see how to dynamically select the cheapest suitable model for each sub‑task.  
- Explore **prompt engineering techniques** for multimodal models, including few‑shot examples, chain‑of‑thought prompting, and structured output formats (JSON, XML).  
- Investigate **other low‑cost multimodal models** available on OpenRouter or similar aggregators (e.g., Claude 3 Haiku, GPT‑4o mini, Phi‑3‑vision) and compare their pricing and performance characteristics.  
- Learn about **token budgeting and cost monitoring** for LLM applications; tools like `litellm`, `LangSmith`, or custom middleware can help track per‑call expenses in real time.  
- Read up on **hybrid AI architectures** where a fast, lightweight model handles perception or retrieval and a powerful model handles reasoning, planning, or generation (e.g., Retrieval‑Augmented Generation, Tool‑former).  
- Examine **video understanding benchmarks** (e.g., ActivityNet, Something‑Something‑V2) to understand what current vision models can and cannot reliably detect, informing when to fallback to a reasoner.  
- Practice building **cost‑aware agents** by simulating various usage patterns (high‑frequency image queries, long‑form video analysis) and observing the impact on total expense.  

---  

*This course extracts every detail, example, statistic, and technique from the source material and expands it into a teachable, step‑by‑step guide for anyone who wants to give their AI agents cheap, reliable vision.*
