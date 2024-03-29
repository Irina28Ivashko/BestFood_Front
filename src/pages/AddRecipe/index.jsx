// добавления рецепта. (создания, редактирование, удаления)

import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, Navigate } from 'react-router-dom';

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import { IngredientsInput } from '../../components/IngredientsInput';
import { TagSelector } from '../../components/TagSelector';
import { RecipeSteps } from '../../components/RecipeSteps';
import { RecipeDetails } from '../../components/RecipeDetails';

import 'easymde/dist/easymde.min.css';
import { selectIsAuth } from '../../redux/slices/auth';
import styles from './AddRecipe.module.scss';
import axios from '../../axios';

export const AddRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setLoading] = useState(false);
  const [recipeText, setRecipeText] = useState(''); // Описание рецепта
  const [recipeTitle, setRecipeTitle] = useState(''); // Название рецепта
  const [attemptedSave, setAttemptedSave] = useState(false); //  состояние, если поле для ввода пустое

  const [selectedTags, setSelectedTags] = useState([]);

  const [steps, setSteps] = useState([]); // Добавляем состояние для шагов приготовления
  const [recipeImageUrl, setRecipeImageUrl] = useState(''); // Изображение рецепта
  const [ingredients, setIngredients] = useState([]); // Состояние для хранения ингредиентов
  const inputFileRef = useRef(null);
  const isEditing = Boolean(id);

  // Обработчик изменений для названия рецепта
  const handleRecipeTitleChange = (e) => {
    const newValue = e.target.value;
    // Регулярное выражение, которое допускает только буквы, цифры и пробелы
    const regex = /^[a-zA-Zа-яА-Я0-9\- ]*$/;

    if (regex.test(newValue) || newValue === '') {
      // Добавлена проверка на пустую строку для возможности стирания текста
      setRecipeTitle(newValue);
    } else {
      // Опционально: можно уведомить пользователя о недопустимости спецсимволов
      alert('Название рецепта не должно содержать специальные символы.');
    }
  };

  // Обработка добавления изображения
  const handleChangeFile = async (event) => {
    try {
      const file = event.target.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff'];
      const maxSizeMB = 3; // Максимальный размер файла в МБ
      const maxSizeBytes = maxSizeMB * 1024 * 1024; // Максимальный размер файла в байтах

      if (!allowedTypes.includes(file.type)) {
        alert('Недопустимый тип файла. Разрешены только изображения (JPEG, PNG, GIF, BMP, TIFF).');
        return; // Прекращаем выполнение функции, если тип файла недопустим
      }

      if (file.size > maxSizeBytes) {
        alert(`Размер файла превышает ${maxSizeMB} МБ. Пожалуйста, выберите другой файл.`);
        return; // Прекращаем выполнение функции, если файл слишком большой
      }

      const formData = new FormData();
      formData.append('image', file);

      // Отправка файла на сервер
      const { data } = await axios.post('/upload', formData);

      // Обновление URL изображения рецепта с учетом нового изображения
      setRecipeImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при загрузке файла!');
    }
  };

  // Удаление изображения
  const onClickRemoveImage = () => {
    setRecipeImageUrl('');
  };

  // Загрузка данных для редактирования
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      axios
        .get(`/recipes/${id}`)
        .then(({ data }) => {
          setRecipeTitle(data.title);
          setRecipeText(data.text);
          setRecipeImageUrl(data.imageUrl);
          setSelectedTags(data.tags);
          setIngredients(data.ingredients || []);
          setSteps(data.stepByStepInstructions || []);

          // Обновление времени приготовления и порций
          const hours = Math.floor(data.cookingTime / 60);
          const minutes = data.cookingTime % 60;
          const portions = data.portionsCount;
          setDetails({ hours, minutes, portions });
        })
        .catch((err) => {
          console.warn(err);
          alert('Ошибка при получении рецепта!');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isEditing]);

  // Обработчики изменений для дополнительных компонентов
  const handleTagsChange = (newTags) => setSelectedTags(newTags);
  const handleIngredientsChange = (newIngredients) => setIngredients(newIngredients); // Обновление списка ингредиентов
  const handleStepsChange = (updatedSteps) => setSteps(updatedSteps); //  для обновления шагов приготовления
  const handleDetailsChange = (newDetails) => setDetails(newDetails); //  для обновления деталей рецепта

  // Состояние для хранения деталей рецепта (кол-во порций и время приг-я)
  const [details, setDetails] = useState({
    portions: 2,
    hours: 0,
    minutes: 30,
  });

  // Определение каталога рецептов из вашего существующего каталога
  const catalog = {
    'По категориям блюд': [
      'Закуски',
      'Салаты',
      'Супы и бульоны',
      'Основные блюда',
      'Десерты',
      'Изделия из теста',
      'Соуса',
      'Напитки',
    ],
    'Блюда на каждый день': ['Завтрак', 'Обед', 'Полдник', 'Ужин'],
    'По праздникам': ['Новый год', 'День рождения', 'Масленица', 'Пасха'],
    'По способу приготовления': [
      'Гриль и барбекю',
      'Запеченные блюда',
      'Тушенные блюда',
      'Варенные блюда',
      'Жаренные блюда',
      'Замороженные блюда',
    ],
    'Тип питания': ['Детское меню', 'Вегетарианское меню', 'Диетическое меню', 'Здоровое питание'],
  };

  // Функция отправки формы
  const onSubmit = async () => {
    setAttemptedSave(true); // Активируем режим проверки валидации

    if (recipeTitle.length < 3 || recipeText.length < 10) {
      // Если условия не удовлетворены, прерываем выполнение функции
      return;
    }

    try {
      setLoading(true);

      // Подготовка данных ингредиентов, включая преобразование в формат, ожидаемый сервером
      const preparedIngredients = ingredients.map((ingredient) => ({
        product: ingredient.productId, // Используем ID вместо названия
        amount: ingredient.amount,
        unit: ingredient.unit,
      }));

      const totalMinutes = details.hours * 60 + details.minutes; // Преобразование в минуты

      const fields = {
        title: recipeTitle,
        imageUrl: recipeImageUrl,
        tags: selectedTags,
        text: recipeText,
        ingredients: preparedIngredients,
        stepByStepInstructions: steps,
        cookingTime: totalMinutes, // Добавляем время приготовления в минутах
        portionsCount: details.portions,
      };

      const { data } = isEditing
        ? await axios.patch(`/recipes/${id}`, fields)
        : await axios.post('/recipes', fields);

      // navigate('/');

      const _id = isEditing ? id : data._id;

      navigate(`/recipes/${_id}`);
      //navigate(`/recipes/${isEditing ? id : data._id}`);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при создании рецепта!');
    } finally {
      setLoading(false);
    }
  };

  // Вычисляем, нужно ли применять стиль ошибки к полям
  const shouldHighlightError = (fieldValue, minLength) =>
    attemptedSave && fieldValue.length < minLength;

  // Проверка аутентификации
  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper className={styles.container}>
      <h2 className={styles.title}>Ваш новый рецепт:</h2>
      {/* Кнопка для загрузки изображения */}
      <div className={styles.uploadSection}>
        <Button
          onClick={() => inputFileRef.current.click()}
          variant="outlined"
          size="large"
          className={styles.uploadButton}>
          Загрузить изображение
        </Button>
        <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
        {recipeImageUrl && (
          <>
            <Button
              variant="contained"
              color="error"
              onClick={onClickRemoveImage}
              className={styles.deleteButton}>
              Удалить
            </Button>

            <img
              className={styles.image}
              src={`https://bestfood-back-2qsm.onrender.com${recipeImageUrl}`}
              alt="Uploaded"
            />
          </>
        )}
      </div>

      {/* Поля для ввода названия */}
      <TextField
        className={styles.recipeTitleField}
        InputProps={{
          style: shouldHighlightError(recipeTitle, 3) ? { borderBottom: '2px solid red' } : {},
        }}
        variant="standard"
        placeholder="Название рецепта..."
        value={recipeTitle}
        onChange={handleRecipeTitleChange}
        // onChange={(e) => setRecipeTitle(e.target.value)}
        fullWidth
        helperText={
          shouldHighlightError(recipeTitle, 3) ? 'Минимальная длинна ввода 3 символа' : ''
        }
        inputProps={{ maxLength: 50 }} // Ограничение количества символов до 100
      />

      {/* Описание рецепта */}

      <div className={styles.centeredTextField}>
        <TextField
          className={styles.textField}
          style={{ border: shouldHighlightError(recipeText, 10) ? '2px solid red' : '' }}
          variant="outlined"
          multiline
          rows={6}
          placeholder="Введите описание рецепта здесь..."
          value={recipeText}
          onChange={(e) => setRecipeText(e.target.value)}
          fullWidth
          helperText={
            shouldHighlightError(recipeText, 10) ? 'Минимальная длинна ввода 10 символов' : ''
          }
        />
      </div>

      <div className={styles.wordCount}>{recipeText.length}/300</div>

      {/* Компонент для указания времени приготовления  рецепта и количества порций */}
      <RecipeDetails initialDetails={details} onDetailsChange={handleDetailsChange} />
      {/* Используем компонент TagSelector для выбора тэгов */}
      <TagSelector initialTags={selectedTags} catalog={catalog} onTagsChange={handleTagsChange} />

      {/* Используем компонент IngredientsInput */}
      <IngredientsInput
        initialIngredients={ingredients}
        onIngredientsChange={handleIngredientsChange}
      />

      {/* Компонент для добавления шагов рецепта */}
      <RecipeSteps initialSteps={steps} onStepsChange={handleStepsChange} />

      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Сохранить рецепт' : 'Сохранить рецепт'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
