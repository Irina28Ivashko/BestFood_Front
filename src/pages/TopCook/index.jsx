// страница со списком топ кулинаров

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopCooks } from '../../redux/slices/auth';

import styles from './TopCook.module.scss';

import { UserCard } from '../../components/UserCard';

export const TopCook = () => {
  const dispatch = useDispatch();
  const topCooks = useSelector((state) => state.auth.topCooks); // Выбор данных о топ кулинарах из Redux store

  // useEffect hook для загрузки данных о топ кулинарах при монтировании компонента
  useEffect(() => {
    dispatch(fetchTopCooks()); // Вызов action для загрузки данных
  }, [dispatch]);

  return (
    <div className={styles.topCooksContainer}>
      <h3 className={styles.title}>Топ кулинаров</h3>
      <div className={styles.gridContainer}>
        {/* Условный рендеринг списка кулинаров */}
        {topCooks &&
          topCooks.map((user, index) => (
            // Отображение карточек топ кулинаров с использованием компонента UserCard
            <UserCard
              key={user._id} // Уникальный ключ для каждой карточки
              user={user} // Данные пользователя
              rank={index + 1} // Ранг кулинара в топе
              lastActivityDate={user.lastActivity} // Дата последней активности пользователя
            />
          ))}
      </div>
    </div>
  );
};
