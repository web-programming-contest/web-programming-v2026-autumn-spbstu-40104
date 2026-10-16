import {Student, getUniqueSubjects} from './model.js';

const form = document.querySelector('[data-testid="entity-form"]');
const list = document.querySelector('[data-testid="entity-list"]');
const subjectOptions = document.getElementById('subjects');

let students = (
  JSON.parse(localStorage.getItem('students')) || [
    {id: 1, name: 'Анна', grades: {Математика: 5, Физика: 4}},
    {id: 2, name: 'Иван', grades: {Математика: 3, История: 2}},
    {id: 3, name: 'Олег', grades: {Физика: 5, История: 4}},
  ]
).map((data) => new Student(data.id, data.name, data.grades));

function change(action) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(action()), 300),
  ).then(() => {
    localStorage.setItem('students', JSON.stringify(students));
    render();
  });
}

function findStudent(element) {
  const card = element.closest('[data-testid="entity-card"]');
  return students.find((student) => String(student.id) === card?.dataset.id);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const id = Number(form.elements.id.value);
  const name = form.elements.name.value;
  change(() => {
    if (students.some((student) => student.id === id)) {
      alert(`ID ${id} уже занят`);
      return;
    }
    students.push(new Student(id, name));
  });
  form.reset();
});

list.addEventListener('submit', (event) => {
  event.preventDefault();
  const student = findStudent(event.target);
  const subject = event.target.elements.subject.value;
  const grade = Number(event.target.elements.grade.value);
  change(() => student.addGrade(subject, grade));
});

list.addEventListener('click', ({target}) => {
  const student = findStudent(target);
  if (target.dataset.testid === 'delete-entity') {
    change(() => {
      students = students.filter((item) => item !== student);
    });
  }
  if (target.dataset.action === 'remove-grade') {
    const subject = target.form.elements.subject.value;
    change(() => student.removeGrade(subject));
  }
});

function render() {
  let html = '';
  for (const student of students) {
    let grades = '';
    for (const subject in student.grades) {
      grades += `<li>${subject}: ${student.grades[subject]}</li>`;
    }
    html += `
      <article class="card" data-testid="entity-card" data-id="${student.id}">
        <h2>${student.summary}</h2>
        <ul>${grades}</ul>
        <form>
          <input name="subject" list="subjects" placeholder="Предмет" aria-label="Предмет" required>
          <select name="grade" aria-label="Оценка">
            <option>5</option><option>4</option><option>3</option><option>2</option>
          </select>
          <button type="submit">Добавить оценку</button>
          <button type="button" data-action="remove-grade">Удалить оценку</button>
        </form>
        <button type="button" data-testid="delete-entity">Удалить студента</button>
      </article>`;
  }
  list.innerHTML = html;
  subjectOptions.innerHTML = getUniqueSubjects(students)
    .map((subject) => `<option>${subject}</option>`)
    .join('');
}

render();
