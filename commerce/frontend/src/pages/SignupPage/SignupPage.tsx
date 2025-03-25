import React,{ useState } from 'react';
import { useNavigate } from "react-router-dom";
import { signup } from "../../api/signupApi";
import * as S from "./Signup.styled";
import ErrorModal from './components/ErrorModal';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        userId: '',
        password: '',
        nickName: '',
    });

    const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지를 위한 상태 추가

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // 회원가입 API 호출
        const { userId, password, nickName } = formData;

        // 회원가입 함수 호출
        const response = await signup(userId, password, nickName);

        if (response.success) {
            // 성공하면 로그인 페이지로 이동
            alert(response.message);
            navigate('/login');
        } else {
            // 실패한 경우 에러 메시지 표시
            setErrorMessage(response.message || '회원가입 실패');
        }
    };

    const handleCloseModal = () => {
        setErrorMessage(''); // 모달 닫기
    };

    return (
        <S.FormContainer>
            <S.Form onSubmit={handleSubmit}>
                <S.FormGroup>
                    <S.Title>회원가입</S.Title>
                    <S.Label htmlFor="userId">아이디</S.Label>
                    <S.Input
                        type="text"
                        id="userId"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        required
                    />
                </S.FormGroup>
                <S.FormGroup>
                    <S.Label htmlFor="password">비밀번호</S.Label>
                    <S.Input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </S.FormGroup>
                <S.FormGroup>
                    <S.Label htmlFor="nickName">닉네임</S.Label>
                    <S.Input
                        type="text"
                        id="nickName"
                        name="nickName"
                        value={formData.nickName}
                        onChange={handleChange}
                        required
                    />
                </S.FormGroup>
                <S.Button type="submit">회원가입</S.Button>
            </S.Form>
            {/* 에러 메시지 팝업 */}
            {errorMessage && <ErrorModal message={errorMessage} onClose={handleCloseModal} />}
        </S.FormContainer>
    );
};

export default SignupForm;
