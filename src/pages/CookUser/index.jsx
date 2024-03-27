// страница кулинара

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserActivity, getUserProfile } from '../../redux/slices/auth';
import { RecipeBlock } from '../../components/RecipeBlock';
import { formatCookingTime } from '../../utils/timeUtils';
import { fetchRemovePost } from '../../redux/slices/posts';
import { Post } from '../../components/Post';
import { PaginationOnPage } from '../../components/PaginationOnPage';

import styles from './CookUser.module.scss';

import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

export const CookUser = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();

  // Получение данных пользователя и его активности из Redux store
  const userProfile = useSelector((state) => state.auth.userProfile);
  const userActivity = useSelector((state) => state.auth.userActivity);
  const isUserActivityLoading = useSelector((state) => state.auth.userActivityLoading);

  const currentAuthorRank = useSelector((state) => state.auth.currentAuthorRank);
  const { recipes, posts } = userActivity || {};
  const userData = useSelector((state) => state.auth.data);

  const postsData = useSelector((state) => state.posts.posts);
  const isPostsLoading = posts && posts.status === 'loading';

  // Состояния для управления отображением вкладок и пагинацией
  const [tabValue, setTabValue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = useSelector((state) => state.recipes.recipes.totalPages);

  // Функции для управления вкладками и пагинацией
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  // Подгрузка данных пользователя и его активности при монтировании компонента
  useEffect(() => {
    dispatch(getUserActivity(userId));
    dispatch(getUserProfile(userId));
  }, [dispatch, userId]);

  // Проверка на загрузку данных
  if (!userProfile || !userActivity || isUserActivityLoading) {
    return <div>Загрузка...</div>;
  }

  // Формирование полного URL аватара
  const fullAvatarUrl = userProfile.avatarUrl.startsWith('http')
    ? userProfile.avatarUrl
    : `http://localhost:4445${userProfile.avatarUrl}`;

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // удаление статьи
  const handleDelete = (id) => {
    if (window.confirm('Вы действительно хотите удалить статью?')) {
      dispatch(fetchRemovePost(id));
    }
  };

  const handleEdit = (id) => {
    //  редактирования статьи
    console.log('Редактирование статьи с ID:', id);
  };

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Отображение информации о пользователе */}
        <Avatar src={fullAvatarUrl} alt={userProfile.fullName} sx={{ width: 100, height: 100 }} />
        <div>
          <Typography variant="h5">{userProfile.fullName}</Typography>
          <Typography variant="body1">
            Место в рейтинге: <span>{currentAuthorRank || 'Нет данных о рейтинге'}</span>
          </Typography>

          <Typography variant="body2">
            Последнее добавление: {userActivity?.lastActivity || 'Неизвестно'}
          </Typography>
        </div>
      </Box>

      {/* Табы для переключения между рецептами и статьями */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChangeTab} aria-label="basic tabs example">
          <Tab label="Рецепты" />
          <Tab label="Статьи" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {/* Отображение рецептов пользователя */}
        {recipes.length === 0 ? (
          <div className={styles.noPostsMessage}>У этого автора нет рецептов 😞</div>
        ) : (
          <Grid container spacing={2}>
            {recipes.map((recipe) => (
              <Grid item xs={12} sm={6} md={4} key={recipe._id}>
                <RecipeBlock
                  // key={recipe._id}
                  id={recipe._id}
                  formattedCookingTime={formatCookingTime(recipe.cookingTime)}
                  calories={recipe.totalCalories ? recipe.totalCalories.toFixed(2) : 0}
                  isAuthor={userData && recipe.user && userData._id === recipe.user._id}
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
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/*   отображениу статей пользователя */}
        {posts.length === 0 ? (
          <div className={styles.noPostsMessage}>У этого автора нет статей 😞</div>
        ) : (
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
                    imageUrl={post.imageUrl ? `http://localhost:4445${post.imageUrl}` : ''}
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
        )}
        {/* пагинация */}
        <PaginationOnPage
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      </TabPanel>
    </div>
  );
};

// Компонент TabPanel для управления содержимым вкладок
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}
