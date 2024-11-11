'use client';

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answerHistory, setAnswerHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to load and parse CSV
    const loadQuestions = async () => {
      try {
        const response = await fetch('/questions.csv');
        const text = await response.text();
        
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            const formattedQuestions = results.data.map(row => ({
              question: row.question,
              options: [row.option1, row.option2, row.option3, row.option4],
              correct: parseInt(row.correct),
              explanation: row.explanation
            }));
            setQuestions(formattedQuestions);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error loading questions:', error);
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    setAnswerHistory([...answerHistory, {
      question: questions[currentQuestion].question,
      selectedAnswer: questions[currentQuestion].options[selectedAnswer],
      correctAnswer: questions[currentQuestion].options[questions[currentQuestion].correct],
      isCorrect: selectedAnswer === questions[currentQuestion].correct,
      explanation: questions[currentQuestion].explanation
    }]);

    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setSelectedAnswer(null);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowScore(true);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8 bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-bold text-blue-600">Loading Quiz Questions...</div>
      </main>
    );
  }

  if (showScore) {
    return (
      <main className="min-h-screen p-8 bg-gray-100">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Quiz Results</h2>
          <div className="mb-8 text-center">
            <p className="text-2xl font-bold mb-2">Final Score: {score} out of {questions.length}</p>
            <p className="text-xl">Percentage: {(score / questions.length * 100).toFixed(1)}%</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Question Review:</h3>
            {answerHistory.map((answer, index) => (
              <div key={index} className={`mb-6 p-4 rounded-lg ${answer.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="font-medium mb-2">Question {index + 1}: {answer.question}</p>
                <p className={`mb-1 ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  Your answer: {answer.selectedAnswer}
                </p>
                {!answer.isCorrect && (
                  <p className="text-green-600 mb-1">Correct answer: {answer.correctAnswer}</p>
                )}
                <p className="text-gray-600 text-sm mt-2">{answer.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-center text-blue-600">Psychology Admission Quiz</h1>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-center text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">{questions[currentQuestion].question}</h2>
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 rounded-lg cursor-pointer transition-all
                  ${selectedAnswer === index 
                    ? 'bg-blue-100 border-2 border-blue-500' 
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
              >
                <input
                  type="radio"
                  name="answer"
                  checked={selectedAnswer === index}
                  onChange={() => handleAnswer(index)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className={`w-full py-3 rounded-lg text-white font-medium transition-all
            ${selectedAnswer === null
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </button>
      </div>
    </main>
  );
}
