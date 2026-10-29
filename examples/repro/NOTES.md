# WIP: Rendiv bug investigation (not for upstream)

Minimal repro for the audio/stitch bugs. `public/a.mp3` (2 s, 440 Hz) and
`public/b.mp3` (0.5 s, 880 Hz) are synthetic sine tones at 24 kHz mono.

    pnpm install && pnpm build                    # from repo root
    node node_modules/playwright/cli.js install chromium-headless-shell   # in packages/renderer
    cd examples/repro
    node render.mjs OpenSequenceAudio             # expect FFmpeg "Infinity" error on master
    node render.mjs SilentOutro                   # expect ~2 s output on master (should be 5 s)
    node render.mjs TwoTabs 2                     # expect only a.mp3 in audioSources on master

Check outputs with `ffprobe -show_entries stream=codec_type,duration,sample_rate out/<id>.mp4`.
Also time whether `node render.mjs ...` exits on its own after "done:" (the exit-hang bug).

## Status (2026-10-29)

Nothing filed upstream yet. Fix branches on the fork (elwizard33/rendiv), each from master 6d6aca2:

- `fix/clamp-open-audio-duration`: core clamps registered clip duration to
  composition duration - startAtFrame (Audio, Video, OffthreadVideo), plus 3 tests
  in audio.test.tsx. 89/89 tests pass; the 2 new Infinity tests fail without the fix.
  Fixes existing issue #4 (root-level Audio) and the Sequence-without-duration variant.
- `fix/stitch-keep-video-length`: drops -shortest, adds apad + `-t <frames/fps>`,
  `-ar 48000`, and leaves atrim open when duration is not finite. Typechecks.
  Not yet verified with a real render.
- `fix/collect-audio-from-all-pages`: render-frames merges __RENDIV_AUDIO_SOURCES__
  from every page by key. Typechecks. Not yet verified with a real render.

Already reported/fixed upstream: Windows entry path (#11, fixed by merged PR #12 on
master, unreleased; npm latest is 0.2.6). Root-level Audio Infinity is issue #4.
