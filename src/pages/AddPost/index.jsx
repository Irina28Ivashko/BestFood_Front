// добавление статьи (создание, редактирование, удаление)

import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor'; //библиотека для редактирования статей

import 'easymde/dist/easymde.min.css';
import { selectIsAuth } from '../../redux/slices/auth';
import styles from './AddPost.module.scss';
import axios from '../../axios';

export const AddPost = () => {
  const { id } = useParams(); // Получение ID статьи из URL (для редактирования)
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth); // Проверка, авторизован ли пользователь

  // Состояния компонента для управления формой добавления/редактирования статьи
  const [isLoading, setLoading] = React.useState(false); // Состояние загрузки (для индикации процесса сохранения)
  const [text, setText] = React.useState(''); // Текст статьи
  const [title, setTitle] = React.useState(''); // заголовок статьи
  const [tags, setTags] = React.useState(''); // теги статьи
  const [imageUrl, setImageUrl] = React.useState(''); // изображение статьи
  const inputFileRef = React.useRef(null); // Ref для скрытого инпута файлов (загрузка изображения)

  const isEditing = Boolean(id); // Определяем, находимся ли в режиме редактирования статьи

  // Обработчик загрузки изображения
  const handleChangeFile = async (event) => {
    try {
      //Добавление картинки в статью

      const file = event.target.files[0];

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff'];
      const maxSizeMB = 3; // Максимальный размер файла в МБ теперь 3 МБ
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

      // отправка на сервер
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при закгрузке файла!');
    }
  };

  // Обработчик удаления изображения
  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  // Обработчик изменения текста статьи (Markdown редактор)
  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  // Обработчик сохранения/публикации статьи
  const onSubmit = async () => {
    try {
      //создание статьи
      setLoading(true);

      const fields = {
        title,
        imageUrl,
        tags,
        text,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при создании статьи!');
    }
  };

  //для редактирования статьи
  React.useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setImageUrl(data.imageUrl);
          setTags(data.tags.join(', '));
        })
        .catch((err) => {
          console.warn(err);
          alert('Ошибка при получении статьи!');
        });
    }
  }, [id]);

  // Настройки для редактора Markdown
  const options = React.useMemo(() => {
    const uniqueId = isEditing ? `post-${id}` : `post-new-${Date.now()}`;
    return {
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        uniqueId: uniqueId,
        delay: 1000,
      },
    };
  }, [isEditing, id]);

  //если не авторизованыmb и нет токена, то переходим на гл.стр.
  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <div className={styles.buttonContainer}>
        {/* Форма для загрузки изображения, ввода заголовка и текста статьи */}
        <Button
          onClick={() => inputFileRef.current.click()}
          variant="outlined"
          size="large"
          className={styles.uploadButton}>
          Загрузить изображение
        </Button>
        <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
        {imageUrl && (
          <>
            <Button
              variant="contained"
              color="error"
              onClick={onClickRemoveImage}
              className={styles.deleteButton}>
              Удалить
            </Button>
            <img
              className={styles.image}
              src={`https://bestfood-back-2qsm.onrender.com${imageUrl}`}
              alt="Uploaded"
            />
          </>
        )}
      </div>
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />

      {/* Кнопки для сохранения/отмены действий */}
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
