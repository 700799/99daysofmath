import { makeScene2D, waitFor } from '@motion-canvas/core';
import { Txt, Circle, Rect, Line } from '@motion-canvas/2d';
import { easeOutBack, easeInOutQuad, easeOutQuad } from '@motion-canvas/core';

// Color palette from 99daysofmath app
const colors = {
  duoGreen: '#58CC02',
  duoBlue: '#1CB0F6',
  duoOrange: '#FF9600',
  duoRed: '#FF4B4B',
  gold: '#FFD700',
  white: '#ffffff',
};

export default makeScene2D(function* (view) {
  view.fill(colors.white);

  // ========== BEAT 1: Introduction (~25 seconds) ==========
  yield* waitFor(0.5);

  // Title text
  const title1 = new Txt({
    text: 'This is Katherine Johnson.',
    fontSize: 72,
    fontWeight: 'bold',
    fill: colors.gold,
    position: [0, -100],
    opacity: 0,
  });
  view.add(title1);

  yield* title1.opacity(1, 0.8);
  yield* waitFor(2);

  const title2 = new Txt({
    text: 'She was a brilliant mathematician.',
    fontSize: 72,
    fontWeight: 'bold',
    fill: colors.white,
    position: [0, 0],
    opacity: 0,
  });
  view.add(title2);

  yield* title2.opacity(1, 0.8);

  // Simple penguin shape (body + head)
  const penguinBody = new Circle({
    size: [40, 50],
    fill: '#000000',
    position: [120, 150],
    opacity: 0,
    scale: 0,
  });
  view.add(penguinBody);

  const penguinHead = new Circle({
    size: [30, 32],
    fill: '#000000',
    position: [120, 100],
    opacity: 0,
    scale: 0,
  });
  view.add(penguinHead);

  yield* penguinBody.opacity(1, 0.5);
  yield* penguinBody.scale(1, 0.5, easeOutBack);
  yield* penguinHead.opacity(1, 0.5);
  yield* penguinHead.scale(1, 0.5, easeOutBack);

  yield* waitFor(1.5);
  yield* title1.opacity(0, 0.8);
  yield* title2.opacity(0, 0.8);
  yield* penguinBody.opacity(0, 0.5);
  yield* penguinHead.opacity(0, 0.5);

  // ========== BEAT 2: The Problem (~35 seconds) ==========
  yield* waitFor(0.3);

  const problem1 = new Txt({
    text: 'In 1969, NASA wanted to send',
    fontSize: 72,
    fill: colors.white,
    position: [0, -100],
    opacity: 0,
  });
  view.add(problem1);

  yield* problem1.opacity(1, 0.8);

  const problem2 = new Txt({
    text: 'astronauts to the Moon.',
    fontSize: 72,
    fill: colors.white,
    position: [0, 0],
    opacity: 0,
  });
  view.add(problem2);

  yield* problem2.opacity(1, 0.8);
  yield* waitFor(2);

  const problem3 = new Txt({
    text: 'But they needed perfect math',
    fontSize: 72,
    fill: colors.duoOrange,
    position: [0, 100],
    opacity: 0,
  });
  view.add(problem3);

  yield* problem3.opacity(1, 0.8);

  const problem4 = new Txt({
    text: 'for the rocket path.',
    fontSize: 72,
    fill: colors.duoOrange,
    position: [0, 180],
    opacity: 0,
  });
  view.add(problem4);

  yield* problem4.opacity(1, 0.8);
  yield* waitFor(2);

  // Earth and Moon
  const earth = new Circle({
    size: 80,
    fill: colors.duoBlue,
    position: [-150, 120],
    opacity: 0,
  });
  view.add(earth);

  yield* earth.opacity(1, 0.6);

  const earthLabel = new Txt({
    text: 'Earth',
    fontSize: 48,
    fill: colors.white,
    position: [-150, 200],
    opacity: 0,
  });
  view.add(earthLabel);

  yield* earthLabel.opacity(1, 0.6);

  const moon = new Circle({
    size: 60,
    fill: '#D3D3D3',
    position: [150, 120],
    opacity: 0,
  });
  view.add(moon);

  yield* moon.opacity(1, 0.6);

  const moonLabel = new Txt({
    text: 'Moon',
    fontSize: 48,
    fill: colors.white,
    position: [150, 200],
    opacity: 0,
  });
  view.add(moonLabel);

  yield* moonLabel.opacity(1, 0.6);

  yield* waitFor(2);

  // Clear beat 2
  yield* problem1.opacity(0, 0.6);
  yield* problem2.opacity(0, 0.6);
  yield* problem3.opacity(0, 0.6);
  yield* problem4.opacity(0, 0.6);
  yield* earth.opacity(0, 0.6);
  yield* earthLabel.opacity(0, 0.6);
  yield* moon.opacity(0, 0.6);
  yield* moonLabel.opacity(0, 0.6);

  // ========== BEAT 3: Katherine's Solution (~40 seconds) ==========
  yield* waitFor(0.5);

  const solution1 = new Txt({
    text: 'Katherine knew the math.',
    fontSize: 70,
    fill: colors.gold,
    position: [0, -100],
    opacity: 0,
  });
  view.add(solution1);

  yield* solution1.opacity(1, 0.8);

  const solution2 = new Txt({
    text: 'She calculated the exact path.',
    fontSize: 70,
    fill: colors.gold,
    position: [0, 0],
    opacity: 0,
  });
  view.add(solution2);

  yield* solution2.opacity(1, 0.8);
  yield* waitFor(2);

  const solution3 = new Txt({
    text: 'Her numbers made sure Apollo 11',
    fontSize: 68,
    fill: colors.duoGreen,
    position: [0, 100],
    opacity: 0,
  });
  view.add(solution3);

  yield* solution3.opacity(1, 0.8);

  const solution4 = new Txt({
    text: 'would reach the Moon safely.',
    fontSize: 68,
    fill: colors.duoGreen,
    position: [0, 170],
    opacity: 0,
  });
  view.add(solution4);

  yield* solution4.opacity(1, 0.8);

  // Celebrate animation - falling stars
  for (let i = 0; i < 8; i++) {
    const starX = Math.random() * 600 - 300;
    const star = new Txt({
      text: '⭐',
      fontSize: 40,
      x: starX,
      y: -300,
      opacity: 1,
    });
    view.add(star);

    yield* star.y(200, 2, easeInOutQuad);
    star.remove();
  }

  yield* waitFor(1);

  // Clear beat 3
  yield* solution1.opacity(0, 0.6);
  yield* solution2.opacity(0, 0.6);
  yield* solution3.opacity(0, 0.6);
  yield* solution4.opacity(0, 0.6);

  // ========== BEAT 4: The Impact (~30 seconds) ==========
  yield* waitFor(0.5);

  const impact1 = new Txt({
    text: 'Apollo 11 launched.',
    fontSize: 72,
    fill: colors.duoGreen,
    position: [0, -100],
    opacity: 0,
  });
  view.add(impact1);

  yield* impact1.opacity(1, 0.8);

  const impact2 = new Txt({
    text: 'It worked!',
    fontSize: 72,
    fill: colors.duoGreen,
    position: [0, 0],
    opacity: 0,
  });
  view.add(impact2);

  yield* impact2.opacity(1, 0.8);
  yield* waitFor(2);

  const impact3 = new Txt({
    text: "Katherine's math helped send",
    fontSize: 68,
    fill: colors.white,
    position: [0, 100],
    opacity: 0,
  });
  view.add(impact3);

  yield* impact3.opacity(1, 0.8);

  const impact4 = new Txt({
    text: '50+ successful missions to space.',
    fontSize: 68,
    fill: colors.white,
    position: [0, 170],
    opacity: 0,
  });
  view.add(impact4);

  yield* impact4.opacity(1, 0.8);
  yield* waitFor(2);

  // Clear beat 4
  yield* impact1.opacity(0, 0.6);
  yield* impact2.opacity(0, 0.6);
  yield* impact3.opacity(0, 0.6);
  yield* impact4.opacity(0, 0.6);

  // ========== BEAT 5: Legacy (~20 seconds) ==========
  yield* waitFor(0.5);

  const legacy1 = new Txt({
    text: 'Katherine Johnson changed history.',
    fontSize: 68,
    fill: colors.white,
    position: [0, -100],
    opacity: 0,
  });
  view.add(legacy1);

  yield* legacy1.opacity(1, 0.8);

  const legacy2 = new Txt({
    text: 'She showed the world the power',
    fontSize: 65,
    fill: colors.gold,
    position: [0, 0],
    opacity: 0,
  });
  view.add(legacy2);

  yield* legacy2.opacity(1, 0.8);

  const legacy3 = new Txt({
    text: 'of women in math and science.',
    fontSize: 65,
    fill: colors.gold,
    position: [0, 70],
    opacity: 0,
  });
  view.add(legacy3);

  yield* legacy3.opacity(1, 0.8);
  yield* waitFor(2);

  const cta = new Txt({
    text: 'You can do math like Katherine!',
    fontSize: 60,
    fill: colors.duoGreen,
    position: [0, 200],
    opacity: 0,
  });
  view.add(cta);

  yield* cta.opacity(1, 0.8);

  yield* waitFor(3);

  // Fade out finale
  yield* legacy1.opacity(0, 1);
  yield* legacy2.opacity(0, 1);
  yield* legacy3.opacity(0, 1);
  yield* cta.opacity(0, 1);

  yield* waitFor(1);
});
