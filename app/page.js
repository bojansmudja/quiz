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
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes

  useEffect(() => {
    fetch('/questions.csv')
      .then(response => response.text())
      .then(text => {
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            const validQuestions = results.data
              .filter(row => row.question)
              .map(row => ({
                question: row.question,
                options: [row.option1, row.option2, row.option3, row.option4],
                correct: parseInt(row.correct),
                explanation: row.explanation
              }));
            setQuestions(validQuestions);
            setLoading(false);
          }
        });
      })
      .catch(error => {
        console.error('Error loading questions:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
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

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    if (typeof window !== 'undefined') {
      const audio = new Audio('/sounds/click.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  };

  const handleNext = () => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    
    if (typeof window !== 'undefined') {
      const audio = new Audio(isCorrect ? '/sounds/correct.mp3' : '/sounds/incorrect.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    }

    setAnswers([...answers, {
      question: questions[currentQuestion].question,
      selected: questions[currentQuestion].options[selectedAnswer],
      correct: questions[currentQuestion].options[questions[currentQuestion].correct],
      isCorrect: isCorrect,
      explanation: questions[currentQuestion].explanation
    }]);

    if (isCorrect) setScore(score + 1);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    setShowScore(true);
    if (typeof window !== 'undefined') {
      const audio = new Audio('/sounds/finish.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
  };

  const formatTime = (seconds) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      
        
          Loading Quiz Questions...
        
      
    );
  }

  if (showScore) {
    return (
      
        
          
            Quiz Results
          
          
          
            
              Score: {score} out of {questions.length}
            
            
              {(score / questions.length * 100).toFixed(1)}%
            
          

          
            {answers.map((answer, index) => (
              
                
                  
                    Question {index + 1}: {answer.question}
                  
                  
                    {answer.isCorrect ? 'Correct' : 'Incorrect'}
                  
                
                
                  Your answer: {answer.selected}
                
                {!answer.isCorrect && (
                  
                    Correct answer: {answer.correct}
                  
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
