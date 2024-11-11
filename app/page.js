'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';

const QUIZ_TIME = 20 * 60; // 20 minutes in seconds

// Sound effects manager
const SoundEffects = {
  click: new Audio('/sounds/click.mp3'),
  correct: new Audio('/sounds/correct.mp3'),
  incorrect: new Audio('/sounds/incorrect.mp3'),
  finish: new Audio('/sounds/finish.mp3'),
  timerWarning: new Audio('/sounds/timer-warning.mp3'),
};

// Adjust volumes
SoundEffects.click.volume = 0.3;
SoundEffects.correct.volume = 0.4;
SoundEffects.incorrect.volume = 0.4;
SoundEffects.finish.volume = 0.5;
SoundEffects.timerWarning.volume = 0.3;

export default function Quiz() {
  // ... [Previous state declarations remain the same]

  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [hasPlayedWarning, setHasPlayedWarning] = useState(false);

  const playSound = useCallback((soundName) => {
    if (isSoundEnabled) {
      const sound = SoundEffects[soundName];
      sound.currentTime = 0; // Reset sound to start
      sound.play().catch(err => console.log('Sound play error:', err));
    }
  }, [isSoundEnabled]);

  // Modified useEffect for timer with sound
  useEffect(() => {
    if (!loading && timeLeft === 0) {
      playSound('finish');
      handleSubmit();
      return;
    }

    if (timeLeft === 300 && !hasPlayedWarning) { // 5 minutes warning
      playSound('timerWarning');
      setHasPlayedWarning(true);
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, hasPlayedWarning, playSound]);

  // Modified handle answer with sound
  const handleAnswer = (index) => {
    playSound('click');
    setSelectedAnswer(index);
  };

  // Modified save answer with sound
  const saveAnswer = () => {
    if (selectedAnswer !== null) {
      const isCorrect = selectedAnswer === questions[currentQuestion].correct;
      playSound(isCorrect ? 'correct' : 'incorrect');

      setAnswerHistory([...answerHistory, {
        question: questions[currentQuestion].question,
        selectedAnswer: questions[currentQuestion].options[selectedAnswer],
        correctAnswer: questions[currentQuestion].options[questions[currentQuestion].correct],
        isCorrect: isCorrect,
        explanation: questions[currentQuestion].explanation
      }]);

      if (isCorrect) {
        setScore(score + 1);
      }
    }
  };

  // Add sound toggle button in the header
  const toggleSound = () => {
    playSound('click');
    setIsSoundEnabled(!isSoundEnabled);
  };

  // Modified return statement with sound toggle
  return (
    
      
        
          {/* Header Section */}
          
            
              
                {isSoundEnabled ? (
                  
                    
                  
                ) : (
                  
                    
                  
                )}
              
            

            {/* ... [Rest of the header remains the same] */}
          

          {/* ... [Rest of the component remains the same] */}
        
      
    
  );
}
