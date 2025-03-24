import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import MainPage from '../pages/MainPage/MainPage';
import SearchResultsPage from '../pages/SearchResultsPage/SearchResultsPage';
import DetailPage from '../pages/DetailPage/DetailPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import CartPage from '../pages/CartPage/CartPage';

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
        path: '/cart',
        element: <CartPage />,
      },
    ],
  },
]);

export default router;
