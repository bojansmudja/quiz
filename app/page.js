'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export default function Page() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(1200);

  useEffect(() => {
    fetch('/questions.csv')
      .then(response => response.text())
      .then(text => {
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            const allQuestions = results.data
              .filter(row => row.question)
              .map(row => ({
                question: row.question,
                options: [row.option1, row.option2, row.option3, row.option4],
                correct: parseInt(row.correct),
                explanation: row.explanation
              }));

            // Select 20 random questions
            const randomQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 20);
            setQuestions(randomQuestions);
            setLoading(false);
          }
        });
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loading) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading]);

  const playSound = (type) => {
    if (typeof window !== 'undefined') {
      const audio = new Audio(`/sounds/${type}.mp3`);
      audio.volume = type === 'click' ? 0.3 : 0.4;
      audio.play().catch(() => {});
    }
  };

  const handleAnswer = (index) => {
    playSound('click');
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    playSound(isCorrect ? 'correct' : 'incorrect');

    setAnswers([...answers, {
      question: questions[currentQuestion].question,
      selected: questions[currentQuestion].options[selectedAnswer],
      correct: questions[currentQuestion].options[questions[currentQuestion].correct],
      isCorrect: isCorrect,
      explanation: questions[currentQuestion].explanation
    }]);

    if (isCorrect) setScore(prevScore => prevScore + 1);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    setShowScore(true);
    playSound('finish');
  };

  const formatTime = (seconds) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
        Loading Quiz Questions...
      </div>
    );
  }

  if (showScore) {
    return (
      <div className="p-8 bg-gradient-to-r from-purple-600 to-blue-500 min-h-screen text-white">
        <h2 className="text-4xl font-bold text-center mb-6">Quiz Results</h2>
        <p className="text-center text-2xl mb-4">Score: {score} out of {questions.length}</p>
        <p className="text-center text-xl mb-8">{(score / questions.length * 100).toFixed(1)}%</p>
        <div className="space-y-4">
          {answers.map((answer, index) => (
            <div key={index} className={`p-4 rounded-lg ${answer.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
              <p className="font-semibold">Question {index + 1}: {answer.question}</p>
              <p>Your answer: {answer.selected}</p>
              {!answer.isCorrect && <p>Correct answer: {answer.correct}</p>}
              <p className="italic">{answer.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-r from-purple-600 to-blue-500 text-white flex flex-col items-center">
      <h1 className="text-5xl font-bold mb-8 text-center">Psychology Admission Quiz</h1>
      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl">Question {currentQuestion + 1}/{questions.length}</p>
          <p className="text-xl">Time Left: {formatTime(timeLeft)}</p>
        </div>
        <div className="h-4 bg-gray-300 rounded-full overflow-hidden mb-6">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-2xl font-semibold mb-4">{questions[currentQuestion].question}</p>
        <div className="space-y-4">
          {questions[currentQuestion].options.map((option, index) => (
            <label
              key={index}
              className={`block p-4 rounded-xl cursor-pointer transition-all duration-200 
                border-2 hover:shadow-lg
                ${selectedAnswer === index 
                  ? 'border-purple-500 bg-purple-600 shadow-md' 
                  : 'border-gray-500 hover:border-purple-400'
                }`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3
                  ${selectedAnswer === index 
                    ? 'border-white bg-white' 
                    : 'border-gray-400'
                  }`}
                >
                  {selectedAnswer === index && (
                    <div className="w-3 h-3 bg-purple-600 rounded-full" />
                  )}
                </div>
                <input
                  type="radio"
                  name="answer"
                  className="hidden"
                  checked={selectedAnswer === index}
                  onChange={() => handleAnswer(index)}
                />
                {option}
              </div>
            </label>
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className={`w-full mt-6 py-4 rounded-xl font-semibold text-lg
            transition-all duration-200 transform hover:scale-105
            ${selectedAnswer === null
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-700 to-blue-700 hover:shadow-lg'
            }`}
        >
          {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
        </button>
      </div>
    </div>
  );
}
