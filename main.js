// Glyph blurs and drifts as the device tilts off level; past a threshold its
// RGB channels glitch apart. iOS gates motion behind a tap.

(() => {
  const glyph = document.querySelector('.glyph');
  if (!glyph) return;

  // flat list of the 9 SVG paths, one set per RGB channel — must be real
  // elements, not <use> refs, or querySelectorAll can't reach them
  const layers = [...glyph.querySelectorAll('[data-layer]')].map(el => ({
    el,
    settled: true,
    nextTick: 0
  }));
  if (!layers.length) return;

  const channels = [...glyph.querySelectorAll('.channel')].map(el => ({
    el,
    dx: 0,
    dy: 0,
    nextTick: 0
  }));

  const gate = document.createElement('div');
  gate.id = 'motion-gate';
  document.body.appendChild(gate);

  const MAX_ACCEL       = 1.2;  // tilt/cursor magnitude that maps to full deviation
  const DEADZONE        = 0.14; // ignore raw deviation below this
  const THRESHOLD       = 0.25; // shaped deviation past which the glitch kicks in
  const MAX_BLUR        = 16;   // px, at full deviation
  const MAX_DRIFT       = 100;  // % translate, at full deviation
  const SMOOTH          = 0.3;  // per-frame easing toward the target deviation
  const BASELINE_WINDOW = 200;  // ms of initial readings averaged into the baseline
  const WEIGHT_X        = 0.6;  // left/right tilt weighting
  const WEIGHT_Y        = 1.0;  // up/down tilt weighting
  const CHANNEL_SPLIT   = 22;   // px, max random channel offset during a glitch

  const NEEDS_GESTURE =
    typeof DeviceMotionEvent !== 'undefined' &&
    typeof DeviceMotionEvent.requestPermission === 'function';

  let baselineX = null;
  let baselineY = null;
  let baselineSumX = 0;
  let baselineSumY = 0;
  let baselineSampleCount = 0;
  let baselineStart = null;

  let tiltX = 0;
  let tiltY = 0;
  let deviation = 0;
  let driftX = 0;
  let driftY = 0;
  let glitchOn = false;
  let glitchStrength = 0;

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  function shapeMag(raw) {
    if (raw < DEADZONE) return 0;
    return clamp((raw - DEADZONE) / (1 - DEADZONE), 0, 1);
  }

  function onMotion(e) {
    const accel = e.accelerationIncludingGravity;
    if (!accel || typeof accel.x !== 'number' || typeof accel.y !== 'number') return;
    const now = performance.now();

    if (baselineX === null) {
      if (baselineStart === null) baselineStart = now;
      baselineSumX += accel.x;
      baselineSumY += accel.y;
      baselineSampleCount += 1;
      if (now - baselineStart < BASELINE_WINDOW) return;
      baselineX = baselineSumX / baselineSampleCount;
      baselineY = baselineSumY / baselineSampleCount;
      return;
    }

    // inverted: the glyph falls away from the tilt rather than toward it
    tiltX = -(accel.x - baselineX);
    tiltY = -(accel.y - baselineY);
  }

  function onMouse(e) {
    const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
    const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;
    tiltX = -normalizedX * MAX_ACCEL;
    tiltY = -normalizedY * MAX_ACCEL;
  }

  // Shared timer-driven burst/settle loop for both glitch effects; `spec`
  // supplies what a burst/settle looks like and how long each state lasts.
  function tickJitter(state, now, strength, spec) {
    if (glitchOn && now > state.nextTick) {
      if (Math.random() < spec.burstChance(strength)) {
        spec.onBurst(state, strength);
        state.nextTick = now + spec.burstDelay();
      } else {
        spec.onSettle(state);
        state.nextTick = now + spec.restDelay(strength);
      }
    } else if (!glitchOn && spec.isUnsettled(state)) {
      spec.onSettle(state);
    }
  }

  const layerJitter = {
    burstChance: (strength) => 0.55 + strength * 0.3,
    burstDelay: () => 18 + Math.random() * 40,
    restDelay: (strength) => 20 + Math.random() * (120 - strength * 90),
    isUnsettled: (layer) => !layer.settled,
    onBurst(layer) {
      const drop = Math.random() < 0.4;
      layer.el.style.opacity = drop ? '0.05' : (0.5 + Math.random() * 0.4).toFixed(2);
      layer.settled = false;
    },
    onSettle(layer) {
      layer.el.style.opacity = '1';
      layer.settled = true;
    },
  };

  const channelJitter = {
    burstChance: (strength) => 0.6 + strength * 0.3,
    burstDelay: () => 16 + Math.random() * 50,
    restDelay: (strength) => 20 + Math.random() * (130 - strength * 90),
    isUnsettled: (channel) => channel.dx !== 0 || channel.dy !== 0,
    onBurst(channel, strength) {
      const angle = Math.random() * Math.PI * 2;
      const magnitude = (2 + Math.random() * CHANNEL_SPLIT) * (0.35 + strength * 0.65);
      channel.dx = Math.cos(angle) * magnitude;
      channel.dy = Math.sin(angle) * magnitude;
      channel.el.style.transform = `translate(${channel.dx.toFixed(2)}px, ${channel.dy.toFixed(2)}px)`;
    },
    onSettle(channel) {
      channel.dx = 0;
      channel.dy = 0;
      channel.el.style.transform = 'translate(0px, 0px)';
    },
  };

  function render(now) {
    const weightedX = tiltX * WEIGHT_X;
    const weightedY = tiltY * WEIGHT_Y;
    const length = Math.hypot(weightedX, weightedY);
    const rawMag = clamp(length / MAX_ACCEL, 0, 1);
    const shaped = shapeMag(rawMag);
    const unitX = length > 0.0001 ? weightedX / length : 0;
    const unitY = length > 0.0001 ? weightedY / length : 0;

    deviation += (shaped - deviation) * SMOOTH;
    driftX += (shaped * unitX - driftX) * SMOOTH;
    driftY += (shaped * unitY - driftY) * SMOOTH;

    glyph.style.filter = `blur(${(Math.pow(deviation, 0.7) * MAX_BLUR).toFixed(2)}px)`;
    glyph.style.transform = `translate(${(driftX * MAX_DRIFT).toFixed(2)}%, ${(driftY * MAX_DRIFT).toFixed(2)}%)`;

    glitchOn = deviation > THRESHOLD;
    glitchStrength = glitchOn ? (deviation - THRESHOLD) / (1 - THRESHOLD) : 0;

    layers.forEach(layer => tickJitter(layer, now, glitchStrength, layerJitter));
    channels.forEach(channel => tickJitter(channel, now, glitchStrength, channelJitter));

    requestAnimationFrame(render);
  }

  async function enableMotion() {
    if (NEEDS_GESTURE) {
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission !== 'granted') return false;
      } catch {
        return false;
      }
    }

    window.addEventListener('devicemotion', onMotion, { passive: true });
    return true;
  }

  function init() {
    requestAnimationFrame(render);
    window.addEventListener('mousemove', onMouse, { passive: true });

    if (!NEEDS_GESTURE) {
      window.addEventListener('devicemotion', onMotion, { passive: true });
      return;
    }

    gate.style.display = 'block';

    const nudgeTimer = setTimeout(() => {
      glyph.classList.add('nudge');
      glyph.addEventListener(
        'animationend',
        () => glyph.classList.remove('nudge'),
        { once: true }
      );
    }, 3500);

    const grantAccess = async () => {
      clearTimeout(nudgeTimer);
      const granted = await enableMotion();
      if (granted) gate.style.display = 'none';
    };

    ['pointerdown', 'touchstart', 'click'].forEach((eventName) => {
      gate.addEventListener(eventName, grantAccess, { passive: true, once: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
