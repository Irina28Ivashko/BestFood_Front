// все рецепты

import React, { useEffect, useState } from 'react';
import { RecipeBlock } from '../../components/RecipeBlock';
import { useSelector, useDispatch } from 'react-redux';
import { formatCookingTime } from '../../utils/timeUtils';
import { fetchRecipes } from '../../redux/slices/recipes';
import { PaginationOnPage } from '../../components/PaginationOnPage';

import styles from './AllRecipes.module.scss';
import Grid from '@mui/material/Grid';

export const AllRecipes = () => {
  const dispatch = useDispatch();
  const recipes = useSelector((state) => state.recipes.recipes.items);
  const [setRecipes] = useState([]);

  const userData = useSelector((state) => state.auth.data); // Получаем данные текущего пользователя
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = useSelector((state) => state.recipes.recipes.totalPages);

  // Эффект для загрузки рецептов при изменении текущей страницы
  useEffect(() => {
    dispatch(fetchRecipes({ page: currentPage, limit: 9 }));
  }, [currentPage, dispatch]);

  // Обработчик изменения страницы в пагинации
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    dispatch(fetchRecipes({ page: currentPage, limit: 9 }));
  };

  return (
    <div className={styles.allRecipesContainer}>
      <h2 className={styles.title}>Все рецепты</h2>

      {/* отображения рецептов */}
      <Grid container spacing={2}>
        {recipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe._id}>
            <RecipeBlock
              key={recipe._id}
              id={recipe._id}
              likesCount={recipe.likesCount}
              formattedCookingTime={formatCookingTime(recipe.cookingTime)}
              calories={recipe.totalCalories ? recipe.totalCalories.toFixed(2) : 0}
              isAuthor={userData && recipe.user && userData._id === recipe.user._id}
              {...recipe}
            />
          </Grid>
        ))}
      </Grid>

      {/*  пагинации для навигации между страницами рецептов */}
      <PaginationOnPage
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};
