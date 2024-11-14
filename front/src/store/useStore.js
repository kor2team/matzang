import { create } from "zustand";

// Zustand 상태 관리 함수 생성
const useStore = create((set) => ({
  // **탭 관리**
  activeTab: "all", // 현재 활성화된 탭의 이름 ("all" 기본값)
  setActiveTab: (tab) => set({ activeTab: tab }), // 탭 변경 함수, 파라미터로 탭 이름을 받아 상태 업데이트

  // **모달 상태**
  isModalOpen: false, // 모달 창의 열림/닫힘 상태 (기본값: 닫힘)
  selectedPost: null, // 선택된 게시물 (기본값: null)
  setModalOpen: (isOpen, post = null) =>
    set({ isModalOpen: isOpen, selectedPost: post }), // 모달 열림/닫힘과 선택된 게시물을 설정하는 함수

  // **컴포넌트 상태 관리**
  currentComponent: "postList", // 현재 표시 중인 컴포넌트 (기본값: "postList")
  setComponent: (component) => set({ currentComponent: component }), // 표시할 컴포넌트를 설정하는 함수

  // **게시물 관련 상태 관리**
  posts: [], // 게시물 목록
  currentPage: 1, // 현재 페이지 번호 (기본값: 1)
  hasMore: true, // 추가 페이지가 있는지 여부 (무한 스크롤 등에 사용)

  // **리뷰 관리 상태**
  comments: {}, // 댓글 상태 객체, 각 게시물의 댓글을 관리하는 데 사용
}));

export default useStore;
