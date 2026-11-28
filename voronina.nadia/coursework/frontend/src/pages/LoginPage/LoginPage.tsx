import {useState} from 'react';
import type {FormEvent} from 'react';

import {Button} from '../../components/Button/Button';
import {Input} from '../../components/Input/Input';

import {useAuthStore} from '../../store/authStore';
import {ApiError} from '../../api/client';

import {Modal} from '../../components/Modal/Modal';

import styles from './LoginPage.module.scss';

export function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const newUsernameError = username.trim()
      ? ''
      : 'Заполните обязательное поле';

    const newPasswordError = password ? '' : 'Заполните обязательное поле';

    setUsernameError(newUsernameError);
    setPasswordError(newPasswordError);

    return !newUsernameError && !newPasswordError;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || isLoading) {
      return;
    }

    setServerError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        username: username.trim(),
        password,
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setServerError(
          'Такого пользователя нет, возможно, неправильный логин или пароль — проверьте данные.',
        );
      } else {
        setServerError('Не удалось выполнить вход. Попробуйте позже.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.loginPage}>
      <div className={styles.content}>
        <h1 className={styles.title}>Добро пожаловать!</h1>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
          noValidate
          aria-busy={isSubmitting}
        >
          <Input
            label="Логин"
            name="username"
            value={username}
            autoComplete="username"
            required
            fullWidth
            error={usernameError}
            disabled={isSubmitting}
            onChange={(event) => {
              const value = event.target.value;

              setUsername(value);

              if (value.trim()) {
                setUsernameError('');
              }

              setServerError('');
            }}
          />

          <Input
            label="Пароль"
            name="password"
            type="password"
            value={password}
            autoComplete="current-password"
            required
            fullWidth
            error={passwordError}
            disabled={isSubmitting}
            onChange={(event) => {
              const value = event.target.value;

              setPassword(value);

              if (value) {
                setPasswordError('');
              }

              setServerError('');
            }}
          />

          <Button type="submit" disabled={isSubmitting || isLoading}>
            {isSubmitting ? 'Входим...' : 'Войти'}
          </Button>
        </form>
      </div>

      <Modal
        isOpen={Boolean(serverError)}
        onClose={() => setServerError('')}
        title="Ошибка авторизации"
        actions={<Button onClick={() => setServerError('')}>Ок</Button>}
      >
        <p>{serverError}</p>
      </Modal>
    </section>
  );
}
