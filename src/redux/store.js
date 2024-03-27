import { configureStore } from '@reduxjs/toolkit';
import { postsReducer } from './slices/posts';
import { recipesReducer } from './slices/recipes';
import { authReducer } from './slices/auth';
import { categoriesBJUReducer } from './slices/categoriesBJU';
import { productsReducer } from './slices/products';
import commentsReducer from './slices/comments';

const store = configureStore({
  reducer: {
    posts: postsReducer,
    recipes: recipesReducer,
    auth: authReducer,
    comments: commentsReducer,
    categoriesBJU: categoriesBJUReducer,
    products: productsReducer,
  },
});

export default store;
