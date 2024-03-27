// Компонент для отображения таблицы найденных продуктов. Принимает список продуктов и функцию для добавления продукта в другую таблицу как пропсы.

import React, { useState } from 'react';
import styles from './FoundProductsTable.module.scss';

export const FoundProductsTable = ({ products = [], onAddToTable = () => {} }) => {
  // Состояние для хранения идентификаторов добавленных продуктов
  const [addedProductIds, setAddedProductIds] = useState([]);

  //  для обработки добавления продукта в таблицу. Проверяет, добавлен ли продукт, и обновляет его данные.
  const handleAddToTable = (product) => {
    if (addedProductIds.includes(product._id)) {
      // Если продукт уже есть в списке, показываем уведомление
      alert('Выбранный продукт уже добавлен в таблицу!');
      return;
    }

    // Подготовка данных о продукте с учетом пользовательской массы (по умолчанию 100 грамм)
    const grams = product.customGrams || 100;
    const productWithUpdatedValues = {
      ...product,
      grams,
      calories: (product.calories * grams) / 100,
      proteins: (product.proteins * grams) / 100,
      fats: (product.fats * grams) / 100,
      carbohydrates: (product.carbohydrates * grams) / 100,
    };

    // Если проверка пройдена, добавляем продукт
    const result = onAddToTable(productWithUpdatedValues);
    if (result) {
      // Проверяем, был ли продукт успешно добавлен
      setAddedProductIds((prevIds) => [...prevIds, product._id]);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.title}>Найденные продукты</h2>
      <table className={styles.foundProductsTable}>
        <thead>
          <tr>
            <th>Продукт</th>
            <th>Ккал</th>
            <th>Белков </th>
            <th>Жиров </th>
            <th>Углеводов </th>
            <th>(на 100 г)</th>
          </tr>
        </thead>

        <tbody>
          {/* Отображаем список продуктов с кнопками для добавления */}
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.calories}</td>
              <td>{product.proteins}</td>
              <td>{product.fats}</td>
              <td>{product.carbohydrates}</td>
              <td>
                {/* Изменение стиля кнопки в зависимости от того, добавлен продукт или нет */}
                <button
                  onClick={() => handleAddToTable(product)}
                  className={
                    addedProductIds.includes(product._id) ? styles.added : styles.addButton
                  }>
                  {addedProductIds.includes(product._id) ? 'Добавлено' : 'Добавить в таблицу'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
