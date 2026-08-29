Put the hero background video here as:  hero.mp4

The Hero component loads /media/hero.mp4 automatically. If the file is absent,
the generative canvas backdrop plays instead — so the site works either way.

Recommended encode (1920x1080, no audio, ~8-12s loop, under ~8 MB):

  ffmpeg -i source.mov -an -vf "scale=1920:-2" -c:v libx264 -crf 26 \
    -preset slow -movflags +faststart -t 12 hero.mp4
