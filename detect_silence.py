import os
import subprocess
import re

AUDIO_DIR = "stellar-game-studio/sgs_frontend/public/game/assets/audio"

def parse_ffmpeg_output(output):
    # We want to find the real start (if there is silence at the beginning)
    # And the real end (if there is silence at the end)
    
    # Example ffmpeg silencedetect output:
    # [silencedetect @ 0x...] silence_start: 0
    # [silencedetect @ 0x...] silence_end: 2.12 | silence_duration: 2.12
    # ...
    # [silencedetect @ 0x...] silence_start: 151.2
    
    duration_match = re.search(r"Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})", output)
    total_duration = 0
    if duration_match:
        h, m, s = duration_match.groups()
        total_duration = int(h) * 3600 + int(m) * 60 + float(s)
        
    silences = []
    # parse [silencedetect @ ...] silence_start: X
    # parse [silencedetect @ ...] silence_end: Y | silence_duration: Z
    
    starts = re.findall(r"silence_start: ([\d\.]+)", output)
    ends = re.findall(r"silence_end: ([\d\.]+)", output)
    
    real_start = 0.0
    real_end = total_duration
    
    # If the first silence starts near 0, then the audio really starts at the first silence_end
    if starts and float(starts[0]) < 0.5 and ends:
        real_start = float(ends[0])
        
    # If the last silence starts near the end of the track, the audio really ends there
    if starts:
        last_start = float(starts[-1])
        # If the last silence starts in the last 15 seconds or after the real_start
        if last_start > real_start and last_start > (total_duration - 20):
            real_end = last_start
            
    # We'll return integers or 1 decimal place max for ease
    return round(real_start, 1), round(real_end - real_start, 1)

def main():
    files = [f for f in os.listdir(AUDIO_DIR) if f.endswith('.mp3')]
    files.sort()
    
    for f in files:
        filepath = os.path.join(AUDIO_DIR, f)
        # We use -40dB and duration=1s. If the song has long quiet parts, it might trigger, but we only check start/end
        cmd = ["ffmpeg", "-hide_banner", "-i", filepath, "-af", "silencedetect=noise=-40dB:d=1.5", "-f", "null", "-"]
        result = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True, encoding='utf-8', errors='replace')
        
        output = result.stderr
        start, dur = parse_ffmpeg_output(output)
        
        print(f"File: {f}")
        print(f"  start: {start}")
        print(f"  duration: {dur}\n")

if __name__ == "__main__":
    main()
