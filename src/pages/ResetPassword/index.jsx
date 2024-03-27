//  страница для восстановления пароля

import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import styles from './ResetPassword.module.scss';
import { resetPassword } from '../../redux/slices/auth';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register, // Функция для регистрации input-элементов в форме
    handleSubmit, // Функция для обработки отправки формы
    watch, // Функция для отслеживания значений полей формы
    formState: { errors, isValid }, // Состояние валидации формы
  } = useForm({
    mode: 'onChange', // Режим валидации формы при изменении данных
  });

  // Функция, вызываемая при отправке формы
  const onSubmit = async (values) => {
    const { email, newPassword, confirmNewPassword } = values;

    // Вызов Redux action для отправки запроса на сброс пароля
    await dispatch(resetPassword({ email, newPassword, confirmNewPassword }));

    // Перенаправление пользователя на страницу входа после сброса пароля
    navigate('/login');
  };

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Восстановление пароля
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Поля для ввода email, нового пароля и его подтверждения */}
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)} // Отображение ошибки валидации email
          helperText={errors.email?.message}
          type="email"
          {...register('email', { required: 'Укажите почту' })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Новый пароль"
          error={Boolean(errors.newPassword?.message)} // Отображение ошибки валидации нового пароля
          helperText={errors.newPassword?.message}
          // type="password"
          {...register('newPassword', {
            required: 'Укажите новый пароль',
            minLength: { value: 6, message: 'Пароль должен быть не менее 6 символов' },
            pattern: {
              value: /^[A-Za-z0-9]+$/,
              message: 'Пароль должен содержать только цифры и латинские буквы',
            },
          })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Подтвердите новый пароль"
          error={Boolean(errors.confirmNewPassword?.message)} // Отображение ошибки валидации подтверждения пароля
          helperText={errors.confirmNewPassword?.message}
          type="password"
          {...register('confirmNewPassword', {
            validate: (value) => value === watch('newPassword') || 'Пароли не совпадают',
          })}
          fullWidth
        />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Сохранить
        </Button>
      </form>
    </Paper>
  );
};
