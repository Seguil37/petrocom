import { createContext, useContext } from 'react';

export const PublicMotionContext = createContext({
  enabled: false,
  lenis: null,
  scrollTo: () => {},
});

export const usePublicMotion = () => useContext(PublicMotionContext);
