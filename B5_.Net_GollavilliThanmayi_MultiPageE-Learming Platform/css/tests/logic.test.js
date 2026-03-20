const { percentage, gradeCalculation, isPass } = require("../js/logic");

test("percentage calculation should return 80", () => {
  expect(percentage(4, 5)).toBe(80);
});

test("grade calculation should return A for 85", () => {
  expect(gradeCalculation(85)).toBe("A");
});

test("pass/fail logic should return false for 30", () => {
  expect(isPass(30)).toBe(false);
});