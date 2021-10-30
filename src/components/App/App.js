import './App.css';
import { Keys } from 'components';
import { useState, useEffect } from 'react';
const fetchData = async () => {
  const data = await fetch('https://type.fit/api/quotes');
  let response = await data.json();
  return response.map(item => item.text);
};
export const App = () => {
  const [started, setStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [text, setText] = useState('');
  const [startTime, setStartTime] = useState();
  const [words, setWords] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [completedWords, setCompletedWords] = useState([]);
  const [wpm, setWpm] = useState(0);
  const [cpm, setCpm] = useState(0);
  const [errors, setErrors] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [diffWpm, setDiffWpm] = useState(0);
  const [diffCpm, setDiffCpm] = useState(0);
  const [idx, setIdx] = useState(0);
  const [freeze, setFreeze] = useState(false);
  const startGame = async () => {
    setStarted(true);
    let text_list = JSON.parse(localStorage.getItem('quotes_data'));
    if (!localStorage.getItem('quotes_data')) {
      text_list = await fetchData();
      localStorage.setItem('quotes_data', JSON.stringify(text_list));
    }
    const newText = text_list[Math.floor(Math.random() * text_list.length)];
    setText(newText);
    const newWords = newText.split(' ');
    setWords(newWords);
    setStartTime(Date.now());
    setCompletedWords([]);
  };
  const handleInputChange = e => {
    const newInputValue = e.target.value;
    const newLastLetter = newInputValue[newInputValue.length - 1];
    const currentWord = words[0];

    if (newLastLetter !== ' ') {
      if (newLastLetter === currentWord.at(idx)) {
        setIdx(idx + 1);
        setFreeze(false);
      } else if (e.nativeEvent.inputType === 'deleteContentBackward') {
        setErrors(errors);
      } else {
        if (!!freeze) {
          setErrors(errors);
        } else {
          setErrors(errors + 1);
          setFreeze(true);
        }
      }
    } else {
      setIdx(0);
    }

    if (newLastLetter === ' ' || newLastLetter === '.') {
      if (newInputValue.trim() === currentWord) {
        const newWords = [...words.slice(1)];
        const newCompletedWords = [...completedWords, currentWord];
        setWords(newWords);
        setCompletedWords(newCompletedWords);
        setCompleted(newWords.length === 0);
        setInputValue('');
      }
    } else {
      setInputValue(newInputValue);
    }
  };

  const calculateStats = () => {
    const now = Date.now();
    const diff = (now - startTime) / 1000 / 60; // 1000 ms / 60 s
    const wordsTyped = Math.ceil(
      completedWords.reduce((acc, word) => (acc += word.length), 0) / 5,
    );
    const charTyped = Math.ceil(
      completedWords.reduce((acc, word) => (acc += word.length), 0),
    );

    let newWpm = Math.ceil(wordsTyped / diff);
    let newCpm = Math.ceil(charTyped / diff);
    let wpmDiff = newWpm - wpm;
    let cpmDiff = newCpm - cpm;
    setWpm(newWpm);
    setCpm(newCpm);
    setDiffCpm(cpmDiff);
    setDiffWpm(wpmDiff);
    setTimeElapsed(diff);
  };

  useEffect(() => {
    if (!!completed) {
      setErrors(0);
      calculateStats();
      startGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed]);

  return (
    <>
      {started ? (
        <div>
          <div className="wpm">
            <strong>WPM </strong>
            {wpm}{' '}
            {diffWpm >= 0 ? (
              <span className="green"> ⬆ {diffWpm}</span>
            ) : (
              <span className="red"> ⬇ {diffWpm}</span>
            )}
            <br />
            <strong>CPM </strong>
            {cpm}{' '}
            {diffCpm >= 0 ? (
              <span className="green"> ⬆ {diffCpm}</span>
            ) : (
              <span className="red"> ⬇ {diffCpm}</span>
            )}
            <br />
            <strong>Time </strong>
            {Math.floor(timeElapsed * 60)}s
            <br />
            <strong>Errors </strong>
            {errors}
            {''}
            {/* <span className={diffErrors >=0 ? 'green' : 'red'}>{diffErrors}</span> */}
          </div>
          <div className="container">
            <h4>Type the text below</h4>
            <p className="text">
              {text.split(' ').map((word, w_idx) => {
                let highlight = false;
                let currentWord = false;

                // this means that the word is completed, so turn it green
                if (completedWords.length > w_idx) {
                  highlight = true;
                }

                if (completedWords.length === w_idx) {
                  currentWord = true;
                }

                return (
                  <span
                    className={`word 
                                ${highlight && 'green'} 
                                ${currentWord && 'underline'}`}
                    key={w_idx}
                  >
                    {word.split('').map((letter, l_idx) => {
                      const isCurrentWord = w_idx === completedWords.length;
                      const isWronglyTyped = letter !== inputValue[l_idx];
                      const shouldBeHighlighted = l_idx < inputValue.length;

                      return (
                        <span
                          className={`letter ${
                            isCurrentWord && shouldBeHighlighted
                              ? isWronglyTyped
                                ? 'red'
                                : 'green'
                              : ''
                          }`}
                          //
                          key={l_idx}
                        >
                          {letter}
                        </span>
                      );
                    })}
                  </span>
                );
              })}
            </p>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              autoFocus={started}
            />
          </div>
          <Keys />
        </div>
      ) : (
        <>
          <div className="container">
            <h2>Welcome to the Typing game</h2>
            <p>
              <strong>Rules:</strong> <br />
              Type in the input field the highlighted word. <br />
              The correct words will turn <span className="green">green</span>.
              <br />
              Incorrect letters will turn <span className="red">red</span>.
              <br />
              <br />
              Have fun! 😃
            </p>
            <button className="start-btn" onClick={startGame}>
              Start game
            </button>
          </div>
        </>
      )}
    </>
  );
};
