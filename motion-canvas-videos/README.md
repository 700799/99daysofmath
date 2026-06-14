# Motion Canvas: Katherine Johnson Video

This directory contains the Motion Canvas project for creating an educational video about Katherine Johnson and Apollo 11.

## What's Included

- **src/project.ts** — Main project configuration
- **src/scenes/katherine-johnson.ts** — The complete animated scene with:
  - Beat 1: Introduction (Katherine Johnson, mathematician) - ~25 seconds
  - Beat 2: The Problem (NASA needs perfect math for rocket path) - ~35 seconds  
  - Beat 3: Katherine's Solution (coordinate plane, calculations) - ~40 seconds
  - Beat 4: The Impact (Apollo 11 succeeds, 50+ missions) - ~30 seconds
  - Beat 5: Legacy (women in STEM, call-to-action) - ~20 seconds
  - **Total duration: ~150 seconds (2.5 minutes)**

- **vite.config.ts** — Vite configuration for Motion Canvas
- **tsconfig.json** — TypeScript configuration
- **package.json** — Dependencies and scripts

## Features

✅ **Full narrative** using the existing Manim script  
✅ **Pixar-style pacing** with smooth animations and transitions  
✅ **Large, readable text** (72px minimum, responsive)  
✅ **Color-coded scenes** using the app's Tailwind palette (duo-green, duo-blue, duo-orange, gold)  
✅ **Visual storytelling** with Earth/Moon, falling stars, reward animations  
✅ **Penguin mascot** (simple shapes, celebratory animations)  
✅ **5 distinct narrative beats** synchronized to voice-over pacing  

## How to Render the Video Locally

### Prerequisites

- **Node.js** 16+ and npm
- **FFmpeg** (Motion Canvas bundles this, but system FFmpeg can speed up rendering)

### Steps

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Preview in development mode** (optional, for testing):
   ```bash
   npm run dev
   # Opens http://localhost:9000 in your browser
   # Edit src/scenes/katherine-johnson.ts to iterate
   ```

3. **Render to MP4** (this generates the final video):
   ```bash
   npm run render
   # Renders to: ./output/katherine-johnson.mp4
   # Quality: 1920×1080 @ 30fps (takes 10-30 minutes depending on hardware)
   ```

4. **Copy to app**:
   ```bash
   cp output/katherine-johnson.mp4 ../public/videos/lessons/6.NS-5-story-motion.mp4
   ```

5. **Test in app** — update `src/data/mathStories.json`:
   - Find the Katherine Johnson story entry
   - Change `videoSrc` to `6.NS-5-story-motion.mp4`
   - Run the app and navigate to Stories → Katherine Johnson

## Customization

### Text Adjustments
Edit `src/scenes/katherine-johnson.ts`:
- Change `fontSize` values to adjust text size
- Modify `fill` colors (use values from the `colors` object at top)
- Update text content in the `Txt` components

### Animation Timing
- `yield* waitFor(2)` = 2 second pause
- `yield* [element].opacity(1, 0.8)` = fade in over 0.8 seconds
- `yield* [element].scale(1, 0.5, easeOutBack)` = scale animation with easing

### Add Voice-Over Sync
Motion Canvas doesn't have native audio in the scene file, but you can:
1. Render the video (silent)
2. Use FFmpeg to add audio from the original Manim video:
   ```bash
   ffmpeg -i output/katherine-johnson.mp4 -i ../public/videos/lessons/6.NS-5-story.mp4 \
     -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 \
     ../public/videos/lessons/6.NS-5-story-motion.mp4
   ```

## File Structure

```
motion-canvas-videos/
├── src/
│   ├── project.ts                      # Main config
│   └── scenes/
│       └── katherine-johnson.ts        # The video scene (THIS IS THE WORK)
├── vite.config.ts                      # Vite setup
├── tsconfig.json                       # TypeScript config
├── package.json                        # Dependencies
├── README.md                           # This file
└── output/                             # Rendered videos (after running render)
```

## Motion Canvas API Cheat Sheet

```typescript
// Create text
const text = new Txt({
  text: "Hello",
  fontSize: 72,
  fill: "#ffffff",
  position: [0, 0],
  opacity: 0,
});
view.add(text);

// Animate
yield* text.opacity(1, 0.8);  // Fade in over 0.8s
yield* text.scale(1.5, 0.5); // Scale to 1.5x over 0.5s
yield* text.y(100, 1);       // Move down 100px over 1s

// Wait
yield* waitFor(2);  // Pause for 2 seconds

// Remove
text.remove();
```

## Next Steps

1. **Render locally** on your machine (Motion Canvas works best on macOS/Linux/Windows with proper Node.js setup)
2. **Test the video** in the app by swapping the `videoSrc`
3. **Compare old vs new** by toggling between `6.NS-5-story.mp4` (Manim) and `6.NS-5-story-motion.mp4` (Motion Canvas)
4. **Optional**: Add voice-over audio from the original Manim video using FFmpeg
5. **Deploy**: Once happy, commit the new `.mp4` to the repo

## Troubleshooting

### "motion-canvas serve" not found
- Make sure you've run `npm install` in this directory
- Try: `npx motion-canvas serve` instead

### Rendering is very slow
- First render is slower; subsequent renders are faster (caching)
- Try lowering quality (edit `package.json` scripts: remove `--quality 2`)
- Ensure your machine has enough free RAM and CPU

### Text looks blurry
- Increase `fontSize` values slightly (72px → 80px)
- Ensure Vite/Motion Canvas is using 1x pixel ratio (not retina scaling)

### Need to modify the scene?
- Edit `src/scenes/katherine-johnson.ts` directly
- Save the file
- Re-run `npm run render` to update the output

## Resources

- [Motion Canvas Official Docs](https://motioncanvas.io/)
- [Motion Canvas API Docs](https://motioncanvas.io/api/)
- [Motion Canvas Examples](https://github.com/motion-canvas/examples)

---

**Created as a Motion Canvas replacement for the Manim-based Katherine Johnson educational video.**  
**Target audience: 4th–6th graders (10-year-olds)**  
**Duration: ~2.5 minutes at 1920×1080 / 30fps**
