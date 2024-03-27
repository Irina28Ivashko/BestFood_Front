//  страница понравившихся рецептов

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RecipeBlock } from '../../components/RecipeBlock';
import { formatCookingTime } from '../../utils/timeUtils';
import { fetchLikeRecipes } from '../../redux/slices/auth';
import { PaginationOnPage } from '../../components/PaginationOnPage';

import styles from './Likes.module.scss';
import Grid from '@mui/material/Grid';

export const Likes = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data); // Получение данных текущего пользователя из Redux store
  const likeRecipes = useSelector((state) => state.auth.likeRecipes); // Получение списка избранных рецептов пользователя
  const isAuth = useSelector((state) => !!state.auth.data); // Проверка на аутентификацию пользователя
  const [currentPage, setCurrentPage] = useState(1); // Состояние для текущей страницы пагинации
  const totalPages = useSelector((state) => state.recipes.recipes.totalPages); // Общее количество страниц для пагинации

  // Эффект для загрузки избранных рецептов при изменении currentPage или статуса аутентификации
  useEffect(() => {
    if (isAuth) {
      dispatch(fetchLikeRecipes({ page: currentPage, limit: 9 }));
    }
  }, [dispatch, isAuth]);

  // Обработчик изменения страницы в компоненте пагинации
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className={styles.likesContainer}>
      <h2 className={styles.title}>Мои избранные рецепты</h2>

      {likeRecipes.length === 0 ? (
        // Сообщение, если список избранных рецептов пуст
        <div className={styles.noRecipesMessage}>Вы еще не добавили ни одного рецепта 😞</div>
      ) : (
        // Отображение сетки с карточками избранных рецептов
        <Grid container spacing={2}>
          {likeRecipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe._id}>
              <RecipeBlock
                id={recipe._id}
                formattedCookingTime={formatCookingTime(recipe.cookingTime)}
                calories={recipe.totalCalories ? recipe.totalCalories.toFixed(2) : 0}
                isAuthor={userData && recipe.user && userData._id === recipe.user}
                {...recipe}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <PaginationOnPage
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};
