// полный рецепт

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../../axios';

import styles from './FullRecipe.module.scss';
import {
  addRecipeToFavorites,
  removeRecipeFromFavorites,
  fetchFavoriteRecipes,
  addRecipeToLikes,
  removeRecipeFromLikes,
} from '../../redux/slices/auth';

import { useNotification } from '../../context/Notification'; // окно с уведомлением
import { fetchComments, clearComments } from '../../redux/slices/comments'; //комментарии (редактирование и удаление)
import { Recipe } from '../../components/Recipe'; // рецепт
import { UserInfo } from '../../components/UserInfo'; // инфо об авторе рецепта
import { EnergyValue } from '../../components/EnergyValue'; //энерегетическая ценность продуктов
import { IngredientsWithPortions } from '../../components/IngredientsWithPortions'; // продукты и их вес
import { CommentsBlock } from '../../components/CommentsBlock'; // комментарии
import { AddComment } from '../../components/AddComment'; //создание комментария

//  иконки
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder'; //Лайки
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'; //комментарии
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined'; //просмотры
import TimerIcon from '@mui/icons-material/Timer'; //время приготовления
import BookmarkIcon from '@mui/icons-material/BookmarkBorder'; //закладка

export const FullRecipe = ({ likesCount }) => {
  const dispatch = useDispatch();
  const [recipeData, setRecipeData] = useState(null); // Состояние для хранения данных
  const [isLoading, setLoading] = useState(true); // Индикатор загрузки
  const { id } = useParams(); // ID рецепта

  const [error, setError] = useState(null); // Состояние для хранения возможной ошибки
  const [openAuthDialog, setOpenAuthDialog] = useState(false); // Управление диалогом аутентификации
  const isAuth = useSelector((state) => !!state.auth.data); // Проверка на аутентификацию пользователя

  const [likes, setLikes] = useState(likesCount); // Состояние для управления лайками рецепта
  const favoriteRecipes = useSelector((state) => state.auth.favoriteRecipes); // Избранные рецепты пользователя
  const likeRecipes = useSelector((state) => state.auth.likeRecipes); // Рецепты, на которые пользователь поставил лайк
  const { showNotification } = useNotification(); // Функция для отображения уведомлений

  const [isFavorite, setIsFavorite] = useState(false); // Проверка, добавлен ли рецепт в избранное
  const [isLike, setIsLike] = useState(false); // Проверка, поставлен ли лайк рецепту пользователем

  const { items: comments, status: commentsStatus } = useSelector((state) => state.comments);
  const [ingredients, setIngredients] = useState([]);
  const [nutritionValues, setNutritionValues] = useState({
    calories: 0,
    proteins: 0,
    fats: 0,
    carbs: 0,
  });

  // Загрузка данных о рецепте и комментариях
  useEffect(() => {
    const fetchRecipe = async () => {
      // Асинхронная функция для получения данных о рецепте
      try {
        const response = await axios.get(`/recipes/${id}`);

        const recipeData = response.data; // Сохраняем данные рецепта

        setRecipeData(recipeData);

        setLikes(response.data.likesCount); // начальное количество лайков
        setIsLike(likeRecipes.some((like) => like._id === response.data._id));
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Произошла ошибка при загрузке рецепта');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
      // Загрузка комментариев для текущего рецепта
      dispatch(fetchComments({ contentId: id, contentType: 'recipe' }));

      return () => {
        // Очистка комментариев при уходе с страницы
        dispatch(clearComments());
      };
    } else {
      setError('ID рецепта не определён');
      setLoading(false);
    }
  }, [id, dispatch, likeRecipes]);

  useEffect(() => {
    if (recipeData) {
      // Устанавливаем значения питательных веществ, полученные с сервера
      setNutritionValues({
        calories: recipeData.totalCalories.toFixed(2),
        proteins: recipeData.totalProteins.toFixed(2),
        fats: recipeData.totalFats.toFixed(2),
        carbs: recipeData.totalCarbohydrates.toFixed(2),
      });
    }
  }, [recipeData]);

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchFavoriteRecipes());
    }
  }, [dispatch, isAuth]);

  useEffect(() => {
    // После загрузки данных о рецепте
    if (recipeData) {
      // Установка начального количества лайков
      setLikes(recipeData.likesCount);

      // Проверяем, ставил ли пользователь лайк на этот рецепт
      setIsLike(likeRecipes.some((like) => like._id === recipeData._id));
      // Обновляем состояние isFavorite, когда изменяется список избранных рецептов
      setIsFavorite(favoriteRecipes.some((favorite) => favorite._id === id));
    }
  }, [recipeData, likeRecipes, favoriteRecipes, id]);

  // Функция для форматирования времени приготовления
  const formatCookingTime = (totalMinutes) => {
    if (!totalMinutes || totalMinutes <= 0 || isNaN(totalMinutes)) return 'Время не указано';

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours > 0 ? `${hours} ч ` : ''}${minutes} мин`;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !recipeData) {
    return <div>Ошибка: {error || 'Рецепт не найден.'}</div>;
  }

  // Проверка на наличие деталей рецепта
  const hasDetails = recipeData.details && recipeData.details.portions;

  // Обработчики для добавления/удаления из избранного и лайков
  const handleFavoriteClick = () => {
    if (!isAuth) {
      showNotification();
      return;
    }
    // Логика добавления в избранное...
    if (isFavorite) {
      dispatch(removeRecipeFromFavorites(id));
    } else {
      dispatch(addRecipeToFavorites(id));
    }
    setIsFavorite(!isFavorite);
  };

  // лайки увеличение и уменьшение
  const handleLikeClick = () => {
    if (!isAuth) {
      showNotification();
      return;
    }
    // Логика лайка...
    const newLikesCount = isLike ? likes - 1 : likes + 1;
    setLikes(newLikesCount);

    if (isLike) {
      dispatch(removeRecipeFromLikes(id));
    } else {
      dispatch(addRecipeToLikes(id));
    }
    setIsLike(!isLike);
  };

  return (
    <div className={styles.fullRecipe}>
      {error ? (
        <div>Ошибка: {error}</div>
      ) : isLoading ? (
        <div>Loading...</div>
      ) : recipeData ? (
        <>
          {/* информация о рецепте */}
          <Recipe
            id={recipeData._id}
            title={recipeData.title}
            imageUrl={recipeData.imageUrl ? `http://localhost:4445${recipeData.imageUrl}` : ''}
            user={recipeData.user}
            createdAt={recipeData.createdAt}
            tags={recipeData.tags}
            viewsCount={recipeData.viewsCount}
            likesCount={recipeData.likesCount}
            commentsCount={recipeData.commentsCount}
            BookmarkIcon={recipeData.bookmarkIcon}
            cookingTime={recipeData.cookingTime}
            isFullRecipe>
            {/* Описание рецепта */}
            <div className={styles.descriptionContainer}>
              <div className={styles.description}>{recipeData.text}</div>
            </div>

            {/* ифно об авторе рецепта */}
            <div className={styles.authorInfo}>
              <h3 className={styles.authorTitle}>Автор рецепта</h3>
              <UserInfo {...recipeData.user} additionalText={recipeData.createdAt} />
            </div>
          </Recipe>

          {/* добавить в избранное  */}
          <div className={styles.recipeDetails}>
            <IconButton onClick={handleFavoriteClick}>
              <BookmarkIcon className={isFavorite ? styles.added : ''} />
            </IconButton>

            {/* инфо о просмотрах  */}
            <EyeIcon />
            <span>{recipeData.viewsCount}</span>

            {/*  для добавления likes */}
            <IconButton onClick={handleLikeClick}>
              <FavoriteIcon className={isLike ? styles.liked : ''} />
              {likes > 0 && <span>{likes}</span>} {/* Отображение количества лайков */}
            </IconButton>

            {/* инфо о комментариях */}
            <CommentIcon />
            <span>{recipeData.commentsCount}</span>
          </div>

          {/* Энерге. ценность */}
          <EnergyValue
            calories={nutritionValues.calories}
            proteins={nutritionValues.proteins}
            fats={nutritionValues.fats}
            carbs={nutritionValues.carbs}
          />
          {/* Ингредиенты с учетом количества порций */}
          <IngredientsWithPortions
            initialIngredients={recipeData.ingredients}
            initialPortions={recipeData.portionsCount}
          />

          {/* Раздел инструкций по приготовлению */}
          <div className={styles.instructionsContainer}>
            <div className={styles.instructionsHeader}>
              <h2 className={styles.instructionsTitle}>ИНСТРУКЦИЯ ПРИГОТОВЛЕНИЯ</h2>
              {/* Отображение времени приготовления */}
              <div className={styles.cookingTimeInfo}>
                <TimerIcon className={styles.timerIcon} />

                <span>
                  {recipeData.cookingTime
                    ? formatCookingTime(recipeData.cookingTime)
                    : 'Время не указано'}
                </span>
              </div>
            </div>

            {/* шаги приготовления */}
            {recipeData.stepByStepInstructions.map((step, index) => (
              <div key={index} className={styles.step}>
                <div className={styles.stepTitle}>{`Шаг ${index + 1}:`}</div>
                {step.imageUrl && (
                  <img src={step.imageUrl} alt={`Шаг ${index + 1}`} className={styles.stepImage} />
                )}
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>

          {/* комментарии пользователей */}
          <CommentsBlock
            user={recipeData.user}
            contentId={recipeData._id}
            contentType="recipe"
            isLoading={commentsStatus === 'loading'}
            comments={comments.comments}
          />

          {/* шаблон добавления комментария */}
          <AddComment
            user={recipeData.user}
            contentId={recipeData._id}
            contentType="recipe"
            onUnauthorized={() => setOpenAuthDialog(true)}
          />
        </>
      ) : (
        <div>Рецепт не найден.</div>
      )}
    </div>
  );
};
