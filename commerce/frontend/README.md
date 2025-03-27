# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

# 인증 상태 관리 시스템 사용 예시

## 컴포넌트에서 인증 상태 사용하기

```tsx
import { useAuth } from '../hooks/useAuth';

function ProfilePage() {
  const { isAuthenticated, userId, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>로그인이 필요합니다</div>;
  }

  return (
    <div>
      <h1>프로필 페이지</h1>
      <p>사용자 ID: {userId}</p>
      <button onClick={logout}>로그아웃</button>
    </div>
  );
}
```

## API 호출 시 사용

```tsx
import { useAuth } from '../hooks/useAuth';
import { apiRequest } from '../api/client';

function UserDataComponent() {
  const { token } = useAuth();
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    try {
      // 토큰이 이미 Zustand 스토어에 의해 관리되므로 별도로 설정할 필요 없음
      const response = await apiRequest.get('/api/v1/user/data');
      setUserData(response.data);
    } catch (error) {
      console.error('사용자 데이터 가져오기 실패:', error);
    }
  };

  // ... 컴포넌트 코드
}
```

## 인증 상태에 따른 라우트 보호

```tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```
