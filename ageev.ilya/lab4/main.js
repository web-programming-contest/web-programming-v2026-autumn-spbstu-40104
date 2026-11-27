import {
  Order,
  groupOrdersByStatus,
  getUniqueItems,
  groupOrdersByTotal,
  findOrdersByItem,
  findOrdersByStatus,
} from './model.js';

const storageKey = 'lab4-orders';
const statuses = {
  new: 'Новый',
  processing: 'В обработке',
  completed: 'Выполнен',
  cancelled: 'Отменён',
};
const form = document.querySelector('[data-testid="entity-form"]');
const list = document.querySelector('[data-testid="entity-list"]');
const notice = document.querySelector('.notice');
const operation = document.querySelector('.operation');
const query = document.querySelector('.query');
const statusQuery = document.querySelector('.status-query');
const result = document.querySelector('.result');
let busy = false;

function loadOrders() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      return JSON.parse(saved).map(
        (order) => new Order(order.orderId, order.items, order.status),
      );
    }
  } catch (error) {
    console.warn('Не удалось восстановить заказы', error);
  }
  return [
    new Order(1, [{name: 'Мышь', price: 800}], 'new'),
    new Order(2, [{name: 'Клавиатура', price: 2500}], 'processing'),
  ];
}

let orders = loadOrders();

function saveOrders() {
  localStorage.setItem(storageKey, JSON.stringify(orders));
}

function delay(action) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(action());
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
}

async function changeAsync(action, message) {
  if (busy) {
    return;
  }
  busy = true;
  notice.textContent = 'Выполняется операция…';
  form.querySelector('button').disabled = true;
  list.querySelectorAll('button, select').forEach((control) => {
    control.disabled = true;
  });
  try {
    await delay(action);
    saveOrders();
    notice.textContent = message;
  } catch (error) {
    notice.textContent = error.message;
  } finally {
    busy = false;
    form.querySelector('button').disabled = false;
    render();
  }
}

function element(tag, text = '', className = '') {
  const node = document.createElement(tag);
  node.textContent = text;
  node.className = className;
  return node;
}

function button(text, handler, className = '') {
  const control = element('button', text, className);
  control.type = 'button';
  control.addEventListener('click', handler);
  return control;
}

function field(text, control) {
  const label = element('label', text);
  label.append(control);
  return label;
}

function readOnly(value) {
  const input = element('input');
  input.value = value;
  input.disabled = true;
  return input;
}

function statusSelect(order) {
  const select = element('select');
  for (const [value, text] of Object.entries(statuses)) {
    const option = element('option', text);
    option.value = value;
    select.append(option);
  }
  select.value = order.status;
  select.addEventListener('change', () => {
    order.status = select.value;
    try {
      saveOrders();
      notice.textContent = 'Статус изменён.';
    } catch (error) {
      notice.textContent = error.message;
    }
    render();
  });
  return select;
}

function itemForm(order) {
  const itemEditor = element('form', '', 'fields');
  const name = element('input');
  name.name = 'name';
  name.required = true;
  const price = element('input');
  price.name = 'price';
  price.type = 'number';
  price.min = '0';
  price.step = '0.01';
  price.required = true;
  const submit = element('button', 'Добавить товар');
  submit.type = 'submit';
  itemEditor.append(field('Название', name), field('Цена, ₽', price), submit);
  itemEditor.addEventListener('submit', (event) => {
    event.preventDefault();
    const item = {name: name.value.trim(), price: Number(price.value)};
    if (!item.name || !Number.isFinite(item.price) || item.price < 0) {
      notice.textContent = 'Укажи название и корректную цену.';
      return;
    }
    changeAsync(() => order.addItem(item), 'Товар добавлен.');
  });
  return itemEditor;
}

function orderCard(order) {
  const card = element('article', '', 'order-card');
  card.dataset.testid = 'entity-card';
  const top = element('div', '', 'order-top');
  const remove = button(
    'Удалить заказ',
    () =>
      changeAsync(() => {
        orders = orders.filter((current) => current.orderId !== order.orderId);
      }, 'Заказ удалён.'),
    'danger',
  );
  remove.dataset.testid = 'delete-entity';
  top.append(element('h3', `Заказ № ${order.orderId}`), remove);
  const fields = element('div', '', 'fields');
  fields.append(
    field('ID', readOnly(order.orderId)),
    field('Текущий статус', readOnly(statuses[order.status] ?? order.status)),
    field('Изменить статус', statusSelect(order)),
  );
  const items = element('ul', '', 'items');
  for (const item of order.items) {
    const row = element('li', '', 'item-row');
    row.append(
      element('span', `${item.name} — ${item.price} ₽`),
      button(
        'Удалить товар',
        () => changeAsync(() => order.removeItem(item.name), 'Товар удалён.'),
        'danger',
      ),
    );
    items.append(row);
  }
  if (order.items.length === 0) {
    items.append(element('li', 'Товаров пока нет.'));
  }
  card.append(
    top,
    fields,
    items,
    element('p', `Общая сумма: ${order.getTotal().toFixed(2)} ₽`, 'total'),
    itemForm(order),
  );
  return card;
}

function renderAnalysis() {
  document.querySelector('.query-field').hidden =
    operation.value !== 'find-item';
  document.querySelector('.status-field').hidden =
    operation.value !== 'find-status';
  const operations = {
    status: () => groupOrdersByStatus(orders),
    items: () => getUniqueItems(orders),
    total: () => groupOrdersByTotal(orders),
    'find-item': () => findOrdersByItem(orders, query.value.trim()),
    'find-status': () => findOrdersByStatus(orders, statusQuery.value),
  };
  result.textContent = JSON.stringify(operations[operation.value](), null, 2);
}

function render() {
  list.replaceChildren(...orders.map(orderCard));
  if (orders.length === 0) {
    list.append(element('p', 'Заказов пока нет.'));
  }
  renderAnalysis();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const id = Number(data.get('orderId'));
  const status = data.get('status');
  if (
    !Number.isSafeInteger(id) ||
    id < 1 ||
    orders.some((order) => order.orderId === id)
  ) {
    notice.textContent = 'Укажи уникальный положительный целый ID.';
    return;
  }
  changeAsync(() => {
    orders.push(new Order(id, [], status));
    form.reset();
  }, 'Заказ добавлен.');
});

operation.addEventListener('change', renderAnalysis);
query.addEventListener('input', renderAnalysis);
statusQuery.addEventListener('change', renderAnalysis);
render();
