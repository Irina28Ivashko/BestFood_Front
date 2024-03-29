// страница авторизации

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';

import styles from './Login.module.scss';
import { fetchAuth, selectIsAuth } from '../../redux/slices/auth';

export const Login = () => {
  const isAuth = useSelector(selectIsAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  //при успешной валидации, запрос выполнен корректно
  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values));

    if (!data.payload) {
      return alert('Не удалось авторизоваться!');
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  //если пользователь авторизован, то проиходит переход на гл.стр.
  if (isAuth) {
    return <Navigate to="/" />;
  }

  // обработчик для  перехода на страницу регистрации
  const handleRegisterClick = () => {
    navigate('/register'); // Затем переходим на страницу регистрации
  };

  // восстановление пароля
  const handleNewPassword = () => {
    navigate('/reset-password');
  };

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          //если эта инфо true, то сообщение буде подствечиваться красн. цв.
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register('email', { required: 'Укажите почту' })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          type="password"
          {...register('password', {
            required: 'Укажите пароль',
            minLength: {
              value: 6,
              message: 'Пароль должен состоять минимум из 6 символов', // Сообщение, которое будет показано, если в поле меньше 3 символов
            },
          })}
          // {...register('password', { required: 'Укажите пароль' })}
          fullWidth
        />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>

        <button onClick={handleRegisterClick} className={styles.buttonRegister}>
          Зарегистрироваться
        </button>

        <button onClick={handleNewPassword} className={styles.buttonPassword}>
          Восстановить пароль
        </button>
      </form>
    </Paper>
  );
};
