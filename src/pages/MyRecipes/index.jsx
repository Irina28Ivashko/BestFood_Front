// страница с созданными рецептами автора

import React, { useEffect, useState } from 'react';

import { fetchMyRecipes } from '../../redux/slices/recipes';
import { useSelector, useDispatch } from 'react-redux';
import { RecipeBlock } from '../../components/RecipeBlock';
import { formatCookingTime } from '../../utils/timeUtils';
import { PaginationOnPage } from '../../components/PaginationOnPage';

import styles from './MyRecipes.module.scss';
import Grid from '@mui/material/Grid';

export const MyRecipes = () => {
  const dispatch = useDispatch();

  // Извлекаем рецепты и общее количество страниц из состояния
  const { items: recipes = [], totalPages } = useSelector((state) => state.recipes.recipes);

  const userData = useSelector((state) => state.auth.data); // Данные текущего пользователя
  const [currentPage, setCurrentPage] = useState(1); // Состояние для текущей страницы пагинации

  // Эффект для загрузки рецептов пользователя при изменении currentPage
  useEffect(() => {
    dispatch(fetchMyRecipes({ page: currentPage, limit: 9 }));
  }, [currentPage, dispatch]);

  // Обработчик изменения страницы в компоненте пагинации
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    dispatch(fetchMyRecipes({ page: value, limit: 9 }));
  };

  return (
    <div className={styles.myRecipesContainer}>
      <h2 className={styles.title}>Мои рецепты</h2>

      {recipes.length === 0 ? (
        // Сообщение, если у пользователя нет добавленных рецептов
        <div className={styles.noRecipesMessage}>Вы еще не добавили ни одного рецепта 😞</div>
      ) : (
        // Отображение сетки с карточками рецептов пользователя
        <Grid container spacing={2}>
          {recipes.map((recipe) => (
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

      {/* пагинация */}
      <PaginationOnPage
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};
