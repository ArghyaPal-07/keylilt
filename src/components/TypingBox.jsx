import { useCallback, useEffect, useRef, useState } from "react";
import { generate } from "random-words";
import { useNavigate } from "react-router-dom";
import { databases, ID, isAppwriteConfigured } from "../appwriteConfig";
import { useAuth } from "../utils/AuthContext";
import { Query } from "appwrite";
import { calculateMetrics } from "../utils/typingMetrics";

const MAX_TIME = 30;
const freshSession = () => ({ index: 0, mistakes: 0, startedAt: null, finished: false });
export default function TypingTest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const inputRef = useRef(null);
  const session = useRef(freshSession());
  const [words, setWords] = useState(() => generate({ exactly: 30, join: " " }));
  const [marks, setMarks] = useState([]);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [metrics, setMetrics] = useState({ wpm: 0, accuracy: "100.00" });
  const [index, setIndex] = useState(0);
  const [focused, setFocused] = useState(false);
  const [running, setRunning] = useState(false);
  const activeChar = useRef(null);

  const finish = useCallback((duration) => {
    const current = session.current;
    if (current.finished) return;
    current.finished = true;
    const score = calculateMetrics(current.index, current.mistakes, duration);
    const result = { ...score, mistakes: current.mistakes, duration: Number(duration.toFixed(1)), completed: true };
    // Preserve existing personal-best record fields, without changing the schema.
    if (user && isAppwriteConfigured && import.meta.env.VITE_APPWRITE_DATABASE_ID && import.meta.env.VITE_APPWRITE_COLLECTION_ID) {
      const database = import.meta.env.VITE_APPWRITE_DATABASE_ID;
      const collection = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
      (async () => {
        try {
          const records = await databases.listDocuments(database, collection, [Query.equal("name", user.name || "Anonymous")]);
          const previous = records.documents[0];
          const data = { wpm: Math.max(Number(previous?.wpm) || 0, score.wpm), accuracy: Math.max(Number(previous?.accuracy) || 0, parseInt(score.accuracy)), timestamp: new Date().toISOString() };
          if (previous) await databases.updateDocument(database, collection, previous.$id, data);
          else await databases.createDocument(database, collection, ID.unique(), { ...data, name: user.name || "Anonymous", rank: 0 });
        } catch (error) { console.error("Could not save leaderboard score:", error); }
      })();
    }
    navigate("/results", { state: result });
  }, [navigate, user]);

  const reset = useCallback(() => {
    session.current = freshSession();
    setWords(generate({ exactly: 30, join: " " }));
    setMarks([]);
    setIndex(0);
    setTimeLeft(MAX_TIME);
    setMetrics({ wpm: 0, accuracy: "100.00" });
    setRunning(false);
    if (inputRef.current) { inputRef.current.value = ""; inputRef.current.focus(); }
  }, []);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    const restart = (event) => {
      if (event.key === "Escape") { event.preventDefault(); reset(); }
    };
    window.addEventListener("keydown", restart);
    return () => window.removeEventListener("keydown", restart);
  }, [reset]);
  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const elapsed = Math.min(MAX_TIME, (performance.now() - session.current.startedAt) / 1000);
      setTimeLeft(Math.max(0, Math.ceil(MAX_TIME - elapsed)));
      setMetrics(calculateMetrics(session.current.index, session.current.mistakes, elapsed));
      if (elapsed >= MAX_TIME) finish(MAX_TIME);
    };
    const timer = setInterval(tick, 100);
    return () => clearInterval(timer);
  }, [running, finish]);
  useEffect(() => {
    const element = activeChar.current;
    if (element && element.offsetTop > 100) element.parentElement.scrollTop = element.offsetTop - 50;
    else if (element) element.parentElement.scrollTop = 0;
  }, [index]);

  const handleChange = (event) => {
    const current = session.current;
    if (current.finished || event.nativeEvent.isComposing) return;
    const elapsed = current.startedAt === null ? 0 : (performance.now() - current.startedAt) / 1000;
    if (elapsed >= MAX_TIME) { finish(MAX_TIME); return; }
    const value = event.target.value;
    if (event.nativeEvent.inputType === "deleteContentBackward" || value.length < current.index) {
      current.index = Math.max(0, current.index - 1);
      setMarks(previous => previous.slice(0, current.index));
      setIndex(current.index);
      return;
    }
    // A test accepts one keystroke at a time; paste cannot produce a score.
    if (value.length !== current.index + 1) { event.target.value = value.slice(0, current.index); return; }
    if (current.startedAt === null) { current.startedAt = performance.now(); setRunning(true); }
    const correct = value.at(-1) === words[current.index];
    if (!correct) current.mistakes += 1;
    setMarks(previous => [...previous.slice(0, current.index), correct ? "correct" : "incorrect"]);
    current.index += 1;
    setIndex(current.index);
    setMetrics(calculateMetrics(current.index, current.mistakes, elapsed));
    if (current.index >= words.length) finish(Math.max(0.001, (performance.now() - current.startedAt) / 1000));
  };

  return <section className="typing-page" aria-labelledby="typing-title">
    <div className="practice-heading"><span className="eyebrow">A moment of focus</span><h1 id="typing-title">Find your rhythm<span>.</span></h1><p>Let everything else fall quiet. Start typing.</p></div>
    <div className="test-toolbar"><div><span className="mode-label">words</span><span className="toolbar-divider" />English<span className="toolbar-divider" /><span>30 seconds</span></div><span className="timer" aria-label={`${timeLeft} seconds remaining`}>{timeLeft}<small>s</small></span></div>
    <dl className="live-metrics"><div><dt>wpm</dt><dd>{metrics.wpm}</dd></div><div><dt>accuracy</dt><dd>{metrics.accuracy}%</dd></div><div><dt>errors</dt><dd>{session.current.mistakes}</dd></div></dl>
    <div className={`typing-area ${focused ? "is-focused" : ""}`} onClick={() => inputRef.current?.focus()}>
      <label className="sr-only" htmlFor="typing-input">Type the displayed English words. Timer starts on your first character.</label>
      <input id="typing-input" className="typing-input" ref={inputRef} onChange={handleChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onPaste={event => event.preventDefault()} autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck="false" inputMode="text" aria-describedby="typing-instructions typing-passage" />
      <p id="typing-passage" className="sr-only">{words}</p><p className="typing-words" aria-hidden="true">{words.split("").map((char, position) => <span key={position} ref={position === index ? activeChar : null} className={`${marks[position] || "upcoming"} ${position === index ? "active-char" : ""}`}>{char}</span>)}</p>
      {!focused && <span className="focus-prompt">Click here or tab to focus</span>}
    </div>
    <div className="test-bottom"><span id="typing-instructions">{running ? "Stay with the rhythm." : "The timer starts with your first keystroke."}</span><button onClick={reset} className="restart-button" aria-label="Restart test">↻ <span>Restart</span><kbd>esc</kbd></button></div>
  </section>;
}
