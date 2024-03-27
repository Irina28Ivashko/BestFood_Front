import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchCategoriesBJU = createAsyncThunk('categoriesBJU/fetchCategories', async () => {
  const response = await axios.get('/categories');
  return response.data;
});

//создание категории
export const createCategoryBJU = createAsyncThunk(
  'categoriesBJU/createCategory',
  async (categoryData, { getState, rejectWithValue }) => {
    const { isAdmin } = getState().auth.data;
    if (!isAdmin) {
      return rejectWithValue('Только администраторы могут создавать категории.');
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/categories', categoryData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

//редактирование категории
export const updateCategoryBJU = createAsyncThunk(
  'categoriesBJU/updateCategory',
  async ({ categoryId, categoryData }, { getState, rejectWithValue }) => {
    const { isAdmin } = getState().auth.data;
    if (!isAdmin) {
      return rejectWithValue('Только администраторы могут обновлять категории.');
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`/categories/${categoryId}`, categoryData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

//удаление категорий
export const deleteCategoryBJU = createAsyncThunk(
  'categoriesBJU/deleteCategory',
  async (categoryId, { getState, rejectWithValue }) => {
    const { isAdmin } = getState().auth.data;
    if (!isAdmin) {
      return rejectWithValue('Только администраторы могут удалять категории.');
    }
    try {
      const token = localStorage.getItem('token');
      console.log(`Bearer token: ${token}`);
      await axios.delete(`/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return categoryId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const categoryBJUSlice = createSlice({
  name: 'categoriesBJU',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesBJU.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(createCategoryBJU.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(updateCategoryBJU.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteCategoryBJU.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const categoriesBJUReducer = categoryBJUSlice.reducer;
