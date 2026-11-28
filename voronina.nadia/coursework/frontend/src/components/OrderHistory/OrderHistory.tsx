import {useEffect, useState} from 'react';

import {getOrders} from '../../api/orders';
import {ApiError} from '../../api/client';

import type {Order} from '../../types/order';

import {getProductWord} from '../../utils/getProductWord';
import {Button} from '../Button/Button';

import styles from './OrderHistory.module.scss';

type HistoryState =
  | {status: 'loading'}
  | {status: 'success'; orders: Order[]}
  | {status: 'error'; message: string};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: '2-digit',
    year: 'numeric',
  });
}

export function OrderHistory() {
  const [state, setState] = useState<HistoryState>({
    status: 'loading',
  });

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      try {
        const orders = await getOrders();

        if (!cancelled) {
          setState({
            status: 'success',
            orders,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: 'error',
            message:
              error instanceof ApiError
                ? error.message
                : 'Не удалось загрузить историю заказов.',
          });
        }
      }
    }

    void loadOrders();

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  function retry() {
    setState({status: 'loading'});
    setAttempt((previous) => previous + 1);
  }

  if (state.status === 'loading') {
    return (
      <section className={styles.message} role="status">
        Загрузка истории заказов...
      </section>
    );
  }

  if (state.status === 'error') {
    return (
      <section className={styles.message}>
        <p className={styles.error} role="alert">
          {state.message}
        </p>

        <Button onClick={retry}>Повторить попытку</Button>
      </section>
    );
  }

  if (state.orders.length === 0) {
    return (
      <section className={styles.message}>
        <h2>Пока нет заказов</h2>

        <p>Здесь будут отображаться ваши оформленные заказы.</p>
      </section>
    );
  }

  return (
    <section className={styles.history} aria-label="История заказов">
      <ul className={styles.list}>
        {state.orders.map((order) => (
          <li key={order.id} className={styles.order}>
            <span className={styles.orderNumber}>
              № {order.id} от {formatDate(order.created_at)}
            </span>

            <span className={styles.quantity}>
              {order.total_quantity} {getProductWord(order.total_quantity)}
            </span>

            <span className={styles.price}>
              {order.total_price.toLocaleString('ru-RU')} ₽
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
