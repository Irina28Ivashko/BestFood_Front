// создание комментария

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddComment, fetchComments } from '../../redux/slices/comments';

import styles from './AddComment.module.scss';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar'; // Для информационного сообщения

export const AddComment = ({ contentId, contentType, onUnauthorized }) => {
  const [text, setText] = useState(''); // Состояние для хранения текста комментария
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false); // Для отображения информационного сообщения
  const [alertMessage, setAlertMessage] = useState(''); // Добавлено для управления текстом уведомления
  const userData = useSelector((state) => state.auth.data); //получаем данные пользователя из Redux store

  const isAuth = useSelector((state) => !!state.auth.data); //проверка авторизации пользователя

  // для закрытия окна с информацией
  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowAlert(false);
  };

  // для обработки отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвратить перезагрузку страницы

    if (!isAuth) {
      setAlertMessage('Чтобы оставить комментарий, необходимо авторизоваться!');
      setShowAlert(true);
      // Если пользователь не авторизован, вызываем функцию для отображения модального окна
      onUnauthorized();
      return;
    }

    // проверим, что текст не пустой
    if (!text.trim()) {
      setAlertMessage('Не удалось сохранить комментарий. Пожалуйста, введите текст комментария.');
      setShowAlert(true);
      return;
    }

    try {
      // и отправляем комментарий
      await dispatch(
        fetchAddComment({
          contentId,
          contentType,
          text,
          userId: userData._id,
        }),
      ).unwrap();

      // загружаем комментарий заново, чтобы отобразить добавленный
      dispatch(fetchComments({ contentId, contentType }));

      setText(''); // Очищаем поле ввода после отправки
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error);
      // Обработка ошибки добавления комментария
      setAlertMessage('Произошла ошибка при попытке отправить комментарий.');
      setShowAlert(true);
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={userData?.avatarUrl || 'default_avatar_url_here'}
        />

        {/* Форма для ввода комментария */}
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => !isAuth && setShowAlert(true)} // Показать уведомление при фокусе, если не авторизован
          />
          <Button variant="contained" onClick={handleSubmit}>
            Отправить
          </Button>
        </div>
      </div>

      {/* Снекбар с уведомлением для неавторизованных пользователей */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={showAlert}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        message={alertMessage} // Используем state для управления текстом сообщения
        action={
          // Кнопка закрытия уведомления
          <>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleAlertClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
    </>
  );
};
