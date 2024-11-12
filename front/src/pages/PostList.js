import useStore from "../store/useStore";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

function PostList() {
  const navigate = useNavigate();

  // Zustand에서 필요한 상태와 함수들을 가져옴
  const {
    openModal, // 모달 열기 함수
    activeTab, // 활성화된 탭 상태
    setActiveTab, // 탭 상태 설정 함수
    filterUserPosts, // 내가 쓴 글 필터링 여부
    setFilterUserPosts, // 내가 쓴 글 필터링 설정 함수
    filterLikedPosts, // 좋아요한 글 필터링 여부
    setFilterLikedPosts, // 좋아요한 글 필터링 설정 함수
    isLogin, // 로그인 상태
    setComponent, // 현재 컴포넌트 변경 함수
    loggedInEmail, // 로그인된 이메일 주소
    fetchPosts, // 게시물 데이터 가져오는 함수 (상태 관리)
  } = useStore();

  // 검색어와 검색창 포커스를 위한 상태 및 참조
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);

  // 게시물 작성 버튼 클릭 시 호출되는 함수
  const handleCreatePost = () => {
    if (!isLogin) {
      alert("로그인이 필요한 서비스입니다"); // 로그인 상태가 아니면 경고 메시지
      navigate("/login"); // 로그인 페이지로 이동
    } else {
      setComponent("createPost"); // 게시물 작성 컴포넌트 활성화
    }
  };

  // 무한 스크롤 데이터 로딩을 위한 useInfiniteQuery 설정
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", activeTab], // 활성 탭을 queryKey로 사용
      queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam), // fetchPosts 함수 호출
      getNextPageParam: (lastPage) => lastPage.nextPage, // 다음 페이지 존재 여부 반환
    });

  // 게시물 필터링 함수 (내가 쓴 글, 좋아요한 글, 검색어로 필터링)
  const filteredPosts = (posts) => {
    let filtered = posts;

    if (filterUserPosts) {
      filtered = filtered.filter((post) => post.userId === loggedInEmail); // 내가 쓴 글 필터링
    }
    if (filterLikedPosts) {
      filtered = filtered.filter((post) => post.likedByUser); // 좋아요한 글 필터링
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()) // 검색어 필터링
      );
    }

    return filtered;
  };

  // 검색 아이콘 클릭 시 입력창에 포커스 설정
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
          onChange={(e) => setSearchQuery(e.target.value)} // 검색어 업데이트
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

      {/* 필터링 버튼들 */}
      <div className="flex flex-col sm:flex-row justify-center mb-5 gap-1 ">
        <button
          onClick={() => {
            setFilterUserPosts(false);
            setFilterLikedPosts(false);
            setActiveTab("all"); // 전체글 보기
          }}
          className={`px-4 py-2 ${
            activeTab === "all" ? "bg-orange-500 text-white" : "bg-gray-200"
          } rounded-md border border-card w-1/4 text-center`}
        >
          전체글 보기
        </button>
        <button
          onClick={() => {
            setFilterUserPosts(true);
            setFilterLikedPosts(false);
            setActiveTab("user"); // 내가 쓴 글 보기
          }}
          className={`px-4 py-2 ${
            activeTab === "user" ? "bg-orange-500 text-white" : "bg-gray-200"
          } border border-card w-1/4 text-center rounded-md`}
        >
          내가 쓴 글 보기
        </button>
        <button
          onClick={() => {
            setFilterUserPosts(false);
            setFilterLikedPosts(true);
            setActiveTab("liked"); // 좋아요한 글 보기
          }}
          className={`px-4 py-2 ${
            activeTab === "liked" ? "bg-orange-500 text-white" : "bg-gray-200"
          } rounded-md border border-card w-1/4 text-center`}
        >
          좋아요한 글 보기
        </button>
      </div>

      {/* 게시물 리스트 */}
      <div className="p-4 grid grid-cols-2 gap-4 w-full h-4/5 overflow-y-auto">
        {data?.pages.map((page) =>
          filteredPosts(page.posts).map((post) => (
            <div
              key={post.postId}
              className="bg-white p-4 border border-card rounded-md shadow-card cursor-pointer"
              onClick={() => openModal(post)} // 게시물 클릭 시 모달 열기
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
            onClick={fetchNextPage} // 다음 페이지 로딩
            disabled={isFetchingNextPage} // 로딩 중일 때 버튼 비활성화
            className="text-white bg-orange-500 w-full max-w-md px-4 py-2 rounded shadow-card"
          >
            {isFetchingNextPage ? (
              "로딩중"
            ) : (
              <span className="material-symbols-outlined">add</span>
            )}
          </button>
        </div>
      )}

      {/* 게시물 작성 버튼 (우하단 고정) */}
      <button
        onClick={handleCreatePost} // 게시물 작성 클릭 시
        className="fixed bottom-4 right-4 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600"
      >
        게시물 작성
      </button>
    </>
  );
}

export default PostList;
