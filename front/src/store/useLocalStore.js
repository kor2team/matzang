import { create } from "zustand";
import { persist } from "zustand/middleware";

// 초기 사용자 상태
const initialUser = {
  loggedInEmail: "",
  userId: "",
};

// Zustand로 사용자 상태 저장소 생성
const useLocalStore = create(
  persist(
    (set, get) => ({
      user: initialUser,

      // 사용자 상태 설정
      setUser: (userInfo) => {
        console.log(userInfo);
        const { token, email, userId, ...restUserInfo } = userInfo;

        // JWT 토큰을 로컬 스토리지에 저장
        if (token) {
          localStorage.setItem("auth_token", token);

          // 서버에서 제공된 userId를 설정
          set({
            user: { ...restUserInfo, loggedInEmail: email, userId },
          });
        } else {
          set({
            user: { ...restUserInfo, loggedInEmail: email },
          });
        }
      },

      // 사용자 상태 초기화
      clearUser: () => {
        localStorage.removeItem("auth_token");
        set({ user: initialUser });
      },

      // 현재 토큰 가져오기
      getToken: () => localStorage.getItem("auth_token"),
      
      //

    }),
    {
      name: "USER_INFO", // 로컬 스토리지 키 이름
    }
  )
);

export default useLocalStore;
