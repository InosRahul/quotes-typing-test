import './App.css';
import { Keys } from 'components';
import { useState, useRef } from 'react';
export const App = () => {
  const [started, setStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [text, setText] = useState('');
  const [startTime, setStartTime] = useState();
  const [words, setWords] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [completedWords, setCompletedWords] = useState([]);
  const [wpm, setWpm] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [lastLetter, setLastLetter] = useState('');
  const inputRef = useRef();

  const startGame = () => {
    setStarted(true);
    const text_list = [
      `You never read a book on psychology, Tippy. You didn't need to. You knew by some divine instinct that you can make more friends in two months by becoming genuinely interested in other people than you can in two years by trying to get other people interested in you.`,
      `I know more about the private lives of celebrities than I do about any governmental policy that will actually affect me. I'm interested in things that are none of my business, and I'm bored by things that are important to know.`,
      `A spider.`,
      `As customers of all races, nationalities, and cultures visit the Dekalb Farmers Market by the thousands, I doubt that many stand in awe and contemplate the meaning of its existence. But in the capital of the Sunbelt South, the quiet revolution of immigration and food continues to upset and redefine the meanings of local, regional, and global identity.`,
      `Outside of two men on a train platform there's nothing in sight. They're waiting for spring to come, smoking down the track. The world could come to an end tonight, but that's alright. She could still be there sleeping when I get back.`,
      `I'm a broke-nose fighter. I'm a loose-lipped liar. Searching for the edge of darkness. But all I get is just tired. I went looking for attention. In all the wrong places. I was needing a redemption. And all I got was just cages.`,
    ];
    const newText = text_list[Math.floor(Math.random() * text_list.length)];
    setText(newText);
    const newWords = newText.split(' ');
    setWords(newWords);
    setStartTime(Date.now());
    setCompletedWords([]);
    console.log(newWords);
  };
  const handleInputChange = e => {
    const newInputValue = e.target.value;
    const newLastLetter = newInputValue[newInputValue.length - 1];
    console.log(newLastLetter);
    const currentWord = words[0];
    console.log(completedWords);
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
      setLastLetter(newLastLetter);
    }
    calculateWPM();
  };

  const calculateWPM = () => {
    const now = Date.now();
    const diff = (now - startTime) / 1000 / 60; // 1000 ms / 60 s

    // every word is considered to have 5 letters
    // so here we are getting all the letters in the words and divide them by 5
    // "my" shouldn't be counted as same as "deinstitutionalization"
    const wordsTyped = Math.ceil(
      completedWords.reduce((acc, word) => (acc += word.length), 0) / 5,
    );

    // calculating the wpm
    const wpm = Math.ceil(wordsTyped / diff);
    setWpm(wpm);
    setTimeElapsed(diff);
  };

  return (
    <>
      {started ? (
        <div>
          <div className="wpm">
            <strong>WPM: </strong>
            {wpm}
            <br />
            <strong>Time: </strong>
            {Math.floor(timeElapsed * 60)}s
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
          <div>Welcome to the Typing Game</div>
          <button onClick={startGame}>Start Game</button>
        </>
      )}
    </>
  );
};
