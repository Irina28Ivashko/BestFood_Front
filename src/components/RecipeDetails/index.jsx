// обработчки для изменения кол-ва порций и времени приготовления в рецепте

import React, { useState, useEffect } from 'react';
import { TextField, Grid, Typography } from '@mui/material';

import styles from './RecipeDetails.module.scss'; // Подключение стилей

export const RecipeDetails = ({ initialDetails, onDetailsChange }) => {
  // Состояния для хранения количества порций, часов и минут
  const [portions, setPortions] = useState(1); // Количество порций по умолчанию равно 1
  const [hours, setHours] = useState(0); // Количество часов по умолчанию равно 0
  const [minutes, setMinutes] = useState(30); // Количество минут по умолчанию равно 30

  // Хук эффекта для инициализации состояния деталей рецепта из пропсов initialDetails
  useEffect(() => {
    if (initialDetails) {
      // Если initialDetails переданы, обновляем состояние компонента
      setPortions(initialDetails.portions);
      setHours(initialDetails.hours);
      setMinutes(initialDetails.minutes);
    }
  }, [initialDetails]); // Эффект зависит от initialDetails

  // обработкa изменения количества порций
  const handlePortionsChange = (value) => {
    let newValue = Math.max(1, Math.min(1000, value)); // Ограничиваем значение от 1 до 1000
    // const newValue = value < 0 ? 0 : value; // Предотвращение отрицательных значений
    setPortions(newValue); // Обновляем состояние порций

    // Обновление состояния в родительском компоненте
    onDetailsChange({ portions: newValue, hours, minutes });
  };

  // обработкa изменения времени приготовления
  const handleTimeChange = (field, value) => {
    let newValue = Math.max(0, Math.min(field === 'hours' ? 23 : 59, value)); // Ограничиваем значения
    // const newValue = value < 0 ? 0 : value; // Предотвращение отрицательных значений

    // В зависимости от поля обновляем соответствующее состояние
    if (field === 'hours') {
      setHours(newValue);
    } else {
      setMinutes(newValue);
    }

    //  обновление состояния в родительском компоненте
    onDetailsChange({
      portions,
      hours: field === 'hours' ? newValue : hours,
      minutes: field === 'minutes' ? newValue : minutes,
    });
  };

  return (
    <div className={styles.detailsWrapper}>
      <Grid
        container
        justifyContent="center"
        spacing={2}
        alignItems="center"
        className={styles.detailsContainer}>
        {/* Поле для ввода количества порций */}
        <Grid item xs={2}>
          <Typography variant="subtitle2" gutterBottom className={styles.label}>
            Количество порций
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={portions}
            onChange={(e) => handlePortionsChange(Number(e.target.value))}
            InputProps={{ inputProps: { min: 1, max: 1000 } }}
            className={styles.tinyInput}
          />
        </Grid>

        {/* Поле для ввода часов приготовления */}

        <Grid item xs="auto" className={styles.timeContainer}>
          <Typography variant="subtitle1" align="center" gutterBottom>
            Время приготовления
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Час(ов)"
                type="number"
                value={hours}
                sx={{ width: '100px', marginRight: '200px' }}
                onChange={(e) => handleTimeChange('hours', Number(e.target.value))}
                InputProps={{ inputProps: { min: 0, max: 23 } }}
                className={styles.tinyInput}
              />
            </Grid>

            {/* Поле для ввода минут приготовления */}

            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Минут"
                type="number"
                value={minutes}
                sx={{ width: '100px' }}
                onChange={(e) => handleTimeChange('minutes', Number(e.target.value))}
                InputProps={{ inputProps: { min: 0, max: 59 } }}
                className={styles.tinyInput}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
