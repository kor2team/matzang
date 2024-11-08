import { create } from "zustand";

const useStore = create((set) => ({
  activeTab: "all", // 현재 활성화된 탭의 상태를 저장하는 변수, 기본값은 'all'
  isModalOpen: false, // 상세보기 모달의 열림 상태를 나타내는 변수
  currentComponent: "postList", // 현재 활성화된 컴포넌트 상태, 기본값은 'postList'
  selectedPost: null, // 선택된 게시물의 정보를 저장하는 변수
  filterUserPosts: false, // 사용자가 작성한 게시물만 필터링하는 상태
  filterLikedPosts: false, // 사용자가 좋아요한 게시물만 필터링하는 상태
  isLogin: false, // 로그인 여부를 나타내는 상태, 기본값은 로그아웃 상태인 false
  errorMessage: "", // 오류 메시지를 저장하는 상태, 기본값은 빈 문자열
  loggedInEmail: "", // 로그인한 이메일 상태

  // activeTab을 변경하는 함수
  setActiveTab: (tab) => set({ activeTab: tab }),

  // 게시물 작성창 상태를 변경하는 함수
  setComponent: (component) => set({ currentComponent: component }),

  // 상세보기 모달을 열고, 선택된 게시물 데이터를 설정하는 함수
  openModal: (post) => set({ isModalOpen: true, selectedPost: post }),

  // 상세보기 모달을 닫고, 선택된 게시물 데이터를 초기화하는 함수
  closeModal: () => set({ isModalOpen: false, selectedPost: null }),

  // 내가 쓴 글 보기 필터링 설정 함수
  setFilterUserPosts: (isUserPosts) => set({ filterUserPosts: isUserPosts }),

  // 좋아요한 글 필터링 설정 함수
  setFilterLikedPosts: (isLikedPosts) =>
    set({ filterLikedPosts: isLikedPosts }),

  // 로그인 상태를 설정하는 함수
  setIsLogin: (status) => set({ isLogin: status }),

  // 로그인 상태를 토글하는 함수
  toggleLogin: () => set((state) => ({ isLogin: !state.isLogin })),

  // 이메일 설정 함수
  setLoggedInEmail: (email) => set({ loggedInEmail: email }),
}));

export default useStore;
