import {Link} from 'react-router-dom';

import styles from './EmptyCart.module.scss';

export function EmptyCart() {
  return (
    <section className={styles.emptyCart}>
      <img src="/images/empty-cart.png" alt="" className={styles.image} />

      <h1 className={styles.title}>Пока пусто</h1>

      <p className={styles.description}>
        Ознакомьтесь с новинками и хитами на главной или найдите нужное в
        каталоге
      </p>

      <div className={styles.actions}>
        <Link to="/catalog" className={styles.catalogLink}>
          Перейти в каталог
        </Link>

        <Link to="/" className={styles.homeLink}>
          Главная страница
        </Link>
      </div>
    </section>
  );
}
