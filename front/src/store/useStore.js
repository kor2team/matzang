import { create } from "zustand";

const useStore = create((set) => ({
  // **탭 관리**
  activeTab: "all",
  setActiveTab: (tab) => set({ activeTab: tab }),

  // **모달 상태**
  isModalOpen: false,
  selectedPost: null,
  setModalOpen: (isOpen, post = null) =>
    set({ isModalOpen: isOpen, selectedPost: post }),

  // **컴포넌트 상태 관리**
  currentComponent: "postList",
  setComponent: (component) => set({ currentComponent: component }),

  // **게시물 관련 상태 관리**
  posts: [],
  currentPage: 1,
  hasMore: true,

  // **리뷰 관리 상태**
  comments: {},
}));

export default useStore;
