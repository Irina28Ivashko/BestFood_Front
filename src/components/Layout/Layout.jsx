import React from 'react';

import { Outlet } from 'react-router-dom';
import { Header } from '../Header';
import { Categories } from '../Categories';
import { AuthDialog } from '../AuthDialog';
import { useNotification } from '../../context/Notification';
import RecipeCatalog from '../RecipeCatalog';

import { SideBlock } from '../SideBlock';

import styles from './Layout.module.scss';
import Container from '@mui/material/Container';

const Layout = () => {
  // Использование контекста для управления показом диалоговых окон уведомлений
  const { isOpen, closeNotification } = useNotification();

  return (
    <div className={styles.layout}>
      {/* Верхняя часть страницы, заголовок */}
      <Header />

      {/* Компонент Categories для выбора категорий с колбэком, выводящим выбранную категорию в консоль */}
      <Categories onCategoryChange={(category) => console.log(category)} />

      {/* Основной контент страницы */}
      <div className={styles.content}>
        {/* Боковая панель с каталогом рецептов и возможным диалогом аутентификации */}
        <div className={styles.sideBlock}>
          <SideBlock>
            {/* Каталог рецептов в боковой панели */}
            <RecipeCatalog />
          </SideBlock>

          {/* Условное отображение диалогового окна аутентификации, если isOpen истина */}
          {isOpen && <AuthDialog isOpen={isOpen} onClose={closeNotification} />}
        </div>
        <Container maxWidth="lg" className={styles.mainContent}>
          <Outlet /> {/* Для рендеринга дочерних маршрутов */}
        </Container>
      </div>
    </div>
  );
};

export default Layout;
