#!/usr/bin/env python3
"""
generate_audio.py — Convert a 2-speaker podcast script to MP3 using Kokoro 82M via OpenRouter.

Usage:
    python scripts/transcribe/generate_audio.py <script_file> <output_mp3>

Script format expected:
    [ALEX]: Hello, welcome to the show...
    [SAM]: Thanks Alex, today we're talking about...

Voice roles:
    ALEX = male   (explainer)  — default: am_echo  (American English male)
    SAM  = female (questioner) — default: af_nova  (American English female)

Override voices via env vars: KOKORO_VOICE_MALE, KOKORO_VOICE_FEMALE
American male:   am_adam, am_echo, am_eric, am_fenrir, am_liam, am_michael, am_onyx, am_orion
American female: af_alloy, af_aoede, af_bella, af_heart, af_jessica, af_kore, af_nicole, af_nova
British male:    bm_daniel, bm_fable, bm_george, bm_lewis
British female:  bf_alice, bf_emma, bf_isabella, bf_lily

Requirements:
    OPENROUTER_API_KEY in .env
    ffmpeg on PATH  (only needed for multi-segment concatenation)

Orpheus upgrade path (GPU, high quality):
    Set ORPHEUS_API_URL=http://localhost:5005 in .env
    Requires: ollama pull legraphista/Orpheus:3b-ft-q4_k_m + Orpheus-FastAPI server
"""
import json
import os
import re
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request

# Ensure UTF-8 output on Windows (handles → ✓ ⏱ 💰 etc.)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


# ── Load .env if present (for direct Python invocations) ─────────────────────
def _load_dotenv() -> None:
    """Minimal .env loader — does not override existing env vars."""
    dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".env")
    if not os.path.isfile(dotenv_path):
        return
    with open(dotenv_path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, val = line.partition("=")
            if key.strip() and key.strip() not in os.environ:
                os.environ[key.strip()] = val.strip()


_load_dotenv()

# ── Config ────────────────────────────────────────────────────────────────────
# Kokoro 82M voice names — override via KOKORO_VOICE_MALE / KOKORO_VOICE_FEMALE env vars.
# American male:   am_adam, am_echo, am_eric, am_fenrir, am_liam, am_michael, am_onyx, am_orion
# American female: af_alloy, af_aoede, af_bella, af_heart, af_jessica, af_kore, af_nicole, af_nova
KOKORO_VOICE_MALE   = os.environ.get("KOKORO_VOICE_MALE",   "am_echo")
KOKORO_VOICE_FEMALE = os.environ.get("KOKORO_VOICE_FEMALE", "af_nova")

# ALEX = male (explainer), SAM = female (questioner)
VOICES = {
    "ALEX": KOKORO_VOICE_MALE,    # male voice — explainer role
    "SAM":  KOKORO_VOICE_FEMALE,  # female voice — questioner role
}

ORPHEUS_VOICES = {
    "ALEX": "tara",  # Orpheus voice when ORPHEUS_API_URL is set
    "SAM":  "leo",
}

KOKORO_MODEL    = "hexgrad/kokoro-82m"
KOKORO_ENDPOINT = "https://openrouter.ai/api/v1/audio/speech"

# ── Parse dialogue ────────────────────────────────────────────────────────────
def parse_dialogue(script_text: str) -> list[tuple[str, str]]:
    """Parse [SPEAKER]: text lines into (speaker, text) list."""
    segments: list[tuple[str, str]] = []
    current_speaker: str | None     = None
    current_lines:   list[str]      = []

    for line in script_text.splitlines():
        line = line.strip()
        if not line:
            continue
        m = re.match(r"^\[(ALEX|SAM)\]:\s*(.*)", line, re.IGNORECASE)
        if m:
            if current_speaker and current_lines:
                segments.append((current_speaker, " ".join(current_lines)))
            current_speaker = m.group(1).upper()
            current_lines   = [m.group(2).strip()]
        elif current_speaker:
            current_lines.append(line)

    if current_speaker and current_lines:
        segments.append((current_speaker, " ".join(current_lines)))

    return segments

# ── Kokoro TTS (OpenRouter) ───────────────────────────────────────────────────
def tts_segment_kokoro(text: str, voice: str, out_path: str, api_key: str) -> None:
    """Generate audio using Kokoro 82M via OpenRouter.

    OpenRouter returns raw PCM (audio/pcm;rate=24000;channels=1 s16le).
    We convert to MP3 via ffmpeg after receiving.
    Voices: am_echo, am_onyx, af_nova, af_alloy, bm_george, bf_emma, etc.
    Pricing: $0.62/M characters.
    """
    payload = json.dumps({
        "model": KOKORO_MODEL,
        "input": text,
        "voice": voice,
    }).encode("utf-8")

    req = urllib.request.Request(
        KOKORO_ENDPOINT,
        data=payload,
        headers={
            "Content-Type":  "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )

    # Retry up to 3 times on 429/503
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                audio_bytes = resp.read()  # raw PCM bytes
            break
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")
            if e.code in (429, 503) and attempt < 2:
                wait = (attempt + 1) * 15
                print(f"[audio]   rate-limited ({e.code}), retrying in {wait}s …")
                time.sleep(wait)
            else:
                raise RuntimeError(f"Kokoro TTS HTTP {e.code}: {body[:400]}") from e

    # Save PCM to temp file, convert to MP3 via ffmpeg
    with tempfile.NamedTemporaryFile(suffix=".pcm", delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_pcm = tmp.name

    try:
        subprocess.run(
            ["ffmpeg", "-y",
             "-f", "s16le", "-ar", "24000", "-ac", "1",
             "-i", tmp_pcm,
             out_path],
            check=True, capture_output=True
        )
    finally:
        os.unlink(tmp_pcm)

# ── Orpheus TTS (optional, GPU) ───────────────────────────────────────────────
def tts_segment_orpheus(text: str, voice: str, out_path: str, api_url: str) -> None:
    """Generate audio using Orpheus-FastAPI (requires GPU + Orpheus-FastAPI server)."""
    payload = json.dumps({"text": text, "voice": voice}).encode("utf-8")
    req = urllib.request.Request(
        f"{api_url.rstrip('/')}/v1/audio/speech",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        audio_data = resp.read()

    # Orpheus returns WAV — convert to MP3 for consistency
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        tmp.write(audio_data)
        tmp_wav = tmp.name

    subprocess.run(
        ["ffmpeg", "-y", "-i", tmp_wav, "-q:a", "4", out_path],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    os.unlink(tmp_wav)

# ── Concatenate MP3 files ─────────────────────────────────────────────────────
def concat_mp3(segment_files: list[str], output: str) -> None:
    """Use ffmpeg to concatenate segment MP3 files into final output."""
    with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False, encoding="utf-8") as f:
        for fp in segment_files:
            # ffmpeg concat uses forward slashes; escape apostrophes
            fp_escaped = fp.replace("\\", "/").replace("'", r"\'")
            f.write(f"file '{fp_escaped}'\n")
        list_file = f.name

    try:
        subprocess.run(
            [
                "ffmpeg", "-y",
                "-f", "concat", "-safe", "0",
                "-i", list_file,
                "-c:a", "libmp3lame", "-q:a", "4",
                output,
            ],
            check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE,
        )
    except subprocess.CalledProcessError as e:
        stderr = e.stderr.decode("utf-8", errors="replace") if e.stderr else ""
        raise RuntimeError(f"ffmpeg concat failed:\n{stderr}") from e
    finally:
        os.unlink(list_file)

# ── Main ──────────────────────────────────────────────────────────────────────
def main() -> None:
    if len(sys.argv) < 3:
        print(f"Usage: {sys.argv[0]} <script_file> <output_mp3>")
        sys.exit(1)

    script_file = sys.argv[1]
    output_mp3  = sys.argv[2]

    # Validate inputs
    if not os.path.isfile(script_file):
        print(f"[audio] ERROR: Script file not found: {script_file}")
        sys.exit(1)

    script_text = open(script_file, encoding="utf-8").read()
    segments    = parse_dialogue(script_text)

    if not segments:
        print(f"[audio] ERROR: No [ALEX]/[SAM] dialogue found in {script_file}")
        sys.exit(1)

    print(f"[audio] {len(segments)} dialogue segments found")

    # Detect TTS backend: Orpheus (GPU) > Kokoro via OpenRouter > error
    orpheus_url    = os.environ.get("ORPHEUS_API_URL",    "").strip()
    openrouter_key = os.environ.get("OPENROUTER_API_KEY", "").strip()
    use_orpheus    = bool(orpheus_url)

    if use_orpheus:
        print(f"[audio] Using Orpheus TTS at {orpheus_url}")
    elif openrouter_key:
        print(f"[audio] Using Kokoro 82M via OpenRouter — model: {KOKORO_MODEL}")
        print(f"[audio]   ALEX voice (male):   {VOICES['ALEX']}")
        print(f"[audio]   SAM  voice (female): {VOICES['SAM']}")
        print(f"[audio]   Pricing: $0.62/M characters")
    else:
        print("[audio] ERROR: OPENROUTER_API_KEY not set — cannot generate podcast audio.")
        print("  Add OPENROUTER_API_KEY=<your-key> to your .env file")
        sys.exit(1)

    # Generate each segment into a temp file
    total_chars = sum(len(text) for _, text in segments)
    os.makedirs(os.path.dirname(os.path.abspath(output_mp3)), exist_ok=True)
    tmp_dir   = tempfile.mkdtemp(prefix="kb_podcast_")
    seg_files = []
    t_start   = time.time()

    try:
        for i, (speaker, text) in enumerate(segments):
            seg_path = os.path.join(tmp_dir, f"seg_{i:04d}.mp3")
            print(f"[audio]   {i+1:2d}/{len(segments)} [{speaker}] {text[:60]}…")

            if use_orpheus:
                voice = ORPHEUS_VOICES.get(speaker, "tara")
                tts_segment_orpheus(text, voice, seg_path, orpheus_url)
            else:
                voice = VOICES.get(speaker, VOICES["ALEX"])
                tts_segment_kokoro(text, voice, seg_path, openrouter_key)

            seg_files.append(seg_path)

        print(f"[audio] Concatenating {len(seg_files)} segments → {output_mp3}")
        concat_mp3(seg_files, output_mp3)
        elapsed  = time.time() - t_start
        size_kb  = os.path.getsize(output_mp3) // 1024
        cost_usd = (total_chars / 1_000_000) * 0.62
        print(f"[audio] ✓ Done — {size_kb} KB saved to {output_mp3}")
        print(f"[audio] ⏱  Time : {elapsed:.1f}s ({elapsed/60:.1f} min)")
        print(f"[audio] 💰 Chars: {total_chars:,} characters")
        print(f"[audio] 💰 Cost : ${cost_usd:.4f} USD  (@$0.62/M chars)")

    finally:
        # Clean up temp segment files
        for fp in seg_files:
            try: os.unlink(fp)
            except OSError: pass
        try: os.rmdir(tmp_dir)
        except OSError: pass


if __name__ == "__main__":
    main()
