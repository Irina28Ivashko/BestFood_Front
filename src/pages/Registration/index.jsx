//  страница регистрации для пользователя

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useForm } from 'react-hook-form';

import styles from './Login.module.scss';
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth); //проверяем, авторизирован ли пользователь
  const dispatch = useDispatch();

  // Инициализация react-hook-form для управления формой
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    // Начальные значения формы
    defaultValues: {
      fullName: 'Мистер Фредди',
      email: 'test@test.ru',
      password: '1324',
    },
    mode: 'onChange', // Валидация при изменении
  });

  //при успешной валидации, запрос выполнен корректно
  const onSubmit = async (values) => {
    // Отправка данных на сервер с помощью Redux action
    const data = await dispatch(fetchRegister(values));

    // Проверка на наличие ошибок в ответе
    if (!data.payload) {
      return alert('Не удалось зарегистрироваться!');
    }

    // Если в ответе есть токен, сохраняем его в localStorage
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  //если пользователь авторизован, то проиходит переход на гл.стр.
  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Поля для ввода имени, почты и пароля с валидацией */}
        <TextField
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', {
            required: 'Укажите полное имя',
            minLength: {
              value: 3,
              message: 'Имя должно состоять минимум из 3 символов', // Сообщение, которое будет показано, если в поле меньше 3 символов
            },
            validate: {
              noSpecialChars: (value) =>
                !/[&%$]/.test(value) ||
                'Имя может содержать только буквы, цифры, дефисы, апострофы и пробелы', // Добавляем проверку на запрещённые символы
            },
          })}
          // {...register('fullName', { required: 'Укажите полное имя' })}
          className={styles.field}
          label="Полное имя"
          fullWidth
        />
        <TextField
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register('email', { required: 'Укажите почту' })}
          className={styles.field}
          label="E-Mail"
          fullWidth
        />
        <TextField
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          // type="password"
          {...register('password', {
            required: 'Укажите пароль',
            minLength: {
              value: 6,
              message: 'Пароль должен состоять минимум из 6 символов', // Сообщение, которое будет показано, если в поле меньше 3 символов
            },
            pattern: {
              value: /^[A-Za-z0-9]+$/,
              message: 'Пароль должен содержать только цифры и латинские буквы',
            },
          })}
          // {...register('password', { required: 'Укажите пароль' })}
          className={styles.field}
          label="Пароль"
          fullWidth
        />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
