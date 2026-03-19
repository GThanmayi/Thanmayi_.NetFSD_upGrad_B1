const STORAGE_KEYS = {
  completedCourses: "completedCourses",
  quizResult: "quizResult"
};

function getCompletedCourses() {
  const saved = localStorage.getItem(STORAGE_KEYS.completedCourses);
  const parsed = saved ? JSON.parse(saved) : [];

  const uniqueValidCourses = [...new Set(parsed)].filter((id) =>
    coursesData.some((course) => course.id === id)
  );

  if (uniqueValidCourses.length !== parsed.length) {
    localStorage.setItem(
      STORAGE_KEYS.completedCourses,
      JSON.stringify(uniqueValidCourses)
    );
  }

  return uniqueValidCourses;
}

function saveCompletedCourses(completedCourses) {
  const uniqueValidCourses = [...new Set(completedCourses)].filter((id) =>
    coursesData.some((course) => course.id === id)
  );

  localStorage.setItem(
    STORAGE_KEYS.completedCourses,
    JSON.stringify(uniqueValidCourses)
  );
}

function addCompletedCourse(courseId) {
  const completedCourses = getCompletedCourses();

  if (!completedCourses.includes(courseId)) {
    completedCourses.push(courseId);
    saveCompletedCourses(completedCourses);
  }
}

function getQuizResult() {
  const saved = localStorage.getItem(STORAGE_KEYS.quizResult);
  return saved ? JSON.parse(saved) : null;
}

function saveQuizResult(result) {
  localStorage.setItem(STORAGE_KEYS.quizResult, JSON.stringify(result));
}