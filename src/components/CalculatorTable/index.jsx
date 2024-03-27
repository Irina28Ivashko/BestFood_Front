// таблица калькулятор

import React, { useState, useEffect } from 'react';

import styles from './CalculatorTable.module.scss';

export const CalculatorTable = ({ products, setProducts }) => {
  // Состояние для хранения итоговых значений по всем продуктам
  const [total, setTotal] = useState({
    grams: 0, // Общий вес в граммах
    calories: 0, // калории
    proteins: 0, // белки
    fats: 0, // жиры
    carbohydrates: 0, // углеводы
  });

  // Функция добавления продукта в таблицу. Возвращает true, если продукт добавлен, и false, если такой продукт уже есть
  const onAddToTable = (productToAdd) => {
    if (products.some((product) => product.id === productToAdd.id)) {
      // Продукт уже есть, не добавляем его и возвращаем false
      return false;
    } else {
      // Добавляем продукт и возвращаем true
      setProducts((prevProducts) => [...prevProducts, productToAdd]);
      return true;
    }
  };

  const addProductFromList = (newProduct, grams) => {
    setProducts((prevProducts) => [...prevProducts, { ...newProduct, grams }]);
  };

  // Функция для удаления продукта из списка по индексу
  const handleRemoveProduct = (index) => {
    setProducts((prevProducts) => prevProducts.filter((_, i) => i !== index));
  };

  // const handleChange = (index, field, value) => {
  //   setProducts((prevProducts) =>
  //     prevProducts.map((product, i) => (i === index ? { ...product, [field]: value } : product)),
  //   );
  // };

  // Функция для пересчета итоговых значений
  useEffect(() => {
    const newTotal = products.reduce(
      (acc, product) => ({
        grams: acc.grams + Number(product.grams || 0),
        calories: acc.calories + (Number(product.calories) * Number(product.grams || 0)) / 100,
        proteins: acc.proteins + (Number(product.proteins) * Number(product.grams || 0)) / 100,
        fats: acc.fats + (Number(product.fats) * Number(product.grams || 0)) / 100,
        carbohydrates:
          acc.carbohydrates + (Number(product.carbohydrates) * Number(product.grams || 0)) / 100,
      }),
      { grams: 0, calories: 0, proteins: 0, fats: 0, carbohydrates: 0 },
    );
    setTotal(newTotal);
  }, [products]);

  // Обработчик изменения значений в инпутах для граммов
  const handleChangeGrams = (index, value) => {
    const newGrams = Number(value) || 0;
    setProducts((prev) =>
      prev.map((product, i) => (i === index ? { ...product, grams: newGrams } : product)),
    );

    // Используйте регулярное выражение для проверки, является ли ввод только числом
    const isOnlyDigits = /^\d+$/.test(value);
    const grams = isOnlyDigits ? parseInt(value, 10) : 0;

    // обновляем продукты только если ввод является положительным числом
    const updatedProducts = products.map((product, i) =>
      i === index ? { ...product, grams: grams } : product,
    );
    setProducts(updatedProducts);
  };

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.title}>Калькулятор калорийности продуктов</h2>
      <table>
        <thead>
          <tr>
            <th className={styles.productColumn}>Продукт</th>
            <th className={styles.gramsColumn}>Грамм</th>
            <th>Ккал</th>
            <th>Белков (г)</th>
            <th>Жиров (г)</th>
            <th>Углеводов (г)</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {/* Отображение списка продуктов */}
          {products &&
            products.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>

                <td>
                  <input
                    type="number"
                    className={styles.input}
                    value={product.grams}
                    // value={product.grams || ''}
                    onChange={(e) => handleChangeGrams(index, e.target.value)}
                    min="0" //  ограничение на минимальное значение
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, ''); //  для предотвращения ввода нечисловых символов
                    }}
                  />
                </td>

                {/* Отображение рассчитанных значений для каждого продукта */}
                <td>{((product.calories * product.grams) / 100).toFixed(2)}</td>
                <td>{((product.proteins * product.grams) / 100).toFixed(2)}</td>
                <td>{((product.fats * product.grams) / 100).toFixed(2)}</td>
                <td>{((product.carbohydrates * product.grams) / 100).toFixed(2)}</td>

                <td>
                  {/* Кнопка удаления продукта из списка */}
                  <button onClick={() => handleRemoveProduct(index)}>Удалить</button>
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot>
          {/* Итоговые значения по всем продуктам */}
          <tr>
            <td>Всего</td>
            <td>{total.grams} </td>
            <td>{total.calories.toFixed(2)} </td>
            <td>{total.proteins.toFixed(2)} </td>
            <td>{total.fats.toFixed(2)} </td>
            <td>{total.carbohydrates.toFixed(2)} </td>
          </tr>

          {/* Итоговые значения на 100 г продукта */}
          <tr>
            <td>Всего на 100 г</td>
            <td>100 </td>
            <td>{total.grams > 0 ? (total.calories / (total.grams / 100)).toFixed(2) : 0} </td>
            <td>{total.grams > 0 ? (total.proteins / (total.grams / 100)).toFixed(2) : 0} </td>
            <td>{total.grams > 0 ? (total.fats / (total.grams / 100)).toFixed(2) : 0} </td>
            <td>{total.grams > 0 ? (total.carbohydrates / (total.grams / 100)).toFixed(2) : 0}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
