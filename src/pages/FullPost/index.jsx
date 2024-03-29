// полная статья со всей информацией

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; //для редактирования текста в статье
import axios from '../../axios';
import { useSelector, useDispatch } from 'react-redux';

import { AuthDialog } from '../../components/AuthDialog';
import { Post } from '../../components/Post';
import { AddComment } from '../../components/AddComment';
import { CommentsBlock } from '../../components/CommentsBlock';
import { fetchComments, clearComments } from '../../redux/slices/comments';

import styles from './FullPost.module.scss';

export const FullPost = () => {
  const [data, setData] = React.useState(); // Состояние для хранения данных статьи
  const [isLoading, setLoading] = React.useState(true); // Состояние для индикации загрузки
  const { id } = useParams();
  const dispatch = useDispatch();

  // Получение состояния комментариев из Redux store
  const { items: comments, status: commentsStatus } = useSelector((state) => state.comments);
  const [openAuthDialog, setOpenAuthDialog] = useState(false); // Состояние для управления диалогом аутентификации

  useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data); // Установка данных статьи
        setLoading(false); // Отключение индикатора загрузки
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении статьи');
      });

    // Загрузка комментариев для статьи
    dispatch(fetchComments({ contentId: id, contentType: 'post' }));

    return () => {
      // Очистка комментариев при уходе со страницы
      dispatch(clearComments());
    };
  }, [id, dispatch, clearComments]);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />; // Отображение индикатора загрузки
  }

  return (
    <div className={styles.container}>
      {/* изображение  */}
      {data.imageUrl && (
        <img
          className={styles.imageFullPost}
          src={`https://bestfood-back-2qsm.onrender.com${data.imageUrl}`}
          alt={data.title}
        />
      )}

      {/* статья */}
      <div className={styles.postContent}>
        <Post
          id={data._id}
          user={data.user}
          createdAt={data.createdAt}
          viewsCount={data.viewsCount}
          commentsCount={comments.length}
          isFullPost></Post>
        {/* <ReactMarkdown children={data.text} /> */}
      </div>

      <div className={styles.contentWrapper}>
        <h2 className={styles.fullPostTitle}>{data.title}</h2>
        <div className={styles.fullPostText}>
          <ReactMarkdown children={data.text} />
        </div>
      </div>

      {/* написанные комментарии */}
      <CommentsBlock
        user={data.user}
        contentId={data._id}
        contentType="post"
        isLoading={commentsStatus === 'loading'}
        comments={comments.comments}>
        {/* форма для написания комментария */}
        <AddComment
          user={data.user}
          contentId={data._id}
          contentType="post"
          onUnauthorized={() => setOpenAuthDialog(true)}
        />
      </CommentsBlock>

      {/* уведомление об авторизации при попытке оставить комментарий неавторизованным пользователем */}
      <AuthDialog open={openAuthDialog} onClose={() => setOpenAuthDialog(false)} />
    </div>
  );
};
