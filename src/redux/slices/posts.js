import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ page = 1, limit = 9 } = {}) => {
    const query = `/posts?page=${page}&limit=${limit}&sort=-createdAt`;
    const { data } = await axios.get(query);
    return data;
  },
);

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
  const { data } = await axios.get('/tags');
  return data;
});

export const fetchMyPosts = createAsyncThunk(
  'posts/fetchMyPosts',
  async ({ userId, page, limit }) => {
    const response = await axios.get(`/posts/my?userId=${userId}&page=${page}&limit=${limit}`);
    return response.data;
  },
);

export const fetchRemovePost = createAsyncThunk(
  'posts/fetchRemovePost',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/posts/${id}`);
      return response.data; // Сохраняем только данные, не включая заголовки
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  posts: {
    items: [],
    status: 'loading',
    totalPages: 0,
  },
  tags: {
    items: [],
    status: 'loading',
  },
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //получение статей
      //идет загрузка
      .addCase(fetchPosts.pending, (state) => {
        state.posts.items = [];
        state.posts.status = 'loading';
      })
      //запрос выполнился упешно
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts.items = action.payload.items;
        state.posts.totalPages = action.payload.totalPages;
        state.posts.status = 'loaded';
      })

      //произошла ошибка
      .addCase(fetchPosts.rejected, (state) => {
        state.posts.items = [];
        state.posts.status = 'error';
      })

      // для получения статей пользователя
      .addCase(fetchMyPosts.fulfilled, (state, action) => {
        state.posts.items = action.payload;
        state.posts.status = 'loaded';
      })
      .addCase(fetchMyPosts.rejected, (state) => {
        state.posts.items = [];
        state.posts.status = 'error';
      })
      //удаление статьи

      .addCase(fetchRemovePost.pending, (state, action) => {
        state.posts.items = state.posts.items.filter((obj) => obj._id !== action.meta.arg);
      });
  },
});

export const postsReducer = postSlice.reducer;
