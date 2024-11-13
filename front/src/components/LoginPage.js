import React, { useState } from "react";
import { loginUser, registerUser } from "../services/api";
import { useMutation } from "@tanstack/react-query";
import useLocalStore from "../store/useLocalStore";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState(""); // 사용자 이메일 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 상태
  const [username, setUsername] = useState(""); // 사용자 이름 상태 (회원가입 전용)
  const [isLogin, setIsLogin] = useState(true); // 로그인/회원가입 토글 상태

  const setUser = useLocalStore((state) => state.setUser); // useLocalStore로부터 setUser 가져오기

  // 로그인 뮤테이션
  const loginMutation = useMutation(
    (user) => loginUser(user.username, user.password),
    {
      onSuccess: (loginData) => {
        const { token } = loginData;
        setUser({ email, token }); // 로그인 성공 시 유저 정보 저장
        console.log(email, token);
        onLogin(email); // 로그인 성공 시 부모 컴포넌트의 onLogin 호출
      },
      onError: (error) => {
        alert("로그인에 실패하였습니다. 다시 시도해주세요");
        console.log("로그인 오류: ", error);
      },
    }
  );

  // 회원가입 뮤테이션
  const registerMutation = useMutation(
    (newUser) =>
      registerUser(newUser.username, newUser.email, newUser.password),
    {
      onSuccess: (data) => {
        console.log("회원가입 성공 응답:", data); // 서버 응답을 확인
        alert("회원가입 성공!");
        setIsLogin(true); // 회원가입 후 로그인 화면으로 전환
      },
      onError: (error) => {
        console.log(error);
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
        console.error("회원가입 오류:", error);
      },
    }
  );

  // 로그인 처리 함수
  const handleLogin = (e) => {
    e.preventDefault();
    console.log("로그인 시도:", { username, password }); // 확인용 로그
    loginMutation.mutate({ username: email, password }); // username에 email 값을 전달
    console.log("mutate시행후:", { username, password }); // 확인용 로그
  };

  // 회원가입 처리 함수
  const handleSignup = (e) => {
    e.preventDefault();
    if (email && password && password === confirmPassword && username) {
      registerMutation.mutate({ username, email, password });
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
                <label htmlFor="username" className="block font-medium">
                  닉네임
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} // username 상태 업데이트
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
