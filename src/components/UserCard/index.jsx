// карточка пользователя в топ кулинаров

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { setCurrentAuthorRank } from '../../redux/slices/auth';
import { useDispatch } from 'react-redux';

import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import defaultAvatar from '../../assets/images/logo.svg';

import styles from './UserCard.module.scss';

export const UserCard = ({ user, rank, lastActivityDate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Функция для обработки клика по карточке пользователя
  const handleViewProfile = () => {
    dispatch(setCurrentAuthorRank(rank)); // Установка текущего ранга пользователя
    navigate(`/users/${user._id}/activity`); // Переход на страницу пользователя
  };

  // Получение полного URL аватара пользователя
  const fullAvatarUrl = user.avatarUrl
    ? user.avatarUrl.startsWith('http')
      ? user.avatarUrl
      : `http://localhost:4445${user.avatarUrl}`
    : defaultAvatar;

  //  для определения стиля фона в зависимости от ранга пользователя
  const getBackgroundStyle = (rank) => {
    switch (rank) {
      case 1:
        return styles.gold;
      case 2:
        return styles.silver;
      case 3:
        return styles.bronze;
      default:
        return rank <= 10 ? styles.lightGreen : styles.lightBlue;
    }
  };

  // Применение функции для получения стиля фона
  const backgroundStyle = getBackgroundStyle(rank);

  return (
    <Card className={`${styles.userCard} ${backgroundStyle}`} onClick={handleViewProfile}>
      <CardContent>
        {/* Отображение аватара, имени пользователя и дополнительной информации */}
        <div className={styles.avatarContainer}>
          <Avatar src={fullAvatarUrl} alt={user.fullName} className={styles.avatar} />
        </div>
        <Typography variant="h6">{user.fullName}</Typography>
        <Typography variant="body2">Рецептов: {user.recipeCount}</Typography>
        <Typography variant="body2">Статей: {user.postCount}</Typography>
        <Typography variant="body2">
          Последнее добавление: {lastActivityDate || 'Неизвестно'}
        </Typography>
        <Typography variant="caption" className={styles.rank}>
          Место в рейтинге: <span className={styles.rankNumber}>{rank}</span>
        </Typography>
      </CardContent>
    </Card>
  );
};
