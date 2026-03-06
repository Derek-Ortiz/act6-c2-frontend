import axios from 'axios';

// Tomamos la URL del backend desde las variables de entorno de Next.js
// Si no existe, usamos el localhost por defecto
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api/v1';

export const apiClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor opcional: Muy útil si en el futuro agregas autenticación con Tokens
apiClient.interceptors.request.use((config) => {
  // const token = localStorage.getItem('token');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});