// главная страница

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Grid from '@mui/material/Grid';
import styles from './Home.module.scss';

import { formatCookingTime } from '../../utils/timeUtils';

import { Post } from '../../components/Post';
import { RecipeBlock } from '../../components/RecipeBlock';

import { fetchPosts } from '../../redux/slices/posts';
import { fetchRecipes } from '../../redux/slices/recipes';
import Pagination from '@mui/material/Pagination';

export const Home = () => {
  const dispatch = useDispatch();

  // Извлечение данных пользователя и статей из Redux store
  const userData = useSelector((state) => state.auth.data);
  const { posts } = useSelector((state) => state.posts);
  const postsData = useSelector((state) => state.posts.posts);

  // Состояния для управления выбранной категорией и текущими страницами
  const [selectedCategory, setSelectedCategory] = useState('Рецепты');
  const isPostsLoading = posts.status === 'loading';

  // Текущая страница для рецептов
  const [currentRecipePage, setCurrentRecipePage] = useState(1);
  // Текущая страница для статей
  const [currentPostPage, setCurrentPostPage] = useState(1);

  // Для рецептов
  useEffect(() => {
    if (selectedCategory === 'Рецепты') {
      dispatch(fetchRecipes({ page: currentRecipePage, limit: 9 }));
    }
  }, [currentRecipePage, dispatch, selectedCategory]);

  // Для статей
  useEffect(() => {
    dispatch(fetchPosts({ page: currentPostPage, limit: 9 }));
  }, [dispatch]);

  const {
    items: recipes,
    status: recipesStatus,
    totalPages,
  } = useSelector((state) => state.recipes.recipes);
  if (recipesStatus === 'loading') {
    return <div>Loading...</div>;
  }

  const isRecipesLoading = recipesStatus === 'loading';

  return (
    <>
      {selectedCategory === 'Рецепты' && (
        <>
          <Grid xs={12} item>
            {/* рецепты */}
            <div className={styles.recipeBlockContainer}>
              {isRecipesLoading ? (
                'Загрузка...'
              ) : recipes && recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <RecipeBlock
                    key={recipe._id}
                    id={recipe._id}
                    user={recipe.user}
                    tags={recipe.tags}
                    title={recipe.title}
                    imageUrl={
                      recipe.imageUrl
                        ? `https://bestfood-back-2qsm.onrender.com${recipe.imageUrl}`
                        : ''
                    }
                    calories={recipe.totalCalories ? recipe.totalCalories.toFixed(2) : 0}
                    formattedCookingTime={formatCookingTime(recipe.cookingTime)}
                    viewsCount={recipe.viewsCount}
                    likesCount={recipe.likesCount}
                    commentsCount={recipe.commentsCount}
                    text={recipe.text}
                    isLiked={false}
                    onLike={() => {}}
                    isAuthor={userData && recipe.user && userData._id === recipe.user._id}
                  />
                ))
              ) : (
                <p>Рецепты не найдены.</p>
              )}
            </div>
            <div className={styles.paginationContainer}>
              <Pagination
                className={styles.pagination}
                count={totalPages}
                page={currentRecipePage}
                onChange={(event, page) => setCurrentRecipePage(page)}
              />
            </div>
          </Grid>
        </>
      )}

      <Grid container spacing={2}>
        {isPostsLoading ? (
          [...Array(5)].map((_, index) => <Post key={index} isLoading={true} />)
        ) : postsData && postsData.items && postsData.items.length > 0 ? (
          postsData.items.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post._id}>
              {/* статьи */}
              <Post
                id={post._id}
                title={post.title}
                createdAt={post.createdAt}
                imageUrl={
                  post.imageUrl ? `https://bestfood-back-2qsm.onrender.com${post.imageUrl}` : ''
                }
                user={post.user}
                viewsCount={post.viewsCount}
                commentsCount={post.commentsCount}
                isEditable={userData && post.user && userData._id === post.user._id}
              />
            </Grid>
          ))
        ) : (
          <p>Статьи не найдены.</p>
        )}
      </Grid>
    </>
  );
};
