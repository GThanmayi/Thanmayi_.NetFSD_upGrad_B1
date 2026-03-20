function percentage(score, total) {
  return (score / total) * 100;
}

function gradeCalculation(percent) {
  if (percent >= 80) return "A";
  else if (percent >= 60) return "B";
  else if (percent >= 40) return "C";
  else return "F";
}

function isPass(percent) {
  return percent >= 40;
}

module.exports = { percentage, gradeCalculation, isPass };