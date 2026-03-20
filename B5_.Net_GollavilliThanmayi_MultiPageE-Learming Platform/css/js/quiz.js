const selectedAnswers = {};

function simulateQuizLoad() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(quizQuestions);
    }, 1200);
  });
}

async function loadQuiz() {
  const loader = document.getElementById("quizLoader");
  const quizForm = document.getElementById("quizForm");
  const quizContainer = document.getElementById("quizContainer");

  if (!loader || !quizForm || !quizContainer) return;

  loader.classList.remove("d-none");
  quizForm.classList.add("d-none");
  quizContainer.innerHTML = "";

  try {
    const questions = await simulateQuizLoad();
    renderQuizQuestions(questions);
    loader.classList.add("d-none");
    quizForm.classList.remove("d-none");
  } catch (error) {
    loader.innerHTML = `<p class="text-danger mb-0">Failed to load quiz questions.</p>`;
  }
}

function renderQuizQuestions(questions) {
  const quizContainer = document.getElementById("quizContainer");
  if (!quizContainer) return;

  resetSelectedAnswers();

  let html = "";

  questions.forEach((q, index) => {
    html += `
      <section class="question-card mb-4">
        <h4 class="mb-3">Q${index + 1}. ${q.question}</h4>
        <div class="options-group">
          ${q.options
            .map(
              (option, optionIndex) => `
                <label class="option-item d-block mb-2" for="q${q.id}_option${optionIndex}">
                  <input
                    type="radio"
                    id="q${q.id}_option${optionIndex}"
                    name="question${q.id}"
                    value="${escapeHtml(option)}"
                    onchange="handleAnswerChange(${q.id}, this.value)"
                  />
                  <span>${option}</span>
                </label>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  });

  quizContainer.innerHTML = html;
}

function resetSelectedAnswers() {
  Object.keys(selectedAnswers).forEach((key) => delete selectedAnswers[key]);
}

function handleAnswerChange(questionId, selectedOption) {
  selectedAnswers[questionId] = selectedOption;
}

function submitQuiz() {
  if (Object.keys(selectedAnswers).length !== quizQuestions.length) {
    alert("Please answer all questions before submitting the quiz.");
    return;
  }

  let score = 0;

  quizQuestions.forEach((question) => {
    if (selectedAnswers[question.id] === question.answer) {
      score++;
    }
  });

  const total = quizQuestions.length;
  const percentageValue = Math.round(percentage(score, total));
  const grade = gradeCalculation(percentageValue);
  const passed = isPass(percentageValue);

  const result = {
    score,
    total,
    percentage: percentageValue,
    grade,
    passed
  };

  saveQuizResult(result);
  renderQuizResult(result);
}

function renderQuizResult(result) {
  const resultBox = document.getElementById("quizResult");
  if (!resultBox) return;

  let feedbackMessage = "";

  switch (result.grade) {
    case "A":
      feedbackMessage = "Excellent performance!";
      break;
    case "B":
      feedbackMessage = "Very good job!";
      break;
    case "C":
      feedbackMessage = "Good effort, keep improving.";
      break;
    default:
      feedbackMessage = "Keep practicing and try again.";
      break;
  }

  resultBox.innerHTML = `
    <h3 class="mb-3">Quiz Result</h3>
    <p><strong>Score:</strong> ${result.score}/${result.total}</p>
    <p><strong>Percentage:</strong> ${result.percentage}%</p>
    <p><strong>Grade:</strong> ${result.grade}</p>
    <p><strong>Status:</strong> ${result.passed ? "Pass" : "Fail"}</p>
    <p class="mb-0"><strong>Feedback:</strong> ${feedbackMessage}</p>
  `;

  resultBox.classList.remove("d-none");
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

document.addEventListener("DOMContentLoaded", () => {
  loadQuiz();

  const submitButton = document.getElementById("submitQuizBtn");
  if (submitButton) {
    submitButton.addEventListener("click", submitQuiz);
  }
});