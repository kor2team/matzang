import { useInfiniteQuery } from "@tanstack/react-query";
import useStore from "../store/useStore";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

function PostList() {
  const navigate = useNavigate();

  // Zustand에서 상태와 함수 불러오기
  const {
    openModal, // 게시물 상세 보기 모달 열기
    activeTab, // 활성화된 탭 상태 (전체글, 내가 쓴 글, 좋아요한 글)
    setActiveTab, // 탭 상태 변경
    filterUserPosts, // 내가 쓴 글 필터링 여부
    setFilterUserPosts, // 내가 쓴 글 필터링 여부 설정
    filterLikedPosts, // 좋아요한 글 필터링 여부
    setFilterLikedPosts, // 좋아요한 글 필터링 여부 설정
    isLogin, // 로그인 상태 여부
    setComponent, // 활성 컴포넌트 변경
  } = useStore();

  // 검색어 상태 관리
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null); // 입력창 참조

  // 게시물 작성 버튼 클릭 시 호출 함수
  const handleCreatePost = () => {
    if (!isLogin) {
      alert("로그인이 필요한 서비스입니다");
      navigate("/login"); // 로그인 페이지로 이동
    } else {
      setComponent("createPost"); // 게시물 작성 컴포넌트 활성화
    }
  };

  // 게시물 데이터 가져오는 함수 (임의의 데이터 생성)
  const fetchPosts = async ({ pageParam = 0 }) => {
    const sampleData = {
      posts: [
        {
          id: pageParam * 3 + 1,
          userId: "test@example.com",
          title: `고기감자조림 ${pageParam * 3 + 1}`,
          image: "https://via.placeholder.com/150",
          recipeDescription: "고기와 감자가 잘 어울리는 메뉴.",
          ingredients: "고기, 감자",
          instructions: "1.고기를 준비합니다, 2.감자를 조립니다.",
          likedByUser: pageParam % 2 === 0,
        },
        {
          id: pageParam * 3 + 2,
          userId: "test2@example.com",
          title: `게시물 ${pageParam * 3 + 2}`,
          image: "https://via.placeholder.com/150",
          recipeDescription: "고기와 감자가 잘 어울리는 메뉴.",
          ingredients: "고기, 감자",
          instructions: "이것은 임의의 설명입니다.",
          likedByUser: pageParam % 2 === 0,
        },
      ],
      nextPage: pageParam < 10 ? pageParam + 1 : undefined,
    };
    return sampleData;
  };

  // 무한 스크롤을 위한 useInfiniteQuery 설정
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", activeTab],
      queryFn: fetchPosts,
      getNextPageParam: (lastPage) => lastPage.nextPage,
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

      {/* 필터링 버튼들 */}
      <div className="flex flex-col sm:flex-row justify-center mb-5 gap-1 ">
        <button
          onClick={() => {
            setFilterUserPosts(false);
            setFilterLikedPosts(false);
            setActiveTab("all");
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
            setActiveTab("user");
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
            setActiveTab("liked");
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
            onClick={fetchNextPage}
            disabled={isFetchingNextPage}
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
        onClick={handleCreatePost}
        className="fixed bottom-4 right-4 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600"
      >
        게시물 작성
      </button>
    </>
  );
}

export default PostList;
