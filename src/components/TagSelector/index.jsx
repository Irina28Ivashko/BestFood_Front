// теги по категорям рецептов

import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';

import styles from './TagSelector.module.scss';

export const TagSelector = ({ initialTags, catalog, onTagsChange }) => {
  const [tags, setTags] = useState([]); // Состояние для хранения массива тэгов

  useEffect(() => {
    if (initialTags) {
      setTags(initialTags);
    }
  }, [initialTags]);

  // Состояние для выбранной категории
  const [selectedCategory, setSelectedCategory] = useState(null);
  // Состояние для выбранного блюда (тэга)
  const [selectedTag, setSelectedTag] = useState(null);

  // Получение списка блюд для выбранной категории
  const getTagsForCategory = (category) => {
    return category ? catalog[category] : [];
  };

  // Функция обработки выбора тэгов
  const handleTagChange = (newTag) => {
    if (newTag && !tags.includes(newTag)) {
      if (tags.length < 5) {
        const newTags = [...tags, newTag];
        setTags(newTags);
        onTagsChange(newTags); // Обновление тегов в родительском компоненте
      } else {
        // Вывод уведомления, если пытаются добавить больше 5 тегов
        alert('Максимальное количество тегов к одному рецепту - 5.');
      }
    }
  };

  // Функция для удаления тэга
  const handleDeleteTag = (tagToDelete) => {
    setTags((tags) => tags.filter((tag) => tag !== tagToDelete));
  };

  // Функция для очистки всех тэгов
  const handleClearAllTags = () => {
    setTags([]);
  };

  return (
    <div>
      <div className={styles.fieldsContainer}>
        {/* Компонент Autocomplete для выбора категории */}
        <Autocomplete
          className={styles.autocompleteField}
          options={Object.keys(catalog)}
          value={selectedCategory}
          onChange={(event, newValue) => {
            setSelectedCategory(newValue);
            setSelectedTag(null); // Сброс выбранного блюда при смене категории
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Категория"
              inputProps={{
                ...params.inputProps,
                maxLength: 50, // Ограничение ввода до 50 символов
                onInput: (e) => {
                  e.target.value = e.target.value.replace(/[^a-zA-Zа-яА-Я\s]/gi, '');
                },
              }}
            />
          )}
        />

        {/* Компонент Autocomplete для выбора блюда */}
        {selectedCategory && (
          <Autocomplete
            className={styles.autocompleteField}
            options={getTagsForCategory(selectedCategory)}
            value={selectedTag}
            onChange={(event, newValue) => {
              setSelectedTag(newValue);
              // onTagsChange(newValue);
              handleTagChange(newValue); // Добавление нового тега
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Тег"
                inputProps={{
                  ...params.inputProps,
                  maxLength: 50, // Ограничение ввода до 50 символов
                  onInput: (e) => {
                    e.target.value = e.target.value.replace(/[^a-zA-Zа-яА-Я\s]/gi, '');
                  },
                }}
              />
            )}
          />
        )}
      </div>

      {/* Контейнер для отображения выбранных тегов */}
      <div className={styles.tagsDisplay}>
        <TextField
          label="Все теги"
          fullWidth
          variant="outlined"
          margin="normal"
          InputProps={{
            //Отображение выбранных тэгов с возможностью удаления
            startAdornment: tags.map((tag, index) => (
              <Chip key={index} label={tag} onDelete={() => handleDeleteTag(tag)} />
            )),
            endAdornment: (
              <InputAdornment position="end">
                <Button onClick={handleClearAllTags} size="small">
                  Очистить все
                </Button>
              </InputAdornment>
            ),
            readOnly: true,
          }}
        />
      </div>
    </div>
  );
};
