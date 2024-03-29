// шаги приготовления

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Button, TextField, IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close'; // крестик для удаления шага

import styles from './RecipeSteps.module.scss';

export const RecipeSteps = ({ initialSteps, onStepsChange }) => {
  //  создание начального объекта шага
  const createInitialStep = () => ({ imageUrl: '', description: '' });

  const [steps, setSteps] = useState(initialSteps || [{ imageUrl: '', description: '' }]);

  //  создание двух начальных шагов
  // const [steps, setSteps] = useState([createInitialStep(), createInitialStep()]);

  useEffect(() => {
    if (initialSteps) {
      setSteps(initialSteps);
    }
  }, [initialSteps]);

  // Функция для загрузки изображения
  const handleUploadImage = async (index, file) => {
    const token = localStorage.getItem('token'); // Получение токена

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff'];
    const maxSizeMB = 3; // Максимальный размер файла в МБ
    const maxSizeBytes = maxSizeMB * 1024 * 1024; // Пересчитываем максимальный размер файла в байтах

    if (!allowedTypes.includes(file.type)) {
      alert('Недопустимый тип файла. Разрешены только изображения (JPEG, PNG, GIF, BMP, TIFF).');
      return; // Прекращаем выполнение функции, если тип файла недопустим
    }

    if (file.size > maxSizeBytes) {
      alert(`Размер файла превышает ${maxSizeMB} МБ. Пожалуйста, выберите другой файл.`);
      return; // Прекращаем выполнение функции, если файл слишком большой
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await axios.post(
        'https://bestfood-back-2qsm.onrender.com/upload',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // После успешной загрузки обновляем URL изображения в соответствующем шаге
      // if (data.url) {
      //   const newSteps = [...steps];
      //   newSteps[index].imageUrl = `https://bestfood-back-2qsm.onrender.com${data.url}`;
      //   setSteps(newSteps);
      //   onStepsChange(newSteps);
      //   // handleStepChange(index, 'imageUrl', `https://bestfood-back-2qsm.onrender.com${data.url}`);
      // }

      const updatedSteps = steps.map((step, stepIndex) => {
        if (index === stepIndex) {
          return { ...step, imageUrl: `https://bestfood-back-2qsm.onrender.com${data.url}` };
        }
        return step;
      });
      setSteps(updatedSteps);
      onStepsChange(updatedSteps);

      // Дальнейшая обработка ответа сервера
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
      alert('Не удалось загрузить изображение. Попробуйте ещё раз.');
    }
  };

  // Функция для обработки изменений в шагах
  const handleStepChange = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
    onStepsChange(newSteps);
  };
  // const handleStepChange = (index, field, value) => {
  //   const updatedSteps = [...steps];
  //   updatedSteps[index][field] = value;
  //   setSteps(updatedSteps); // Обновление состояния шагов
  //   onStepsChange(updatedSteps);
  // };

  // Функция для удаления изображения
  const handleDeleteImage = (index) => {
    const newSteps = steps.map((step, stepIndex) => {
      if (index === stepIndex) {
        return { ...step, imageUrl: '' };
      }
      return step;
    });
    setSteps(newSteps);
    onStepsChange(newSteps);
  };
  // const handleDeleteImage = (index) => {
  //   handleStepChange(index, 'imageUrl', '');
  // };

  // Функция для добавления нового шага
  const addStep = () => {
    setSteps([...steps, { imageUrl: '', description: '' }]);
  };

  // Функция для удаления шага
  const removeStep = (index) => {
    const newSteps = steps.filter((_, idx) => idx !== index);
    setSteps(newSteps); // Обновление состояния после удаления шага
    onStepsChange(newSteps);
  };

  return (
    <div className={styles.stepsContainer}>
      <h2>Пошаговая инструкция</h2>
      {steps.map((step, index) => (
        // Заголовок шага с кнопкой добавления изображения
        <div key={index} className={styles.step}>
          <div className={styles.stepHeader}>
            <h3 className={styles.stepNumber}>ШАГ {index + 1}</h3>
            <IconButton color="primary" component="label">
              <input
                hidden
                type="file"
                onChange={(e) => handleUploadImage(index, e.target.files[0])}
              />
              <PhotoCamera />
            </IconButton>

            {step.imageUrl && (
              <div className={styles.photoPreview}>
                <img src={step.imageUrl} alt={`Шаг ${index + 1}`} />
                <IconButton color="error" onClick={() => handleDeleteImage(index)}>
                  <CloseIcon />
                </IconButton>
              </div>
            )}
          </div>

          {/* Текстовое поле для описания шага */}
          <TextField
            label={`Инструкция к шагу приготовления `}
            multiline
            rows={2} // Уменьшаем количество строк
            variant="outlined"
            fullWidth
            value={step.description}
            onChange={(e) => handleStepChange(index, 'description', e.target.value)}
            inputProps={{ maxLength: 500 }}
            className={styles.stepDescription}
          />
          {/* Кнопка для удаления шага (отображается начиная со второго шага) */}
          <IconButton
            color="error"
            onClick={() => removeStep(index)}
            className={styles.deleteButton}>
            <CloseIcon />
          </IconButton>
        </div>
      ))}
      {/* Кнопка для добавления нового шага */}
      <Button variant="contained" onClick={addStep} className={styles.addButton}>
        Добавить шаг
      </Button>
    </div>
  );
};
