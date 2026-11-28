import styles from './Advantages.module.scss';

const advantages = [
  {
    id: 'delivery',
    title: 'Утром заказали, вечером получили',
    icon: <img src="/images/icons/rocket.svg" alt="" />,
  },
  {
    id: 'refund',
    title: 'С товаром что-то не так? Вернем деньги',
    icon: <img src="/images/icons/moneyback.svg" alt="" />,
  },
  {
    id: 'original',
    title: 'Только оригинальные товары',
    icon: <img src="/images/icons/certificate.svg" alt="" />,
  },
];

export function Advantages() {
  return (
    <section className={styles.advantages}>
      <h2 className={styles.title}>Преимущества</h2>

      <div className={styles.cards}>
        {advantages.map((advantage) => (
          <article key={advantage.id} className={styles.card}>
            <div
              className={`${styles.icon} ${styles[advantage.id]}`}
              aria-hidden="true"
            >
              {advantage.icon}
            </div>

            <h3 className={styles.cardTitle}>{advantage.title}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
