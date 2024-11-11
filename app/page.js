'use client';

import React, { useState } from 'react';

const questions = [
  {
    question: "Which of these is NOT one of the lobes of the human brain?",
    options: ["Temporal lobe", "Parietal lobe", "Cognitive lobe", "Occipital lobe"],
    correct: 2
  },
  {
    question: "Who is considered the father of psychoanalysis?",
    options: ["Carl Jung", "Sigmund Freud", "Ivan Pavlov", "B.F. Skinner"],
    correct: 1
  },
  {
    question: "Which psychological perspective emphasizes observable behaviors?",
    options: ["Psychodynamic", "Behaviorism", "Humanistic", "Cognitive"],
    correct: 1
  }
];

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowScore(true);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Psychology Admission Quiz</h1>
        
        {showScore ? (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Quiz Complete!</h2>
            <p className="text-lg">Your score: {score} out of {questions.length}</p>
            <p className="text-lg">Percentage: {(score / questions.length * 100).toFixed(1)}%</p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {questions.length}
              </p>
              <h2 className="text-lg font-medium mt-2">
                {questions[currentQuestion].question}
              </h2>
            </div>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full text-left p-3 rounded ${
                    selectedAnswer === index 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className={`mt-6 px-4 py-2 rounded ${
                selectedAnswer === null
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
