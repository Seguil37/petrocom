export const normalizeWhitespace = (value = '') => String(value).replace(/\s+/g, ' ').trim();

export const toTitleCase = (value = '') =>
  normalizeWhitespace(value)
    .toLocaleLowerCase('es-PE')
    .replace(/(^|\s|-|')(\p{L})/gu, (match, separator, char) => `${separator}${char.toLocaleUpperCase('es-PE')}`);

export const normalizeSentence = (value = '') => {
  const text = normalizeWhitespace(value);
  if (!text) return '';
  return `${text.charAt(0).toLocaleUpperCase('es-PE')}${text.slice(1)}`;
};

export const normalizeEmail = (value = '') => normalizeWhitespace(value).toLocaleLowerCase('es-PE');

export const normalizePhone = (value = '') =>
  normalizeWhitespace(value)
    .replace(/[^\d+]/g, '')
    .replace(/^00/, '+');

export const normalizeCode = (value = '') =>
  normalizeWhitespace(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export const normalizeCodeDraft = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\s+/g, '-')
    .replace(/[^A-Z0-9-]+/g, '-')
    .replace(/-+/g, '-');

export const normalizeUrl = (value = '') => normalizeWhitespace(value);

export const applyTextNormalizer = (setter, field, normalizer = toTitleCase) => {
  setter((prev) => ({ ...prev, [field]: normalizer(prev[field]) }));
};
