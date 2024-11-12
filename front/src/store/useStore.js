import { create } from "zustand";

// Zustand를 이용해 전역 상태 관리
const useStore = create((set) => ({
  // 현재 활성화된 탭 (전체 글, 내가 쓴 글, 좋아요한 글)
  activeTab: "all",

  // 상세보기 모달의 열림 상태와 선택된 게시물 정보
  isModalOpen: false,
  selectedPost: null,

  //수정 버튼 누를대 기존 상태 게시물 정보
  setSelectedPost: null,

  // 현재 활성화된 컴포넌트 상태, 기본값은 "postList"
  currentComponent: "postList",

  // 게시물 필터링 상태 (내가 쓴 글 필터링 여부, 좋아요한 글 필터링 여부)
  filterUserPosts: false,
  filterLikedPosts: false,

  // 로그인 상태와 로그인된 이메일 저장
  isLogin: false,
  loggedInEmail: "",

  // 오류 메시지 상태
  errorMessage: "",

  posts: [], //게시물의 반영 상태
  // 게시물 데이터를 가져오는 함수 - 백엔드 API 대체용으로 임의 데이터 생성
  fetchPosts: async (pageParam = 0) => {
    const sampleData = {
      posts: [
        {
          recepiId: pageParam * 3 + 1,
          userId: "test@example.com",
          title: `고기감자조림 ${pageParam * 3 + 1}`,
          image: "https://via.placeholder.com/150",
          recipeDescription: "고기와 감자가 잘 어울리는 메뉴.",
          ingredients: "고기, 감자",
          instructions: "1.고기를 준비합니다, 2.감자를 조립니다.",
          likedByUser: pageParam % 2 === 0,
        },
        {
          recepiId: pageParam * 3 + 2,
          userId: "test2@example.com",
          title: `게시물 ${pageParam * 3 + 2}`,
          image: "https://via.placeholder.com/150",
          recipeDescription: "고기와 감자가 잘 어울리는 메뉴.",
          ingredients: "고기, 감자",
          instructions: "이것은 임의의 설명입니다.",
          likedByUser: pageParam % 2 === 0,
        },
      ],
      nextPage: pageParam < 10 ? pageParam + 1 : undefined, // 다음 페이지 존재 여부
    };

    set({ posts: sampleData.posts }); // 가져온 데이터를 posts 상태에 설정
    return sampleData;
  },

  // 게시물 추가 함수
  addPost: (newPost) =>
    set((state) => ({
      posts: [...state.posts, newPost],
    })),
  //게시물 수정시 물고올 상태저장
  setSelectedPost: (post) => {
    set({ selectedPost: post });
  },
  // 댓글을 게시물 ID별로 저장하는 상태
  comments: {},

  // 댓글 추가 함수 - 특정 게시물 ID에 새로운 댓글 추가
  addComment: (postId, commentText, userId) =>
    set((state) => {
      // 해당 게시물 ID의 댓글 배열 가져오기 (없으면 빈 배열 생성)
      const postComments = state.comments[postId] || [];
      // 새로운 댓글 객체 생성
      const newComment = {
        id: postComments.length + 1, // 고유 ID 설정
        text: commentText, // 댓글 내용
        userId: userId, // 댓글 작성자 ID (현재 로그인된 사용자)
      };
      return {
        comments: {
          ...state.comments,
          [postId]: [...postComments, newComment], // 새로운 댓글을 해당 게시물 ID에 추가
        },
      };
    }),

  // 댓글 수정 함수 - 특정 댓글 ID의 내용을 수정
  editComment: (postId, commentId, newText) =>
    set((state) => {
      const postComments = state.comments[postId].map((comment) =>
        comment.id === commentId ? { ...comment, text: newText } : comment
      );
      return {
        comments: {
          ...state.comments,
          [postId]: postComments, // 수정된 댓글 리스트로 업데이트
        },
      };
    }),

  // 댓글 삭제 함수 - 특정 댓글 ID를 가진 댓글을 삭제
  deleteComment: (postId, commentId) =>
    set((state) => {
      const postComments = state.comments[postId].filter(
        (comment) => comment.id !== commentId
      );
      return {
        comments: {
          ...state.comments,
          [postId]: postComments, // 삭제 후 댓글 리스트로 업데이트
        },
      };
    }),
  // 게시물 수정 함수
  updatePost: (updatedPost) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.recepiId === updatedPost.id ? { ...post, ...updatedPost } : post
      ),
    })),

  //게시물 삭제 함수
  deletePost: (recepiId) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.recepiId !== recepiId),
    })),

  // 상태 변경 함수들
  setActiveTab: (tab) => set({ activeTab: tab }), // activeTab 변경 함수
  // 특정 컴포넌트 전환 시 selectedPost도 함께 설정하도록 수정
  setComponent: (component) => set({ currentComponent: component }),
  openModal: (post) => set({ isModalOpen: true, selectedPost: post }), // 모달 열기 및 게시물 설정
  closeModal: () => set({ isModalOpen: false }), // 모달 닫기
  setFilterUserPosts: (isUserPosts) => set({ filterUserPosts: isUserPosts }), // 내가 쓴 글 필터링 설정
  setFilterLikedPosts: (isLikedPosts) =>
    set({ filterLikedPosts: isLikedPosts }), // 좋아요한 글 필터링 설정
  setIsLogin: (status) => set({ isLogin: status }), // 로그인 상태 설정
  setLoggedInEmail: (email) => set({ loggedInEmail: email }), // 로그인 이메일 설정
}));

export default useStore;
