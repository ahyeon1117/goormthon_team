import rocketIcon from '../assets/rocket-icon.svg';

import { signup } from '../api/auth';
import { SignupRequest } from '../types/api';
import UserForm from '../components/auth/UserForm';
import { useAuthForm } from '../hooks/useAuthForm';

const SignupPage = () => {
  const { form, handleChange, handleSubmit } = useAuthForm<SignupRequest>({
    initialState: { username: '', email: '', password: '' },
    submitFn: signup,
    errorMessage: '회원가입에 실패했습니다. 이름, 이메일과 비밀번호를 확인해주세요.',
  });
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative">
      <div className="absolute w-full max-w-5xl min-h-[60vh] rounded-lg border border-white rotate-3 z-0" />

      <div className="relative flex flex-col md:flex-row w-full max-w-5xl min-h-[60vh] h-full rounded-lg overflow-hidden">
        {/* Left Section */}
        <div className="md:w-1/2 bg-card-left text-white p-12 flex flex-col justify-center">
          <h1 className="text-7xl font-bold leading-tight">ROCKET</h1>
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-7xl font-bold leading-tight mb-4">IDE</h1>
            <img src={rocketIcon} alt="rocket icon" className="h-16 w-16 rotate-[30deg]" />
          </div>

          <p className="text-sm font-noto">
            “우리는 지금 당장 실현 가능한 기술로 의미 있는 변화를 만들어냅니다.” “그리고 이 작은
            시작은 앞으로의 더 큰 확장 가능성을 품고 있습니다.”
          </p>
        </div>

        {/* Right Section */}
        <UserForm
          form={form}
          isSignup
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel="Sign Up"
        />
      </div>
    </div>
  );
};

export default SignupPage;
