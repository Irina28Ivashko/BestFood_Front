import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import axios from '../../axios';

// вход по логину и паролю
export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params) => {
  const { data } = await axios.post('/auth/login', params);
  return data;
});

// регистрация
export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
  const { data } = await axios.post('/auth/register', params);
  return data;
});

// получаем информацию о себе
export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
  const { data } = await axios.get('/auth/me');
  return data;
});

// восстановление пароля
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, newPassword, confirmNewPassword }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/auth/reset_password', {
        email,
        newPassword,
        confirmNewPassword,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const setCurrentAuthorRank = createAction('auth/setCurrentAuthorRank');

//  для обновления данных пользователя в настройках профиля
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.data.token;
      const response = await axios.patch('/users/update', userData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.user;
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      return rejectWithValue(error.response.data);
    }
  },
);

// для получения топ кулинаров
export const fetchTopCooks = createAsyncThunk('auth/fetchTopCooks', async () => {
  const response = await axios.get('/top-cooks');
  return response.data;
});

// Добавление рецепта в избранное
export const addRecipeToFavorites = createAsyncThunk(
  'recipes/addToFavorites',
  async (recipeId, { getState, dispatch }) => {
    const token = getState().auth.data.token;
    await axios.post(
      `/users/favorites`,
      { recipeId },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    // Обновляем список избранных рецептов в состоянии
    const updatedFavorites = getState().auth.favoriteRecipes.filter((id) => id !== recipeId);
    dispatch(updateFavoriteRecipes(updatedFavorites));
    dispatch(fetchFavoriteRecipes());
  },
);

//  для получения активности пользователя
export const getUserActivity = createAsyncThunk(
  'auth/getUserActivity',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/users/${userId}/activity`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении активности пользователя:', error);
      return rejectWithValue(error.response.data);
    }
  },
);

// получение инфо об профиле пользователя
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/users/${userId}/profile`); // Используйте правильный URL
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении профиля пользователя:', error);
      return rejectWithValue(error.response.data);
    }
  },
);

// Удаление рецепта из избранного
export const removeRecipeFromFavorites = createAsyncThunk(
  'recipes/removeFromFavorites',
  async (recipeId, { getState, dispatch }) => {
    const token = getState().auth.data.token;
    await axios.delete(`/users/favorites/${recipeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Обновляем список избранных рецептов, исключая удаленный рецепт
    const updatedFavorites = getState().auth.favoriteRecipes.filter((id) => id !== recipeId);
    dispatch(updateFavoriteRecipes(updatedFavorites));

    dispatch(fetchFavoriteRecipes());
  },
);

// Создание асинхронного действия для получения избранных рецептов
export const fetchFavoriteRecipes = createAsyncThunk(
  'auth/fetchFavoriteRecipes',
  async (_, { getState }) => {
    const token = getState().auth.data.token;

    const response = await axios.get('/users/favorites', {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data; // Предполагается, что сервер возвращает массив рецептов
  },
);

// При инициализации состояния, загрузите избранные рецепты из localStorage
const persistedFavoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];

// Добавление рецепта в список likes
export const addRecipeToLikes = createAsyncThunk(
  'recipes/addToLikes',
  async (recipeId, { getState, dispatch }) => {
    const token = getState().auth.data.token;
    const response = await axios.post(
      `/users/likes`,
      { recipeId },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    // Обновляем список избранных рецептов в состоянии
    const updatedLikes = [...getState().auth.likeRecipes, recipeId];
    dispatch(updateLikeRecipes(updatedLikes));
    dispatch(fetchLikeRecipes());
  },
);

// Удаление рецепта из списка likes
export const removeRecipeFromLikes = createAsyncThunk(
  'recipes/removeFromLikes',
  async (recipeId, { getState, dispatch }) => {
    const token = getState().auth.data.token;
    const response = await axios.delete(`/users/likes/${recipeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`[Client Remove Like] Response: `, response.data);
    // Обновляем список избранных рецептов, исключая удаленный рецепт
    const updatedLikes = getState().auth.likeRecipes.filter((id) => id !== recipeId);
    dispatch(updateLikeRecipes(updatedLikes));

    dispatch(fetchLikeRecipes());
  },
);

// Создание асинхронного действия для получения likes рецептов
export const fetchLikeRecipes = createAsyncThunk(
  'auth/fetchLikeRecipes',
  async (_, { getState }) => {
    const token = getState().auth.data.token;

    const response = await axios.get('/users/likes', {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data; // Предполагается, что сервер возвращает массив рецептов
  },
);

// При инициализации состояния, загрузите likes рецептов из localStorage
const persistedLikeRecipes = JSON.parse(localStorage.getItem('likeRecipes')) || [];

const initialState = {
  //инфо о пользователе загружается
  data: null,
  status: 'loading',
  favoriteRecipes: [],
  // favoriteRecipes: persistedFavoriteRecipes,
  likeRecipes: [],
  isAdmin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    //выйти из аккаунта
    logout: (state) => {
      state.data = null;
      state.favoriteRecipes = []; // Очищаем избранные рецепты
      state.likeRecipes = []; // Очищаем лайки
      localStorage.removeItem('token'); // Удаляем токен из localStorage
      localStorage.removeItem('favoriteRecipes'); // Очищаем избранные рецепты из localStorage
      localStorage.removeItem('likeRecipes');
    },

    setAuthState: (state, action) => {
      state.data = action.payload; // Устанавливаем состояние аутентификации
      state.currentUserId = action.payload?._id;
    },
    updateFavoriteRecipes: (state, action) => {
      state.favoriteRecipes = action.payload;
      localStorage.setItem('favoriteRecipes', JSON.stringify(state.favoriteRecipes));
    },

    updateLikeRecipes: (state, action) => {
      state.likeRecipes = action.payload;
      localStorage.setItem('likeRecipes', JSON.stringify(state.likeRecipes));
    },

    updateCurrentAuthorRank: (state, action) => {
      state.currentAuthorRank = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      //идет загрузка
      .addCase(fetchAuth.pending, (state) => {
        state.status = 'loading';
        state.data = null;
      })
      //запрос выполнился упешно
      .addCase(fetchAuth.fulfilled, (state, action) => {
        console.log('Аутентификация прошла успешно, пользователь:', action.payload);
        state.status = 'loaded';
        state.data = action.payload;
        state.isAdmin = action.payload.isAdmin;
      })
      //произошла ошибка
      .addCase(fetchAuth.rejected, (state) => {
        state.status = 'error';
        state.data = null;
      })

      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordStatus = 'loading';
        state.resetPasswordError = null;
      })
      // Обработка успешного сброса пароля
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPasswordStatus = 'succeeded';
        state.resetPasswordError = null;
        // Здесь можете выполнить дополнительные действия, например, перенаправление пользователя
      })
      // Обработка ошибки сброса пароля
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordStatus = 'failed';
        state.resetPasswordError = action.error.message;
        // Здесь можете сохранить сообщение об ошибке для отображения пользователю
      })

      //идет загрузка
      .addCase(fetchAuthMe.pending, (state) => {
        state.status = 'loading';
        //state.data = null;
      })
      //запрос выполнился упешно
      .addCase(fetchAuthMe.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.data = action.payload;
        state.favoriteRecipes = action.payload.favoriteRecipes || [];
      })
      //произошла ошибка
      .addCase(fetchAuthMe.rejected, (state) => {
        state.status = 'error';
        state.data = null;
      })

      //идет загрузка
      .addCase(fetchRegister.pending, (state) => {
        state.status = 'loading';
        state.data = null;
      })
      //запрос выполнился упешно
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.data = action.payload;
        state.isAdmin = action.payload.isAdmin;
      })
      //произошла ошибка
      .addCase(fetchRegister.rejected, (state) => {
        state.status = 'error';
        state.data = null;
      })

      // Обработка обновления профиля пользователя
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.data = { ...state.data, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        console.error('Ошибка при обновлении профиля:', action.error.message);
      })

      // обработка топ кулинаров
      .addCase(fetchTopCooks.fulfilled, (state, action) => {
        // Здесь логика для обработки успешного получения списка топ кулинаров
        state.topCooks = action.payload;
      })

      // Обработка получения избранных рецептов
      .addCase(fetchFavoriteRecipes.fulfilled, (state, action) => {
        state.favoriteRecipes = action.payload;
      })

      // Обработка получения likes рецептов
      .addCase(fetchLikeRecipes.fulfilled, (state, action) => {
        state.likeRecipes = action.payload;
      })

      // Обработка получения активности пользователя
      .addCase(getUserActivity.pending, (state) => {
        state.userActivityLoading = true;
      })
      .addCase(getUserActivity.fulfilled, (state, action) => {
        state.userActivityLoading = false;
        state.userActivity = action.payload;
      })
      .addCase(getUserActivity.rejected, (state) => {
        state.userActivityLoading = false;
        state.userActivity = null;
      })

      // получение ифнормации об пользователе
      .addCase(getUserProfile.pending, (state) => {
        state.userProfileLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfileLoading = false;
        state.userProfile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state) => {
        state.userProfileLoading = false;
        state.userProfile = null;
      })
      // для получения рейтинга автора
      .addCase(setCurrentAuthorRank, (state, action) => {
        state.currentAuthorRank = action.payload;
      });
  },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const {
  logout,
  setAuthState,
  updateFavoriteRecipes,
  updateLikeRecipes,
  updateCurrentAuthorRank,
} = authSlice.actions;
