// список продуктов при после нажатия на категорию

import React, { useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductsByCategory, selectProductsByCategory } from '../../redux/slices/products';

import styles from './ProductList.module.scss';

export const ProductList = React.memo(({ categoryId, toggleProduct, selectedProducts }) => {
  const dispatch = useDispatch();

  // Получение списка продуктов по категории с помощью селектора, который принимает текущее состояние Redux и ID категории
  const products = useSelector((state) => selectProductsByCategory(state, categoryId));

  // Получение состояния загрузки и ошибок из Redux
  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);

  // Хук  для загрузки продуктов по категории при изменении categoryId или при отсутствии продуктов в списке
  useEffect(() => {
    if (!products.length) {
      dispatch(fetchProductsByCategory(categoryId));
    }
  }, [categoryId, dispatch, products.length]);

  // Функция для обработки переключения (выбора/отмены выбора) продукта
  const handleToggleProduct = (productId) => {
    toggleProduct(productId);
  };

  // Условия для отображения состояния загрузки или ошибки
  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div className={styles.products}>
      {products.map((product) => (
        <div key={product._id} className={styles.product}>
          <input
            type="checkbox"
            id={`product-${product._id}`}
            // Проверяем, выбран ли продукт, изменяя состояние чекбокса
            checked={selectedProducts.includes(product._id)}
            // При изменении чекбокса вызываем `handleToggleProduct`
            onChange={() => handleToggleProduct(product._id)}
          />
          <label htmlFor={`product-${product._id}`}>{product.name}</label>
        </div>
      ))}

      {/* Сообщение о отсутствии продуктов, если список пуст и загрузка завершена */}
      {products.length === 0 && !loading && <p>Продукты в этой категории отсутствуют.</p>}
    </div>
  );
});
