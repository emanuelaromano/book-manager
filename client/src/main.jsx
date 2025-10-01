import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom';
import AuthPage from './pages/AuthPage.jsx';
import BooksPage from './pages/BooksPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import theme from './theme.js';

const queryClient = new QueryClient();

async function requireAuth() {
  const res = await fetch('/api/auth/me', { credentials: 'include' });
  if (!res.ok) throw redirect('/auth');
  return res.json();
}

const router = createBrowserRouter([
  { path: '/', element: <HomePage />, errorElement: <ErrorPage /> },
  { path: '/auth', element: <AuthPage />, errorElement: <ErrorPage /> },
  { path: '/books', element: <BooksPage />, loader: requireAuth, errorElement: <ErrorPage /> },
  { path: '*', element: <NotFoundPage /> }
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);


