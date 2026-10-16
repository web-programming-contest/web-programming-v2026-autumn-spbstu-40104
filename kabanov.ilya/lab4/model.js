export class Student {
  constructor(id, name, grades = {}) {
    this.id = id;
    this.name = name;
    this.grades = grades;
  }

  addGrade(subject, grade) {
    this.grades[subject] = grade;
  }

  removeGrade(subject) {
    delete this.grades[subject];
  }

  getAverageGrade() {
    const grades = Object.values(this.grades);
    if (grades.length === 0) {
      return 0;
    }
    let sum = 0;
    for (const grade of grades) {
      sum += grade;
    }
    return sum / grades.length;
  }

  get summary() {
    return `Студент ${this.name} (id: ${this.id}) — средний балл: ${this.getAverageGrade().toFixed(2)}`;
  }
}

export function groupStudentsByAverageGrade(students) {
  const groups = new Map();
  for (const student of students) {
    const average = student.getAverageGrade();
    if (!groups.has(average)) {
      groups.set(average, []);
    }
    groups.get(average).push(student);
  }
  return groups;
}

export function getUniqueSubjects(students) {
  const subjects = [];
  for (const student of students) {
    for (const subject in student.grades) {
      if (!subjects.includes(subject)) {
        subjects.push(subject);
      }
    }
  }
  return subjects;
}

export function groupStudentsBySubject(students) {
  const groups = new Map();
  for (const subject of getUniqueSubjects(students)) {
    groups.set(
      subject,
      students.filter((student) => subject in student.grades),
    );
  }
  return groups;
}

export function getTopStudents(students) {
  let max = 0;
  for (const student of students) {
    max = Math.max(max, student.getAverageGrade());
  }
  return students.filter((student) => student.getAverageGrade() === max);
}

export function findStudentsBySubject(students, subject, minGrade = 3) {
  return students.filter((student) => student.grades[subject] >= minGrade);
}
