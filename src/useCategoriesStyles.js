import { makeStyles } from '@mui/styles';

export const useCategoriesStyles = makeStyles({
  customButton: {
    display: 'flex ', // Добавляет Flexbox
    alignItems: 'center ', // Выравнивает иконку и текст по центру
    justifyContent: 'center ', // Центрирует содержимое по горизонтали

    backgroundColor: ' #199f5e !important',
    color: 'white !important',
    fontSize: '10px !important',
    padding: '10px 15px !important',

    '&:hover': {
      backgroundColor: ' #184d0b !important',
    },
  },
  customSvg: {
    verticalAlign: 'middle !important', // Выравнивает иконку SVG по вертикали
    flexShrink: 0, // Предотвращает сжатие иконки
    marginRight: '4px', // Добавляет пробел между иконкой и текстом
  },
});
