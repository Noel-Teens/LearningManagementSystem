import { useEffect, useState } from "react";
import axios from "axios";

function TrainerPanel() {
  const [questions, setQuestions] = useState([]);
  const [attempts, setAttempts] = useState([]);

  const [question, setQuestion] = useState("");
  const [opt1, setOpt1] = useState("");
  const [opt2, setOpt2] = useState("");
  const [opt3, setOpt3] = useState("");
  const [answer, setAnswer] = useState("");

  const Q_API = "http://localhost:5000/api/questions";
  const A_API = "http://localhost:5000/api/attempts";

  /* ---------- load ---------- */

  const loadAll = async () => {
    const q = await axios.get(Q_API);
    const a = await axios.get(A_API);
    setQuestions(q.data);
    setAttempts(a.data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  /* ---------- add question ---------- */

  const add = async () => {
    if (!question || !answer) return;

    await axios.post(Q_API, {
      question,
      options: [opt1, opt2, opt3].filter(Boolean),
      answer
    });

    setQuestion("");
    setOpt1("");
    setOpt2("");
    setOpt3("");
    setAnswer("");

    loadAll();
  };

  /* ---------- delete question ---------- */

  const remove = async (id) => {
    await axios.delete(`${Q_API}/${id}`);
    loadAll();
  };

  return (
    <div>

      <h3>Trainer Panel</h3>

      {/* ===== add question ===== */}

      <h4>Add Question</h4>

      <input
        placeholder="Question"
        value={question}
        onChange={e => setQuestion(e.target.value)}
      />

      <input
        placeholder="Option 1"
        value={opt1}
        onChange={e => setOpt1(e.target.value)}
      />

      <input
        placeholder="Option 2"
        value={opt2}
        onChange={e => setOpt2(e.target.value)}
      />

      <input
        placeholder="Option 3"
        value={opt3}
        onChange={e => setOpt3(e.target.value)}
      />

      <input
        placeholder="Correct answer"
        value={answer}
        onChange={e => setAnswer(e.target.value)}
      />

      <button onClick={add}>
        Save Question
      </button>

      {/* ===== question list ===== */}

      <h4 style={{ marginTop: 30 }}>
        Question Bank
      </h4>

      {questions.map(q => (
        <div key={q._id} style={{
          border: "1px solid #ddd",
          padding: 10,
          marginBottom: 8,
          borderRadius: 8
        }}>
          <b>{q.question}</b>
          <div>Answer: {q.answer}</div>

          <button
            onClick={() => remove(q._id)}
            style={{ marginTop: 6 }}
          >
            Delete
          </button>
        </div>
      ))}

      {/* ===== attempts ===== */}

      <h4 style={{ marginTop: 30 }}>
        Attempt History
      </h4>

      {attempts.map(a => (
        <div key={a._id} style={{
          border: "1px solid #e5e7eb",
          padding: 10,
          marginBottom: 8,
          borderRadius: 8
        }}>
          Score: <b>{a.score}/{a.total}</b>
          <div style={{ fontSize: 13, color: "#666" }}>
            {new Date(a.takenAt).toLocaleString()}
          </div>
        </div>
      ))}

    </div>
  );
}

export default TrainerPanel;
