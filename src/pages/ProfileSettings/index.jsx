// профиль пользователя с настройками

import React, { useState, useRef, useEffect } from 'react';
import axios from '../../axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../redux/slices/auth';
import { useNavigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './ProfileSettings.module.scss';

export const ProfileSettings = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data); // Данные пользователя из Redux
  const [fullName, setFullName] = useState(userData?.fullName || ''); // Состояние для полного имени пользователя
  const inputFileRef = useRef(null); // Ссылка на скрытый input для загрузки файла
  const [avatarUrl, setAvatarUrl] = useState(userData?.avatarUrl || '/noavatar.png'); // Состояние для URL аватара
  const navigate = useNavigate();

  // Функция обработки изменения имени пользователя
  const handleNameChange = (e) => {
    setFullName(e.target.value);
  };

  // Эффект для сохранения URL предыдущей страницы
  useEffect(() => {
    // Сохраняем URL предыдущей страницы в состоянии
    const previousUrl =
      window.history.state && window.history.state.idx > 0 ? document.referrer : '/';
    navigate.previousUrl = previousUrl;
  }, [navigate]);

  // Эффект для обновления состояния fullName при изменении данных пользователя
  useEffect(() => {
    setFullName(userData?.fullName || '');
  }, [userData, setFullName]);

  // Функция для обработки загрузки файла аватара
  const handleChangeFile = async (event) => {
    try {
      const file = event.target.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff'];
      const maxSizeMB = 1; // Максимальный размер файла в МБ
      const maxSizeBytes = maxSizeMB * 1024 * 1024; // Максимальный размер файла в байтах

      if (!allowedTypes.includes(file.type)) {
        alert('Недопустимый тип файла. Разрешены только изображения (JPEG, PNG, GIF, BMP, TIFF).');
        return; // Прекращаем выполнение функции, если тип файла недопустим
      }

      if (file.size > maxSizeBytes) {
        alert(`Размер файла превышает ${maxSizeMB} МБ. Пожалуйста, выберите другой файл.`);
        return; // Прекращаем выполнение функции, если файл слишком большой
      }

      const formData = new FormData();
      formData.append('image', file);

      // Отправка файла на сервер
      const { data } = await axios.post('/upload', formData);

      // Обновление URL аватара с учетом нового изображения
      const uploadedImageUrl = `https://bestfood-back-2qsm.onrender.com${data.url}`;
      const newAvatarUrlWithCacheBuster = `${uploadedImageUrl}?t=${new Date().getTime()}`;

      setAvatarUrl((prevUrl) => newAvatarUrlWithCacheBuster);

      // Обновляем профиль пользователя с новым URL аватара
      await dispatch(updateProfile({ fullName, avatarUrl: newAvatarUrlWithCacheBuster }));
    } catch (err) {
      console.warn(err);
      alert('Ошибка при загрузке файла!');
    }
  };

  // Функция для обработки отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('avatarUrl', avatarUrl);

    // Обновление данных профиля
    const updateResponse = await dispatch(updateProfile(formData));

    if (updateProfile.fulfilled.match(updateResponse)) {
      // Если запрос успешный, обновляем локальные данные
      setFullName(updateResponse.payload.fullName);
      setAvatarUrl(
        `https://bestfood-back-2qsm.onrender.com${updateResponse.payload.avatarUrl}?t=${new Date().getTime()}`,
      );
    }
    navigate('/');
  };

  // Функция для отмены изменений
  const handleCancel = () => {
    navigate('/'); // Перенаправляем пользователя на глав. стр. без сохранения изменений
  };

  return (
    <div className={styles.root}>
      <Typography variant="h5" className={styles.title}>
        Настройки профиля
      </Typography>
      <div className={styles.avatar}>
        <Avatar src={avatarUrl} sx={{ width: 100, height: 100 }} />
      </div>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
        className={styles.uploadButton}>
        Загрузить фото
      </Button>

      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      <form onSubmit={handleSubmit}>
        <TextField
          label="Полное имя"
          value={fullName}
          onChange={handleNameChange}
          className={styles.field}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="E-Mail"
          value={userData?.email || ''}
          className={styles.field}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />

        <div className={styles.buttonGroup}>
          <Button type="submit" variant="contained" color="primary">
            Сохранить изменения
          </Button>
          <Button onClick={handleCancel} variant="outlined" color="secondary">
            Отменить
          </Button>
        </div>
      </form>
    </div>
  );
};
