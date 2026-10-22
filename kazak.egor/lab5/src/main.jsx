import * as React from 'react';
import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {books} from './books.js';
import './styles.css';

function TreeLevel({data, level}) {
  if (Array.isArray(data)) {
    return (
      <ul data-testid="tree-level" data-level={level}>
        {data.map((title) => (
          <li key={title} className="book">
            {title}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul data-testid="tree-level" data-level={level}>
      {Object.entries(data).map(([name, children]) => (
        <TreeBranch key={name} name={name} data={children} level={level} />
      ))}
    </ul>
  );
}

function TreeBranch({name, data, level}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <li data-testid="tree-branch">
      <button
        type="button"
        data-testid="tree-toggle"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >
        <span className="arrow" aria-hidden="true">
          {expanded ? '▼' : '▶'}
        </span>
        {name}
      </button>
      <div hidden={!expanded}>
        <TreeLevel data={data} level={level + 1} />
      </div>
    </li>
  );
}

function App() {
  return (
    <>
      <h1>Каталог книг</h1>
      <p>
        Нажмите на стрелку или название ветки, чтобы раскрыть или свернуть её.
      </p>
      <section
        className="book-tree"
        data-testid="tree"
        aria-label="Книги по авторам, издательствам и жанрам"
      >
        <TreeLevel data={books} level={1} />
      </section>
    </>
  );
}

const rootElement = document.querySelector('[data-testid="app"]');
createRoot(rootElement).render(React.createElement(App));
