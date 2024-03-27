import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategoriesBJU } from '../../redux/slices/categoriesBJU';

import styles from './CategorySelector.module.scss';

export const CategorySelector = ({ onSelectCategory, activeCategories }) => {
  const dispatch = useDispatch();

  // Используем  `useSelector`, чтобы получить доступ к состоянию хранилища Redux и получить данные категорий
  const { items: categoriesData } = useSelector((state) => state.categoriesBJU);

  // Используем `useMemo` для оптимизации и создания списка категорий с информацией об активности,
  // зависит от данных категорий и активных категорий
  const categoriesWithActiveState = useMemo(
    () =>
      categoriesData.map((category) => ({
        ...category,
        isActive: activeCategories.includes(category._id),
      })),
    [categoriesData, activeCategories],
  );

  // Используем `useEffect` для загрузки категорий при монтировании компонента,
  // пустой массив зависимостей означает, что эффект выполнится один раз после первого рендеринга
  useEffect(() => {
    dispatch(fetchCategoriesBJU());
  }, [dispatch]);

  return (
    <div className={styles.categories}>
      {categoriesWithActiveState.map((category) => (
        <div
          key={category._id}
          // Используем информацию об активности напрямую из оптимизированного списка
          className={`${styles.category} ${category.isActive ? styles.active : ''}`}
          onClick={() => onSelectCategory(category._id)}>
          {category.name}
        </div>
      ))}
    </div>
  );
};
