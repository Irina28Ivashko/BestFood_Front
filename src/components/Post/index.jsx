// карточка для для универсального отображения статей

import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import clsx from 'clsx'; // Библиотека для условного объединения классов
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

import styles from './Post.module.scss';
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import { fetchRemovePost } from '../../redux/slices/posts';

export const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  children,
  isFullPost,
  isLoading,
  isEditable,
}) => {
  const dispatch = useDispatch();

  // Если идет загрузка, отображаем скелетон
  if (isLoading) {
    return <PostSkeleton />;
  }

  // обработчик удаления поста
  const onClickRemove = () => {
    if (window.confirm('Вы действительно хотите удалить статью?')) {
      dispatch(fetchRemovePost(id)); // Диспатчим экшн удаления поста
    }
  };

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {/* Условное отображение кнопок редактирования и удаления для редактируемых постов */}
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}

      {/* Условное отображение изображения, если пост не в полном виде и изображение присутствует */}
      {!isFullPost && imageUrl && (
        <img
          className={styles.image}
          src={
            imageUrl.startsWith('/uploads')
              ? `https://bestfood-back-2qsm.onrender.com${imageUrl}`
              : imageUrl
          }
          alt={title}
        />
      )}
      <div className={styles.wrapper}>
        {/* Информация о пользователе с дополнительным текстом даты создания */}
        <UserInfo {...(user || {})} additionalText={createdAt} />

        <div className={styles.indention}>
          {/*  отображение заголовка */}
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>

          {children && <div className={styles.content}>{children}</div>}
          <div className={styles.postDetails}>
            <span>
              <EyeIcon />
              <span>{viewsCount}</span>
            </span>
            <span>
              <CommentIcon />
              <span>{commentsCount}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
