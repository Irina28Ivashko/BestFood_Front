// страница для добавления категорий и продуктов. только для администратора

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategoriesBJU,
  createCategoryBJU,
  deleteCategoryBJU,
  updateCategoryBJU,
} from '../../redux/slices/categoriesBJU';
import {
  fetchProductsByCategory,
  createProduct,
  deleteProduct,
  updateProduct,
} from '../../redux/slices/products';

import styles from './AddCalculatorBJU.module.scss';

export const AddCalculatorBJU = () => {
  // Состояния для работы с формой добавления категорий
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  // Состояния для управления выбором категории и созданием продукта
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newProductName, setNewProductName] = useState('');
  const [newProductEnergy, setNewProductEnergy] = useState({
    calories: '',
    proteins: '',
    fats: '',
    carbs: '',
  });
  const [newProductDetails, setNewProductDetails] = useState({
    glycemicIndex: '',
    unitWeight: '',
    unit: 'гр',
  });

  const [measurementDetails, setMeasurementDetails] = useState({
    cup: { mlEquivalent: '', gramsEquivalent: '' },
    tablespoon: { mlEquivalent: '', gramsEquivalent: '' },
    teaspoon: { mlEquivalent: '', gramsEquivalent: '' },
  });

  // Состояние для управления показом формы добавления продукта
  const [showProductInput, setShowProductInput] = useState(false);

  const dispatch = useDispatch();
  // Получение списка категорий и продуктов из Redux store
  const categories = useSelector((state) => state.categoriesBJU.items);
  const products = useSelector((state) => state.products.byCategory[selectedCategory] || []);

  // Загрузка списка категорий при монтировании компонента
  useEffect(() => {
    dispatch(fetchCategoriesBJU());
  }, [dispatch]);

  // Определение обработчиков событий для добавления, сохранения и отмены категорий и продуктов
  const handleAddCategoryClick = () => {
    // Показать форму добавления категории
    setShowCategoryInput(true);
  };

  const handleSaveCategoryClick = async () => {
    // Сохранение новой категории
    try {
      await dispatch(createCategoryBJU({ name: newCategoryName })).unwrap();
      setNewCategoryName('');
      setShowCategoryInput(false); // Скрыть форму после сохранения
    } catch (error) {
      console.error('Error saving category: ', error);
    }
  };

  // Отмена добавления категории
  const handleCancelCategoryClick = () => {
    setNewCategoryName('');
    setShowCategoryInput(false);
  };

  // Выбор категории для отображения ее продуктов
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    dispatch(fetchProductsByCategory(categoryId));
  };

  const handleAddProductClick = () => {
    setShowProductInput(true); // Показать форму добавления продукта
  };

  const handleSaveProductClick = async () => {
    // Сохранение нового продукта
    if (
      selectedCategory &&
      newProductName.trim() &&
      newProductEnergy.calories &&
      newProductEnergy.proteins &&
      newProductEnergy.fats &&
      newProductEnergy.carbs
    ) {
      // Формирование данных продукта и отправка запроса на создание
      const productData = {
        category: selectedCategory,
        name: newProductName,
        calories: parseInt(newProductEnergy.calories, 10),
        proteins: parseInt(newProductEnergy.proteins, 10),
        fats: parseInt(newProductEnergy.fats, 10),
        carbohydrates: parseInt(newProductEnergy.carbs, 10),
        glycemicIndex: newProductDetails.glycemicIndex
          ? parseInt(newProductDetails.glycemicIndex, 10)
          : null,
        unitWeight: newProductDetails.unitWeight
          ? parseInt(newProductDetails.unitWeight, 10)
          : null,
        unit: newProductDetails.unit,

        measurements: measurementDetails,

        measurements: {
          cup: {
            ...measurementDetails.cup,
            mlEquivalent: Number(measurementDetails.cup.mlEquivalent),
            gramsEquivalent: Number(measurementDetails.cup.gramsEquivalent),
          },
          tablespoon: {
            ...measurementDetails.tablespoon,
            mlEquivalent: Number(measurementDetails.tablespoon.mlEquivalent),
            gramsEquivalent: Number(measurementDetails.tablespoon.gramsEquivalent),
          },
          teaspoon: {
            ...measurementDetails.teaspoon,
            mlEquivalent: Number(measurementDetails.teaspoon.mlEquivalent),
            gramsEquivalent: Number(measurementDetails.teaspoon.gramsEquivalent),
          },
        },
      };

      try {
        await dispatch(createProduct(productData)).unwrap();

        setNewProductName('');
        setNewProductEnergy({
          calories: '',
          proteins: '',
          fats: '',
          carbs: '',
        });
        setNewProductDetails({ glycemicIndex: '', unitWeight: '', unit: 'гр' });

        setMeasurementDetails({
          cup: { mlEquivalent: '', gramsEquivalent: '' },
          tablespoon: { mlEquivalent: '', gramsEquivalent: '' },
          teaspoon: { mlEquivalent: '', gramsEquivalent: '' },
        });
        setShowProductInput(false);

        // Очистка полей формы и скрытие её
      } catch (error) {
        console.error('Error saving product:', error);
      }
    } else {
      console.error('Please fill all the fields.');
    }
  };

  // Отмена добавления продукта
  const handleCancelProductClick = () => {
    setNewProductName('');
    setNewProductEnergy({ calories: '', proteins: '', fats: '', carbs: '' });
    setShowProductInput(false); // Сброс значений формы
  };

  // удаление категории
  const handleDeleteCategory = async (categoryId) => {
    try {
      await dispatch(deleteCategoryBJU(categoryId)).unwrap();
    } catch (error) {
      console.error('Ошибка при удалении категории:', error);
    }
  };

  // удаление продукта
  const handleDeleteProduct = async (productId) => {
    try {
      await dispatch(deleteProduct(productId)).unwrap();

      dispatch(fetchProductsByCategory(selectedCategory));
    } catch (error) {
      console.error('Ошибка при удалении продукта:', error);
    }
  };

  // реадктивароние категории
  const handleEditCategory = async (category) => {
    const newName = prompt('Введите новое название категории:', category.name);
    if (newName && newName.trim() && newName !== category.name) {
      try {
        await dispatch(
          updateCategoryBJU({ categoryId: category._id, categoryData: { name: newName } }),
        ).unwrap();
        console.log('Категория обновлена успешно');
      } catch (error) {
        console.error('Ошибка при редактировании категории:', error);
      }
    }
  };

  // редактирование продукта
  const handleEditProduct = async (product) => {
    const newName = prompt('Введите новое название продукта:', product.name);
    if (newName && newName.trim() && newName !== product.name) {
      try {
        const productData = {
          // Здесь можно добавить другие поля, которые хотите редактировать
          name: newName,
        };
        await dispatch(updateProduct({ productId: product._id, updateData: productData })).unwrap();
        console.log('Продукт обновлен успешно');
        // Обновляем список продуктов для текущей категории
        dispatch(fetchProductsByCategory(selectedCategory));
      } catch (error) {
        console.error('Ошибка при редактировании продукта:', error);
      }
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: 'lightgrey' }}>
      <div className={styles.categoryCreate}>
        {/* Форма добавления категории */}
        <button onClick={handleAddCategoryClick}>Добавить категорию</button>
        {showCategoryInput && (
          <div>
            <input
              type="text"
              placeholder="Название категории"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <button onClick={handleSaveCategoryClick}>Сохранить</button>
            <button onClick={handleCancelCategoryClick}>Отменить</button>
          </div>
        )}
      </div>

      {/* Список категорий */}
      <div className={styles.categoryList}>
        {categories.map((category) => (
          <div key={category._id} onClick={() => handleCategorySelect(category._id)}>
            {category.name}
            <button onClick={() => handleEditCategory(category)}>Редактировать</button>
            <button onClick={() => handleDeleteCategory(category._id)}>Удалить</button>
          </div>
        ))}
      </div>

      {/* Форма добавления продукта */}
      {selectedCategory && (
        <div className={styles.productSection}>
          <h3>
            Продукты категории: {categories.find((cat) => cat._id === selectedCategory)?.name}
          </h3>
          <button onClick={handleAddProductClick}>Добавить продукт</button>
          {showProductInput && (
            <div>
              <input
                type="text"
                placeholder="Название продукта"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
              />
              <input
                type="number"
                placeholder="Калории на 100г"
                value={newProductEnergy.calories}
                onChange={(e) =>
                  setNewProductEnergy({ ...newProductEnergy, calories: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Белки на 100г"
                value={newProductEnergy.proteins}
                onChange={(e) =>
                  setNewProductEnergy({ ...newProductEnergy, proteins: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Жиры на 100г"
                value={newProductEnergy.fats}
                onChange={(e) => setNewProductEnergy({ ...newProductEnergy, fats: e.target.value })}
              />
              <input
                type="number"
                placeholder="Углеводы на 100г"
                value={newProductEnergy.carbs}
                onChange={(e) =>
                  setNewProductEnergy({ ...newProductEnergy, carbs: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Гликемический индекс"
                value={newProductDetails.glycemicIndex}
                onChange={(e) =>
                  setNewProductDetails({ ...newProductDetails, glycemicIndex: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Вес одной  штук"
                value={newProductDetails.unitWeight}
                onChange={(e) =>
                  setNewProductDetails({ ...newProductDetails, unitWeight: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Стаканы (мл)"
                value={measurementDetails.cup.mlEquivalent}
                onChange={(e) =>
                  setMeasurementDetails({
                    ...measurementDetails,
                    cup: { ...measurementDetails.cup, mlEquivalent: e.target.value },
                  })
                }
              />
              <input
                type="number"
                placeholder="Стаканы (гр)"
                value={measurementDetails.cup.gramsEquivalent}
                onChange={(e) =>
                  setMeasurementDetails({
                    ...measurementDetails,
                    cup: { ...measurementDetails.cup, gramsEquivalent: e.target.value },
                  })
                }
              />
              <input
                type="number"
                placeholder="Ст.л (мл)"
                value={measurementDetails.tablespoon.mlEquivalent}
                onChange={(e) =>
                  setMeasurementDetails({
                    ...measurementDetails,
                    tablespoon: { ...measurementDetails.tablespoon, mlEquivalent: e.target.value },
                  })
                }
              />
              <input
                type="number"
                placeholder="Ст.л (гр)"
                value={measurementDetails.tablespoon.gramsEquivalent}
                onChange={(e) =>
                  setMeasurementDetails({
                    ...measurementDetails,
                    tablespoon: {
                      ...measurementDetails.tablespoon,
                      gramsEquivalent: e.target.value,
                    },
                  })
                }
              />
              <input
                type="number"
                placeholder="Ч.л (мл)"
                value={measurementDetails.teaspoon.mlEquivalent}
                onChange={(e) =>
                  setMeasurementDetails({
                    ...measurementDetails,
                    teaspoon: { ...measurementDetails.teaspoon, mlEquivalent: e.target.value },
                  })
                }
              />
              <input
                type="number"
                placeholder="Ч.л (гр)"
                value={measurementDetails.teaspoon.gramsEquivalent}
                onChange={(e) =>
                  setMeasurementDetails({
                    ...measurementDetails,
                    teaspoon: { ...measurementDetails.teaspoon, gramsEquivalent: e.target.value },
                  })
                }
              />
              <select
                value={newProductDetails.unit}
                onChange={(e) =>
                  setNewProductDetails({ ...newProductDetails, unit: e.target.value })
                }>
                <option value="гр">гр</option>
                <option value="мл">мл</option>
                <option value="ст.л">ст.л</option>
                <option value="ч.л">ч.л</option>
                <option value="шт">шт</option>
                <option value="стакан">стакан</option>
              </select>
              <button onClick={handleSaveProductClick}>Сохранить</button>
              <button onClick={handleCancelProductClick}>Отменить</button>
            </div>
          )}

          {/* Список продуктов выбранной категории */}
          <div>
            {products.map((product) => (
              <div key={product._id}>
                {product.name} - {product.calories || 0} ккал Белки:
                {product.proteins || 0} г, Жиры: {product.fats || 0} г, Углеводы:
                {product.carbohydrates || 0} г Гликемический индекс: {product.glycemicIndex || '-'},
                Вес одной единицы: {product.unitWeight ? `${product.unitWeight}г` : '-'}, Единица
                измерения: {product.unit || '-'}
                <button onClick={() => handleEditProduct(product)}>Редактировать</button>
                <button onClick={() => handleDeleteProduct(product._id)}>Удалить</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
