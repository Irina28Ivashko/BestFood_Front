// Добавление продуктов при создании рецепта. используем поиск по названию продукта, выбираем из получен. результ.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchProducts, searchResultsSelector } from '../../redux/slices/products';

import {
  TextField,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import styles from './IngredientsInput.module.scss';

export const IngredientsInput = ({ initialIngredients, onIngredientsChange }) => {
  // Создание состояния для хранения списка ингредиентов, с инициализацией количества

  const [ingredients, setIngredients] = useState(
    initialIngredients.map((ingredient) => ({
      ...ingredient,
      searchTerm: '',
      searchResults: [],
    })) || [{ name: '', amount: 0, unit: 'гр', searchTerm: '', searchResults: [] }],
  );

  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const searchTermsRef = useRef(ingredients.map((ingredient) => ingredient.name));

  const [invalidAmountIndices, setInvalidAmountIndices] = useState([]);
  const [invalidIngredientIndices, setInvalidIngredientIndices] = useState([]);
  // Использование селектора для получения результатов поиска
  const searchResults = useSelector(searchResultsSelector);

  useEffect(() => {
    // Обновляем результаты поиска для каждого ингредиента при изменении его поискового запроса
    ingredients.forEach((ingredient, index) => {
      if (searchTermsRef.current[index] !== ingredient.name) {
        const searchTerm = searchTermsRef.current[index];
        if (searchTerm) {
          dispatch(searchProducts(searchTerm)).then((action) => {
            if (action.payload) {
              setIngredients((currentIngredients) =>
                currentIngredients.map((ing, i) =>
                  i === index ? { ...ing, searchResults: action.payload } : ing,
                ),
              );
            }
          });
        } else {
          setIngredients((currentIngredients) =>
            currentIngredients.map((ing, i) => (i === index ? { ...ing, searchResults: [] } : ing)),
          );
        }
      }
    });
  }, [dispatch, ingredients.length]);

  //  для обработки изменений в полях ингредиентов, единиц измерения и кол-ва
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];

    if (field === 'amount') {
      // Разрешаем ввод чисел, точки, но убираем все остальные символы, кроме одной точки и чисел
      const sanitizedValue = value.replace(/[^\d.]/g, '').replace(/^(\d*\.?)|(\d*)\.?/g, '$1$2');

      // Если первый символ - точка, добавляем 0 перед ней
      const finalValue = sanitizedValue.startsWith('.') ? `0${sanitizedValue}` : sanitizedValue;

      // Ограничиваем значение максимумом и минимумом, преобразуем в число для проверки
      let numericValue = parseFloat(finalValue);
      numericValue = isNaN(numericValue) ? 0 : Math.max(0, Math.min(100000, numericValue));

      // Обновляем состояние
      newIngredients[index][field] = numericValue.toString();

      // Обновляем индексы невалидных полей, если число невалидно
      const isInvalid = numericValue <= 0;
      setInvalidAmountIndices((current) =>
        isInvalid ? [...current, index] : current.filter((i) => i !== index),
      );
    } else {
      newIngredients[index][field] = value;
    }

    setIngredients(newIngredients);
    onIngredientsChange(newIngredients);
  };

  //  для добавления нового ингредиента
  const addIngredient = () => {
    if (ingredients.length >= 25) {
      // Если количество ингредиентов достигло 25, показываем уведомление
      alert('Максимальное количество ингредиентов к одному рецепту - 25.');
    } else {
      setIngredients([
        ...ingredients,
        { name: '', amount: 0, unit: 'гр', searchTerm: '', searchResults: [] },
      ]);
    }
  };

  // ф-я для удаления ингредиента
  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
    onIngredientsChange(newIngredients); //  обновленноу состояние род. компонента
  };

  // Функция для обновления поискового запроса и выполнения поиска
  const handleSearchChange = (index, value) => {
    // Обновляем поисковый запрос и результаты поиска для текущего ингредиента
    setIngredients((currentIngredients) =>
      currentIngredients.map((ingredient, i) =>
        i === index ? { ...ingredient, searchTerm: value } : ingredient,
      ),
    );

    // Теперь отправляем запрос на сервер, если значение не пустое
    if (value.trim()) {
      dispatch(searchProducts(value.trim())).then((action) => {
        if (action.payload) {
          // Только обновляем результаты поиска для текущего ингредиента
          setIngredients((currentIngredients) =>
            currentIngredients.map((ingredient, i) =>
              i === index ? { ...ingredient, searchResults: action.payload } : ingredient,
            ),
          );
        }
      });
    } else {
      // Очищаем результаты поиска, если строка поиска пуста
      setIngredients((currentIngredients) =>
        currentIngredients.map((ingredient, i) =>
          i === index ? { ...ingredient, searchResults: [] } : ingredient,
        ),
      );
    }
  };

  //  для обработки выбора продукта из результатов поиска
  const handleSelectProduct = useCallback(
    (index, product) => {
      // Проверяем, существует ли уже продукт с таким же названием в списке ингредиентов
      const isProductAlreadyAdded = ingredients.some(
        (ingredient) => ingredient.name === product.name,
      );

      if (isProductAlreadyAdded) {
        // Если продукт уже добавлен, показываем уведомление и не добавляем его повторно
        alert(`Продукт "${product.name}" уже добавлен в рецепт!`);
      } else {
        // Если продукт ещё не добавлен, добавляем его в список
        setIngredients((currentIngredients) =>
          currentIngredients.map((ingredient, i) =>
            i === index
              ? {
                  ...ingredient,
                  productId: product._id,
                  name: product.name,
                  calories: product.calories,
                  proteins: product.proteins,
                  fats: product.fats,
                  carbohydrates: product.carbohydrates,
                  searchTerm: product.name,
                  searchResults: [],
                  unit: product.unit || 'гр',
                  unitWeight: product.unitWeight || 1,
                }
              : ingredient,
          ),
        );
      }
    },
    [ingredients],
  );

  return (
    <div className={styles.ingredientsContainer}>
      <h3>Ингредиенты</h3>
      {ingredients.map((ingredient, index) => (
        <div key={index} className={styles.ingredientRow}>
          {/*  поле для ввода названия ингредиента */}
          <TextField
            className={styles.ingredientName}
            label="Укажите ингредиент"
            inputProps={{
              maxLength: 50, // Ограничение длины ввода до 50 символов
            }}
            value={ingredient.searchTerm}
            onChange={(e) => handleSearchChange(index, e.target.value)}
            fullWidth
          />

          {/* Отображение результатов поиска */}

          {ingredient.searchTerm && ingredient.searchResults.length > 0 && (
            <List dense className={styles.searchResultsList}>
              {ingredient.searchResults.map((product) => (
                <ListItem
                  key={product._id}
                  button
                  onClick={() => handleSelectProduct(index, product)}>
                  <ListItemText primary={product.name} />
                </ListItem>
              ))}
            </List>
          )}

          {/* Поле для ввода количества ингредиента */}
          <TextField
            // className={styles.ingredientAmount}
            className={`${styles.ingredientAmount} ${
              invalidAmountIndices.includes(index) ? styles.invalidInput : ''
            }`}
            label="Количество"
            type="number"
            value={ingredient.amount}
            onChange={(e) =>
              handleIngredientChange(index, 'amount', e.target.value.replace(/^0+/, ''))
            } // Удаляем ведущие нули
            // onChange={(e) => handleIngredientChange(index, 'amount', Number(e.target.value))}
            InputProps={{ inputProps: { min: 0, max: 100000 } }}
            error={invalidAmountIndices.includes(index)}
          />

          {/* делаем выпадающий список для выбора единицы измерения */}
          <FormControl className={styles.ingredientUnit}>
            <InputLabel>ЕД. ИЗМ.</InputLabel>
            <Select
              value={ingredient.unit}
              onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
              label="ЕД. ИЗМ.">
              <MenuItem value="гр">гр</MenuItem>
              <MenuItem value="мл">мл</MenuItem>
              <MenuItem value="ст.л">ст.л</MenuItem>
              <MenuItem value="ч.л">ч.л</MenuItem>
              <MenuItem value="шт">шт</MenuItem>
              <MenuItem value="стакан">стакан</MenuItem>
            </Select>
          </FormControl>
          {/* Кнопка для удаления ингредиента */}
          <IconButton onClick={() => removeIngredient(index)} className={styles.deleteButton}>
            <CloseIcon />
          </IconButton>
        </div>
      ))}
      {/* Кнопка для добавления нового ингредиента */}
      <Button variant="contained" className={styles.addIngredientButton} onClick={addIngredient}>
        Добавить ингредиент
      </Button>
    </div>
  );
};
