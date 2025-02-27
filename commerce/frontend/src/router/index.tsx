import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import SearchResultsPage from '../pages/SearchResults/SearchResultsPage';

// 라우터 설정
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <div>홈 페이지</div>, // 홈 페이지 컴포넌트로 교체 가능
      },
      {
        path: '/search-results',
        element: <SearchResultsPage />,
      },
    ],
  },
]);

export default router;
