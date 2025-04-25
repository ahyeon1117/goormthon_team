import { useUserForm } from '../../hooks/useUserForm';
import { useUser } from '../../hooks/useUser';

const UserEditForm = () => {
  const { handleUpdateUser } = useUser();
  const { form, handleChange, validateForm, error } = useUserForm();

  const handleSubmit = () => {
    if (!validateForm()) return;
    handleUpdateUser(form);
  };

  return (
    <div className=" text-white space-y-6">
      {/* 기본 정보 */}
      <div>
        <h2 className="text-lg font-semibold mb-2">기본 정보</h2>
        <label className="block text-sm mb-1">이름</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder={localStorage.getItem('username') || undefined}
          className="w-full p-2 bg-dashboard-btn-control-primary rounded mb-3"
        />
        <label className="block text-sm mb-1">이메일</label>
        <input
          disabled
          value="goorm@gmail.com"
          // value={form.email} 백엔드에 email추가 요청 할 것.
          className="w-full p-2 bg-gray-700 rounded text-gray-400"
        />
      </div>

      {/* 비밀번호 변경 */}
      <div>
        <h2 className="text-sm mb-2">비밀번호</h2>
        <input
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          placeholder="현재 비밀번호"
          type="password"
          className="w-full p-2 bg-dashboard-btn-control-primary rounded mb-2"
        />
        <input
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          placeholder="새 비밀번호"
          type="password"
          className="w-full p-2 bg-dashboard-btn-control-primary rounded mb-2"
        />
        <p className="text-xs mb-3 text-gray-400">
          비밀번호는 영문자와 숫자를 포함해 8자 이상이어야 합니다.
        </p>
        <input
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="새 비밀번호 확인"
          type="password"
          className="w-full p-2 bg-dashboard-btn-control-primary rounded"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* 회원 탈퇴 / 저장 */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          className="bg-btn-primary hover:bg-primary-hover text-white px-5 py-2 rounded-lg"
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default UserEditForm;
