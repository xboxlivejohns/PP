/* Isolated motion study. No imports or changes to the production website. */
(async () => {
  const $ = (s) => document.querySelector(s);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const input = $('#progress');
  const follow = $('#follow-scroll');
  const play = $('#play');
  const lane = $('.nav-lane');
  const actor = $('.nav-actor');
  let availableTravel = Math.max(0, lane.clientWidth - actor.clientWidth);
  const stages = [
    { at: 0, id: 'ready', name: 'Ready', x: 0 },
    { at: 0.035, id: 'vacuum', name: 'Vacuum', x: 170 },
    { at: 0.17, id: 'wheels', name: 'Wheels', x: 100 },
    { at: 0.26, id: 'foam', name: 'Snow foam', x: 0 },
    { at: 0.4, id: 'rinse', name: 'Rinse', x: 0 },
    { at: 0.48, id: 'wash', name: 'Contact wash', x: 160 },
    { at: 0.64, id: 'final-rinse', name: 'Final rinse', x: 0 },
    { at: 0.73, id: 'dry', name: 'Towel dry', x: 160 },
    { at: 0.94, id: 'finish', name: 'Finishing', x: 0 },
    { at: 0.995, id: 'complete', name: 'Clean & dry', x: 0 },
  ];
  let timeline;
  let scrollQueued = false;
  let resumeWhenVisible = false;
  const state = { progress: 0 };
  const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));
  const smooth = (n) => {
    n = clamp(n);
    return n * n * (3 - 2 * n);
  };
  const mix = (a, b, t) => a + (b - a) * t;
  try {
    const response = await fetch('scene.svg');
    if (!response.ok) throw new Error('Scene unavailable');
    const source = await response.text();
    const views = [...document.querySelectorAll('[data-scene]')].map((root, index) => {
      const prefix = `scene-${index}-`;
      root.innerHTML = source
        .replace(/id="([^"]+)"/g, (_, id) => `id="${prefix}${id}"`)
        .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${prefix}${id})`)
        .replace(/href="#([^"]+)"/g, (_, id) => `href="#${prefix}${id}"`);
      const q = (name) => root.querySelector(`[data-${name}]`);
      const particles = [];
      for (let i = 0; i < 22; i++) {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('r', String(0.9 + (i % 4) * 0.45));
        dot.setAttribute('fill', i % 3 ? '#f1fcff' : '#97def7');
        q('spray-particles').append(dot);
        particles.push(dot);
      }
      const drips = [];
      for (let i = 0; i < 10; i++) {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        dot.setAttribute('rx', '1.5');
        dot.setAttribute('ry', '3');
        dot.setAttribute('fill', '#c8effa');
        q('impact-particles').append(dot);
        drips.push(dot);
      }
      const names = [
        'foam-build',
        'foam-clear',
        'dirt',
        'wheel-dirt',
        'wash-lather',
        'beads',
        'door',
        'person',
        'upper-body',
        'head',
        'lance',
        'jet',
        'bottle',
        'spray-cone',
        'water-ray',
        'leg-back',
        'leg-front',
        'reflection',
        'shine',
        'sparkles',
        'arm-back',
        'arm-front',
        'hand',
        'hose',
        'vacuum',
        'vac-hose',
        'vac-nozzle',
        'wheel-brush',
        'mitt',
        'bucket',
        'towel',
      ];
      return {
        root,
        q,
        el: Object.fromEntries(names.map((name) => [name, q(name)])),
        particles,
        drips,
      };
    });

    function render() {
      const p = clamp(state.progress);
      const still = reduced.matches;
      let stageIndex = 0;
      stages.forEach((stage, i) => {
        if (p >= stage.at) stageIndex = i;
      });
      const currentStage = stages[stageIndex];
      const nextAt = stages[stageIndex + 1]?.at ?? 1;
      const s = clamp((p - currentStage.at) / Math.max(0.001, nextAt - currentStage.at));
      const id = currentStage.id;
      const is = (name) => id === name;
      const cyclic = Math.sin(s * Math.PI * 10);
      const previousX = stages[Math.max(0, stageIndex - 1)].x;
      const stepIn = smooth(s / 0.14);
      let personX = mix(previousX, currentStage.x, stepIn);
      if (is('wash') || is('dry')) personX += Math.sin(s * Math.PI * 2) * 26 * stepIn;
      const stepping = stepIn < 1 && previousX !== currentStage.x;
      const stride = still || !stepping ? 0 : Math.sin(s * 90) * 12;
      const bob = still || !stepping ? 0 : Math.abs(Math.sin(s * 90)) * -1.5;
      const vacuuming = is('vacuum') && s > 0.1 && s < 0.94;
      const brushing = is('wheels') && s > 0.24 && s < 0.76;
      const washing = is('wash') && s > 0.12;
      const drying = is('dry') && s > 0.12;
      const foamStage = is('foam') && s > 0.12;
      const rinsing = is('rinse') || is('final-rinse');
      const wheelRinsing = is('wheels') && !brushing;
      const spraying = foamStage || rinsing || wheelRinsing;
      const foam = p < 0.26 ? 0 : p < 0.4 ? smooth((s - 0.12) / 0.78) : 1;
      const rinse = p < 0.4 ? 0 : p < 0.48 ? smooth(s) : 1;
      const dirt =
        p < 0.4
          ? 0.65
          : p < 0.48
            ? mix(0.65, 0.19, smooth(s))
            : p < 0.64
              ? mix(0.19, 0, smooth(s))
              : 0;
      const wheelDirt = p < 0.17 ? 0.8 : p < 0.26 ? 0.8 * (1 - smooth(s)) : 0;
      let handX = 281,
        handY = 143,
        lean = 0;
      if (vacuuming) {
        handY = 143 + cyclic * 6;
        lean = 7;
      } else if (brushing) {
        handY = 177 + cyclic * 4;
        lean = 9;
      } else if (washing) {
        handY = 115 + cyclic * 20;
        lean = -5;
      } else if (drying) {
        handY = 132 + cyclic * 12;
        lean = -4;
      } else if (spraying) {
        handY = 143 + Math.sin(s * 15) * 3;
        lean = -2;
      } else {
        handX = 252;
        handY = 174;
      }
      if (still) {
        lean = 0;
      }
      const toolX = handX - 281,
        toolY = handY - 143;
      let aimX = 355 + s * 325,
        aimY = 107 + Math.sin(s * Math.PI) * 26;
      if (wheelRinsing) {
        aimX = 409 - personX;
        aimY = 205;
      }
      const beads = p < 0.4 ? 0 : p < 0.73 ? 0.8 : p < 0.94 ? 0.8 * (1 - smooth(s)) : 0;
      const lather = is('wash')
        ? smooth((s - 0.1) / 0.6) * 0.8
        : is('final-rinse')
          ? 0.8 * (1 - smooth(s))
          : 0;
      function arm(sx, sy, tx, ty, l1, l2) {
        const dx = tx - sx,
          dy = ty - sy,
          d = Math.max(0.1, Math.hypot(dx, dy));
        const a =
          Math.atan2(dy, dx) + Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
        return (
          'M' +
          sx +
          ' ' +
          sy +
          ' ' +
          (sx + Math.cos(a) * l1).toFixed(2) +
          ' ' +
          (sy + Math.sin(a) * l1).toFixed(2) +
          ' ' +
          tx.toFixed(2) +
          ' ' +
          ty.toFixed(2)
        );
      }
      for (const view of views) {
        const { el, particles, drips } = view;
        const attr = (name, key, value) => el[name].setAttribute(key, String(value));
        const visible = (name, yes) => attr(name, 'opacity', yes ? 1 : 0);
        attr('foam-build', 'width', foam * 480);
        attr('foam-clear', 'x', 310 + rinse * 480);
        attr('foam-clear', 'width', 480 * (1 - rinse));
        attr('dirt', 'opacity', dirt);
        attr('wheel-dirt', 'opacity', wheelDirt);
        attr('wash-lather', 'opacity', lather);
        attr('beads', 'opacity', beads);
        visible('door', vacuuming);
        visible('vacuum', vacuuming);
        visible('vac-nozzle', vacuuming);
        visible('wheel-brush', brushing);
        visible('mitt', washing);
        visible('bucket', is('wash'));
        visible('towel', drying);
        visible('lance', spraying);
        visible('hose', spraying);
        visible('bottle', foamStage);
        visible('jet', spraying);
        attr('person', 'transform', 'translate(' + personX.toFixed(2) + ' ' + bob.toFixed(2) + ')');
        attr('upper-body', 'transform', 'rotate(' + lean.toFixed(2) + ' 224 166)');
        attr('leg-back', 'transform', 'rotate(' + stride.toFixed(2) + ' 219 168)');
        attr('leg-front', 'transform', 'rotate(' + (-stride).toFixed(2) + ' 230 168)');
        attr('arm-front', 'd', arm(234, 129, handX, handY, 34, 36));
        attr('arm-back', 'd', arm(214, 129, handX - 1, handY + 2, 38, 40));
        attr('hand', 'cx', handX);
        attr('hand', 'cy', handY);
        ['lance', 'vac-nozzle', 'wheel-brush', 'mitt', 'towel'].forEach((name) =>
          attr(name, 'transform', 'translate(' + toolX.toFixed(2) + ' ' + toolY.toFixed(2) + ')'),
        );
        attr(
          'spray-cone',
          'd',
          'M320 132 ' +
            aimX.toFixed(1) +
            ' ' +
            (aimY - 16).toFixed(1) +
            ' ' +
            aimX.toFixed(1) +
            ' ' +
            (aimY + 22).toFixed(1) +
            'Z',
        );
        attr('spray-cone', 'opacity', foamStage ? 0.24 : 0.04);
        attr('water-ray', 'd', 'M320 132 ' + aimX.toFixed(1) + ' ' + aimY.toFixed(1));
        attr('water-ray', 'opacity', foamStage ? 0.2 : 0.9);
        const radians = (lean * Math.PI) / 180;
        const worldHandX =
          224 + (handX - 224) * Math.cos(radians) - (handY - 166) * Math.sin(radians) + personX;
        const worldHandY =
          166 + (handX - 224) * Math.sin(radians) + (handY - 166) * Math.cos(radians) + bob;
        attr(
          'vac-hose',
          'd',
          'M341 215Q375 239 ' + worldHandX.toFixed(1) + ' ' + worldHandY.toFixed(1),
        );
        particles.forEach((dot, i) => {
          const phase = (s * 22 + i * 0.6180339) % 1;
          const spread = (((i * 0.37) % 1) - 0.5) * (foamStage ? 32 : 8);
          dot.setAttribute('cx', mix(320, aimX, phase).toFixed(2));
          dot.setAttribute('cy', (mix(132, aimY, phase) + spread * phase).toFixed(2));
          dot.setAttribute('opacity', String(spraying ? Math.sin(phase * Math.PI) * 0.85 : 0));
        });
        drips.forEach((dot, i) => {
          const phase = (s * 10 + i * 0.31) % 1;
          dot.setAttribute('cx', String(340 + i * 40));
          dot.setAttribute('cy', String(178 + phase * 56));
          dot.setAttribute(
            'opacity',
            String((is('foam') && s > 0.3) || rinsing ? (1 - phase) * 0.65 : 0),
          );
        });
        const shine = is('finish') ? smooth(s) : 0;
        attr('reflection', 'opacity', is('finish') ? Math.sin(shine * Math.PI) * 0.65 : 0);
        attr('shine', 'transform', 'translate(' + (300 + shine * 520) + ' 0)');
        attr(
          'sparkles',
          'opacity',
          is('complete') ? 1 : is('finish') ? smooth((s - 0.7) / 0.3) : 0,
        );
      }
      const percentage = Math.round(p * 100);
      $('.stage-label').textContent = currentStage.name;
      $('.stage-description').textContent = '';
      $('.nav-stage').textContent = currentStage.name;
      $('.nav-percent').textContent = percentage + '%';
      $('.progress-readout').textContent = percentage + '%';
      input.value = String(Math.round(p * 1000));
      input.setAttribute('aria-valuetext', percentage + '%, ' + currentStage.name);
      $('.rail-fill').style.transform = 'scaleX(' + p + ')';
      actor.style.transform = 'translateX(' + (still ? 0 : p * availableTravel) + 'px)';
      document.body.dataset.stage = currentStage.id;
      document.querySelectorAll('[data-seek]').forEach((button) => {
        button.setAttribute(
          'aria-pressed',
          String(Math.abs(p - Number(button.dataset.seek)) < 0.02),
        );
      });
    }
    function updatePlay() {
      const running = timeline && !timeline.paused() && timeline.progress() < 1;
      play.textContent = running
        ? 'Pause preview'
        : state.progress >= 0.999
          ? 'Replay preview'
          : 'Play preview';
      play.setAttribute('aria-pressed', String(Boolean(running)));
    }
    timeline = gsap.timeline({ paused: true, onUpdate: render, onComplete: updatePlay });
    timeline.to(state, { progress: 1, duration: 26, ease: 'none' });
    const stopScroll = () => {
      follow.checked = false;
    };
    function seek(value) {
      timeline.pause().progress(clamp(value));
      render();
      updatePlay();
    }
    input.addEventListener('input', () => {
      stopScroll();
      seek(Number(input.value) / 1000);
    });
    document.querySelectorAll('[data-seek]').forEach((button) =>
      button.addEventListener('click', () => {
        stopScroll();
        seek(Number(button.dataset.seek));
      }),
    );
    play.addEventListener('click', () => {
      stopScroll();
      if (!timeline.paused() && timeline.progress() < 1) timeline.pause();
      else {
        if (timeline.progress() >= 0.999) timeline.progress(0);
        timeline.play();
      }
      updatePlay();
    });
    $('#restart').addEventListener('click', () => {
      stopScroll();
      seek(0);
    });
    function fromScroll() {
      scrollQueued = false;
      if (!follow.checked) return;
      const max = document.documentElement.scrollHeight - innerHeight;
      seek(max > 0 ? scrollY / max : 0);
    }
    follow.addEventListener('change', () => {
      if (follow.checked) fromScroll();
    });
    addEventListener(
      'scroll',
      () => {
        if (follow.checked && !scrollQueued) {
          scrollQueued = true;
          requestAnimationFrame(fromScroll);
        }
      },
      { passive: true },
    );
    addEventListener('resize', () => {
      availableTravel = Math.max(0, lane.clientWidth - actor.clientWidth);
      if (follow.checked) fromScroll();
      else render();
    });
    function motionPreference() {
      timeline.pause();
      updatePlay();
      render();
      $('#motion-note').textContent = reduced.matches
        ? 'Reduced motion is on: no automatic playback or travelling scene. You can inspect stages or explicitly play the sample.'
        : 'Silent 26-second preview. Play, pause, inspect any stage, or link it to scrolling. Your website is unchanged.';
    }
    reduced.addEventListener('change', motionPreference);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        resumeWhenVisible = !timeline.paused();
        timeline.pause();
      } else if (resumeWhenVisible && !reduced.matches && !follow.checked) timeline.play();
      updatePlay();
    });
    document.querySelectorAll('button,input').forEach((el) => {
      el.disabled = false;
    });
    motionPreference();
    if (!reduced.matches) {
      timeline.play();
      updatePlay();
    }
    window.detailPreview = {
      seek,
      get progress() {
        return state.progress;
      },
      get playing() {
        return !timeline.paused() && timeline.progress() < 1;
      },
    };
  } catch (error) {
    console.error(error);
    $('#load-error').hidden = false;
    $('#motion-note').textContent = 'The production website has not been affected.';
  }
})();
