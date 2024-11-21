// ProfilePage.js
import React from "react";

const ProfilePage = ({ email, onLogout }) => {
  // const [newPassword, setNewPassword] = useState("");

  // const handlePasswordChange = (e) => {
  //   setNewPassword(e.target.value);
  // };

  // const handlePasswordUpdate = () => {
  //   // 비밀번호 변경 로직 (예: 백엔드 API 호출)
  //   console.log("비밀번호 변경됨:", newPassword);
  // };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center">개인정보</h1>

      {/* 이메일 표시 */}
      <div className="mb-4">
        <p className="text-lg">
          <strong>닉네임:</strong> {email}
        </p>
      </div>

      {/* 비밀번호 입력
      <div className="mb-4">
        <label className="block text-lg font-semibold" htmlFor="newPassword">
          새 비밀번호:
        </label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={handlePasswordChange}
          placeholder="새 비밀번호 입력"
          className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 비밀번호 변경 버튼 
      <div className="mb-6">
        <button
          onClick={handlePasswordUpdate}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          비밀번호 변경
        </button>
      </div> */}

      {/* 로그아웃 버튼 */}
      <div>
        <button
          onClick={onLogout}
          className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
