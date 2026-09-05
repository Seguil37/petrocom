import { createElement } from 'react';

const MotionTitle = ({ as: Component = 'h2', children, className = '' }) => {
  const text = String(children);

  return createElement(
    Component,
    {
      className,
      'data-motion-title': true,
      'aria-label': text,
    },
    text.split(' ').map((word, wordIndex, words) => (
      <span
        key={`${word}-${wordIndex}`}
        className="inline-block whitespace-nowrap"
        aria-hidden="true"
      >
        {Array.from(word).map((letter, letterIndex) => (
          <span
            key={`${letter}-${letterIndex}`}
            className="inline-block"
            data-motion-letter
          >
            {letter}
          </span>
        ))}
        {wordIndex < words.length - 1 && (
          <span className="inline-block" data-motion-letter>
            &nbsp;
          </span>
        )}
      </span>
    )),
  );
};

export default MotionTitle;
