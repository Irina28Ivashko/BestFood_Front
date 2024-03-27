// страница с созданными статьями автора

import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import { useDispatch, useSelector } from 'react-redux';
import { Post } from '../../components/Post';
import { fetchRemovePost } from '../../redux/slices/posts';
import { PaginationOnPage } from '../../components/PaginationOnPage';

import styles from './MyPosts.module.scss';
import Grid from '@mui/material/Grid';

export const MyPosts = () => {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]); // Состояние для хранения статей пользователя

  const userData = useSelector((state) => state.auth.data); // Данные текущего пользователя из Redux store
  const [currentPage, setCurrentPage] = useState(1); // Состояние текущей страницы для пагинации
  const totalPages = useSelector((state) => state.posts.posts.totalPages); // Общее количество страниц для пагинации

  // Эффект для загрузки статей пользователя при изменении currentPage или авторизации пользователя
  useEffect(() => {
    if (userData) {
      axios
        .get('/posts/my', {
          headers: { Authorization: `Bearer ${userData.token}` }, // Токен авторизации в заголовках
        })
        .then(({ data }) => {
          setPosts(data); // Установка полученных статей в состояние
        })
        .catch((error) => {
          console.error('Ошибка при загрузке моих статей:', error);
        });
    }
  }, [userData, currentPage]);

  // Обработчик изменения страницы в пагинации
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (!posts) {
    return <div>Загрузка...</div>; // или другое сообщение о загрузке
  }

  // Обработчик удаления статьи
  const handleDelete = (id) => {
    if (window.confirm('Вы действительно хотите удалить статью?')) {
      dispatch(fetchRemovePost(id));
    }
  };

  // Обработчик редактирования статьи
  const handleEdit = (id) => {
    // Реализуйте логику для редактирования статьи
    console.log('Редактирование статьи с ID:', id);
  };

  return (
    <div className={styles.myPostsContainer}>
      <h2 className={styles.title}>Мои статьи</h2>
      <div className={styles.gridContainer}>
        {posts.length === 0 ? (
          // Сообщение, если статьи отсутствуют
          <div className={styles.noPostsMessage}>Вы еще не добавили ни одной статьи 😞</div>
        ) : (
          // Отображение списка статей
          <Grid container spacing={2}>
            {posts.map((post) => (
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
        )}

        {/* Пагинация */}
        <PaginationOnPage
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};
