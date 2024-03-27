// модальное окно с уведомлением для неавторизированного пользователя при наж. на лайк и избранное

import React from 'react';
import { useNavigate } from 'react-router-dom';

import CloseIcon from '@mui/icons-material/Close';
import styles from './AuthDialog.module.scss';

export const AuthDialog = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    onClose(); // Сначала закрываем уведомление
    navigate('/login'); // Затем переходим на страницу регистрации
  };

  if (!isOpen) return null;

  return (
    <div className={styles.authDialogOverlay}>
      <div className={styles.authDialog}>
        <div className={styles.closeButton} onClick={onClose}>
          <CloseIcon />
        </div>
        <p className={styles.text}>Еще не с нами? Зарегистрируйтесь!</p>
        <button onClick={handleLoginClick} className={styles.buttonLogin}>
          Войти
        </button>
      </div>
    </div>
  );
};
