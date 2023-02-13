import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

function App() {
  //   setGreetMsg(await invoke("greet", { name }));
  const [quote, setQuote] = useState("Lorem ipsum?");
  const [userQuote, setUserQuote] = useState("");
  const [result, setResult] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  // const [currWord, setCurrWord] = useState("");

  const handleType = (e: any) => {
    const lastChar = e.target.value[e.target.value.length - 1];
    if (quote[userQuote.length] === lastChar) {
      console.log("correct");
      setUserQuote((prev) => prev + lastChar);
    } else {
      console.log(e.target.value, quote[userQuote.length]);
    }

    if (lastChar === " " && quote[userQuote.length] === " ") {
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (userQuote.length === quote.length) {
      showResults();
    }
  }, [userQuote]);

  const showResults = () => {
    inputRef.current.value = "";
    let errors = 0;
    let hits = 0;

    for (let i = 0; i < quote.length; i++) {
      console.log(quote[i], userQuote[i]);
      if (userQuote[i] === quote[i]) {
        hits++;
      } else {
        errors++;
      }
    }

    const precision = Math.round((hits / quote.length) * 100);
    setResult(`errors: ${errors} hits: ${hits} precision: ${precision}%`);
  };

  const isCorrect = (i: number) => {
    if (userQuote[i] === quote[i]) {
      return "typeSuccess";
    } else if (userQuote[i] === undefined) {
      return "";
    }
  };

  return (
    <div className="container">
      <h1 className="title">
        Welcome to <i>Typas</i>!
      </h1>

      <code>
        <p>
          {quote.split("").map((letter, i) => (
            <strong className={isCorrect(i)} key={i}>
              {letter}
            </strong>
          ))}
        </p>
      </code>

      {/* <p>{userQuote}</p> */}

      <p>{result}</p>

      <div className="row">
        <div>
          <input
            id="greet-input"
            onChange={(e) => handleType(e)}
            placeholder="Type here..."
            maxLength={quote.length}
            autoComplete="false"
            ref={inputRef}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
