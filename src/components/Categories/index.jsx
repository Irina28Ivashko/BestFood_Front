// категории

import styles from './Categories.module.scss';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';

import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import { useCategoriesStyles } from '../../useCategoriesStyles';

export const Categories = ({ onCategoryChange }) => {
  const classes = useCategoriesStyles();
  const isAuth = useSelector(selectIsAuth);
  const [activeCategory, setActiveCategory] = useState('');
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    onCategoryChange(category); // Вызываем функцию, переданную из родительского компонента
    switch (category) {
      case 'Рецепты':
        navigate('/recipes'); // Переход на страницу рецептов
        break;
      case 'Кулинарные статьи':
        navigate('/posts'); // Переход на страницу статей
        break;
      case 'Калькулятор калорий':
        navigate('/calculator'); // Переход на страницу калькулятора калорий
        break;
      case 'Топ кулинаров':
        navigate('/top-cooks'); // Переход на страницу топ кулинаров
        break;
      default:
        navigate('/'); // Переход на главную страницу в случае нераспознанной категории
    }
  };

  return (
    <div className={styles.categories}>
      <ul>
        <li
          className={activeCategory === 'Рецепты' ? styles.active : ''}
          onClick={() => handleCategoryClick('Рецепты')}>
          Рецепты
        </li>
        <li
          className={activeCategory === 'Кулинарные статьи' ? styles.active : ''}
          onClick={() => handleCategoryClick('Кулинарные статьи')}>
          Кулинарные статьи
        </li>
        <li
          className={activeCategory === 'Калькулятор калорий' ? styles.active : ''}
          onClick={() => handleCategoryClick('Калькулятор калорий')}>
          Калькулятор калорий
        </li>
        <li
          className={activeCategory === 'Топ кулинаров' ? styles.active : ''}
          onClick={() => handleCategoryClick('Топ кулинаров')}>
          Топ кулинаров
        </li>
      </ul>

      <div className={styles.categories__buttons}>
        {isAuth && (
          <>
            <Link to="/add-post">
              <Button className={classes.customButton} variant="contained">
                <svg
                  className={classes.customSvg}
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.8 4.8H7.2V1.2C7.2 0.5373 6.6627 0 6 0C5.3373 0 4.8 0.5373 4.8 1.2V4.8H1.2C0.5373 4.8 0 5.3373 0 6C0 6.6627 0.5373 7.2 1.2 7.2H4.8V10.8C4.8 11.4627 5.3373 12 6 12C6.6627 12 7.2 11.4627 7.2 10.8V7.2H10.8C11.4627 7.2 12 6.6627 12 6C12 5.3373 11.4627 4.8 10.8 4.8Z"
                    fill="white"
                  />
                </svg>
                Добавить статью
              </Button>
            </Link>
            <Link to="/add-recipe">
              <Button className={classes.customButton} variant="contained">
                <svg
                  className={classes.customSvg}
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.8 4.8H7.2V1.2C7.2 0.5373 6.6627 0 6 0C5.3373 0 4.8 0.5373 4.8 1.2V4.8H1.2C0.5373 4.8 0 5.3373 0 6C0 6.6627 0.5373 7.2 1.2 7.2H4.8V10.8C4.8 11.4627 5.3373 12 6 12C6.6627 12 7.2 11.4627 7.2 10.8V7.2H10.8C11.4627 7.2 12 6.6627 12 6C12 5.3373 11.4627 4.8 10.8 4.8Z"
                    fill="white"
                  />
                </svg>
                Добавить рецепт
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
