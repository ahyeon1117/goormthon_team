import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../../api/authApi";
import {
  Container,
  LoginForm,
  Title,
  InputGroup,
  Label,
  Input,
  LoginButton,
  SignupLink,
  ErrorMessage,
} from "./LoginPage.styled";

const LoginPage: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 아이디 유효성 검사
  const validateUserId = (value: string) => {
    if (!value) {
      setUserIdError("아이디를 입력해주세요");
      return false;
    }
    // 최소 길이 등 추가 조건 설정 가능
    if (value.length < 4) {
      setUserIdError("아이디는 최소 4자 이상이어야 합니다");
      return false;
    }
    setUserIdError("");
    return true;
  };

  // 비밀번호 유효성 검사
  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError("비밀번호를 입력해주세요");
      return false;
    }
    if (value.length < 6) {
      setPasswordError("비밀번호는 최소 6자 이상이어야 합니다");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    // 유효성 검사 실행
    const isUserIdValid = validateUserId(userId);
    const isPasswordValid = validatePassword(password);

    if (!isUserIdValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);

    // authApi의 login 함수 호출
    const loginResult = await login(userId, password);

    if (loginResult.success) {
      // 로그인 성공 시 이전 페이지로 이동 (또는 메인 페이지)
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      // 로그인 실패 시 에러 메시지 표시
      setLoginError(loginResult.message || "로그인에 실패했습니다");
    }

    setIsLoading(false);
  };

  return (
    <Container>
      <LoginForm onSubmit={handleSubmit}>
        <Title>로그인</Title>

        <InputGroup>
          <Label htmlFor="userId">아이디</Label>
          <Input
            id="userId"
            type="text"
            value={userId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUserId(e.target.value);
              if (userIdError) validateUserId(e.target.value);
            }}
            onBlur={(e) => validateUserId(e.target.value)}
            placeholder="아이디를 입력하세요"
            autoComplete="username"
            required
          />
          {userIdError && <ErrorMessage>{userIdError}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
              if (passwordError) validatePassword(e.target.value);
            }}
            onBlur={(e) => validatePassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            required
          />
          {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
        </InputGroup>

        {loginError && <ErrorMessage style={{ textAlign: 'center', marginBottom: '10px' }}>{loginError}</ErrorMessage>}

        <LoginButton type="submit" disabled={isLoading}>
          {isLoading ? "로그인 중..." : "로그인"}
        </LoginButton>

        <SignupLink>
          계정이 없으신가요? <a href="/signup">회원가입</a>
        </SignupLink>
      </LoginForm>
    </Container>
  );
};

export default LoginPage;
