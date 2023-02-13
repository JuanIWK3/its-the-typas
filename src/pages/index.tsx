import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import styles from "./home.module.scss";

function App() {
  const [quote, setQuote] = useState("");
  const [userQuote, setUserQuote] = useState("");
  const [result, setResult] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState(0);
  const [currWord, setCurrWord] = useState("");

  const progress = ((userQuote.length + currWord.length) / quote.length) * 100;

  const handleType = (e: any) => {
    const word = e.target.value;
    setCurrWord(word);

    if (word[word.length - 1] !== quote[userQuote.length + word.length - 1]) {
      setErrors((prev) => prev + 1);
    }

    console.log(word[word.length - 1]);

    if (
      word[word.length - 1] === " " &&
      quote[userQuote.length + word.length - 1] === " "
    ) {
      setUserQuote((prev) => prev + word);
      setCurrWord("");
      inputRef.current.value = "";
    }

    console.log(quote[userQuote.length + word.length - 1]);
  };

  const showResults = () => {
    inputRef.current.value = "";

    const precision = Math.round(
      (quote.length / (quote.length + errors)) * 100
    );
    setResult(`errors: ${errors} precision: ${precision}%`);
  };

  const isCorrect = (i: number) => {
    if (userQuote[i] === quote[i]) {
      return styles.typeSuccess;
    } else if (userQuote[i] === undefined) {
      if (currWord[i - userQuote.length] === quote[i]) {
        return styles.typeSuccess;
      } else if (currWord[i - userQuote.length] === undefined) {
        return "";
      }
    }

    return styles.typeError;
  };

  const getQuote = async () => {
    try {
      const res = (await invoke("start")) as any;
      setQuote(res);
    } catch (error) {
      console.log(error);
    }
  };

  const restartGame = () => {
    setUserQuote("");
    setErrors(0);
    setResult("");
    setCurrWord("");
    inputRef.current.value = "";
    inputRef.current.focus();
    getQuote();
  };

  useEffect(() => {
    if (quote === "") {
      getQuote();
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (userQuote + currWord !== quote) return;
    if (userQuote.length + currWord.length === quote.length) {
      showResults();
    }
  }, [userQuote, currWord]);

  const [first, setFirst] = useState("");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Welcome to <i>Typas</i>!
      </h1>
      <div
        className={styles.progress}
        style={{
          width: `${progress}%`,
          background: "#396cd8",
          height: "2px",
        }}
      />

      <code className={styles.quote}>
        <p>
          {quote.split("").map((letter, i) => (
            <strong
              className={`
                ${isCorrect(i)} ${
                userQuote.length + currWord.length === i && styles.typeCurrent
              }
              `.trim()}
              key={i}
            >
              {letter}
            </strong>
          ))}
        </p>
      </code>

      <input
        id="greet-input"
        onChange={(e) => handleType(e)}
        placeholder="Type here..."
        maxLength={quote.length}
        autoComplete="false"
        ref={inputRef}
        type="text"
      />

      <div className="row">
        <button onClick={restartGame}>Restart</button>
        <button>Hello</button>
      </div>
      {first}

      <p>{result}</p>
    </div>
  );
}

export default App;
