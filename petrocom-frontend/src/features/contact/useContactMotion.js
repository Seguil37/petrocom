import { useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { usePublicMotion } from '../../shared/motion/publicMotionContext';

gsap.registerPlugin(ScrollTrigger);

export default function useContactMotion(root) {
  const { lenis } = usePublicMotion();

  useEffect(() => {
    const page = root.current;
    if (!page) return undefined;
    let frame;
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { lenis?.resize(); ScrollTrigger.refresh(); });
    };
    page.addEventListener('load', refresh, true);
    refresh();
    return () => { page.removeEventListener('load', refresh, true); cancelAnimationFrame(frame); };
  }, [root, lenis]);

  useLayoutEffect(() => {
    const page = root.current;
    if (!page) return undefined;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const select = gsap.utils.selector(page);
      const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
      entrance.fromTo(select('[data-contact-title]'), { yPercent: 110 }, { yPercent: 0, duration: 1.15, stagger: 0.12 }, 0.1)
        .fromTo(select('[data-contact-intro]'), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity,visibility' }, 0.4);
      select('[data-contact-reveal]').forEach((element) => {
        if (element.parentElement.matches('.ct-topic-list')) return;
        gsap.fromTo(element, { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.85, ease: 'power3.out', clearProps: 'transform,opacity,visibility', scrollTrigger: { trigger: element, start: 'top 90%', once: true } });
      });
      select('.ct-topic-list').forEach((group) => {
        gsap.fromTo(group.children, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.12, clearProps: 'transform,opacity,visibility', scrollTrigger: { trigger: group, start: 'top 90%', once: true } });
      });
      select('[data-contact-image]').forEach((image) => {
        const reveal = gsap.timeline({ scrollTrigger: { trigger: image, start: 'top 90%', once: true } });
        reveal.fromTo(image, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'power3.inOut', clearProps: 'clipPath' })
          .fromTo(image.querySelector('img'), { scale: 1.08 }, { scale: 1, duration: 1.5, ease: 'power3.out' }, 0);
      });
    }, page);
    return () => media.revert();
  }, [root]);
}
