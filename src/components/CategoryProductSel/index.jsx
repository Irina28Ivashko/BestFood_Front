// выбор продуктов по категории для таблицы калькулятора

import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategoriesBJU } from '../../redux/slices/categoriesBJU';

import { ProductList } from '../ProductList';

import styles from './CategoryProductSel.module.scss';

export const CategoryProductSel = React.memo(({ onApplySelectedProducts }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categoriesBJU.items);

  // Состояние для управления активной категорией
  const [activeCategories, setActiveCategories] = useState([]);

  // Состояние для хранения выбранных продуктов
  const [selectedProducts, setSelectedProducts] = useState([]);

  //  для обработки клика по категории
  const handleSelectCategory = useCallback((categoryId) => {
    setActiveCategories((prev) => {
      const isCurrentlyActive = prev.includes(categoryId);
      if (isCurrentlyActive) {
        // Категория уже активна, удаляем ее, чтобы "закрыть" список продуктов
        return prev.filter((id) => id !== categoryId);
      } else {
        // Добавляем категорию, чтобы "открыть" список продуктов
        return [categoryId]; // Изменено для того, чтобы в момент времени была активна только одна категория
      }
    });
  }, []);

  // Функция для добавления/удаления продукта из списка выбранных
  const toggleProduct = useCallback((productId) => {
    setSelectedProducts((prevSelectedProducts) => {
      const isSelected = prevSelectedProducts.includes(productId);
      // Возвращаем новый список, добавляя или удаляя продукт
      return isSelected
        ? prevSelectedProducts.filter((id) => id !== productId)
        : [...prevSelectedProducts, productId];
    });
  }, []);

  // Обработчик для применения выбранных продуктов
  const handleApplySelectedProducts = useCallback(() => {
    // Вызываем переданный обработчик с текущим списком выбранных продуктов
    onApplySelectedProducts(selectedProducts);
  }, [selectedProducts, onApplySelectedProducts]);

  // Загрузка категорий при монтировании компонента
  useEffect(() => {
    dispatch(fetchCategoriesBJU());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Подбор продуктов по категории</h2>
      <div className={styles.categories}>
        {categories.map((category) => (
          <div
            key={category._id}
            className={styles.category}
            onClick={() => handleSelectCategory(category._id)}>
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${styles.categoryIndicator} ${
                activeCategories.includes(category._id) ? styles.active : ''
              }`}>
              <path
                d="M10 5C10 5.16927 9.93815 5.31576 9.81445 5.43945C9.69075 5.56315 9.54427 5.625 9.375 5.625H0.625C0.455729 5.625 0.309245 5.56315 0.185547 5.43945C0.061849 5.31576 0 5.16927 0 5C0 4.83073 0.061849 4.68424 0.185547 4.56055L4.56055 0.185547C4.68424 0.061849 4.83073 0 5 0C5.16927 0 5.31576 0.061849 5.43945 0.185547L9.81445 4.56055C9.93815 4.68424 10 4.83073 10 5Z"
                fill="#2C2C2C"
              />
            </svg>
            {category.name}
            {activeCategories.includes(category._id) && (
              <div className={`${styles.products} ${styles.active}`}>
                <ProductList
                  categoryId={category._id}
                  toggleProduct={toggleProduct}
                  selectedProducts={selectedProducts}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <button className={styles.applyButton} onClick={handleApplySelectedProducts}>
        Применить
      </button>
    </div>
  );
});
