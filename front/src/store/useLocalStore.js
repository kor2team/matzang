// Zustand 라이브러리와 상태 지속성을 위한 미들웨어(persist)를 가져옵니다.
import { create } from "zustand";
import { persist } from "zustand/middleware";

// 초기 사용자 상태 객체를 정의합니다. 로그인 여부와 로그인된 이메일을 포함합니다.
const initialUser = {
  isLogin: false, // 로그인 상태를 나타내는 플래그
  loggedInEmail: "", // 로그인된 사용자의 이메일
};

// Zustand를 사용하여 로컬 상태 저장소(LocalStore)를 생성합니다.
// 이 저장소는 사용자의 로그인 상태를 관리하고 로컬 스토리지에 상태를 지속(persist)합니다.
const useLocalStore = create(
  persist(
    (set) => ({
      // 사용자 상태를 포함한 초기 상태 정의
      user: initialUser,

      // 사용자 정보를 설정하는 함수. 로그인 시 사용되며, isLogin을 true로 설정합니다.
      setUser: (userInfo) => {
        // userInfo에서 토큰과 이메일을 분리하고, 로컬 스토리지에 저장합니다.
        const { token, email, ...restUserInfo } = userInfo;

        // 토큰이 있다면 로컬 스토리지에 저장
        if (token) {
          localStorage.setItem("auth_token", token); // 토큰을 "auth_token" 키로 로컬 스토리지에 저장
        }

        // 이메일이 있다면 상태를 업데이트하고, 로그인 상태를 true로 설정
        if (email) {
          set({
            user: { ...restUserInfo, loggedInEmail: email, isLogin: true },
          }); // 이메일을 loggedInEmail로 설정
        } else {
          set({ user: { ...restUserInfo, isLogin: true } }); // 이메일이 없을 경우
        }
      },

      // 사용자 정보를 초기 상태로 재설정하는 함수. 로그아웃 시 사용됩니다.
      clearUser: () => {
        localStorage.removeItem("auth_token"); // 로그아웃 시 토큰을 로컬 스토리지에서 제거
        set({ user: initialUser }); // 상태 초기화
      },
    }),
    {
      name: "USER_INFO", // 상태를 로컬 스토리지에 저장할 때 사용할 키 이름
    }
  )
);

export default useLocalStore;
