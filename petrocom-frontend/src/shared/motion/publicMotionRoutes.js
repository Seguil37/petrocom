const PUBLIC_MOTION_EXACT_PATHS = new Set([
  '/',
  '/about',
  '/contacto',
  '/projects',
  '/services',
]);

const PUBLIC_MOTION_PREFIXES = ['/projects/', '/services/'];

export const shouldUsePublicMotion = (pathname = '') => {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';

  return (
    PUBLIC_MOTION_EXACT_PATHS.has(normalizedPath) ||
    PUBLIC_MOTION_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix))
  );
};
