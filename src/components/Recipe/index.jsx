import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

import styles from './Recipe.module.scss';
import { fetchRemoveRecipe } from '../../redux/slices/recipes';
import { ColorTag } from '../ColorTag';

//  иконки
import Snackbar from '@mui/material/Snackbar';

export const Recipe = ({ id, title, imageUrl, tags, children, isFullRecipe }) => {
  const dispatch = useDispatch();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('');

  const handleLikeClick = (liked) => {
    if (liked) {
      setSnackbarMessage('Мне нравится');
      setSnackbarColor('#81c784'); // светло-зеленый
    } else {
      setSnackbarMessage('Мне больше не нравится');
      setSnackbarColor('#4db6ac'); // бирюзовый
    }
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const onClickRemove = () => {
    if (window.confirm('Вы действительно хотите удалить рецепт?')) {
      dispatch(fetchRemoveRecipe(id))
        .then((response) => {
          console.log('Удаление прошло успешно:', response);
        })
        .catch((error) => {
          console.error('Ошибка при удалении:', error);
        });
    }
  };

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullRecipe })}>
      {/* ифно о тегах, категориях  */}
      <ul className={styles.tags}>
        {tags &&
          tags.map((tag) => (
            <li key={tag}>
              <ColorTag
                content={tag}
                url={`/tag/${tag}`}
                className={isFullRecipe ? styles.bigTag : ''}
              />
            </li>
          ))}
      </ul>

      {/* название рецепта */}
      <div className={styles.wrapper}>
        <h2 className={clsx(styles.title, { [styles.titleFull]: isFullRecipe })}>
          {isFullRecipe ? title : <Link to={`/recipes/${id}`}>{title}</Link>}
        </h2>

        {/* изображение рецепта */}
        {imageUrl && (
          <img
            className={clsx(styles.image, { [styles.imageFull]: isFullRecipe })}
            src={imageUrl}
            alt={title}
          />
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          ContentProps={{
            style: { backgroundColor: snackbarColor },
          }}
        />

        {children && <div className={styles.content}>{children}</div>}
      </div>
    </div>
  );
};
