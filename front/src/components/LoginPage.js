import React, { useState } from "react";
import axios from "axios"; // axios import 추가
import useLocalStore from "../store/useLocalStore";
import { fetchSetUserId } from "../services/api";

function LoginPage({ onLogin }) {
  const { setUser } = useLocalStore();
  const [email, setEmail] = useState(""); // 이메일 상태
  const [username, setUsername] = useState(""); // 사용자명 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 상태
  const [isLogin, setIsLogin] = useState(true); // 로그인/회원가입 토글 상태
  const [error, setError] = useState(""); // 에러 메시지 상태

  // 백엔드 URL 설정
  const BACKEND_URL = "http://localhost:8080/api/auth";

  // 로그인 처리 함수
  const handleLogin = async (e) => {
    e.preventDefault();
    if (username && password) {
      try {
        // 로그인 API 호출
        const response = await axios.post(`${BACKEND_URL}/login`, {
          username,
          password,
        });

        // 응답에서 JWT 토큰을 받기
        const { token } = response.data;

        // 로컬 스토리지에 JWT 토큰 저장
        localStorage.setItem("authToken", token);

        // 서버에서 userId 가져오기
        const userId = await fetchSetUserId(token);
        console.log(userId);
        // 로그인 성공 후, 로그인 상태 처리
        setUser({ token, email: username, userId });
        onLogin(username);
        alert("로그인 성공!");
      } catch (error) {
        // 로그인 실패 처리
        setError("사용자명 또는 비밀번호가 틀렸습니다.");
      }
    } else {
      alert("사용자명과 비밀번호를 입력하세요.");
    }
  };

  // 회원가입 처리 함수
  const handleRegister = async (e) => {
    e.preventDefault();
    if (email && username && password && confirmPassword) {
      if (password !== confirmPassword) {
        setError("비밀번호가 일치하지 않습니다.");
        return;
      }
      try {
        // 백엔드 회원가입 API 호출
        const response = await axios.post(`${BACKEND_URL}/register`, {
          email,
          username,
          password,
        });

        // 회원가입 성공 처리
        alert("회원가입 성공!");
        setIsLogin(true); // 로그인 화면으로 전환
      } catch (error) {
        // 에러 처리
        setError("회원가입 실패: " + (error.response?.data || error.message));
      }
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
          onSubmit={isLogin ? handleLogin : handleRegister}
          className="space-y-4"
        >
          {!isLogin && (
            <>
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
            </>
          )}
          <div>
            <label htmlFor="username" className="block font-medium">
              사용자명
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          )}

          {/* 에러 메시지 표시 */}
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <button
            type="submit"
            className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-blue-500"
          >
            {isLogin ? "로그인" : "회원가입"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(""); // 화면 전환 시 에러 메시지 초기화
            }}
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
