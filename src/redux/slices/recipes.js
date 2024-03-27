import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';
import { fetchFavoriteRecipes, fetchLikeRecipes } from './auth.js';

// Асинхронный action для получения рецептов
export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async ({ page = 1, limit = 9, category = null, tag = null }) => {
    let query;
    if (category) {
      // Если указана категория, используем соответствующий эндпоинт
      query = `/recipes/category/${encodeURIComponent(category)}?page=${page}&limit=${limit}`;
    } else if (tag) {
      // Если указан тег, используем эндпоинт для тегов
      query = `/recipes/tag/${encodeURIComponent(tag)}?page=${page}&limit=${limit}`;
    } else {
      // Если ничего не указано, используем общий эндпоинт
      query = `/recipes?page=${page}&limit=${limit}&sort=-createdAt`;
    }

    const { data } = await axios.get(query);

    return data;
  },
);

//  для получения рецептов текущего пользователя
export const fetchMyRecipes = createAsyncThunk(
  'recipes/fetchMyRecipes',
  async ({ page = 1, limit = 9 }) => {
    const { data } = await axios.get(`/recipes/my?page=${page}&limit=${limit}`);
    return data;
  },
);

// для обновления рецепта
export const fetchUpdateRecipe = createAsyncThunk(
  'recipes/fetchUpdateRecipe',
  async ({ id, data }) => {
    const response = await axios.patch(`/recipes/${id}`, data);
    return response.data;
  },
);

//  для удаления рецепта
export const fetchRemoveRecipe = createAsyncThunk(
  'recipes/fetchRemoveRecipe',
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      await axios.delete(`/recipes/${id}`);

      dispatch(removeRecipe(id)); // Диспатчим действие удаления рецепта из состояния

      const token = getState().auth.data.token;
      if (token) {
        dispatch(fetchFavoriteRecipes()); // Обновление избранных рецептов
        dispatch(fetchLikeRecipes()); // Обновление лайкнутых рецептов
      }

      return id;
    } catch (error) {
      console.error('Ошибка при удалении рецепта:', error);
      return rejectWithValue(error.response.data);
    }
  },
);

// Асинхронный action для поиска рецептов
export const fetchSearchRecipes = createAsyncThunk(
  'recipes/fetchSearchRecipes',
  async (query, { rejectWithValue }) => {
    if (typeof query !== 'string') {
      return rejectWithValue('Query must be a string');
    }
    try {
      const response = await axios.get(`/recipes/search?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Начальное состояние
const initialState = {
  recipes: {
    items: [],
    status: 'loading', // loading, loaded, error

    totalPages: 0,
  },
  tags: {
    items: [],
    status: 'loading',
  },
  error: null,
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    //удаление рецепта
    removeRecipe: (state, action) => {
      state.recipes.items = state.recipes.items.filter((recipe) => recipe._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Получение рецептов
      .addCase(fetchRecipes.pending, (state) => {
        state.recipes.items = [];
        state.recipes.status = 'loading';
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.recipes.items = action.payload.items;
        state.recipes.totalPages = action.payload.totalPages;
        state.recipes.status = 'loaded';
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        // Обработка ошибок при получении рецептов
        console.error('Ошибка при получении рецептов:', action.error);
        state.recipes.items = [];
        state.recipes.status = 'error';
      })

      //  Получение рецептов пользователя
      .addCase(fetchMyRecipes.pending, (state) => {
        state.recipes.items = [];
        state.recipes.status = 'loading';
      })
      .addCase(fetchMyRecipes.fulfilled, (state, action) => {
        state.recipes.items = action.payload.items;
        state.recipes.totalPages = action.payload.totalPages;
        state.recipes.status = 'loaded';
      })
      .addCase(fetchMyRecipes.rejected, (state, action) => {
        console.error('Ошибка при получении рецептов пользователя:', action.error);
        state.recipes.items = [];
        state.recipes.status = 'error';
      })
      // Редактирование рецепта
      .addCase(fetchUpdateRecipe.pending, (state) => {
        state.recipes.status = 'loading';
      })
      .addCase(fetchUpdateRecipe.fulfilled, (state, action) => {
        state.recipes.items = state.recipes.items.map((recipe) =>
          recipe._id === action.payload._id ? action.payload : recipe,
        );
        state.recipes.status = 'loaded';
      })
      .addCase(fetchUpdateRecipe.rejected, (state, action) => {
        console.error('Ошибка при редактировании рецепта:', action.error.message);
        state.recipes.status = 'error';
      })

      // Поиск рецепта
      .addCase(fetchSearchRecipes.pending, (state) => {
        state.recipes.status = 'loading';
      })
      .addCase(fetchSearchRecipes.fulfilled, (state, action) => {
        state.recipes.items = action.payload;
        state.recipes.status = 'loaded';
      })
      .addCase(fetchSearchRecipes.rejected, (state, action) => {
        state.recipes.status = 'error';
        state.error = action.error.message;
      });
  },
});

export const recipesReducer = recipesSlice.reducer;

export const { removeRecipe } = recipesSlice.actions;
