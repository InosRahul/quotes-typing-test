import { useEffect } from 'react';
import './styles.css';

export const Keys = () => {
  const line1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const line2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const line3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  useEffect(() => {
    window.addEventListener('keydown', newAnimate);
  });
  const newAnimate = e => {
    const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
    if (!key) return;
    key.classList.add('playing');
    setTimeout(() => key.classList.remove('playing'), 100);
  };
  return (
    <>
      <div className="keys">
        <div data-key={9} className="key">
          <kbd>Tab</kbd>
        </div>
        {line1.map(alphabet => (
          <div data-key={alphabet.charCodeAt(0)} className="key" key={alphabet}>
            <kbd>{alphabet}</kbd>
          </div>
        ))}
        <div data-key={8} className="key">
          <kbd>Back</kbd>
        </div>
      </div>
      <div className="keys">
        <div data-key={20} className="key">
          <kbd>Caps Lock</kbd>
        </div>
        {line2.map(alphabet => (
          <div data-key={alphabet.charCodeAt(0)} className="key" key={alphabet}>
            <kbd>{alphabet}</kbd>
          </div>
        ))}
      </div>
      <div className="keys">
        <div data-key={16} className="key">
          <kbd>Shift</kbd>
        </div>
        {line3.map(alphabet => (
          <div data-key={alphabet.charCodeAt(0)} className="key" key={alphabet}>
            <kbd>{alphabet}</kbd>
          </div>
        ))}
        <div data-key={188} className="key">
          <kbd>,</kbd>
        </div>
        <div data-key={190} className="key">
          <kbd>.</kbd>
        </div>
      </div>
      <div className="keys">
        <div data-key={32} className="key">
          <kbd>Space</kbd>
        </div>
      </div>
    </>
  );
};
