// PostList.js
import useStore from "../store/useStore";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

function PostList() {
  const navigate = useNavigate();

  const {
    openModal,
    activeTab,
    setActiveTab,
    filterUserPosts,
    setFilterUserPosts,
    filterLikedPosts,
    setFilterLikedPosts,
    isLogin,
    setComponent,
    loggedInEmail,
    loadAllRecipes,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);

  const handleCreatePost = () => {
    if (!isLogin) {
      alert("로그인이 필요한 서비스입니다");
      navigate("/login");
    } else {
      setComponent("createPost");
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [
        "posts",
        activeTab,
        filterUserPosts,
        filterLikedPosts,
        searchQuery,
      ],
      queryFn: ({ pageParam = 1 }) => loadAllRecipes(pageParam),
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

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
          page.posts.map((post) => (
            <div
              key={post.postId}
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
