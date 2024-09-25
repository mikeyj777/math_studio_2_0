import MathProblems from './MathProblems';

class MathEngine {
  constructor(curriculum) {
    this.curriculum = curriculum;
    this.DEFAULT_MAX_NUMBER = 100;
    this.problems = MathProblems;
  }

  getRandomNumber(max = this.DEFAULT_MAX_NUMBER) {
    return Math.floor(Math.random() * max) + 1;
  }

  addition(max_number = this.curriculum.addition) {
    if (max_number === -1) return null;
    const a = this.getRandomNumber(max_number);
    const b = this.getRandomNumber(max_number);
    return { question: `${a} + ${b} = ?`, answer: a + b };
  }

  subtraction(max_number = this.curriculum.subtraction) {
    if (max_number === -1) return null;
    const a = this.getRandomNumber(max_number);
    const b = this.getRandomNumber(a);
    return { question: `${a} - ${b} = ?`, answer: a - b };
  }

  multiplication(max_number = this.curriculum.multiplication) {
    if (max_number === -1) return null;
    const a = this.getRandomNumber(max_number);
    const b = this.getRandomNumber(max_number);
    return { question: `${a} × ${b} = ?`, answer: a * b };
  }

  division(max_number = this.curriculum.division) {
    if (max_number === -1) return null;
    const b = this.getRandomNumber(Math.min(10, max_number));
    const answer = this.getRandomNumber(Math.floor(max_number / b));
    const a = b * answer;
    return { question: `${a} ÷ ${b} = ?`, answer: answer };
  }

  geometry() {
    if (this.curriculum.geometry === -1) return null;
    return this.problems.geometry[Math.floor(Math.random() * this.problems.geometry.length)];
  }

  algebra() {
    if (this.curriculum.algebra === -1) return null;
    return this.problems.algebra[Math.floor(Math.random() * this.problems.algebra.length)];
  }

  algebra2() {
    if (this.curriculum.algebra2 === -1) return null;
    return this.problems.algebra2[Math.floor(Math.random() * this.problems.algebra2.length)];
  }

  precalculus() {
    if (this.curriculum.precalculus === -1) return null;
    return this.problems.precalculus[Math.floor(Math.random() * this.problems.precalculus.length)];
  }

  calculus() {
    if (this.curriculum.calculus === -1) return null;
    return this.problems.calculus[Math.floor(Math.random() * this.problems.calculus.length)];
  }

  generateProblem() {
    const subjects = ['addition', 'subtraction', 'multiplication', 'division', 'geometry', 'algebra', 'algebra2', 'precalculus', 'calculus'];
    const availableSubjects = subjects.filter(subject => this.curriculum[subject] !== -1);
    
    if (availableSubjects.length === 0) {
      return { question: "No subjects available for this grade level.", answer: null };
    }

    const randomSubject = availableSubjects[Math.floor(Math.random() * availableSubjects.length)];
    return this[randomSubject]();
  }
}

export default MathEngine;