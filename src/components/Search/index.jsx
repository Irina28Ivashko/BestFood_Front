// поиск по названию рецепта

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSearchRecipes, fetchRecipes } from '../../redux/slices/recipes';

import styles from './Search.module.scss';

export const Search = () => {
  const [query, setQuery] = useState(''); // Состояние для хранения текущего поискового запроса
  const dispatch = useDispatch();
  const [error, setError] = useState(''); // Состояние для хранения ошибки

  // Обработчик для поиска рецептов
  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery); // Обновление состояния с новым запросом
    setError(''); // Очищаем ошибку при каждом новом вводе

    // Отправка запроса на сервер, если длина запроса больше 2 символов
    if (searchQuery.length > 2) {
      dispatch(fetchSearchRecipes(searchQuery)) // проверяем, что searchQuery - это строка
        .unwrap()
        .catch((rejectedValueOrSerializedError) => {
          // Обрабатываем ошибку и обновляем состояние ошибки
          setError(rejectedValueOrSerializedError.message);
        });
    } else if (searchQuery.length === 0) {
      // Если запрос пустой, загружаем исходные рецепты
      dispatch(fetchRecipes({ page: 1, limit: 9 }));
    }
  };

  // Обработчик сброса поискового запроса
  const handleClearSearch = () => {
    setQuery('');
    setError(''); // Очищаем ошибку
    dispatch(fetchRecipes({ page: 1, limit: 9 })); // Загружаем исходные рецепты
  };

  return (
    <div className={styles.root}>
      <svg className={styles.icon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title />
        <g data-name="Layer 2" id="Layer_2">
          <path d="M18,10a8,8,0,1,0-3.1,6.31l6.4,6.4,1.41-1.41-6.4-6.4A8,8,0,0,0,18,10Zm-8,6a6,6,0,1,1,6-6A6,6,0,0,1,10,16Z" />
        </g>
      </svg>
      <input
        className={styles.input}
        placeholder="Поиск репепта..."
        value={query}
        onChange={handleSearch}
      />

      <svg
        onClick={handleClearSearch}
        className={styles.clearIcon}
        fill="none"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
          fill="currentColor"
        />
      </svg>
      {/* Вывод сообщения об ошибке */}
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};
