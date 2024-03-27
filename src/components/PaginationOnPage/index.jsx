// пагинация

import React from 'react';
import Pagination from '@mui/material/Pagination';
import styles from './PaginationOnPage.module.scss';

export const PaginationOnPage = ({ totalPages, currentPage, handlePageChange }) => {
  return (
    <div className={styles.paginationContainer}>
      <Pagination
        className={styles.pagination}
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
      />
    </div>
  );
};
