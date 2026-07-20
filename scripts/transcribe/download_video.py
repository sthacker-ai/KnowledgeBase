#!/usr/bin/env python3
"""
download_video.py — download a video from a URL (X/Twitter or YouTube)
using yt-dlp and save it to the transcripts working directory.

Usage:
  python scripts/transcribe/download_video.py <url> <output_path_no_ext>

Output:
  Downloads the best available audio-only stream (or video if audio-only
  unavailable) to <output_path_no_ext>.m4a (or .mp3 / .webm).
  Prints the final downloaded file path to stdout on the last line.

Exit codes:
  0 = success
  1 = download failed
"""

import sys
import os
import shutil
import subprocess
import json

# yt-dlp shells out to ffmpeg/ffprobe for audio extraction/postprocessing.
# When this script is launched from Windows Task Scheduler (as it is for the
# daily pipeline), the child process's PATH can differ from an interactive
# shell's PATH — ffmpeg being resolvable when run by hand does NOT guarantee
# yt-dlp can find it here. Resolve an explicit --ffmpeg-location instead of
# relying on ambient PATH, so this doesn't silently depend on which context
# invoked the script.
def find_ffmpeg_dir():
    exe = shutil.which("ffmpeg")
    if exe:
        return os.path.dirname(exe)
    for candidate in (r"C:\ffmpeg\bin", r"C:\Program Files\ffmpeg\bin"):
        if os.path.isfile(os.path.join(candidate, "ffmpeg.exe")):
            return candidate
    return None

def main():
    if len(sys.argv) < 3:
        print("Usage: download_video.py <url> <output_path_no_ext>", file=sys.stderr)
        sys.exit(1)

    url         = sys.argv[1]
    output_base = sys.argv[2]  # e.g. data/transcripts/tmp/1234567890

    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_base) or ".", exist_ok=True)

    # yt-dlp command: download best audio and convert to mp3 at 32kbps
    # 32kbps keeps files small: a 104-min video ≈ 24 MB — safely under Groq's 25 MB limit
    # --socket-timeout 30  : fail fast on stalled HLS segments instead of hanging
    # --retries 3          : retry stalled segments before giving up
    cmd = [
        "yt-dlp",
        "--no-playlist",
        "--format", "bestaudio/best",
        "--extract-audio",
        "--audio-format", "mp3",
        "--audio-quality", "32K",
        "--socket-timeout", "30",
        "--retries", "3",
        "--output", f"{output_base}.%(ext)s",
        "--quiet",
        "--print", "after_move:filepath",  # prints final path after download
        url,
    ]

    ffmpeg_dir = find_ffmpeg_dir()
    if ffmpeg_dir:
        cmd[1:1] = ["--ffmpeg-location", ffmpeg_dir]
    else:
        print("[download] WARNING: ffmpeg not found — audio extraction will likely fail", file=sys.stderr)

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=900)  # 15 min
    except subprocess.TimeoutExpired:
        print(f"[download] ERROR: yt-dlp timed out after 15 min", file=sys.stderr)
        sys.exit(1)
    except FileNotFoundError:
        print("[download] ERROR: yt-dlp not found. Install with: pip install yt-dlp", file=sys.stderr)
        sys.exit(1)

    if result.returncode != 0:
        # yt-dlp always requests --extract-audio, but plenty of liked X clips
        # (memes/GIFs re-encoded as mp4) have no audio stream at all — that's
        # not a failure, there's just nothing to transcribe. Distinguish it
        # with exit code 3 so the caller can mark it "no audio" once instead
        # of retrying (and re-downloading) the same silent clip every day.
        if "unable to obtain file audio codec" in (result.stderr or ""):
            print(f"[download] No audio stream in this video — nothing to transcribe", file=sys.stderr)
            sys.exit(3)
        print(f"[download] ERROR: yt-dlp exit {result.returncode}", file=sys.stderr)
        print(result.stderr, file=sys.stderr)
        sys.exit(1)

    # yt-dlp --print after_move:filepath prints the final file path
    downloaded_path = result.stdout.strip().splitlines()[-1] if result.stdout.strip() else ""

    if not downloaded_path or not os.path.exists(downloaded_path):
        # Fallback: glob for any file matching the base
        import glob
        matches = glob.glob(f"{output_base}.*")
        if matches:
            downloaded_path = matches[0]
        else:
            print(f"[download] ERROR: could not find downloaded file at {output_base}.*", file=sys.stderr)
            sys.exit(1)

    # Print the path so Node.js wrapper can capture it
    print(downloaded_path)

if __name__ == "__main__":
    main()
