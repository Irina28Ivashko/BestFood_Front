// информация об авторе рецепта и статей на странацах рецептов/статей

import React from 'react';
import Avatar from '@mui/material/Avatar';
import styles from './UserInfo.module.scss';

export const UserInfo = ({ fullName, avatarUrl, additionalText }) => {
  // Преобразование относительного URL в полный
  const fullAvatarUrl =
    avatarUrl && avatarUrl.startsWith('http')
      ? avatarUrl
      : `http://localhost:4445${avatarUrl || ''}`;

  return (
    <div className={styles.root}>
      <Avatar className={styles.avatar} src={fullAvatarUrl} alt={fullName} />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        {/* Отображение дополнительного текста */}
        {additionalText && <span className={styles.additional}>{additionalText}</span>}
      </div>
    </div>
  );
};
