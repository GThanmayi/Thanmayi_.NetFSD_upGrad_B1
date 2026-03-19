function renderDashboardCourses() {
  const tableBody = document.getElementById("dashboardCourseTableBody");
  if (!tableBody) return;

  const completedCourses = getCompletedCourses();

  tableBody.innerHTML = coursesData
    .map((course, index) => {
      const isCompleted = completedCourses.includes(course.id);

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${course.title}</td>
          <td>${course.category}</td>
          <td>${course.level}</td>
          <td>${course.duration}</td>
          <td>
            <span class="badge-status ${isCompleted ? "badge-complete" : "badge-pending"}">
              ${isCompleted ? "Completed" : "In Progress"}
            </span>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderDashboardProgress() {
  const progressBar = document.getElementById("overallProgress");
  const progressText = document.getElementById("overallProgressText");

  if (!progressBar || !progressText) return;

  const completedCourses = getCompletedCourses();

  const uniqueCompletedCourses = [...new Set(completedCourses)].filter((id) =>
    coursesData.some((course) => course.id === id)
  );

  const totalCourses = coursesData.length;
  const completedCount = uniqueCompletedCourses.length;

  let percent = totalCourses > 0 ? Math.round((completedCount / totalCourses) * 100) : 0;

  if (percent > 100) percent = 100;
  if (percent < 0) percent = 0;

  progressBar.max = 100;
  progressBar.value = percent;
  progressText.textContent = percent + "%";
}

function renderDashboardQuizStats() {
  const quizStats = document.getElementById("dashboardQuizStats");
  if (!quizStats) return;

  const quizResult = getQuizResult();

  if (!quizResult) {
    quizStats.innerHTML = `<p class="empty-state">No quiz attempts yet.</p>`;
    return;
  }

  quizStats.innerHTML = `
    <div class="result-card">
      <p><strong>Score:</strong> ${quizResult.score}/${quizResult.total}</p>
      <p><strong>Percentage:</strong> ${quizResult.percentage}%</p>
      <p><strong>Grade:</strong> ${quizResult.grade}</p>
      <p class="mb-0"><strong>Status:</strong> ${quizResult.passed ? "Pass" : "Fail"}</p>
    </div>
  `;
}

function renderLearningPath() {
  const learningPathList = document.getElementById("learningPathList");
  if (!learningPathList) return;

  const completedCourses = getCompletedCourses();

  learningPathList.innerHTML = coursesData
    .map((course) => {
      const isCompleted = completedCourses.includes(course.id);

      return `
        <div class="path-item">
          <h4>${course.title}</h4>
          <p class="mb-2">${course.category} • ${course.level} • ${course.duration}</p>
          <p class="mb-0">
            Status:
            <strong>${isCompleted ? "Completed" : "Pending"}</strong>
          </p>
        </div>
      `;
    })
    .join("");
}

function renderCoursesPage() {
  const courseList = document.getElementById("courseCardGrid");
  if (!courseList) return;

  const completedCourses = getCompletedCourses();

  courseList.innerHTML = coursesData
    .map((course) => {
      const isCompleted = completedCourses.includes(course.id);

      return `
        <article class="course-card">
          <h3>${course.title}</h3>
          <p class="course-meta">
            ${course.category} • ${course.level} • ${course.duration}
          </p>

          <div>
            <h5>Lessons</h5>
            <ol class="lesson-list">
              ${course.lessons.map((lesson) => `<li>${lesson}</li>`).join("")}
            </ol>
          </div>

          <div class="course-actions">
            <span class="badge-status ${isCompleted ? "badge-complete" : "badge-pending"}">
              ${isCompleted ? "Completed" : "Not Completed"}
            </span>
            <button
              type="button"
              class="btn btn-primary"
              onclick="markCourseComplete(${course.id})"
              ${isCompleted ? "disabled" : ""}
            >
              ${isCompleted ? "Completed" : "Mark Complete"}
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function markCourseComplete(courseId) {
  addCompletedCourse(courseId);
  renderCoursesPage();
  alert("Course marked as completed successfully.");
}

function loadQuiz() {
  const loader = document.getElementById("quizLoader");
  const quizContainer = document.getElementById("quizContainer");

  if (!loader || !quizContainer) return;

  loader.style.display = "grid";
  quizContainer.innerHTML = "";

  simulateQuizLoad()
    .then((questions) => {
      loader.style.display = "none";
      renderQuizQuestions(questions);
    })
    .catch(() => {
      loader.style.display = "none";
      quizContainer.innerHTML = `<p class="text-danger">Failed to load quiz.</p>`;
    });
}

function simulateQuizLoad() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(quizQuestions);
    }, 1200);
  });
}

const selectedAnswers = {};

function renderQuizQuestions(questions) {
  const quizContainer = document.getElementById("quizContainer");
  if (!quizContainer) return;

  selectedAnswersReset();

  let html = "";

  questions.forEach((q, index) => {
    html += `
      <div class="question-card">
        <h4>Q${index + 1}. ${q.question}</h4>
        <div class="options-group">
          ${q.options
            .map(
              (option, optionIndex) => `
              <label class="option-item" for="q${q.id}_option${optionIndex}">
                <input
                  type="radio"
                  id="q${q.id}_option${optionIndex}"
                  name="question${q.id}"
                  value="${escapeHtml(option)}"
                  onchange="handleAnswerChange(${q.id}, this.value)"
                >
                <span>${option}</span>
              </label>
            `
            )
            .join("")}
        </div>
      </div>
    `;
  });

  html += `
    <div class="mt-3">
      <button type="button" class="btn btn-success" onclick="submitQuiz()">Submit Quiz</button>
    </div>
    <div id="quizResultSection" class="mt-4"></div>
  `;

  quizContainer.innerHTML = html;
}

function selectedAnswersReset() {
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
    score: score,
    total: total,
    percentage: percentageValue,
    grade: grade,
    passed: passed
  };

  saveQuizResult(result);

  const resultSection = document.getElementById("quizResultSection");
  if (!resultSection) return;

  let feedbackMessage = "";

  switch (grade) {
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

  resultSection.innerHTML = `
    <div class="result-card">
      <h3>Quiz Result</h3>
      <p><strong>Score:</strong> ${score}/${total}</p>
      <p><strong>Percentage:</strong> ${percentageValue}%</p>
      <p><strong>Grade:</strong> ${grade}</p>
      <p><strong>Status:</strong> ${passed ? "Pass" : "Fail"}</p>
      <p class="mb-0"><strong>Feedback:</strong> ${feedbackMessage}</p>
    </div>
  `;
}

function renderProfilePage() {
  const completedCoursesList = document.getElementById("completedCoursesList");
  const profileQuizSummary = document.getElementById("profileQuizSummary");

  if (completedCoursesList) {
    const completedCourses = getCompletedCourses();

    if (completedCourses.length === 0) {
      completedCoursesList.innerHTML = `
        <li class="list-group-item empty-state">No completed courses yet.</li>
      `;
    } else {
      const completedCourseNames = coursesData.filter((course) =>
        completedCourses.includes(course.id)
      );

      completedCoursesList.innerHTML = completedCourseNames
        .map((course) => `<li class="list-group-item">${course.title}</li>`)
        .join("");
    }
  }

  if (profileQuizSummary) {
    const quizResult = getQuizResult();

    if (!quizResult) {
      profileQuizSummary.innerHTML = `<p class="empty-state">No quiz attempt found.</p>`;
    } else {
      profileQuizSummary.innerHTML = `
        <div class="result-card">
          <p><strong>Score:</strong> ${quizResult.score}/${quizResult.total}</p>
          <p><strong>Percentage:</strong> ${quizResult.percentage}%</p>
          <p><strong>Grade:</strong> ${quizResult.grade}</p>
          <p class="mb-0"><strong>Status:</strong> ${quizResult.passed ? "Pass" : "Fail"}</p>
        </div>
      `;
    }
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

document.addEventListener("DOMContentLoaded", function () {
  const currentPage = document.body.dataset.page;

  if (currentPage === "dashboard") {
    renderDashboardProgress();
    renderDashboardCourses();
    renderLearningPath();
    renderDashboardQuizStats();
  }

  if (currentPage === "courses") {
    renderCoursesPage();
  }

  if (currentPage === "quiz") {
    loadQuiz();
  }

  if (currentPage === "profile") {
    renderProfilePage();
  }
});