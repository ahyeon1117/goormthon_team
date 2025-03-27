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

# Zustand 사용 예시 (인증)

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

## 주요 개념 설명

### 1. 인증 상태 관리 (useAuth 훅)

코드에서 `useAuth` 훅은 Zustand로 만든 스토어를 사용하는 커스텀 훅으로, 다음과 같은 인증 관련 상태와 함수를 제공합니다:
- `isAuthenticated`: 사용자 로그인 여부
- `userId`: 로그인한 사용자의 ID
- `token`: 인증 토큰
- `logout`: 로그아웃 함수

### 2. 컴포넌트에서 인증 상태 사용하기

첫 번째 예시는 프로필 페이지에서 인증 상태를 확인하는 방법을 보여줍니다:
- `useAuth` 훅을 통해 인증 상태를 가져옴
- `isAuthenticated`가 false면 로그인 필요 메시지 표시
- 로그인 상태면 사용자 ID를 표시하고 로그아웃 버튼 제공

### 3. API 호출 시 사용

두 번째 예시는 API 요청 시 인증 토큰을 사용하는 방법을 보여줍니다:
- `useAuth` 훅에서 `token`을 가져옴
- API 요청 시 토큰이 자동으로 사용됨 (코드에서는 명시적으로 토큰을 설정하는 부분이 없지만, 실제로는 `apiRequest` 객체가 내부적으로 토큰을 사용하도록 구성되어 있을 것임)

### 4. 인증 상태에 따른 라우트 보호

세 번째 예시는 인증되지 않은 사용자가 특정 페이지에 접근하지 못하도록 보호하는 방법을 보여줍니다:
- `ProtectedRoute` 컴포넌트는 `isAuthenticated` 상태를 확인
- 인증되지 않은 경우 로그인 페이지로 리다이렉트
- 인증된 경우 자식 컴포넌트(보호된 페이지 내용)를 렌더링
