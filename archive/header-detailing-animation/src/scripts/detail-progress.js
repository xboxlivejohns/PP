import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createDetailingScene } from './detailing-scene';

export function initDetailProgress(header) {
  const lane = header.querySelector('[data-detail-progress]');
  if (!lane) return;
  const actor = lane.querySelector('[data-detail-actor]');
  const fill = lane.querySelector('[data-detail-fill]');
  const scene = createDetailingScene(actor);
  const media = gsap.matchMedia();
  let travel = 0;

  media.add({ always: 'all', reduce: '(prefers-reduced-motion: reduce)', mobile: '(max-width: 760px)' }, (context) => {
    const reduced = context.conditions.reduce;
    const stationary = reduced || context.conditions.mobile;
    let previousFrame = -1;
    lane.dataset.motion = reduced ? 'reduced' : 'scroll';
    const move = gsap.quickSetter(actor, 'x', 'px');
    const progressFill = gsap.quickSetter(fill, 'scaleX');
    const paint = (progress) => {
      if (document.hidden) return;
      const p = Math.max(0, Math.min(1, progress));
      move(stationary ? 0 : travel * p);
      progressFill(p);
      // No timers, autoplay or repeated work while the reader is stationary.
      const frame = reduced ? 1 : Math.round(p * 6000) / 6000;
      if (frame !== previousFrame) {
        scene.render(frame);
        previousFrame = frame;
      }
      lane.dataset.progress = p.toFixed(4);
    };
    const measure = () => {
      travel = Math.max(0, lane.getBoundingClientRect().width - actor.getBoundingClientRect().width);
    };
    measure();
    const trigger = ScrollTrigger.create({
      id: 'header-detail-progress',
      start: 0,
      end: 'max',
      onUpdate: (self) => paint(self.progress),
      onRefresh: (self) => {
        measure();
        paint(self.progress);
      },
    });
    paint(trigger.progress);

    // The header may resize independently of the viewport (fonts, zoom, wrapping).
    const observer = new ResizeObserver(() => {
      measure();
      paint(trigger.progress);
    });
    observer.observe(lane);
    observer.observe(actor);
    const restore = () => {
      if (!document.hidden) {
        trigger.refresh();
        paint(trigger.progress);
      }
    };
    document.addEventListener('visibilitychange', restore);
    window.addEventListener('pageshow', restore);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', restore);
      window.removeEventListener('pageshow', restore);
      trigger.kill();
    };
  });
  return () => media.revert();
}
