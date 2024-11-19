import { jwtDecode } from "jwt-decode";
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
        const { token, email, ...restUserInfo } = userInfo;

        // JWT 토큰을 로컬 스토리지에 저장
        if (token) {
          localStorage.setItem("auth_token", token);

          // JWT 디코딩하여 userId 추출
          try {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId; // jwt의 userID 추출
            set({
              user: { ...restUserInfo, loggedInEmail: email, userId },
            });
          } catch (error) {
            console.error("JWT 디코딩 중 오류 발생:", error.message);
            set({
              user: { ...restUserInfo, loggedInEmail: email, userId: "" },
            });
          }
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

      // userId 가져오기
      getUserId: () => {
        const token = localStorage.getItem("auth_token");
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            console.log("Decoded Token:", decodedToken);
            return decodedToken.userId; // JWT의 payload에서 userName 반환
          } catch (error) {
            console.error("JWT 디코딩 중 오류 발생:", error.message);
            return null;
          }
        }
        return null;
      },
    }),
    {
      name: "USER_INFO", // 로컬 스토리지 키 이름
    }
  )
);

export default useLocalStore;
