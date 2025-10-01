import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom';
import AuthPage from './pages/AuthPage.jsx';
import BooksPage from './pages/BooksPage.jsx';

const queryClient = new QueryClient();

async function requireAuth() {
  const res = await fetch('/api/auth/me', { credentials: 'include' });
  if (!res.ok) throw redirect('/auth');
  return res.json();
}

const router = createBrowserRouter([
  { path: '/', loader: () => redirect('/books') },
  { path: '/auth', element: <AuthPage /> },
  { path: '/books', element: <BooksPage />, loader: requireAuth }
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);


