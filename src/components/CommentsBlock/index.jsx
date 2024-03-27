// блок с комментарием

import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchComments, fetchDeleteComment, fetchUpdateComment } from '../../redux/slices/comments';

import { SideBlock } from '../SideBlock';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import styles from './CommentsBlock.module.scss';

export const CommentsBlock = ({ contentId, contentType, children, comments: initialComments }) => {
  const dispatch = useDispatch();

  // Извлечение данных о комментариях и статусе загрузки из Redux store
  const comments = useSelector((state) => state.comments.items);
  const isLoading = useSelector((state) => state.comments.status) === 'loading';

  const currentUserId = useSelector((state) => state.auth.data?._id); // Идентификатор текущего пользователя

  //  для отслеживания текущего идентификатора пользователя
  useEffect(() => {
    if (!currentUserId) {
      console.error('Ошибка: ID пользователя в CommentsBlock не определен.');
    }
  }, [currentUserId]);

  //  для загрузки комментариев, если указаны contentId и contentType
  useEffect(() => {
    if (contentId && contentType) {
      dispatch(fetchComments({ contentId, contentType }));
    }
  }, [dispatch, contentId, contentType]);

  //  удаление комментария
  const handleDelete = (commentId) => {
    if (window.confirm('Вы действительно хотите удалить комментарий?')) {
      dispatch(fetchDeleteComment({ commentId, contentId, contentType }));
    }
  };

  // реадакирование комментария
  const handleEdit = (commentId, text) => {
    const newText = prompt('Редактировать комментарий:', text);
    if (newText && newText !== text) {
      dispatch(fetchUpdateComment({ commentId, text: newText, contentId, contentType }));
    }
  };

  // Отображение комментариев или загрузочного состояния
  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  const commentsArray = comments || [];

  // Пример проверки перед отображением комментариев
  if (!Array.isArray(commentsArray)) {
    console.error('Expected commentsArray to be an array', commentsArray);
    return null; // или другое подходящее поведение в случае ошибки
  }

  // console.log('Комментарии:', comments);
  // console.log('Загрузка:', isLoading);

  return (
    <SideBlock title="Комментарии">
      <div className={styles.scrollableSection}>
        <List>
          {/* Отображаем либо скелетоны (плейсхолдеры при загрузке), либо комментарии */}
          {(isLoading ? [...Array(5)] : commentsArray).map((comment, index) => (
            <React.Fragment key={comment?._id || index}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  {/* Если данные загружаются, отображаем скелетон, иначе - аватар пользователя */}
                  {isLoading ? (
                    <Skeleton variant="circular" width={40} height={40} />
                  ) : (
                    <Avatar alt={comment.user.fullName} src={comment.user.avatarUrl} />
                  )}
                </ListItemAvatar>
                {isLoading ? (
                  // {/* Скелетоны для текста комментария */}
                  <div className={styles.skeletonTextContainer}>
                    <Skeleton variant="text" height={25} width={120} />
                    <Skeleton variant="text" height={18} width={230} />
                  </div>
                ) : (
                  // {/* Текст комментария и имя пользователя */}
                  <>
                    <ListItemText
                      primary={comment.user.fullName}
                      secondary={
                        <>
                          <span
                            className={
                              currentUserId === comment.user._id ? styles.commentText : ''
                            }>
                            {comment.text}
                          </span>
                          <span className={styles.commentDate}>
                            {comment.updatedAt
                              ? `${comment.updatedAt}`
                              : `Posted: ${comment.createdAt}`}
                          </span>
                        </>
                      }
                    />

                    {/* Отображаем иконки редактирования и удаления только для автора комментария */}

                    {currentUserId === comment.user._id && (
                      <>
                        {/* редактирование комментария */}
                        <div className={styles.editButtons}>
                          <IconButton onClick={() => handleEdit(comment?._id, comment?.text)}>
                            <EditIcon />
                          </IconButton>
                          {/* удаление комментария */}
                          <IconButton onClick={() => handleDelete(comment?._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </>
                    )}
                  </>
                )}
              </ListItem>
              {/* Разделитель между комментариями */}
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </div>
      {/* Дочерние элементы, например, форма для добавления нового комментария */}
      {children}
    </SideBlock>
  );
};
