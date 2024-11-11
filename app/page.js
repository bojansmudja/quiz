'use client';

import React, { useState } from 'react';

const questions = [
  {
    question: "Which of these is NOT one of the lobes of the human brain?",
    options: ["Temporal lobe", "Parietal lobe", "Cognitive lobe", "Occipital lobe"],
    correct: 2,
    explanation: "The cognitive lobe is not a part of the brain. The main lobes are frontal, parietal, temporal, and occipital."
  },
  {
    question: "Who is considered the father of psychoanalysis?",
    options: ["Carl Jung", "Sigmund Freud", "Ivan Pavlov", "B.F. Skinner"],
    correct: 1,
    explanation: "Sigmund Freud developed psychoanalysis in the late 19th century."
  },
  {
    question: "Which psychological perspective emphasizes observable behaviors?",
    options: ["Psychodynamic", "Behaviorism", "Humanistic", "Cognitive"],
    correct: 1,
    explanation: "Behaviorism focuses on observable behaviors rather than internal mental states."
  },
  {
    question: "What is the primary function of neurotransmitters?",
    options: ["Blood circulation", "Chemical messaging", "Tissue repair", "Energy production"],
    correct: 1,
    explanation: "Neurotransmitters are chemicals that transmit signals between nerve cells."
  },
  {
    question: "Which theory is associated with classical conditioning?",
    options: ["Maslow's hierarchy", "Pavlov's dogs", "Freud's id", "Jung's archetypes"],
    correct: 1,
    explanation: "Pavlov discovered classical conditioning through his experiments with dogs."
  },
  {
    question: "What is the primary function of the hippocampus?",
    options: ["Memory formation", "Motor control", "Visual processing", "Language"],
    correct: 0,
    explanation: "The hippocampus plays a crucial role in forming and organizing memories."
  },
  {
    question: "Which disorder is characterized by extreme mood swings?",
    options: ["Anxiety", "Depression", "Bipolar disorder", "Schizophrenia"],
    correct: 2,
    explanation: "Bipolar disorder involves alternating periods of mania and depression."
  },
  {
    question: "What is the concept of 'nature vs. nurture' about?",
    options: ["Learning styles", "Genetics vs. environment", "Teaching methods", "Brain development"],
    correct: 1,
    explanation: "This debate concerns the relative influence of genes versus environmental factors."
  },
  {
    question: "Which research method provides the strongest evidence for causation?",
    options: ["Case study", "Correlational study", "Experimental study", "Observational study"],
    correct: 2,
    explanation: "Experimental studies with controlled variables can establish cause-and-effect relationships."
  },
  {
    question: "What is the primary function of the amygdala?",
    options: ["Emotion processing", "Memory storage", "Motor control", "Language processing"],
    correct: 0,
    explanation: "The amygdala plays a key role in processing emotions, especially fear."
  },
  {
    question: "Which psychologist developed the theory of cognitive development stages?",
    options: ["Freud", "Piaget", "Skinner", "Watson"],
    correct: 1,
    explanation: "Jean Piaget developed the theory of cognitive developmental stages in children."
  },
  {
    question: "What is cognitive dissonance?",
    options: ["Memory loss", "Mental conflict", "Learning disability", "Attention deficit"],
    correct: 1,
    explanation: "Cognitive dissonance occurs when holding contradictory beliefs causes mental discomfort."
  },
  {
    question: "Which part of the brain is responsible for balance and coordination?",
    options: ["Cerebellum", "Thalamus", "Hypothalamus", "Medulla"],
    correct: 0,
    explanation: "The cerebellum coordinates movement and maintains balance."
  },
  {
    question: "What is the Stanford Prison Experiment known for?",
    options: ["Learning theory", "Memory research", "Social roles", "Child development"],
    correct: 2,
    explanation: "It demonstrated how people adapt to social roles and authority positions."
  },
  {
    question: "Which neurotransmitter is associated with pleasure and reward?",
    options: ["Serotonin", "Dopamine", "GABA", "Acetylcholine"],
    correct: 1,
    explanation: "Dopamine is involved in reward, pleasure, and motivation."
  },
  {
    question: "What is the main focus of positive psychology?",
    options: ["Mental illness", "Well-being", "Childhood trauma", "Brain disorders"],
    correct: 1,
    explanation: "Positive psychology focuses on well-being, happiness, and human strengths."
  },
  {
    question: "Which defense mechanism involves returning to an earlier stage of development?",
    options: ["Projection", "Regression", "Repression", "Rationalization"],
    correct: 1,
    explanation: "Regression is returning to an earlier developmental stage when under stress."
  },
  {
    question: "What is the primary function of the prefrontal cortex?",
    options: ["Executive function", "Emotion", "Memory", "Vision"],
    correct: 0,
    explanation: "The prefrontal cortex handles executive functions like planning and decision-making."
  },
  {
    question: "Which approach emphasizes free will and self-actualization?",
    options: ["Behavioral", "Humanistic", "Psychodynamic", "Biological"],
    correct: 1,
    explanation: "Humanistic psychology emphasizes personal growth and self-actualization."
  },
  {
    question: "What is the recency effect in memory?",
    options: ["First items remembered", "Middle items remembered", "Last items remembered", "All items forgotten"],
    correct: 2,
    explanation: "The recency effect is better recall of the most recently presented items."
  }
];

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answerHistory, setAnswerHistory] = useState([]);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    // Save answer history
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
