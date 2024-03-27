// для обозначения цвета для каждого тега

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ColorTag.module.scss';

export const ColorTag = ({ content, url }) => {
  // Объект для связи категорий с классами стилей
  const getTagColorClass = (tag) => {
    const tagColors = {
      Закуски: styles.tagColorBlyuda,
      Салаты: styles.tagColorBlyuda,
      'Супы и бульоны': styles.tagColorBlyuda,
      'Основные блюда': styles.tagColorBlyuda,
      Десерты: styles.tagColorBlyuda,
      'Изделия из теста': styles.tagColorBlyuda,
      Соуса: styles.tagColorBlyuda,
      Напитки: styles.tagColorBlyuda,
      Завтрак: styles.tagColorEveryday,
      Обед: styles.tagColorEveryday,
      Полдник: styles.tagColorEveryday,
      Ужин: styles.tagColorEveryday,
      'Новый год': styles.tagColorHolidays,
      'День рождения': styles.tagColorHolidays,
      Масленица: styles.tagColorHolidays,
      Пасха: styles.tagColorHolidays,
      'Гриль и барбекю': styles.tagColorCookingMethod,
      'Запеченные блюда': styles.tagColorCookingMethod,
      'Тушенные блюда': styles.tagColorCookingMethod,
      'Варенные блюда': styles.tagColorCookingMethod,
      'Жаренные блюда': styles.tagColorCookingMethod,
      'Замороженные блюда': styles.tagColorCookingMethod,
      'Детское меню': styles.tagColorDiet,
      'Вегетарианское меню': styles.tagColorDiet,
      'Диетическое меню': styles.tagColorDiet,
      'Здоровое питание': styles.tagColorDiet,
    };

    const colorClass = tagColors[tag] || styles.defaultTagColor;

    return colorClass;

    // return tagColors[tag] || styles.defaultTagColor; // Возвращайте стиль по умолчанию, если тег не найден
  };

  // Получаем класс цвета для текущего тега
  const tagColorClass = getTagColorClass(content);

  // Возвращаем элемент Link с классом стиля, соответствующим категории
  return (
    <Link to={url} className={`${styles.tag} ${tagColorClass}`}>
      {content}
    </Link>
  );
};
