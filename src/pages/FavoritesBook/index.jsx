// страница с отмеченными избранными рецептами пользователя

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RecipeBlock } from '../../components/RecipeBlock';
import { formatCookingTime } from '../../utils/timeUtils';
import { fetchFavoriteRecipes } from '../../redux/slices/auth';
import { PaginationOnPage } from '../../components/PaginationOnPage';

import styles from './FavoritesBook.module.scss';
import Grid from '@mui/material/Grid';

export const FavoritesBook = () => {
  const dispatch = useDispatch();

  // Получение данных о пользователе и его избранных рецептах из Redux store
  const userData = useSelector((state) => state.auth.data);
  const favoriteRecipes = useSelector((state) => state.auth.favoriteRecipes);
  const isAuth = useSelector((state) => !!state.auth.data);

  // Состояние для управления текущей страницей пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = useSelector((state) => state.recipes.recipes.totalPages);

  // Эффект для загрузки избранных рецептов, если пользователь авторизован
  useEffect(() => {
    if (isAuth) {
      dispatch(fetchFavoriteRecipes({ page: currentPage, limit: 9 }));
    }
  }, [dispatch, isAuth, currentPage]);

  // Обработчик изменения страницы в компоненте пагинации
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    dispatch(fetchFavoriteRecipes({ page: value, limit: 9 }));
  };

  return (
    <div className={styles.myResipesContainer}>
      <h2 className={styles.title}>Моя книга рецептов</h2>
      {/* Проверка наличия избранных рецептов */}
      {favoriteRecipes.length === 0 ? (
        <div className={styles.noRecipesMessage}>
          В вашей книге рецептов еще не добавлено ни одного рецепта 😞
          <br />
          Скорее сделайте это и начните готовить 👍
        </div>
      ) : (
        <Grid container spacing={2}>
          {/* Отображение списка избранных рецептов */}
          {favoriteRecipes.map((recipe, index) => (
            <Grid item xs={12} sm={6} md={4} key={recipe._id || index}>
              <RecipeBlock
                // key={recipe._id || index}
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
      {/* пагинация */}
      <PaginationOnPage
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};
