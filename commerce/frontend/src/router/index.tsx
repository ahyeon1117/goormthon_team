import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import MainPage from '../pages/MainPage/MainPage';
import SearchResultsPage from '../pages/SearchResultsPage/SearchResultsPage';
import DetailPage from '../pages/DetailPage/DetailPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import SignupPage from '../pages/SignupPage/SignupPage.tsx';
import CartPage from '../pages/CartPage/CartPage';
import OrderPage from '../pages/OrderPage/OrderPage';
import LibraryPage from '../pages/LibraryPage/LibraryPage';
import MyBookPage from '../pages/MyBookPage/MyBookPage';
import ProtectedRoute from './ProtectedRoute';
import EditnamePage from '../pages/EditPage/EditnamePage.tsx';

// 라우터 설정
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <MainPage />,
      },
      {
        path: '/search',
        element: <SearchResultsPage />,
      },
      {
        path: '/detail/:id',
        element: <DetailPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
      {
        path: '/edit',
        element: <EditnamePage />,
      },
      {
        path: '/cart',
        element: (
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/order',
        element: (
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/library',
        element: (
          <ProtectedRoute>
            <LibraryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/mybook',
        element: (
          <ProtectedRoute>
            <MyBookPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
