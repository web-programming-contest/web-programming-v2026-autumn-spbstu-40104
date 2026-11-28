import styles from './Footer.module.scss';

const socialLinks = [
  {
    name: 'ВКонтакте',
    icon: '/images/social%20icons/vk.png',
    url: 'https://vk.com/',
  },
  {
    name: 'Telegram',
    icon: '/images/social%20icons/telegram.png',
    url: 'https://telegram.org/',
  },
  {
    name: 'WhatsApp',
    icon: '/images/social%20icons/whatsapp.png',
    url: 'https://www.whatsapp.com/',
  },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.info}>
          <div className={styles.brand}>Gadget Hub</div>

          <p className={styles.description}>Магазин надежных гаджетов</p>

          <p className={styles.copyright}>
            © 2024 ООО “Гаджет Хаб”. Все права защищены
          </p>
        </div>

        <a href="tel:+78006783424" className={styles.phone}>
          <img
            src="/images/icons/mobile.svg"
            alt=""
            className={styles.phoneIcon}
          />

          <span>8 (800) 678-34-24</span>
        </a>

        <div className={styles.socials}>
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className={styles.socialLink}
            >
              <img src={social.icon} alt="" className={styles.socialIcon} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
