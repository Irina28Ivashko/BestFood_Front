// Компонент для отображения ингредиентов с учетом количества порций

import React, { useState, useEffect } from 'react';
import styles from './IngredientsWithPortions.module.scss';

import { Button } from '@mui/material';

export const IngredientsWithPortions = ({ initialIngredients, initialPortions }) => {
  const [portions, setPortions] = useState(initialPortions); // Состояние для управления количеством порций
  // Состояние для хранения базового списка ингредиентов для последующего пересчета
  const [baseIngredients, setBaseIngredients] = useState(initialIngredients);

  // Состояние для хранения и отображения актуального списка ингредиентов с учетом порций
  const [ingredients, setIngredients] = useState(initialIngredients);

  // Пересчет количества ингредиентов при изменении portions или initialIngredients
  useEffect(() => {
    setBaseIngredients(initialIngredients);
  }, [initialIngredients, initialPortions]);

  // Эффект для пересчета количества ингредиентов в зависимости от количества порций
  useEffect(() => {
    const newIngredients = baseIngredients.map((ingredient) => ({
      ...ingredient,

      // Пересчет количества с округлением до двух знаков после запятой
      amount: ((ingredient.amount / initialPortions) * portions).toFixed(2), // Округление до 2 знаков после запятой
    }));

    setIngredients(newIngredients);
  }, [portions, baseIngredients, initialPortions]);

  // Обработчик изменения количества порций
  const handlePortionsChange = (e) => {
    let newValue = Number(e.target.value);
    newValue = newValue > 1000 ? 1000 : newValue; // Ограничение максимального значения
    newValue = newValue < 1 ? 1 : newValue; // Ограничение минимального значения
    setPortions(newValue);
    // setPortions(Number(e.target.value)); // Преобразование в число
  };

  // Функция для увеличения количества порций
  const incrementPortions = () => {
    setPortions((prevPortions) => (prevPortions < 1000 ? prevPortions + 1 : 1000));
    // setPortions((prevPortions) => prevPortions + 1);
  };

  // Функция для уменьшения количества порций с проверкой на минимальное значение (1)
  const decrementPortions = () => {
    setPortions((prevPortions) => (prevPortions > 1 ? prevPortions - 1 : 1));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Ингредиенты</h3>
        <div className={styles.portionsControl}>
          {/* Кнопки для управления количеством порций */}
          <span className={styles.portionsLabel}>Порции:</span>
          <Button className={styles.controlButton} onClick={decrementPortions}>
            -
          </Button>
          <input
            type="number"
            className={styles.portionsInput}
            value={portions}
            onChange={handlePortionsChange}
            min="1"
            max="1000"
          />
          <Button className={styles.controlButton} onClick={incrementPortions}>
            +
          </Button>
        </div>
      </div>

      <ul className={styles.ingredientsList}>
        {/* Маппинг пересчитанных ингредиентов для отображения */}
        {ingredients.map((ingredient, index) => (
          <li key={index} className={styles.ingredientItem}>
            <span className={styles.ingredientName}>{ingredient.product.name}</span>
            <span
              className={styles.ingredientAmount}>{`${ingredient.amount} ${ingredient.unit}`}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
