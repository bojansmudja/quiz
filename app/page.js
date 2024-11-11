export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="flex min-h-screen flex-col items-center p-4">
        <Quiz />
      </div>
    </main>
  )
}

const Quiz = () => {
  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-4">Psychology Admission Quiz</h1>
      <QuizContent />
    </div>
  )
}

'use client'
const QuizContent = () => {
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
  ]

  const [currentQuestion, setCurrentQuestion] = React.useState(0)
  const [selectedAnswer, setSelectedAnswer] = React.useState(null)
  const [score, setScore] = React.useState(0)
  const [showScore, setShowScore] = React.useState(false)

  const handleAnswer = (index) => {
    setSelectedAnswer(index)
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    setSelectedAnswer(null)
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowScore(true)
    }
  }

  if (showScore) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-lg">Your score: {score} out of {questions.length}</p>
        <p className="text-lg">Percentage: {(score / questions.length * 100).toFixed(1)}%</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-gray-500">Question {currentQuestion + 1} of {questions.length}</p>
        <h2 className="text-lg font-medium mt-2">{questions[currentQuestion].question}</h2>
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
  )
}
