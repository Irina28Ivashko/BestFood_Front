import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://bestfood-back-2qsm.onrender.com',
});

// когда порисходит любой запрос, всегда проверяй есть ли в localstorage что-то и вшивай это в инфу Authorization

instance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
