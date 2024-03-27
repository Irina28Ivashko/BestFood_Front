// поиск по названию продукта и добавления найденного продукта в таблицу-калькулятор

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchProducts } from '../../redux/slices/products';

import { calculateNutritionalValue } from '../../utils/calculateNutritionalValue';

import styles from './SearchProduct.module.scss';

export const SearchProduct = ({ onAddToTable }) => {
  // Локальные состояния для управления поиском и выбранным продуктом
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [grams, setGrams] = useState(100); // По умолчанию устанавливаем вес в граммах
  const dispatch = useDispatch();
  const searchResults = useSelector((state) => state.products.searchResults) || [];

  // Пересчитываем питательные значения при изменении выбранного продукта или его массы
  useEffect(() => {
    setSelectedProduct(null); // Сброс выбранного продукта
    if (searchTerm) {
      dispatch(searchProducts(searchTerm.trim()));
    }
  }, [searchTerm, dispatch]);

  // Обработчик изменения строки поиска
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim()) {
      dispatch(searchProducts(value.trim()));
    }
  };

  // Маппинг для перевода единиц измерения на русский язык
  const measurementNames = {
    cup: 'стакане',
    tablespoon: 'столовой ложке',
    teaspoon: 'чайной ложке',
  };

  // Обработчик изменения количества грамм
  const handleGramsChange = (e) => {
    setGrams(Number(e.target.value) || 100);
  };

  //  для добавления выбранного продукта в таблицу
  const handleAddProduct = () => {
    if (selectedProduct) {
      const nutritionalValues = calculateNutritionalValue(selectedProduct, grams);
      const productToAdd = {
        id: selectedProduct._id,
        ...selectedProduct,
        grams, // Указываем актуальную массу продукта
        calories: nutritionalValues.calories, // Пересчитанные значения на указанную массу
        proteins: nutritionalValues.proteins,
        fats: nutritionalValues.fats,
        carbohydrates: nutritionalValues.carbohydrates,
      };
      const isAdded = onAddToTable(productToAdd);
      if (!isAdded) {
        alert('Выбранный продукт уже добавлен в таблицу!');
      } else {
        setSearchTerm(''); // Сброс поисковой строки для нового поиска
        setGrams(100); // Сброс массы на значение по умолчанию
        setSelectedProduct(null); // Сброс выбранного продукта
      }
    }
  };

  // Функция для выбора продукта из результатов поиска
  const handleProductSelect = (product) => {
    setSelectedProduct(product); // Установка выбранного продукта
  };

  return (
    <div className={styles.Container}>
      <h2 className={styles.title}>Подбор продуктов по названию</h2>
      <div className={styles.searchAndCounter}>
        <input
          type="text"
          className={styles.searchInput}
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Поиск продуктов..."
        />
        <input
          type="number"
          className={styles.gramsInput}
          value={grams}
          onChange={handleGramsChange}
          placeholder="Граммы"
          min="1"
        />
      </div>

      {/* Отображение результатов поиска */}
      {searchTerm && !selectedProduct && (
        <div className={styles.resultsList}>
          {searchResults.map((product) => (
            <div
              key={product._id}
              className={styles.resultItem}
              onClick={() => handleProductSelect(product)}>
              {product.name}
            </div>
          ))}
        </div>
      )}

      {/* подробности выбранного продукта */}
      {selectedProduct && (
        <div className={styles.productDetails}>
          <p>{selectedProduct.name}</p>
          <div>Калорийность: {((selectedProduct.calories * grams) / 100).toFixed(2)} ккал</div>
          <div>Белки: {((selectedProduct.proteins * grams) / 100).toFixed(2)} г</div>
          <div>Жиры: {((selectedProduct.fats * grams) / 100).toFixed(2)} г</div>
          <div>Углеводы: {((selectedProduct.carbohydrates * grams) / 100).toFixed(2)} г</div>
          {selectedProduct.glycemicIndex !== undefined && (
            <div>Гликемический индекс: {selectedProduct.glycemicIndex}</div>
          )}
          {selectedProduct.unitWeight !== undefined && selectedProduct.unit && (
            <div>
              Вес в 1 ({selectedProduct.unit}): {selectedProduct.unitWeight} г
            </div>
          )}

          {selectedProduct.measurements && (
            <div className={styles.measurements}>
              {Object.entries(selectedProduct.measurements).map(([measure, value]) => (
                <div key={measure}>
                  Вес в 1 {measurementNames[measure] || measure}: {value.gramsEquivalent} грамм (
                  {value.mlEquivalent} мл)
                </div>
              ))}
            </div>
          )}

          <button className={styles.addButton} onClick={handleAddProduct}>
            Добавить в таблицу
          </button>
        </div>
      )}
    </div>
  );
};
