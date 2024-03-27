import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

// создание комментария
export const fetchAddComment = createAsyncThunk(
  'comments/fetchAddComment',
  async ({ contentType, contentId, text, userId }, { dispatch }) => {
    const response = await axios.post('/comments', { contentType, contentId, text, userId });

    return response.data;
  },
);

// для загрузки комментария к определенному рецепту или статье
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({ contentType, contentId }, { dispatch, getState }) => {
    // Очищаем текущие комментарии перед загрузкой новых
    dispatch(clearComments());

    const { data } = await axios.get(`/comments/${contentType}/${contentId}`);
    return data;
  },
);

// получение одного комментария
export const fetchOneComment = createAsyncThunk('comments/fetchOneComment', async (commentId) => {
  try {
    const { data } = await axios.get(`/comments/${commentId}`);

    return data;
  } catch (error) {
    console.error('Ошибка при получении одного комментария:', error);
    return null;
  }
});

// удаление комментария
export const fetchDeleteComment = createAsyncThunk(
  'comments/fetchDeleteComment',
  async ({ commentId, contentId, contentType }, { dispatch }) => {
    await axios.delete(`/comments/${commentId}`);
    // После успешного удаления, обновляем список комментариев
    // dispatch(fetchComments({ contentId, contentType }));
    return commentId;
  },
);

// редактирование комментария

export const fetchUpdateComment = createAsyncThunk(
  'comments/fetchUpdateComment',
  async ({ commentId, text, contentId, contentType }, { dispatch }) => {
    const response = await axios.patch(`/comments/${commentId}`, { text });
    // После успешного редактирования, обновляем список комментариев
    // dispatch(fetchComments({ contentId, contentType }));
    return response.data;
  },
);

const initialState = {
  items: [],
  status: 'loading', // 'loading', 'succeeded', 'failed'
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,

  reducers: {
    // Добавляем новый экшн для очистки комментариев
    clearComments(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchAddComment.fulfilled, (state, action) => {
        console.log('Комментарий добавлен:', action.payload);
        // state.items = action.payload;
        state.items.unshift(action.payload);
        state.status = 'succeeded';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        // state.items = action.payload;
        if (action.payload && Array.isArray(action.payload.comments)) {
          state.items = action.payload.comments;
        } else {
          console.error('Полученные данные не содержат массив комментариев', action.payload);
        }
        state.status = 'succeeded';
      })
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(fetchComments.rejected, (state) => {
        state.status = 'failed';
      })

      // удаление комментария
      .addCase(fetchDeleteComment.fulfilled, (state, action) => {
        state.items = state.items.filter((comment) => comment._id !== action.payload);
      })
      // редактирование комменария
      .addCase(fetchUpdateComment.fulfilled, (state, action) => {
        const commentId = action.payload._id;
        const commentToUpdate = state.items.find((comment) => comment._id === commentId);
        if (commentToUpdate) {
          commentToUpdate.text = action.payload.text;
        }
      });
  },
});

export default commentsSlice.reducer;

export const { clearComments } = commentsSlice.actions;
