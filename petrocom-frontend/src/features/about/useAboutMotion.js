import { useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { usePublicMotion } from '../../shared/motion/publicMotionContext';

gsap.registerPlugin(ScrollTrigger);

// Lenis and its GSAP ticker belong to PublicMotionProvider. This hook only
// owns the page's visual effects, so navigating away cannot leave them running.
export default function useAboutMotion(root) {
  const { lenis } = usePublicMotion();

  // Keep Lenis' scroll limits and ScrollTrigger aligned after lazy images load.
  useEffect(() => {
    const page = root.current;
    if (!page) return undefined;
    let frame;
    const synchronize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        lenis?.resize();
        ScrollTrigger.refresh();
      });
    };
    page.addEventListener('load', synchronize, true);
    synchronize();
    return () => {
      cancelAnimationFrame(frame);
      page.removeEventListener('load', synchronize, true);
    };
  }, [root, lenis]);

  useLayoutEffect(() => {
    if (!root.current) return undefined;
    const page = root.current;
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const select = gsap.utils.selector(page);
      const hero = gsap.timeline({ defaults: { ease: 'power3.out' } });
      hero.fromTo(select('.pc-hero-media img'), { scale: 1.1, opacity: 0.3 }, { scale: 1, opacity: 1, duration: 1.7 }, 0)
        .fromTo(select('[data-about-title-line]'), { yPercent: 110 }, { yPercent: 0, duration: 1.15, stagger: 0.12 }, 0.15)
        .fromTo(select('[data-about-hero-item]'), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, clearProps: 'transform,opacity,visibility' }, 0.5);

      gsap.fromTo(select('.pc-reading-progress'), { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: page, start: 'top top', end: 'bottom bottom', scrub: 0.2 },
      });

      select('[data-about-heading]').forEach((heading) => {
        gsap.fromTo(heading.querySelectorAll('[data-about-heading-line]'), { yPercent: 105 }, {
          yPercent: 0, duration: 1.1, stagger: 0.12, ease: 'power4.out',
          scrollTrigger: { trigger: heading, start: 'top 90%', once: true },
        });
      });

      select('[data-about-reveal]').forEach((element) => {
        if (element.parentElement.matches('.pc-purpose-grid, .pc-capabilities, .pc-commitment-list')) return;
        gsap.fromTo(element, { autoAlpha: 0, y: 26 }, {
          autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out',
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: { trigger: element, start: 'top 92%', once: true },
        });
      });
      select('.pc-purpose-grid, .pc-capabilities, .pc-commitment-list').forEach((group) => {
        gsap.fromTo(group.querySelectorAll('[data-about-reveal]'), { autoAlpha: 0, y: 26 }, {
          autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.13, ease: 'power3.out',
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: { trigger: group, start: 'top 90%', once: true },
        });
      });
      select('[data-about-image-reveal]').forEach((element) => {
        gsap.fromTo(element, { clipPath: 'inset(0 0 100% 0)' }, {
          clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'power3.inOut', clearProps: 'clipPath',
          scrollTrigger: { trigger: element, start: 'top 90%', once: true },
        });
        gsap.fromTo(element.querySelector('img'), { scale: 1.12 }, {
          scale: 1, duration: 1.6, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 90%', once: true },
        });
      });
      select('[data-about-parallax]').forEach((element) => {
        gsap.fromTo(element, { yPercent: -4 }, { yPercent: 4, ease: 'none',
          scrollTrigger: { trigger: element.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        });
      });
      select('[data-about-panorama]').forEach((element) => {
        gsap.fromTo(element, { scale: 1.08, yPercent: -4 }, { scale: 1, yPercent: 4, ease: 'none',
          scrollTrigger: { trigger: element.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.7 },
        });
      });
      gsap.fromTo(select('.pc-scroll-cue svg'), { y: -3 }, { y: 4, repeat: -1, yoyo: true, duration: 1, ease: 'sine.inOut' });
    }, page);

    media.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.to(page.querySelector('.pc-hero-content'), {
        yPercent: -12, autoAlpha: 0.3, ease: 'none',
        scrollTrigger: { trigger: page.querySelector('.pc-hero'), start: 'top top', end: 'bottom top', scrub: 0.7 },
      });
    }, page);

    media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const cleanups = [];
      page.querySelectorAll('.pc-purpose-panel').forEach((panel) => {
        const scale = gsap.quickTo(panel.querySelector('img'), 'scale', { duration: 0.85, ease: 'power3.out' });
        const shift = gsap.quickTo(panel.querySelector('h3'), 'y', { duration: 0.6, ease: 'power3.out' });
        const enter = () => { scale(1.065); shift(-7); };
        const leave = () => { scale(1); shift(0); };
        panel.addEventListener('mouseenter', enter);
        panel.addEventListener('mouseleave', leave);
        cleanups.push(() => {
          panel.removeEventListener('mouseenter', enter);
          panel.removeEventListener('mouseleave', leave);
        });
      });
      return () => cleanups.forEach((cleanup) => cleanup());
    }, page);

    return () => media.revert();
  }, [root]);
}
