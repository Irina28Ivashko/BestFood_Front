// каталог рецептов по категориям и тегам для бокового меню

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './RecipeCatalog.module.scss';

const RecipeCatalog = () => {
  const [isOpen, setIsOpen] = useState(false); // Состояние для отслеживания видимости каталога

  const toggleCatalog = () => setIsOpen(!isOpen); // Функция для переключения видимости
  // Функция для закрытия каталога при выборе элемента
  // Функция для закрытия каталога при выборе элемента на мобильных устройствах
  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  const catalog = {
    'По категориям блюд': [
      'Закуски',
      'Салаты',
      'Супы и бульоны',
      'Основные блюда',
      'Десерты',
      'Изделия из теста',
      'Соуса',
      'Напитки',
    ],
    'Блюда на каждый день': ['Завтрак', 'Обед', 'Полдник', 'Ужин'],
    'По праздникам': ['Новый год', 'День рождения', 'Масленица', 'Пасха'],
    'По способу приготовления': [
      'Гриль и барбекю',
      'Запеченные блюда',
      'Тушенные блюда',
      'Варенные блюда',
      'Жаренные блюда',
      'Замороженные блюда',
    ],
    'Тип питания': ['Детское меню', 'Вегетарианское меню', 'Диетическое меню', 'Здоровое питание'],
  };

  return (
    <div>
      {/* Кнопка для открытия/закрытия каталога */}

      {/* <button className={styles.toggleButton} onClick={toggleCatalog}>
        ☰
      </button> */}
      <button
        className={`${styles.toggleButton} ${isOpen ? styles.hide : ''}`}
        onClick={toggleCatalog}>
        ☰
      </button>

      {/* Отображаем каталог только если он открыт (состояние isOpen === true) */}

      <div className={`${styles.catalogContainer} ${isOpen ? styles.show : ''}`}>
        <button className={styles.closeButton} onClick={toggleCatalog}>
          ✕
        </button>

        <h2 className={styles.catalogTitle}>Каталог рецептов</h2>

        <div className={styles.scrollableSection}>
          {/* Перебор категорий и элементов каталога */}
          {Object.entries(catalog).map(([category, items]) => (
            <div key={category} className={styles.categorySection}>
              {/* Ссылка на страницу с фильтрацией по категории */}
              <Link
                to={`/category/${encodeURIComponent(category)}`}
                className={styles.categoryLink}
                onClick={handleMenuItemClick}>
                <h3 className={styles.catalogTitle}>{category}</h3>
              </Link>
              <ul className={styles.catalogList}>
                {/* Перебор элементов в каждой категории */}
                {items.map((item) => (
                  <li key={item} className={styles.catalogItem}>
                    {/* Ссылка на страницу с фильтрацией по тегу */}
                    <Link
                      to={`/tag/${encodeURIComponent(item)}`}
                      className={styles.catalogLink}
                      onClick={handleMenuItemClick}>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeCatalog;
