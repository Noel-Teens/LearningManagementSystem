function Result({ score, total, restart }) {
  const percent = Math.round((score / total) * 100);
  const passed = percent >= 60;

  return (
    <div>
      <h2>Quiz Completed</h2>

      <p>Score: {score} / {total}</p>
      <p>Percentage: {percent}%</p>

      <p className={passed ? "result-pass" : "result-fail"}>
        {passed ? "PASS" : "FAIL"}
      </p>

      <button className="primary-btn" onClick={restart}>
        Restart Quiz
      </button>
    </div>
  );
}

export default Result;

