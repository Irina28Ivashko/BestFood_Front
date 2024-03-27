// профиль авторизированного пользователя

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../redux/slices/auth';

import styles from './Profile.module.scss';
import Button from '@mui/material/Button';

function Profile() {
  const dispatch = useDispatch();
  // Состояние для управления видимостью выпадающего списка
  const [showPopup, setShowPopup] = useState(false);

  // Функция для переключения видимости
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // Функция для закрытия меню при клике на элемент
  const handleItemClick = () => {
    setShowPopup(false);
  };

  // обработчик для выхода из систему
  const onClickLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
    }
  };

  return (
    <div className={styles.profile}>
      <div className={styles.profile__label} onClick={togglePopup}>
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 5C10 5.16927 9.93815 5.31576 9.81445 5.43945C9.69075 5.56315 9.54427 5.625 9.375 5.625H0.625C0.455729 5.625 0.309245 5.56315 0.185547 5.43945C0.061849 5.31576 0 5.16927 0 5C0 4.83073 0.061849 4.68424 0.185547 4.56055L4.56055 0.185547C4.68424 0.061849 4.83073 0 5 0C5.16927 0 5.31576 0.061849 5.43945 0.185547L9.81445 4.56055C9.93815 4.68424 10 4.83073 10 5Z"
            fill="#2C2C2C"
          />
        </svg>

        <span>Профиль</span>
      </div>
      <div className={`${styles.profile__popup} ${showPopup ? styles.show : ''}`}>
        <ul>
          <li className={styles.profile__item} onClick={handleItemClick}>
            <Link to="/profile-settings">Настройка профиля</Link>
          </li>
          <li className={styles.profile__item} onClick={handleItemClick}>
            <Link to="/my-recipes">Мои рецепты</Link>
          </li>
          <li className={styles.profile__item} onClick={handleItemClick}>
            <Link to="/my-posts">Мои статьи</Link>
          </li>
          <li className={styles.profile__item} onClick={handleItemClick}>
            <Link to="/favorites">Моя книга рецептов</Link>
          </li>
          <li className={styles.profile__item} onClick={handleItemClick}>
            <Link to="/likes">Мне нравится</Link>
          </li>

          {/* Кнопка для выхода */}
          <Button
            onClick={onClickLogout}
            className={styles.logoutButton}
            variant="contained"
            // color="error"
          >
            Выйти
          </Button>
        </ul>
      </div>
    </div>
  );
}

export default Profile;
