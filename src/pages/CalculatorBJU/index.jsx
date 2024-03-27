// калькулятор энергетической ценности продуктов

import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setActiveCategoryId, fetchProductsByIds } from '../../redux/slices/products';

import { SearchProduct } from '../../components/SearchProduct';
import { CalculatorTable } from '../../components/CalculatorTable';
import { CategoryProductSel } from '../../components/CategoryProductSel';
import { FoundProductsTable } from '../../components/FoundProductsTable';

export const CalculatorBJU = () => {
  const dispatch = useDispatch();

  // Определение, является ли текущий пользователь администратором
  const isAdmin = useSelector((state) => state.auth.data?.isAdmin);

  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [products, setProducts] = useState([]);

  // Используем новое состояние activeCategoryId из Redux для управления видимостью
  const activeCategoryId = useSelector((state) => state.products.activeCategoryId);

  // Загрузка продуктов по идентификаторам при изменении списка идентификаторов
  useEffect(() => {
    if (selectedProductIds.length > 0) {
      dispatch(fetchProductsByIds(selectedProductIds)).then((response) => {
        // Проверяем, что операция выполнена успешно
        if (response.meta.requestStatus === 'fulfilled') {
          setSelectedProducts(response.payload);
        } else {
          // Обработка ошибки или невыполненного запроса
          console.error('Ошибка при загрузке продуктов:', response.error);
        }
      });
    }
  }, [selectedProductIds, dispatch]);

  // Обработчик для установки активной категории
  const handleSelectCategory = useCallback(
    (categoryId) => {
      dispatch(setActiveCategoryId(categoryId === activeCategoryId ? null : categoryId));
    },
    [dispatch, activeCategoryId],
  );

  const handleApplySelectedProducts = useCallback(
    (productIds) => {
      if (productIds.length > 0) {
        dispatch(fetchProductsByIds(productIds)).then((actionResult) => {
          if (actionResult.meta.requestStatus === 'fulfilled') {
            setSelectedProducts(actionResult.payload);
          } else {
            console.error('Ошибка при загрузке продуктов:', actionResult.error);
          }
        });
      } else {
        setSelectedProducts([]); // Очистка списка, если не выбрано ни одного продукта
      }
    },
    [dispatch],
  );

  // для добвления продута в список продуктов в CalculatorTable
  const handleAddProductToList = useCallback(
    (productToAdd) => {
      // Проверяем, есть ли уже продукт с таким ID в списке
      const isProductAlreadyAdded = products.some((product) => product._id === productToAdd._id);

      if (isProductAlreadyAdded) {
        alert('Выбранный продукт уже добавлен в таблицу!');
        return false;
      } else {
        // Добавление и обновление информации о продукте для расчета
        const updatedProduct = {
          ...productToAdd,
          calories: (productToAdd.calories * productToAdd.grams) / 100,
          proteins: (productToAdd.proteins * productToAdd.grams) / 100,
          fats: (productToAdd.fats * productToAdd.grams) / 100,
          carbohydrates: (productToAdd.carbohydrates * productToAdd.grams) / 100,
        };

        setProducts((prevProducts) => [...prevProducts, updatedProduct]);
        return true;
      }
    },
    [products],
  );

  return (
    <div>
      {/*  поиск по продуктам */}
      <SearchProduct onAddToTable={handleAddProductToList} />

      {/* Компонент калькулятора */}
      <CalculatorTable
        products={products}
        setProducts={setProducts}
        onAddToTable={handleAddProductToList}
      />

      {/* выбор продуктов по категории */}
      <CategoryProductSel
        onSelectCategory={handleSelectCategory}
        onApplySelectedProducts={handleApplySelectedProducts}
      />

      {/* просмотр энерегетической ценности продуктов */}
      <FoundProductsTable products={selectedProducts} onAddToTable={handleAddProductToList} />

      {/* Контент страницы калькулятора */}
      {isAdmin && (
        <button onClick={() => navigate('/add-calculator')}>Добавить категории и продукты</button>
      )}
    </div>
  );
};
