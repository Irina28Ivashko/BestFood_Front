import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from '../../axios';

// Селектор для получения состояния поиска
const selectSearchResults = (state) => state.products.searchResults;

// Мемоизированный селектор для результатов поиска
export const searchResultsSelector = createSelector([selectSearchResults], (searchResults) => {
  // Пример трансформации: фильтрация или сортировка результатов
  return searchResults.filter((result) => result.someCondition).sort((a, b) => a.compare(b));
});

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get('/products');
  return response.data;
});

// создание продукта
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { getState, rejectWithValue }) => {
    const token = getState().auth.data.token || localStorage.getItem('token');
    if (!token) {
      console.log("Token is undefined, make sure it's correctly set in the auth state.");
      return rejectWithValue('Аутентификация не выполнена. Токен не найден.');
    }
    try {
      const response = await axios.post('/products', productData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

//    обновление продукта (только для администраторов)
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, updateData }, { getState, rejectWithValue }) => {
    const { data } = getState().auth;
    const { token, isAdmin } = data;
    if (!isAdmin) {
      return rejectWithValue('Только администраторы могут обновлять продукты.');
    }
    try {
      const token = data.token;
      const response = await axios.patch(`/products/${productId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

//    удаление продукта (только для администраторов)
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { getState, rejectWithValue }) => {
    const { data } = getState().auth;
    const { token, isAdmin } = data;
    if (!isAdmin) {
      return rejectWithValue('Только администраторы могут удалять продукты.');
    }
    try {
      const token = data.token;
      await axios.delete(`/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return productId; // Возвращаем ID удалённого продукта для обновления состояния
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

//   для получения продуктов по категории
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (categoryId) => {
    const response = await axios.get(`/products/category/${categoryId}`);
    return { categoryId, products: response.data };
  },
);

// Пример оптимизированного селектора, который извлекает и трансформирует данные
export const selectProductsByCategoryOptimized = createSelector(
  [(state) => state.products.byCategory, (state, categoryId) => categoryId],
  (byCategory, categoryId) => {
    const products = byCategory[categoryId] || [];
    // Пример трансформации данных, если это необходимо
    return products.map((product) => ({
      ...product,
      // Пример добавления дополнительных данных или трансформации существующих
    }));
  },
);

// Оптимизированный селектор
export const selectProductsByCategory = createSelector(
  [(state) => state.products.byCategory, (state, categoryId) => categoryId],
  (byCategory, categoryId) => {
    // Убедитесь, что возвращается массив, даже если категория отсутствует
    return byCategory[categoryId] ? [...byCategory[categoryId]] : [];
  },
);

// Селекторы
const selectStatusState = (state) => state.products.status;

export const selectProductLoadingStatus = createSelector([selectStatusState], (status) => status);

export const selectProductById = createSelector(
  [(state) => state.products.items, (state, productId) => productId],
  (items, productId) => items.find((product) => product._id === productId),
);

// Для получения продуктов по идентификаторам от разных категорий
export const fetchProductsByIds = createAsyncThunk(
  'products/fetchProductsByIds',
  async (productIds, { getState, rejectWithValue }) => {
    try {
      const response = await axios.post('/products/byIds', { ids: productIds });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

//  для поиска продуктов
export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/products/search?query=${searchTerm}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    byCategory: {},
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    loading: false,
    error: null,
    searchResults: [],
    activeCategoryId: null, // Добавленное поле для активной категории
  },
  reducers: {
    // Добавляем редьюсер для управления активной категорией
    setActiveCategoryId(state, action) {
      state.activeCategoryId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        const categoryId = action.payload.category;
        if (!state.byCategory[categoryId]) {
          state.byCategory[categoryId] = [];
        }
        state.byCategory[categoryId].push(action.payload);
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        const categoryId = action.payload.category;
        if (state.byCategory[categoryId]) {
          const index = state.byCategory[categoryId].findIndex(
            (product) => product._id === action.payload._id,
          );
          if (index !== -1) {
            state.byCategory[categoryId][index] = action.payload;
          }
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const productId = action.payload; // ID удаленного продукта
        Object.keys(state.byCategory).forEach((categoryId) => {
          state.byCategory[categoryId] =
            state.byCategory[categoryId]?.filter((product) => product._id !== productId) || [];
        });
      })

      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        const { categoryId, products } = action.payload;
        state.byCategory[categoryId] = products;
        state.loading = false;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchProductsByIds.fulfilled, (state, action) => {
        action.payload.forEach((product) => {
          if (!state.items.find((p) => p._id === product._id)) {
            state.items.push(product);
          }
        });
      })

      .addCase(searchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setActiveCategoryId } = productSlice.actions;

export const productsReducer = productSlice.reducer;
