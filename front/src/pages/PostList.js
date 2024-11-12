import { useInfiniteQuery } from "@tanstack/react-query";
import useStore from "../store/useStore";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

function PostList() {
  const navigate = useNavigate();

  // Zustand에서 필요한 상태와 함수 가져오기
  const {
    openModal, // 게시물 상세 보기 모달을 여는 함수
    activeTab, // 현재 활성화된 탭 상태 (전체글, 내가 쓴 글, 좋아요한 글)
    setActiveTab, // 활성화된 탭 상태를 변경하는 함수
    filterUserPosts, // 내가 쓴 글 필터링 여부
    setFilterUserPosts, // 내가 쓴 글 필터링 여부 설정 함수
    filterLikedPosts, // 좋아요한 글 필터링 여부
    setFilterLikedPosts, // 좋아요한 글 필터링 여부 설정 함수
    isLogin, // 로그인 상태 여부
    setComponent, // 현재 활성 컴포넌트를 변경하는 함수
    fetchPosts, // 게시물 데이터 가져오는 함수 (상태 관리)
  } = useStore();

  // 검색어 상태 관리
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null); // 입력창 참조

  // 게시물 작성 버튼 클릭 시 호출되는 함수
  const handleCreatePost = () => {
    if (!isLogin) {
      // 로그인 상태가 아니면 경고 메시지를 표시하고 로그인 페이지로 이동
      alert("로그인이 필요한 서비스입니다");
      navigate("/login");
    } else {
      // 로그인 상태이면 게시물 작성 컴포넌트로 전환
      setComponent("createPost");
    }
  };

  // 무한 스크롤을 위한 useInfiniteQuery 훅 사용
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", activeTab], // 쿼리 키로 게시물 데이터 캐싱 및 관리
      queryFn: fetchPosts, // 게시물 데이터를 가져오는 함수
      getNextPageParam: (lastPage) => lastPage.nextPage, // 다음 페이지 파라미터 설정
    });

  // 게시물 필터링 함수
  const filteredPosts = (posts) => {
    let filtered = posts;

    if (filterUserPosts) {
      filtered = filtered.filter((post) => post.userId === "test@example.com");
    }
    if (filterLikedPosts) {
      filtered = filtered.filter((post) => post.likedByUser);
    }
    if (searchQuery) {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

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
          onClick={() => {
            setFilterUserPosts(false);
            setFilterLikedPosts(false);
            setActiveTab("all"); // 전체글 보기 탭 활성화
          }}
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
          onClick={() => {
            setFilterUserPosts(true);
            setFilterLikedPosts(false);
            setActiveTab("user"); // 내가 쓴 글 보기 탭 활성화
          }}
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
          onClick={() => {
            setFilterUserPosts(false);
            setFilterLikedPosts(true);
            setActiveTab("liked"); // 좋아요한 글 보기 탭 활성화
          }}
          className={`px-4 py-2 ${
            activeTab === "liked" ? "bg-orange-500 text-white" : "bg-gray-200"
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
        {data?.pages.map((page) =>
          filteredPosts(page.posts).map((post) => (
            <div
              key={post.id}
              className="bg-white p-4 border border-card rounded-md shadow-card cursor-pointer"
              onClick={() => openModal(post)}
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
          ))
        )}
      </div>

      {/* 더보기 버튼 */}
      {hasNextPage && (
        <div className="flex justify-center mt-5">
          <button
            onClick={fetchNextPage} // 다음 페이지 로드
            disabled={isFetchingNextPage}
            className="text-white bg-orange-500 w-full max-w-md px-4 py-2 rounded shadow-card"
          >
            {isFetchingNextPage ? (
              "로딩중" // 로딩 중일 때 표시
            ) : (
              <span className="material-symbols-outlined">add</span>
            )}
          </button>
        </div>
      )}

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
