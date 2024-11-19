import { create } from "zustand";
import { fetchAllRecipes, fetchMyRecipesAfterAccess } from "../services/api";

// Zustand를 이용해 전역 상태 관리
const useStore = create((set) => ({
  // 현재 활성화된 탭 (전체 글, 내가 쓴 글, 좋아요한 글)
  activeTab: "all",

  // 상세보기 모달의 열림 상태와 선택된 게시물 정보
  isModalOpen: false,
  selectedPost: null,

  // 현재 활성화된 컴포넌트 상태, 기본값은 "postList"
  currentComponent: "postList",

  // 게시물 필터링 상태 (내가 쓴 글 필터링 여부, 좋아요한 글 필터링 여부)
  filterUserPosts: false,

  // 로그인 상태와 로그인된 이메일 저장
  isLogin: false,
  loggedInEmail: "",
  userId: "",

  // 오류 메시지 상태
  errorMessage: "",

  // 게시물 데이터
  posts: [],
  userPosts: [],
  likePosts: [],

  // 게시물 가져오기
  fetchPosts: async () => {
    try {
      const response = await fetchAllRecipes();

      const posts = response || [];

      set(() => ({
        posts, // Zustand 상태 업데이트
      }));

      return { posts };
    } catch (error) {
      console.error("Error fetching posts:", error);
      set({ errorMessage: "게시물을 가져오는 중 문제가 발생했습니다." });
      throw error;
    }
  },

  // 내가 쓴 게시물 가져오기
  fetchUserPosts: async () => {
    try {
      const response = await fetchMyRecipesAfterAccess();
      const userPosts = response || [];
      set(() => ({
        userPosts,
      }));
      return { userPosts };
    } catch (error) {
      console.error("Error fetching user posts:", error);
      set({ errorMessage: "게시물을 가져오는 중 문제가 발생했습니다." });
      throw error;
    }
  },
  // 상태 변경 함수들
  setActiveTab: (tab) => set({ activeTab: tab }), // activeTab 변경 함수
  // 특정 컴포넌트 전환 시 selectedPost도 함께 설정하도록 수정
  setComponent: (component) => set({ currentComponent: component }),
  openModal: (post) => set({ isModalOpen: true, selectedPost: post }), // 모달 열기 및 게시물 설정
  closeModal: () => set({ isModalOpen: false }), // 모달 닫기
  setFilterLikedPosts: (isLikedPosts) =>
    set({ filterLikedPosts: isLikedPosts }), // 좋아요한 글 필터링 설정
  setIsLogin: (status) => set({ isLogin: status }), // 로그인 상태 설정
  setLoggedInEmail: (email) => set({ loggedInEmail: email }), // 로그인 이메일 설정
  setUserId: (id) => set({ userId: id }),
}));

export default useStore;
