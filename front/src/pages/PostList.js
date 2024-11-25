import useStore from "../store/useStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useLocalStore from "../store/useLocalStore";

function PostList() {
  const navigate = useNavigate();

  // Zustand에서 필요한 상태와 함수 가져오기

  const {
    activeTab,
    setComponent,
    posts,
    userPosts,
    favoritePosts,
    setActiveTab,
    fetchPosts,
    fetchUserPosts,
    favoriteUserPosts,
    openModal,
  } = useStore();

  // 검색어 상태 관리]
  const [searchQuery, setSearchQuery] = useState(""); //검색어상태
  const inputRef = useRef(null); // 입력창 참조

  // 게시물 작성 버튼 클릭 시 호출되는 함수
  const handleCreatePost = () => {
    const token = useLocalStore.getState().getToken(); //zustand에서 현재 토큰 가져오기
    if (!token) {
      // 로그인 상태가 아니면 경고 메시지를 표시하고 로그인 페이지로 이동
      alert("로그인이 필요한 서비스입니다");
      navigate("/login");
    } else {
      // 로그인 상태이면 게시물 작성 컴포넌트로 전환
      setComponent("createPost");
    }
  };

  // 초기 데이터 로드 및 탭 변경 처리
  useEffect(() => {
    if (activeTab === "all") {
      fetchPosts();
    } else if (activeTab === "user") {
      fetchUserPosts();
    } else if (activeTab === "favorite") {
      favoriteUserPosts();
    }
  }, [activeTab, fetchPosts, fetchUserPosts, favoriteUserPosts]);

  // 필터링된 게시물 가져오기
  const getFilteredPosts = () => {
    let currentPosts;

    if (activeTab === "user") {
      currentPosts = userPosts;
    } else if (activeTab === "favorite") {
      currentPosts = favoritePosts; // favorite 탭의 게시물
    } else {
      currentPosts = posts;
    }

    if (searchQuery) {
      currentPosts = currentPosts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return currentPosts;
  };

  const filteredPosts = getFilteredPosts();

  // 검색 아이콘 클릭 시 입력창 포커스
  const handleSearchIconClick = () => {
    inputRef.current.focus();
  };

  return (
    <>
      {/* 검색 입력 박스 */}
      <div className="flex items-center justify-center">
        <input
          type="text"
          placeholder="레시피를 검색하세요..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          ref={inputRef}
          className="ml-6 mb-5 w-72 h-10 p-2 border-2 border-orange-500 rounded-full"
        />
        <span
          className="material-symbols-outlined cursor-pointer ml-2"
          onClick={handleSearchIconClick}
        >
          search
        </span>
      </div>

      {/* 게시물 필터링 버튼 */}
      <div className="flex flex-row justify-center mb-5">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 ${
            activeTab === "all" ? "bg-orange-500 text-white" : "bg-gray-200"
          } rounded-md border border-card w-1/4 text-center`}
        >
          <div className="flex flex-col items-center">
            <span>전체 글</span>
            <span>보기</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("user")}
          className={`px-4 py-2 ${
            activeTab === "user" ? "bg-orange-500 text-white" : "bg-gray-200"
          } border border-card w-1/4 text-center rounded-md`}
        >
          <div className="flex flex-col items-center">
            <span>내가 쓴</span>
            <span>글 보기</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("favorite")}
          className={`px-4 py-2 ${
            activeTab === "favorite"
              ? "bg-orange-500 text-white"
              : "bg-gray-200"
          } rounded-md border border-card w-1/4 text-center`}
        >
          <div className="flex flex-col items-center">
            <span>좋아요한</span>
            <span>글 보기</span>
          </div>
        </button>
      </div>

      {/* 게시물 리스트 */}
      <div className="p-4 grid grid-cols-2 gap-4 w-full h-4/5 overflow-y-auto">
        {filteredPosts.map((post, index) => (
          <div
            key={post.id || index}
            className="bg-white p-4 border border-card rounded-md shadow-card cursor-pointer"
            onClick={() => {
              openModal(post);
            }}
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-32 object-cover rounded-md"
            />
            <h3 className="text-lg font-semibold mt-2 text-gray-800 text-center">
              {post.title}
            </h3>
            <p className="text-gray-600 mt-1">{post.recipeDescription}</p>
          </div>
        ))}
      </div>

      {/* 게시물 작성 버튼 (우하단 고정) */}
      <button
        onClick={handleCreatePost} // 게시물 작성 클릭 시 호출
        className="fixed bottom-4 right-4 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600"
      >
        게시물 작성
      </button>
    </>
  );
}

export default PostList;
