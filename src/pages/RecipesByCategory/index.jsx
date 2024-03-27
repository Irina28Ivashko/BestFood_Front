// страница с рецептами по выбранной тегам категории

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { RecipeBlock } from '../../components/RecipeBlock';
import { fetchRecipes } from '../../redux/slices/recipes';
import { formatCookingTime } from '../../utils/timeUtils';
import { PaginationOnPage } from '../../components/PaginationOnPage';

import styles from './RecipesByCategory.module.scss';
import Grid from '@mui/material/Grid';

export const RecipesByCategory = () => {
  const { tag } = useParams();
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.auth.data); // Данные текущего пользователя из состояния Redux
  const recipes = useSelector((state) => state.recipes.recipes.items); // Получаем список рецептов из состояния Redux
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница для пагинации
  const totalPages = useSelector((state) => state.recipes.recipes.totalPages); // Общее количество страниц

  // Загрузка рецептов при изменении тега или страницы
  useEffect(() => {
    dispatch(fetchRecipes({ tag, page: currentPage, limit: 12 }));
  }, [tag, currentPage, dispatch]);

  // Обработчик смены страницы в компоненте пагинации
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className={styles.RecipesByCategoryContainer}>
      <h2 className={styles.title}>Рецепты: {tag}</h2>
      <Grid container spacing={2}>
        {/* рецепты */}
        {recipes.map((recipe) => {
          const isAuthor = userData && recipe.user && userData._id === recipe.user;
          return (
            <Grid item xs={12} sm={6} md={4} key={recipe._id}>
              <RecipeBlock
                id={recipe._id}
                formattedCookingTime={formatCookingTime(recipe.cookingTime)}
                calories={recipe.totalCalories ? recipe.totalCalories.toFixed(2) : 0}
                isAuthor={isAuthor}
                {...recipe}
              />
            </Grid>
          );
        })}
      </Grid>

      {/* пагинация */}
      <PaginationOnPage
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};
