function Question({ data, onAnswer, index, total }) {
  if (!data) {
    return <p>No question available</p>;
  }

  return (
    <div>

      <div className="question-meta">
        Question {index + 1} of {total}
      </div>

      <h3>{data.question}</h3>

      <div className="option-list">
        {data.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

    </div>
  );
}

export default Question;
