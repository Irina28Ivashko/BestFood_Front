import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationProvider } from './context/Notification';

import { fetchAuthMe, selectIsAuth, setAuthState } from './redux/slices/auth';
import Layout from './components/Layout/Layout';

import {
  Home,
  FullPost,
  FullRecipe,
  Registration,
  ResetPassword,
  ProfileSettings,
  AddPost,
  FavoritesBook,
  Login,
  AddRecipe,
  RecipesByCategory,
  RecipesByParentCategory,
  AllRecipes,
  AllPosts,
  MyRecipes,
  MyPosts,
  Likes,
  TopCook,
  CookUser,
  CalculatorBJU,
  AddCalculatorBJU,
} from './pages';

import './scss/app.scss';

function App() {
  const dispatch = useDispatch();
  // const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    //dispatch(setLoading(true)); // Устанавливаем статус загрузки перед восстановлением состояния
    const token = localStorage.getItem('token');
    if (token) {
      // Восстанавливаем состояние аутентификации из localStorage
      dispatch(setAuthState({ token }));
      // Также можно отправить запрос на сервер для проверки валидности токена
      dispatch(fetchAuthMe());

      // Добавьте запрос к серверу для получения избранных рецептов
      // dispatch(fetchFavoriteRecipes());
    }
  }, [dispatch]);

  return (
    <NotificationProvider>
      <div className="wrapper">
        <div className="content">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route
                index
                element={
                  <>
                    <Home />
                  </>
                }
              />
              {/* Рецепты: добавить рецепт, редактировать, полный рецепт */}
              <Route path="/add-recipe" element={<AddRecipe />} />
              <Route path="/recipes/edit/:id" element={<AddRecipe />} />
              <Route path="/recipes/:id" element={<FullRecipe />} />

              {/* Статьи: добавить статью, полная статья, редактировать */}
              <Route path="/add-post" element={<AddPost />} />
              <Route path="/posts/:id" element={<FullPost />} />
              <Route path="/posts/:id/edit" element={<AddPost />} />

              {/* Книга рецептов, рецепты по тегам, рецепты по категироям  */}
              <Route path="/favorites" element={<FavoritesBook />} />
              <Route path="/tag/:tag" element={<RecipesByCategory />} />
              <Route path="/category/:category" element={<RecipesByParentCategory />} />

              {/* Все рецепты, все статьи, топ кулинаров, калькулятор калорий, добав.калькул. */}
              <Route path="/recipes" element={<AllRecipes />} />
              <Route path="/posts" element={<AllPosts />} />
              <Route path="/top-cooks" element={<TopCook />} />
              <Route path="/users/:userId/activity" element={<CookUser />} />
              <Route path="/calculator" element={<CalculatorBJU />} />
              <Route path="/add-calculator" element={<AddCalculatorBJU />} />

              {/* Авторизация, регистарция, настройка профиля */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/profile-settings" element={<ProfileSettings />} />

              {/* Мои добавленые рецепты, мои доб. статьи, мои лайки */}
              <Route path="/my-recipes" element={<MyRecipes />} />
              <Route path="/my-posts" element={<MyPosts />} />
              <Route path="/likes" element={<Likes />} />
            </Route>
          </Routes>
        </div>
      </div>
    </NotificationProvider>
  );
}

export default App;
