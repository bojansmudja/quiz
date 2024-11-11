'use client';

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

export default function Page() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answerHistory, setAnswerHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes

  // Load questions
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/questions.csv');
        const text = await response.text();
        
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            const formattedQuestions = results.data
              .filter(row => row.question)
              .map(row => ({
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

  // Timer
  useEffect(() => {
    if (!loading && timeLeft === 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    // Play click sound
    if (typeof window !== 'undefined') {
      const audio = new Audio('/sounds/click.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  };

  const handleNext = () => {
    // Play correct/incorrect sound
    if (typeof window !== 'undefined') {
      const isCorrect = selectedAnswer === questions[currentQuestion].correct;
      const audio = new Audio(isCorrect ? '/sounds/correct.mp3' : '/sounds/incorrect.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    }

    // Save answer
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
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setShowScore(true);
    // Play finish sound
    if (typeof window !== 'undefined') {
      const audio = new Audio('/sounds/finish.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
  };

  if (loading) {
    return (
      
        
          Loading Quiz Questions...
        
      
    );
  }

  if (showScore) {
    return (
      
        
          
            Quiz Results
          
          
          
            
              Final Score: {score} out of {questions.length}
            
            
              {(score / questions.length * 100).toFixed(1)}%
            
            
              Time taken: {20 - Math.ceil(timeLeft / 60)} minutes
            
          

          
            {answerHistory.map((answer, index) => (
              
                
                  
                    Question {index + 1}: {answer.question}
                  
                  
                    {answer.isCorrect ? 'Correct' : 'Incorrect'}
                  
                
                
                  Your answer: {answer.selectedAnswer}
                
                {!answer.isCorrect && (
                  
                    Correct answer: {answer.correctAnswer}
                  
                )}
                
                  {answer.explanation}
                
              
            ))}
          
        
      
    );
  }

  return (
    
      
        
          
            
              Psychology Admission Quiz
            
            
            
              
                Question {currentQuestion + 1}/{questions.length}
              
              
                Time: {formatTime(timeLeft)}
              
            
            
            
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            
          

          
            
              {questions[currentQuestion].question}
            
            
            
              {questions[currentQuestion].options.map((option, index) => (
                <label
                  key={index}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 
                    border-2 hover:shadow-md
                    ${selectedAnswer === index 
                      ? 'border-purple-500 bg-purple-50 shadow-md' 
                      : 'border-gray-200 hover:border-purple-200'
                    }`}
                >
                  
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${selectedAnswer === index 
                        ? 'border-purple-500 bg-purple-500' 
                        : 'border-gray-300'
                      }`}
                    >
                      {selectedAnswer === index && (
                        
                      )}
                    
                    <input
                      type="radio"
                      name="answer"
                      className="hidden"
                      checked={selectedAnswer === index}
                      onChange={() => handleAnswer(index)}
                    />
                    {option}
                  
                
              ))}
            
          

          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className={`w-full py-4 rounded-xl text-white font-semibold text-lg
              transition-all duration-200 transform hover:scale-[1.02]
              ${selectedAnswer === null
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg'
              }`}
          >
            {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
          
        
      
    
  );
}
