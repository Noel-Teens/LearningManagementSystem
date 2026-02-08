import { useEffect, useState } from "react";
import axios from "axios";
import Question from "./Question";
import Result from "./Result";

const QUIZ_TIME = 60;

/* shuffle helper */
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME);
  const [finished, setFinished] = useState(false);

  /* load + randomize */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/questions")
      .then(res => setQuestions(shuffle(res.data)));
  }, []);

  /* timer */
  useEffect(() => {
    if (finished) return;

    const t = setInterval(() => {
      setTimeLeft(s => {
        if (s <= 1) {
          setFinished(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [finished]);

  /* save attempt when finished */
  useEffect(() => {
    if (!finished || questions.length === 0) return;

    axios.post(
      "http://localhost:5000/api/attempts",
      {
        score,
        total: questions.length
      }
    );
  }, [finished]);

  const handleAnswer = (selected) => {
    if (selected === questions[current].answer) {
      setScore(s => s + 1);
    }
    setCurrent(c => c + 1);
  };

  const submitNow = () => setFinished(true);

  const restart = () => {
    setQuestions(shuffle(questions));
    setCurrent(0);
    setScore(0);
    setTimeLeft(QUIZ_TIME);
    setFinished(false);
  };

  if (questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  if (finished || current >= questions.length) {
    return (
      <Result
        score={score}
        total={questions.length}
        restart={restart}
      />
    );
  }

  return (
    <div>

      <div style={{ marginBottom: 12 }}>
        ⏱ {timeLeft}s left
      </div>

      <Question
        data={questions[current]}
        onAnswer={handleAnswer}
        index={current}
        total={questions.length}
      />

      <button
        onClick={submitNow}
        style={{ marginTop: 12 }}
      >
        Submit Quiz
      </button>

    </div>
  );
}

export default Quiz;
