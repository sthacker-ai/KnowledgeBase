#!/usr/bin/env python3
"""
transcribe_audio.py — transcribe an audio/video file.

Priority:
  1. Groq API (whisper-large-v3-turbo) — if GROQ_API_KEY env var is set.
     ~5-10 seconds for a 45-min file. Free tier at console.groq.com.
  2. faster-whisper (local CPU) — fallback when no Groq key or API fails.
     20-30 min for a 45-min file on CPU.

Usage:
  python scripts/transcribe/transcribe_audio.py <audio_file> <output_txt_path> [model_size]

Arguments:
  audio_file      Path to the audio or video file (mp3, m4a, webm, mp4, etc.)
  output_txt_path Path where the plain text transcript will be saved
  model_size      Whisper model size for local fallback: tiny, base, small, medium, large-v3
                  Default: small

Output:
  Writes the transcript as plain text to output_txt_path.
  Prints a summary line to stdout.

Exit codes:
  0 = success
  1 = error

Install dependencies:
  pip install faster-whisper groq
"""

import sys
import os
import json
import datetime


def log_groq_usage(audio_path: str, word_count: int) -> None:
    """Append a Groq transcription usage entry to data/token-usage.json."""
    try:
        # Estimate audio duration from file size @ 32kbps mp3
        size_bytes = os.path.getsize(audio_path)
        audio_secs = round(size_bytes / (32 * 1024 / 8), 1)  # 32kbps = 4000 bytes/sec

        # Find data/ relative to this script (scripts/transcribe/ -> ../../data/)
        script_dir = os.path.dirname(os.path.abspath(__file__))
        usage_path = os.path.join(script_dir, "..", "..", "data", "token-usage.json")
        usage_path = os.path.normpath(usage_path)

        entry = {
            "ts":               datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
            "label":            f"transcribe-{os.path.splitext(os.path.basename(audio_path))[0]}",
            "model":            "whisper-large-v3-turbo",
            "provider":         "Groq",
            "audio_seconds":    audio_secs,
            "word_count":       word_count,
            "prompt_tokens":    0,
            "completion_tokens": 0,
            "total_tokens":     0,
        }

        existing = []
        if os.path.exists(usage_path):
            with open(usage_path, "r", encoding="utf-8") as f:
                try:
                    existing = json.load(f)
                except Exception:
                    existing = []

        existing.append(entry)
        with open(usage_path, "w", encoding="utf-8") as f:
            json.dump(existing, f, indent=2)
    except Exception as e:
        print(f"[transcribe] Warning: could not log Groq usage: {e}", flush=True)


def transcribe_with_groq(audio_path: str) -> str:
    """Transcribe using Groq API. Returns transcript text or raises on failure.
    If the file exceeds Groq's 25 MB limit, splits into 20-min chunks with ffmpeg
    and transcribes each chunk, then concatenates the results.
    """
    try:
        from groq import Groq
    except ImportError:
        raise RuntimeError("groq package not installed — run: pip install groq")

    api_key = os.environ.get("GROQ_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("GROQ_API_KEY not set")

    client = Groq(api_key=api_key)

    size_mb = os.path.getsize(audio_path) / (1024 * 1024)

    if size_mb <= 24:
        # Fast path: single upload
        print(f"[transcribe] Using Groq API (whisper-large-v3-turbo) [{size_mb:.1f} MB]…", flush=True)
        with open(audio_path, "rb") as f:
            response = client.audio.transcriptions.create(
                model="whisper-large-v3-turbo",
                file=f,
                response_format="text",
            )
        return str(response).strip()

    # File is too large — split into chunks and transcribe each one
    print(f"[transcribe] File is {size_mb:.1f} MB — splitting into 20-min chunks for Groq…", flush=True)

    import subprocess
    import tempfile

    # Check ffmpeg is available
    try:
        subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
    except (FileNotFoundError, subprocess.CalledProcessError):
        raise RuntimeError("ffmpeg not found in PATH — required for chunked transcription")

    chunk_dir = tempfile.mkdtemp(prefix="groq_chunks_")
    chunk_pattern = os.path.join(chunk_dir, "chunk_%03d.mp3")
    # Split at 20-minute boundaries (-c copy = no re-encode, fast)
    split_cmd = [
        "ffmpeg", "-i", audio_path,
        "-f", "segment", "-segment_time", "1200",  # 1200 seconds = 20 min
        "-c", "copy",
        chunk_pattern,
        "-y",
    ]
    result = subprocess.run(split_cmd, capture_output=True, text=True)
    if result.returncode != 0:
        # Clean up on ffmpeg error
        import shutil
        shutil.rmtree(chunk_dir, ignore_errors=True)
        raise RuntimeError(f"ffmpeg split failed: {result.stderr[:300]}")

    chunk_files = sorted([
        os.path.join(chunk_dir, f)
        for f in os.listdir(chunk_dir)
        if f.startswith("chunk_") and f.endswith(".mp3")
    ])

    if not chunk_files:
        import shutil
        shutil.rmtree(chunk_dir, ignore_errors=True)
        raise RuntimeError("ffmpeg produced no chunk files")

    print(f"[transcribe] Split into {len(chunk_files)} chunks — transcribing with Groq…", flush=True)

    parts = []
    try:
        for i, chunk_path in enumerate(chunk_files, 1):
            chunk_mb = os.path.getsize(chunk_path) / (1024 * 1024)
            print(f"[transcribe] Chunk {i}/{len(chunk_files)} ({chunk_mb:.1f} MB)…", flush=True)
            with open(chunk_path, "rb") as f:
                response = client.audio.transcriptions.create(
                    model="whisper-large-v3-turbo",
                    file=f,
                    response_format="text",
                )
            parts.append(str(response).strip())
    finally:
        import shutil
        shutil.rmtree(chunk_dir, ignore_errors=True)

    return "\n".join(parts)


def transcribe_with_whisper(audio_path: str, model_size: str) -> tuple[str, object]:
    """Transcribe using local faster-whisper. Returns (transcript_text, info)."""
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        print("[transcribe] ERROR: faster-whisper not installed.", file=sys.stderr)
        print("  Install with: pip install faster-whisper", file=sys.stderr)
        sys.exit(1)

    print(f"[transcribe] Using local faster-whisper (model: {model_size})…", flush=True)
    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    print(f"[transcribe] Transcribing: {audio_path}", flush=True)

    transcript_parts = []

    def collect_segments(segs):
        for seg in segs:
            try:
                transcript_parts.append(seg.text.strip())
            except (IndexError, AttributeError):
                pass

    try:
        segments, info = model.transcribe(audio_path, beam_size=5)
        collect_segments(segments)
    except (IndexError, Exception) as e:
        print(f"[transcribe] Warning: first pass failed ({e}), retrying with vad_filter=False", flush=True)
        transcript_parts.clear()
        try:
            segments, info = model.transcribe(audio_path, beam_size=5, vad_filter=False)
            collect_segments(segments)
        except Exception as e2:
            print(f"[transcribe] ERROR: transcription failed on retry: {e2}", file=sys.stderr)
            sys.exit(1)

    return "\n".join(transcript_parts), info


def main():
    if len(sys.argv) < 3:
        print("Usage: transcribe_audio.py <audio_file> <output_txt_path> [model_size]", file=sys.stderr)
        sys.exit(1)

    audio_path  = sys.argv[1]
    output_path = sys.argv[2]
    model_size  = sys.argv[3] if len(sys.argv) > 3 else "small"

    if not os.path.exists(audio_path):
        print(f"[transcribe] ERROR: audio file not found: {audio_path}", file=sys.stderr)
        sys.exit(1)

    transcript = None
    word_count = 0

    # --- Try Groq API first ---
    if os.environ.get("GROQ_API_KEY", "").strip():
        try:
            transcript = transcribe_with_groq(audio_path)
            word_count = len(transcript.split())
            log_groq_usage(audio_path, word_count)
            print(f"[transcribe] Groq done. {word_count} words => {output_path}", flush=True)
        except Exception as e:
            print(f"[transcribe] Groq failed ({e}), falling back to local faster-whisper…", flush=True)
            transcript = None

    # --- Fallback: local faster-whisper ---
    if transcript is None:
        transcript, info = transcribe_with_whisper(audio_path, model_size)
        word_count = len(transcript.split())
        duration = info.duration if hasattr(info, "duration") else "?"
        try:
            print(f"[transcribe] Local done. {word_count} words, duration ~{duration:.0f}s => {output_path}", flush=True)
        except Exception:
            print(f"[transcribe] Local done. {word_count} words => {output_path}", flush=True)

    # Write output
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(transcript)


if __name__ == "__main__":
    main()

