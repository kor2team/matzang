import useStore from "../store/useStore";
import { useState, useEffect, useCallback } from "react";
import {
  deleteRecipe,
  addFavorite,
  removeFavorite,
  createReview,
  updateReview,
  deleteReview,
} from "../services/api";
import useLocalStore from "../store/useLocalStore";

function PostModal() {
  // **Global 상태 및 유틸리티 함수 가져오기**
  const { isModalOpen, closeModal, selectedPost, setComponent, fetchPosts } =
    useStore(); // 모달 관련 상태와 메서드
  const recipeId = String(selectedPost?.recipeId); // 선택된 게시물의 ID
  const { user } = useLocalStore(); // 사용자 정보
  const numUserId = Number(user.userId); // 사용자 ID (숫자 형변환)
  const loginUserName = user.userName;

  // **Local 상태 선언**
  const [newComment, setNewComment] = useState(""); // 새로운 댓글 입력 값
  const [likedByUser, setLikedByUser] = useState(
    selectedPost?.favorite || false
  ); // 좋아요 상태
  const [likesCount, setLikesCount] = useState(
    selectedPost?.favoriteCount || 0
  ); // 좋아요 수
  const [showComments, setShowComments] = useState(false); // 댓글 섹션 표시 여부
  const [localSelectedPost, setLocalSelectedPost] = useState(selectedPost); // 선택된 게시물의 로컬 상태
  //유저내임 상태
  // **Handlers**

  // 댓글 추가 핸들러
  const handleAddComment = useCallback(
    async (e) => {
      e.preventDefault();
      const token = useLocalStore.getState().getToken();
      if (!newComment.trim()) return;

      try {
        // 댓글 추가 API 호출
        await createReview(token, recipeId, {
          review: newComment,
        });

        // 댓글 추가 후 전체 게시물 갱신
        await fetchPosts(); // 전체 게시물 다시 불러오기

        // 댓글 추가 성공 후 selectedPost를 새로 갱신
        const updatedPost = useStore
          .getState()
          .posts.find((post) => post.recipeId === Number(recipeId));
        setLocalSelectedPost(updatedPost); // 로컬 상태 갱신

        // 댓글 추가 성공 시, 유저 이름과 댓글 내용을 로컬 상태에 반영
        setNewComment(""); // 입력 필드 초기화=
      } catch (error) {
        console.error("댓글 추가 중 오류 발생:", error);
      }
    },
    [newComment, recipeId, fetchPosts, setLocalSelectedPost]
  );
  // 댓글 수정 핸들러
  const handleEditComment = useCallback(
    async (reviewId) => {
      const updatedText = prompt("댓글을 수정하세요:"); // 사용자 입력
      const token = useLocalStore.getState().getToken(); // 사용자 토큰

      if (updatedText) {
        try {
          await updateReview(token, reviewId, { review: updatedText }); // 서버 요청
          const updatedReviews = localSelectedPost.reviews.map((review) =>
            review.reviewId === reviewId
              ? { ...review, comment: updatedText }
              : review
          );
          setLocalSelectedPost({
            ...localSelectedPost,
            reviews: updatedReviews,
          }); // 상태 업데이트
        } catch (error) {
          console.error("댓글 수정 중 오류 발생:", error);
        }
      }
    },
    [localSelectedPost]
  );

  // 댓글 삭제 핸들러
  const handleDeleteComment = useCallback(
    async (reviewId) => {
      const token = useLocalStore.getState().getToken(); // 사용자 토큰
      try {
        await deleteReview(token, reviewId); // 서버 요청
        const updatedReviews = localSelectedPost.reviews.filter(
          (review) => review.reviewId !== reviewId
        );
        setLocalSelectedPost({
          ...localSelectedPost,
          reviews: updatedReviews,
        }); // 상태 업데이트
      } catch (error) {
        console.error("댓글 삭제 중 오류 발생:", error);
      }
    },
    [localSelectedPost]
  );
  // 좋아요 처리 핸들러
  const handleLike = useCallback(async () => {
    const token = useLocalStore.getState().getToken(); // 사용자 토큰
    if (!token) {
      console.error("토큰이 없습니다. 로그인이 필요합니다.");
      console.log(numUserId);
      return;
    }
    try {
      if (likedByUser) {
        await removeFavorite(token, recipeId); // 서버 요청 (좋아요 해제)
        setLikesCount((prev) => prev - 1);
        setLikedByUser(false);
      } else {
        await addFavorite(token, recipeId); // 서버 요청 (좋아요 추가)
        setLikesCount((prev) => prev + 1);
        setLikedByUser(true);
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류 발생:", error);
    }
  }, [likedByUser, recipeId, numUserId]);

  // 게시물 삭제 핸들러
  const handleDeletePost = useCallback(async () => {
    const token = useLocalStore.getState().getToken(); // 사용자 토큰
    try {
      await deleteRecipe(token, recipeId); // 서버 요청
      closeModal(); // 모달 닫기
      fetchPosts(); // 게시물 목록 갱신
    } catch (error) {
      console.error("게시물 삭제 중 오류 발생:", error);
    }
  }, [recipeId, closeModal, fetchPosts]);

  // 게시물 수정 핸들러
  const handleUpdatePost = useCallback(() => {
    setComponent("updatePost"); // 수정 모드로 전환
    closeModal(); // 모달 닫기
  }, [setComponent, closeModal]);

  // 모달 닫기 핸들러
  const handleCloseModal = useCallback(() => {
    setNewComment(""); // 입력값 초기화
    closeModal(); // 모달 닫기
  }, [closeModal]);

  // **Effects**

  // 모달이 열릴 때 선택된 게시물 상태 초기화
  useEffect(() => {
    setLocalSelectedPost(selectedPost);
  }, [selectedPost]);

  // 좋아요 상태 초기화 (게시물이 변경될 때마다 실행)
  useEffect(() => {
    if (localSelectedPost) {
      setLikesCount(localSelectedPost.favoriteCount || 0);
      setLikedByUser(localSelectedPost.favorite || false);
    }
  }, [localSelectedPost]);
  console.log(localSelectedPost);
  // **조건부 렌더링: 모달이 닫혀있거나 게시물이 없으면 렌더링 중단**
  if (!isModalOpen || !localSelectedPost) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-modal relative max-w-4xl w-full flex flex-col border border-card">
        {/* 닫기 버튼 */}
        <button
          onClick={handleCloseModal}
          className="absolute top-3 right-3 text-white transition bg-orange-500 border-modal shadow-modal text-lg px-2 py-1 hover:text-gray-800"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex flex-row h-full">
          {/* 왼쪽: 이미지 */}
          <div className="w-3/5 h-full">
            {localSelectedPost.img && localSelectedPost.img.length > 0 ? (
              // img 배열이 비어있지 않을 경우
              <div className="grid grid-cols-1 gap-2">
                {localSelectedPost.img.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`${localSelectedPost.title} - ${index + 1}`}
                    className="w-full h-auto object-cover rounded-md shadow-card"
                  />
                ))}
              </div>
            ) : (
              // img 배열이 비어있을 경우 기본 이미지 렌더링
              <img
                src="https://via.placeholder.com/150" // 기본 이미지 URL
                alt="Default"
                className="w-full h-full object-cover rounded-md shadow-card"
              />
            )}
          </div>

          {/* 오른쪽: 제목, 설명, 좋아요 및 댓글 버튼 */}
          <div className="w-2/5 p-4 flex flex-col">
            {/* 게시물 내용 */}
            <div className="flex-1 overflow-y-auto max-h-96">
              <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
                {localSelectedPost.title}
              </h2>
              <p className="text-gray-700 pb-2">
                {localSelectedPost.recipeDescription}
              </p>
              <p className="text-gray-700 pb-2">
                조리시간 : {localSelectedPost.cookTime}
              </p>
              <p className="text-gray-700 pb-2">재료 :</p>
              <ul>
                {localSelectedPost.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient.ingredientName}</li>
                ))}
              </ul>

              <p className="text-gray-700 pb-2 mt-2">조리방법 :</p>
              <ul>
                {localSelectedPost.instructions.map((instruction, index) => (
                  <li key={index}>
                    {instruction.stepNumber}.{" "}
                    {instruction.instructionDescription}
                  </li>
                ))}
              </ul>
            </div>

            {/* 좋아요 및 댓글 버튼 */}
            <div className="flex justify-center items-center space-x-4 mt-4">
              {/* 수정 및 삭제 버튼 */}
              {localSelectedPost.userId === numUserId && (
                <div className="flex space-x-2 items-center justify-center px-4 py-2">
                  <button
                    onClick={handleUpdatePost}
                    className="text-sm text-blue-500 hover:underline hover:text-gray-800"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="text-sm text-red-500 hover:underline hover:text-gray-800"
                  >
                    삭제
                  </button>
                </div>
              )}
              <button
                onClick={handleLike}
                className="border bg-orange-500 border-modal shadow-modal text-sm px-4 py-2 hover:text-gray-800"
              >
                ❤️ <span>{likesCount}</span>
              </button>
              <button
                onClick={() => setShowComments(!showComments)}
                className="border bg-orange-500 border-modal shadow-modal text-sm px-4 py-2 hover:text-gray-800"
              >
                💬 <span>{localSelectedPost.reviews.length}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 댓글 섹션 */}
        {showComments && (
          <div className="mt-6 border-t border-card pt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">댓글</h3>
            {localSelectedPost.reviews.length === 0 ? (
              <p className="text-gray-500">아직 댓글이 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {localSelectedPost.reviews.map((comment) => (
                  <li
                    key={comment.reviewId}
                    className="text-gray-700 flex items-center justify-between"
                  >
                    <span>
                      {comment.username} 작성 : {comment.comment}
                    </span>
                    {comment.username === loginUserName && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditComment(comment.reviewId)}
                          className="text-sm text-blue-500 hover:underline"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.reviewId)}
                          className="text-sm text-red-500 hover:underline"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* 댓글 입력 폼 */}
            <form
              onSubmit={handleAddComment}
              className="mt-4 flex items-center"
            >
              <input
                type="text"
                placeholder="무엇이 궁금하신가요? 댓글을 남겨주세요."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 border border-card p-2 rounded-l-sm w-full"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-r-sm"
              >
                <span className="material-symbols-outlined">library_add</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostModal;
