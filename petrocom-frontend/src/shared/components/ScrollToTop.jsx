import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePublicMotion } from '../motion/publicMotionContext';

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();
  const { scrollTo } = usePublicMotion();

  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => {
        const element = document.querySelector(hash);
        if (element) {
          scrollTo(element);
        }
      });
      return;
    }

    scrollTo(0, { immediate: true });
  }, [pathname, search, hash, scrollTo]);

  return null;
};

export default ScrollToTop;
