export class Order {
  constructor(orderId, items = [], status = 'new') {
    this.orderId = orderId;
    this.items = [...items];
    this.status = status;
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItem(name) {
    this.items = this.items.filter((item) => item.name !== name);
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
}

export function groupOrdersByStatus(orders) {
  const groups = Object.create(null);
  for (const order of orders) {
    (groups[order.status] ??= []).push(order);
  }
  return groups;
}

export function getUniqueItems(orders) {
  return [
    ...new Set(orders.flatMap((order) => order.items.map((item) => item.name))),
  ];
}

export function groupOrdersByTotal(orders) {
  const groups = {'До 1000': [], 'Свыше 1000 до 5000': [], 'Свыше 5000': []};
  for (const order of orders) {
    const total = order.getTotal();
    if (total <= 1000) {
      groups['До 1000'].push(order);
    } else if (total <= 5000) {
      groups['Свыше 1000 до 5000'].push(order);
    } else {
      groups['Свыше 5000'].push(order);
    }
  }
  return groups;
}

export function findOrdersByItem(orders, name) {
  return orders.filter((order) =>
    order.items.some((item) => item.name === name),
  );
}

export function findOrdersByStatus(orders, status) {
  return orders.filter((order) => order.status === status);
}
