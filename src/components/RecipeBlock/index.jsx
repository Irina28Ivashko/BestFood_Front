// карточка рецепта

import React, { useEffect, useState } from 'react';
import styles from './RecipeBlock.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNotification } from '../../context/Notification';

import {
  addRecipeToFavorites,
  removeRecipeFromFavorites,
  fetchFavoriteRecipes,
  addRecipeToLikes,
  removeRecipeFromLikes,
  fetchLikeRecipes,
} from '../../redux/slices/auth'; // Импорт действия для обновления избранных рецептов
import { fetchRemoveRecipe } from '../../redux/slices/recipes';

import { ColorTag } from '../ColorTag';
import { RecipeSkeleton } from './Skeleton';

//Иконоки

import CalculatorIcon from '@mui/icons-material/Calculate'; // калории
import TimerIcon from '@mui/icons-material/Timer'; //таймер (время приготовления)
import BookmarkIcon from '@mui/icons-material/BookmarkBorder'; //избранное
import FavoriteIcon from '@mui/icons-material/FavoriteBorder'; // лайк
import CommentIcon from '@mui/icons-material/ChatBubbleOutline'; // комментарии
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined'; // Добавленная иконка для просмотров
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit'; // редактирование
import DeleteIcon from '@mui/icons-material/Clear'; // удаление

export const RecipeBlock = ({
  id,
  title,
  text,
  imageUrl,
  isAuthor,
  calories,
  formattedCookingTime,
  viewsCount,
  commentsCount,
  isLoading,
  likesCount,
  tags,
}) => {
  const dispatch = useDispatch();

  const isAuth = useSelector((state) => !!state.auth.data); // Проверка, авторизован ли пользователь
  const favoriteRecipes = useSelector((state) => state.auth.favoriteRecipes); // Список избранных рецептов пользователя
  const likeRecipes = useSelector((state) => state.auth.likeRecipes); // Список рецептов, на которые пользователь поставил лайк
  const [likes, setLikes] = useState(likesCount); // Локальное состояние для учета лайков

  // Проверка, находится ли текущий рецепт в избранном
  const [isFavorite, setIsFavorite] = useState(
    isAuth && favoriteRecipes.some((recipe) => recipe._id === id),
  );

  // Проверка, поставлен ли лайк на текущий рецепт
  const [isLike, setIsLike] = useState(isAuth && likeRecipes.some((recipe) => recipe._id === id));

  const authStatus = useSelector((state) => state.auth.status); // Статус аутентификации
  const navigate = useNavigate();

  const { showNotification } = useNotification();

  // Загрузка списка избранных и лайкнутых рецептов
  useEffect(() => {
    if (isAuth) {
      dispatch(fetchFavoriteRecipes());
      dispatch(fetchLikeRecipes());
    }
  }, [dispatch, isAuth]);

  // Обновление статуса "избранное" и лайк
  useEffect(() => {
    setIsFavorite(favoriteRecipes.some((recipe) => recipe._id === id));
    setIsLike(likeRecipes.some((recipe) => recipe._id === id));
  }, [favoriteRecipes, likeRecipes, id, isAuth]);

  // окно при нажатии на избранное
  const handleFavoriteClick = () => {
    // Обработчик клика по иконке избранного: добавление/удаление из избранных
    if (!isAuth) {
      // Если пользователь не авторизован, показать уведомление
      showNotification();

      return;
    }
    // Добавление или удаление рецепта из избранных
    if (isFavorite) {
      dispatch(removeRecipeFromFavorites(id));
    } else {
      dispatch(addRecipeToFavorites(id));
    }
    setIsFavorite(!isFavorite); // Переключение состояния избранного
  };

  const handleLikeClick = () => {
    // Обработчик клика по иконке лайка: добавление/удаление лайка
    if (!isAuth) {
      // Если пользователь не авторизован, показать уведомление
      showNotification();
      return;
    }
    // Добавление или удаление лайка
    const newLikesCount = isLike ? likes - 1 : likes + 1;
    setLikes(newLikesCount);

    if (isLike) {
      dispatch(removeRecipeFromLikes(id));
    } else {
      dispatch(addRecipeToLikes(id));
    }
    setIsLike(!isLike); // Переключение состояния лайка
  };

  if (isLoading) {
    return <RecipeSkeleton />;
  }

  // Функция для перенаправления на страницу редактирования
  const handleEdit = () => {
    navigate(`/recipes/edit/${id}`);
  };

  // Функция для удаления рецепта
  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить рецепт?')) {
      dispatch(fetchRemoveRecipe(id));
    }
  };

  const handleIconClick = (e, action) => {
    e.stopPropagation(); // Предотвратить всплытие события (чтобы клик по иконке не вызывал клик по карточке)
    action(); // Выполнить переданное действие
  };

  // Проверка на наличие imageUrl
  const imageSrc = imageUrl
    ? imageUrl.startsWith('/uploads')
      ? `https://bestfood-back-2qsm.onrender.com${imageUrl}`
      : imageUrl
    : 'путь_к_заглушке_изображения';

  return (
    <div className={styles.recipeBlock}>
      {/* Отображение иконок редактирования и удаления для автора */}
      {isAuthor && (
        <div className={styles.editButtons}>
          <IconButton onClick={(e) => handleIconClick(e, handleEdit)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={(e) => handleIconClick(e, handleDelete)} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}

      {/* Ссылка на полное описание рецепта */}
      <Link to={`/recipes/${id}`} className={styles.recipeBlockLink}>
        {/* Изображение рецепта. При клике на изображение пользователь будет перенаправлен на страницу с полным описанием рецепта */}
        <img className={styles.recipeBlockImage} src={imageSrc} alt={title} />
      </Link>

      {/* Информация о калорийности и времени приготовления рецепта */}
      <div className={styles.recipeBlockInfo}>
        <span className={styles.calories}>
          <CalculatorIcon /> {calories} ккал
        </span>
        <span className={styles.time}>
          <TimerIcon /> {formattedCookingTime}
        </span>
      </div>

      <div className={styles.recipeBlockContent}>
        {/* Ссылка на полное описание рецепта */}
        <h4 className={styles.recipeBlockTitle}>
          <Link to={`/recipes/${id}`}>{title}</Link>
        </h4>

        {/* Краткое описание рецепта */}
        <div className={styles.recipeBlockDescription}>{text}</div>
      </div>

      <div className={styles.recipeBlockActions}>
        {/* Действия пользователя с рецептом ( добавление в закладки, лайки) */}
        <div className={styles.actionItem}>
          <EyeIcon />

          {/* кол-во просмотров рецептв  */}
          <span>{viewsCount}</span>
        </div>

        <div className={styles.actionItem}>
          <CommentIcon />
          <span>{commentsCount}</span>
        </div>

        {/*  для добавления в книгу рецептов */}
        <IconButton onClick={(e) => handleIconClick(e, handleFavoriteClick)}>
          <BookmarkIcon className={isAuth && isFavorite ? styles.added : ''} />
        </IconButton>

        {/*  для добавления likes */}
        <IconButton onClick={(e) => handleIconClick(e, handleLikeClick)}>
          <FavoriteIcon className={isAuth && isLike ? styles.liked : ''} />
          {likes > 0 && <span>{likes}</span>}
        </IconButton>
      </div>

      <div className={styles.tags} onClick={(e) => handleIconClick(e, handleLikeClick)}>
        {/* Теги из каталога рецептов */}
        {Array.isArray(tags) &&
          tags.map((tag) => (
            <ColorTag
              key={tag}
              content={tag}
              url={`/tag/${tag}`} // URL для перехода на страницу категории тега
            />
          ))}
      </div>
    </div>
  );
};
