import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import SearchResultsPage from '../pages/SearchResults/SearchResultsPage';
import MainPage from '../pages/MainPage/MainPage'

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
    ],
  },
]);

export default router;
