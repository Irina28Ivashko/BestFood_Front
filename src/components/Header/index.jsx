// шапка

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import Button from '@mui/material/Button';

import styles from './Header.module.scss';
import logoSvg from '../../assets/images/logo.svg';
import Container from '@mui/material/Container';
import { logout, selectIsAuth } from '../../redux/slices/auth';
import { Search } from '../Search';
import Profile from '../Profile';

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const location = useLocation();

  // обработчик выхода из системы для авторизированного пользователя
  const onClickLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      dispatch(logout());
      //при выходе удаляем токен из localStorage
      window.localStorage.removeItem('token');
    }
  };

  return (
    <div className={styles.header}>
      <Container maxWidth="lg">
        <div className={styles.container}>
          {/* логотип сайта */}
          <div className={styles.leftSection}>
            <Link className={styles.logo} to="/">
              <div className={styles.logoContent}>
                <img width="38" src={logoSvg} alt="BestFood.logo" />
                <h1>Best Food</h1>
              </div>
            </Link>
          </div>

          {/* поиск по рецептам */}
          {location.pathname !== '/cart' && (
            <div className={styles.centerSection}>
              <Search />
            </div>
          )}

          <div className={styles.rightSection}>
            {isAuth ? (
              <>
                {/* книга с рецептами, которые добавил пользователь */}
                <Link to="/favorites" className={styles.favoritesLink}>
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 128 128"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <rect width="128" height="128" fill="url(#pattern0)" />
                    <defs>
                      <pattern
                        id="pattern0"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1">
                        <use href="#image0_120_264" transform="scale(0.0078125)" />
                      </pattern>
                      <image
                        id="image0_120_264"
                        width="128"
                        height="128"
                        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALfSURBVHic7djRTVtBEEbhGXABLgHegxd34A7idAAVECoAKoioIO4gpIK4A2evC4hLcAHgyQtS8oAEXCW7d+9/vkcEmkUcZgRmAAAAAAAAAAAAAABgbLz2AzYpTSdmFxHx0d0Xtd9TQkSs3f37o9lqnvO+5luqBrBN6bNF3Jj7tOY7qonYm/v9Wc63tZ5QJYBNStNJxFdzX9aYPzQRsX5y/1RjGxyVHmhmdhzxjR/+H+6+OI74UWN28QC2Kd2q3Pr3cPfzbjb7UnxuyWGblE4mZr9KzmyNm80/5Pyz1LyiG2AScVNyXosi4qrkvNIngLv/GveLkuOKBbBNaSH75947bVNalJpVLIAw44f/duelBhULwAt+UyNQ7Jelyv8BMBwEII4AxBGAOAIQRwDiCEAcAYgjAHEEII4AxBGAOAIQRwDiCEAcAYgjAHEEII4AxBGAOAIQRwDiCEAcAYgjAHEEII4AxBGAOAIQRwDiCEAcAYgjAHEEII4AxBGAOAIQRwDiCEAcAYgjAHEEII4AxBGAOAIQRwDiCEAcAYgjAHEEII4AxBGAOAIQRwDiCEAcAYgjAHEEII4AxBGAOAIQpxtAxO5gdnkwu7SIXe3n1DKp/YDiIh7M/f6s69Z/fXS1TWlhEVfmvqz1tBo0AojYh9nqyf1+3nW7lz7lLOe1ma03KZ0cR1y52YW5T4u+s4Jxn4DnNf/ofjrruut5zrvXvmSe827WddeP7qcK52GcG+DlNf8u85z3ZraykZ+H8QTwhjXf15jPQ/snoMea72uM56HdDfAP1nxfYzoPbQXwH9d8X62fhzZOQME131er52HYG6Dimu+rtfMwvAAGuOb7auE8DOcENLDm+xryeai/ARpc830N8TzUCWBEa76voZyHsgFE7A7udwf3h+ffBnnPp+56k9LdkdnyKOLG3Gs/CwAAAAAAAAAAAAAANOw3eEw+qqj6+lkAAAAASUVORK5CYII="
                      />
                    </defs>
                  </svg>

                  <span>Моя книга рецептов</span>
                </Link>

                {/* профиль авторизированного пользователя */}
                <Profile />

                {/* кнопка выхода из системы */}
                <Button onClick={onClickLogout} variant="contained" color="error" size="small">
                  Выйти
                </Button>
              </>
            ) : (
              <div className={styles.authButtons}>
                {/* кнопка авторизации  */}
                <Link to="/login">
                  <Button variant="outlined" size="small">
                    Войти
                  </Button>
                </Link>

                {/* кнопка для регистрации */}
                <Link to="/register">
                  <Button variant="contained" size="small">
                    Создать аккаунт
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
