import {useEffect, useState} from 'react';
import {Link, NavLink, useNavigate} from 'react-router-dom';

import {useAuthStore} from '../../store/authStore';
import {useCartQuantity} from '../../store/cartStore';
import {Modal} from '../Modal/Modal';
import {Button} from '../Button/Button';

import styles from './Header.module.scss';

export function Header() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);

  const cartQuantity = useCartQuantity();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 0);
    }

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logout();
      setIsLogoutModalOpen(false);
      navigate('/', {replace: true});
    } catch {
      alert('Не удалось выйти из аккаунта. Попробуйте ещё раз.');
    } finally {
      setIsLoggingOut(false);
    }
  }

  const headerClassName = [styles.header, isScrolled ? styles.scrolled : '']
    .filter(Boolean)
    .join(' ');

  function getNavClassName({isActive}: {isActive: boolean}) {
    return [styles.navButton, isActive ? styles.active : '']
      .filter(Boolean)
      .join(' ');
  }

  return (
    <header className={headerClassName}>
      <div className={`container ${styles.inner}`}>
        <Link
          to="/"
          className={styles.logo}
          aria-label="Gadget Hub — главная страница"
        >
          <img src="/images/gadget-hub-logo.svg" alt="Gadget Hub" />
        </Link>

        <nav className={styles.navigation} aria-label="Основная навигация">
          <NavLink to="/catalog" className={getNavClassName}>
            <img
              src="/images/icons/catalog.svg"
              alt=""
              className={styles.icon}
            />

            <span>Каталог</span>
          </NavLink>

          {!isLoading &&
            (user ? (
              <>
                <NavLink to="/cart" className={getNavClassName}>
                  <img
                    src="/images/icons/card.svg"
                    alt=""
                    className={styles.icon}
                  />

                  <span>Корзина</span>

                  {cartQuantity > 0 && (
                    <span className={styles.badge}>{cartQuantity}</span>
                  )}
                </NavLink>

                <button
                  type="button"
                  className={styles.navButton}
                  onClick={() => setIsLogoutModalOpen(true)}
                  disabled={isLoggingOut}
                >
                  <img
                    src="/images/icons/profile.svg"
                    alt=""
                    className={styles.icon}
                  />

                  <span>Выйти</span>
                </button>
              </>
            ) : (
              <NavLink to="/login" className={getNavClassName}>
                <img
                  src="/images/icons/profile.svg"
                  alt=""
                  className={styles.icon}
                />

                <span>Войти</span>
              </NavLink>
            ))}
        </nav>
      </div>
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => {
          if (!isLoggingOut) {
            setIsLogoutModalOpen(false);
          }
        }}
        title="Выход из аккаунта"
        actions={
          <>
            <Button
              disabled={isLoggingOut}
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Отмена
            </Button>

            <Button
              variant="pink"
              disabled={isLoggingOut}
              onClick={handleLogout}
            >
              {isLoggingOut ? 'Выходим...' : 'Выйти'}
            </Button>
          </>
        }
      >
        <p>Вы уверены, что хотите выйти из аккаунта?</p>
      </Modal>
    </header>
  );
}
