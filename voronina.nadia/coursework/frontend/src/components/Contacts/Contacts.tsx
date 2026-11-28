import styles from './Contacts.module.scss';

export function Contacts() {
  return (
    <section className={styles.contacts}>
      <h2 className={styles.title}>Работаем 24/7</h2>

      <address className={styles.items}>
        <a href="tel:+78006783424" className={styles.item}>
          <img src="/images/icons/mobile_black.svg" alt="" />

          <span>8 (800) 678-34-24</span>
        </a>

        <a href="mailto:gadget@hub.ru" className={styles.item}>
          <img src="/images/icons/mail.svg" alt="" />

          <span>gadget@hub.ru</span>
        </a>

        <div className={styles.item}>
          <img src="/images/icons/map.svg" alt="" />

          <span>
            Санкт-Петербург, ул.
            <br />
            Барочная, д.7, корпус 2
          </span>
        </div>
      </address>
    </section>
  );
}
