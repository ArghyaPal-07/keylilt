import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Brand from "./Brand";

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const retryRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState("");
  const result = state?.completed ? state : null;
  useEffect(() => { retryRef.current?.focus(); }, []);
  useEffect(() => {
    const restart = (event) => {
      if (event.key === "Enter" && !event.ctrlKey && !event.metaKey && !event.altKey &&
        (document.activeElement === document.body || document.activeElement === retryRef.current)) {
        event.preventDefault();
        navigate("/typing", { replace: true });
      }
    };
    window.addEventListener("keydown", restart);
    return () => window.removeEventListener("keydown", restart);
  }, [navigate]);
  const shareText = result ? `I typed ${result.wpm} WPM with ${result.accuracy}% accuracy on Keylilt. ${window.location.origin}` : "";
  const download = async () => {
    setExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(document.getElementById("result-score"), { backgroundColor: "#0a0a0a", scale: 2 });
      const link = document.createElement("a");
      link.download = "keylilt-results.png";
      link.href = canvas.toDataURL();
      link.click();
    } catch { setMessage("Could not save the image. Please try again."); }
    finally { setExporting(false); }
  };
  return <section className="results-page" aria-labelledby="results-title">
    <div className="results-content">
      <div id="result-score" className="result-score">
        <div className="results-top"><Brand /><span className="eyebrow"><span className="status-dot" />{result ? "Test completed" : "Ready when you are"}</span></div>
        {result ? <>
          <h1 id="results-title" className="sr-only">Your typing results</h1>
          <div className="score-center"><span className="eyebrow">Words per minute</span><p className="wpm-score">{result.wpm}<span className="score-period">.</span></p><span className="score-caption">A little practice. A little progress.</span></div>
          <dl className="result-metrics">
            <div><dt>Accuracy</dt><dd>{result.accuracy}<span>%</span></dd></div>
            <div><dt>Errors</dt><dd>{result.mistakes}</dd></div>
            <div><dt>Duration</dt><dd>{result.duration}<span>s</span></dd></div>
          </dl>
        </> : <div className="empty-result"><h1 id="results-title">Find your rhythm.</h1><p>Complete a typing test to see your results here.</p></div>}
      </div>
      <div className="result-actions"><button ref={retryRef} className="primary-button" onClick={() => navigate("/typing", { replace: true })}>{result ? "Try Again" : "Start typing"}<span aria-hidden="true">↗</span></button><span className="shortcut-hint">or press <kbd>enter</kbd></span></div>
      {result && <details className="share-options"><summary>Share your result</summary><div><button onClick={download} disabled={exporting}>{exporting ? "Saving…" : "Save image"}</button><a target="_blank" rel="noopener noreferrer" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}>Share on X</a><a target="_blank" rel="noopener noreferrer" href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}>WhatsApp</a></div></details>}
      <p role="status" className="feedback">{message}</p>
      <Link to="/" className="back-link">← Back to practice</Link>
    </div>
  </section>;
}
