import React, { useState } from "react";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState(""); // 이메일 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 상태
  const [nickname, setNickname] = useState(""); // 닉네임 상태 (회원가입 전용)
  const [isLogin, setIsLogin] = useState(true); // 로그인/회원가입 토글 상태

  // 로그인 처리 함수
  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email);
    } else {
      alert("이메일과 비밀번호를 입력하세요.");
    }
  };

  // 회원가입 처리 함수
  const handleSignup = (e) => {
    e.preventDefault();
    if (email && password && password === confirmPassword && nickname) {
      alert("회원가입 성공!");
      setIsLogin(true); // 회원가입 후 로그인 화면으로 전환
    } else {
      alert("모든 필드를 정확히 입력해주세요.");
    }
  };

  return (
    <div className="flex justify-center items-center h-4/5">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isLogin ? "로그인" : "회원가입"}
        </h2>
        <form
          onSubmit={isLogin ? handleLogin : handleSignup}
          className="space-y-4"
        >
          <div>
            <label htmlFor="email" className="block font-medium">
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-medium">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label htmlFor="confirmPassword" className="block font-medium">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="nickname" className="block font-medium">
                  닉네임
                </label>
                <input
                  type="text"
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-blue-500"
          >
            {isLogin ? "로그인" : "회원가입"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? "회원가입" : "로그인 화면으로"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
