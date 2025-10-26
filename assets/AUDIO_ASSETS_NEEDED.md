# Cat Mode Audio Assets

This directory requires the following audio files for the Cat Mode feature:

## Required Files

### 1. Background Music
- **File names**: `cat-background.ogg` and `cat-background.mp3`
- **Location**: `assets/audio/`
- **Description**: Cute, kawaii-style background music (J-pop/idol style)
- **Requirements**:
  - Looping track (seamless loop points)
  - Duration: 30-120 seconds
  - Upbeat, cheerful, non-intrusive
  - Format: OGG Vorbis (primary) + MP3 fallback
  - Bitrate: 128kbps or lower for good performance
  - License: Free to use, attribution if required

**Suggested Sources**:
- [Pixabay Music](https://pixabay.com/music/) - Free, no attribution required
- [FreePD](https://freepd.com/) - Public domain music
- [Incompetech](https://incompetech.com/) - Royalty-free with attribution
- Search terms: "cute music", "kawaii", "cheerful", "upbeat instrumental"

### 2. Sound Effect (Meow)
- **File names**: `meow.ogg` and `meow.mp3`
- **Location**: `assets/audio/`
- **Description**: Short, cute "meow" sound effect
- **Requirements**:
  - Duration: 0.5-1.5 seconds
  - Cute, high-pitched, friendly tone
  - Format: OGG Vorbis (primary) + MP3 fallback
  - Bitrate: 64-96kbps sufficient for short SFX
  - License: Free to use, attribution if required

**Suggested Sources**:
- [Freesound.org](https://freesound.org/) - Search "cute meow" or "kitten meow"
- [Zapsplat](https://www.zapsplat.com/) - Free sound effects
- [Mixkit](https://mixkit.co/free-sound-effects/) - Royalty-free sounds
- You can also record a simple "meow" and apply a pitch shift for cuteness

## Audio Encoding Guide

### Converting to OGG (using FFmpeg)
```bash
ffmpeg -i input.mp3 -c:a libvorbis -q:a 4 cat-background.ogg
ffmpeg -i input.wav -c:a libvorbis -q:a 3 meow.ogg
```

### Converting to MP3 (fallback, using FFmpeg)
```bash
ffmpeg -i input.wav -c:a libmp3lame -b:a 128k cat-background.mp3
ffmpeg -i input.wav -c:a libmp3lame -b:a 96k meow.mp3
```

## Licensing

All audio files must have appropriate licensing for use in this open-source project. Preferred licenses:
- Public Domain
- CC0 (Creative Commons Zero)
- CC-BY (Creative Commons Attribution)
- Other permissive licenses

**Important**: Document the source and license in `ATTRIBUTIONS.md` in this directory.

## File Structure

Once added, the audio directory should look like:
```
assets/audio/
├── cat-background.ogg
├── cat-background.mp3
├── meow.ogg
├── meow.mp3
├── AUDIO_ASSETS_NEEDED.md (this file)
└── ATTRIBUTIONS.md (to be created)
```

## Testing

After adding the files, test them by:
1. Switch to Cat theme
2. Open Settings
3. Enable "Cat Mode Audio"
4. Enable "Background Music" and/or "Sound Effects"
5. Interact with the UI to trigger meow sounds
6. Verify auto-mute when switching tabs
7. Check volume controls work correctly

## Performance Notes

- OGG files are preferred for modern browsers (better compression)
- MP3 files provide fallback for older browsers
- Audio files are lazy-loaded only when Cat Mode audio is enabled
- Files are cached by the browser after first load
- Total size should be < 1MB for good performance
