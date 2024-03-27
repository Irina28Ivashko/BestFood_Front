// все статьи

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Post } from '../../components/Post';
import { fetchPosts, fetchRemovePost } from '../../redux/slices/posts';

import { PaginationOnPage } from '../../components/PaginationOnPage';
import Grid from '@mui/material/Grid';
import styles from './AllPosts.module.scss';

export const AllPosts = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { items: posts, status } = useSelector((state) => state.posts.posts);
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница пагинации
  const totalPages = useSelector((state) => state.posts.posts.totalPages); // Общее количество страниц

  // Эффект для загрузки статей при изменении текущей страницы
  useEffect(() => {
    dispatch(fetchPosts({ page: currentPage, limit: 12 }));
  }, [currentPage, dispatch]);

  // Обработчик изменения страницы пагинации
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Обработчик удаления статьи
  const handleDelete = (id) => {
    if (window.confirm('Вы действительно хотите удалить статью?')) {
      dispatch(fetchRemovePost(id));
    }
  };

  // Заглушка для обработчика редактирования статьи
  const handleEdit = (id) => {
    console.log('Редактирование статьи с ID:', id);
  };

  // Условия отображения в зависимости от статуса загрузки
  if (status === 'loading') {
    return <div>Загрузка...</div>;
  }

  if (status === 'error') {
    return <div>Ошибка загрузки</div>;
  }

  return (
    <div className={styles.AllPostsContainer}>
      <h2 className={styles.title}>Кулинарные статьи</h2>
      <Grid container spacing={2}>
        {/* Отображение статей с использованием компонента */}
        {posts &&
          posts.length > 0 &&
          posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post._id}>
              <Post
                id={post._id}
                onDelete={() => handleDelete(post._id)}
                onEdit={() => handleEdit(post._id)}
                isEditable={userData && post.user && userData._id === post.user._id}
                {...post}
              />
            </Grid>
          ))}
      </Grid>

      {/* Компонент для навигации по страницам статей */}
      <PaginationOnPage
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};
