import useStore from "../store/useStore";
import { useState, useEffect } from "react";
import {
  deleteRecipe,
  addFavorite,
  removeFavorite,
  createReview,
  updateReview,
  deleteReview,
  fetchAllRecipes,
} from "../services/api";
import useLocalStore from "../store/useLocalStore";

function PostModal() {
  // 상태 및 스토어에서 데이터 가져오기
  const { isModalOpen, closeModal, selectedPost, setComponent, fetchPosts } =
    useStore();
  const recipeId = selectedPost?.recipeId;
  console.log(selectedPost);
  console.log("레시피아이디:", recipeId);
  console.log("셀렉된유저아이디:", selectedPost?.userId);
  const { user } = useLocalStore();
  const userId = user.userId;
  console.log("로그인된 유저아이다", userId);
  // 내부 상태
  const [newComment, setNewComment] = useState("");
  const [likedByUser, setLikedByUser] = useState(
    selectedPost?.favorite || false
  );
  const [likesCount, setLikesCount] = useState(
    selectedPost?.favoriteCount || 0
  );
  const [showComments, setShowComments] = useState(false);
  // 컴포넌트 내부에서 selectedPost를 사용하기 위한 로컬 상태 변수.
  //useState(selectedPost)를 통해 컴포넌트가 마운트될 때 selectedPost의 값을 복사해 새로운 상태 변수로 사용합니다.
  const [localSelectedPost, setLocalSelectedPost] = useState(selectedPost);
  // 모달이 열릴 때 선택된 게시물로 상태 초기화
  useEffect(() => {
    setLocalSelectedPost(selectedPost);
  }, [selectedPost]);

  // 선택된 게시물의 변경사항에 따라 좋아요 및 상태 초기화
  useEffect(() => {
    if (localSelectedPost) {
      setLikesCount(localSelectedPost.favoriteCount || 0);
      setLikedByUser(localSelectedPost.favorite || false);
    }
  }, [localSelectedPost]);

  // 댓글 추가 핸들러
  const handleAddComment = async (e) => {
    e.preventDefault();
    const token = useLocalStore.getState().getToken();
    if (!newComment.trim()) return;
    try {
      await createReview(token, recipeId, { review: newComment });
      const allRecipes = await fetchAllRecipes();
      const updatePost = allRecipes.find(
        (recipe) => recipe.recipeId === recipeId
      );
      if (updatePost) {
        setLocalSelectedPost(updatePost);
      }
      setNewComment("");
    } catch (error) {
      console.error("댓글 추가중 에러가 발생했습니다. :", error);
    }
  };
  // 댓글 수정 핸들러
  const handleEditComment = async (reviewId) => {
    const updatedText = prompt("댓글을 수정하세요:");
    const token = useLocalStore.getState().getToken();
    if (updatedText) {
      try {
        const updatedReview = await updateReview(token, reviewId, {
          review: updatedText,
        });
        const updatedReviews = localSelectedPost.reviews.map((review) =>
          review.id === reviewId ? updatedReview : review
        );
        setLocalSelectedPost({ ...localSelectedPost, reviews: updatedReviews }); // 상태 갱신
      } catch (error) {
        console.error("댓글 수정 중 오류 발생:", error);
      }
    }
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (reviewId) => {
    const token = useLocalStore.getState().getToken();
    try {
      await deleteReview(token, reviewId);
      const updatedReviews = localSelectedPost.reviews.filter(
        (review) => review.id !== reviewId
      );
      setLocalSelectedPost({ ...localSelectedPost, reviews: updatedReviews }); // 상태 갱신
    } catch (error) {
      console.error("댓글 삭제 중 오류 발생:", error);
    }
  };

  // 좋아요 핸들러
  const handleLike = async () => {
    try {
      if (likedByUser) {
        await removeFavorite(recipeId);
        setLikesCount((prev) => prev - 1);
        setLikedByUser(false);
      } else {
        await addFavorite(recipeId);
        setLikesCount((prev) => prev + 1);
        setLikedByUser(true);
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류 발생:", error);
    }
  };

  // 게시물 삭제 핸들러
  const handleDeletePost = async () => {
    const token = useLocalStore.getState().getToken();
    try {
      await deleteRecipe(token, recipeId);
      console.log("삭제 핸들러 레시프아이디", recipeId);
      closeModal();
      fetchPosts(); // 게시물 목록 갱신
    } catch (error) {
      console.error("게시물 삭제 중 오류 발생:", error);
    }
  };

  // 게시물 수정 핸들러
  const handleUpdatePost = () => {
    setComponent("updatePost");
    closeModal();
  };
  const handleCloseModal = () => {
    setNewComment("");
    closeModal();
  };
  // 모달이 열려있지 않거나 선택된 게시물이 없을 경우 렌더링 중단
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
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
                {localSelectedPost.title}
              </h2>
              <p className="text-gray-700 pb-2">
                {localSelectedPost.recipeDescription}
              </p>
              <p className="text-gray-700 pb-2">
                요리시간 : {localSelectedPost.cookTime}
              </p>
              <p className="text-gray-700 pb-2">
                재료 :
                <ul>
                  {localSelectedPost.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient.ingredientName}</li>
                  ))}
                </ul>
              </p>
              <p className="text-gray-700 pb-2">
                요리방법 :
                <ul>
                  {localSelectedPost.instructions.map((instruction, index) => (
                    <li key={index}>
                      {instruction.stepNumber}.{" "}
                      {instruction.instructionDescription}
                    </li>
                  ))}
                </ul>
              </p>
              {/* 수정 및 삭제 버튼 */}
              {localSelectedPost.userId == userId && (
                <div className="flex space-x-2 items-center justify-end mt-3 mr-2">
                  <button
                    onClick={handleUpdatePost}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="text-sm text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>

            {/* 좋아요 및 댓글 버튼 */}
            <div className="mt-auto flex justify-center items-center space-x-4">
              <button
                onClick={handleLike}
                className="border bg-orange-500 border-modal shadow-modal text-xl px-4 py-2 hover:text-gray-800"
              >
                ❤️ <span>{likesCount}</span>
              </button>
              <button
                onClick={() => setShowComments(!showComments)}
                className="border bg-orange-500 border-modal shadow-modal text-xl px-4 py-2 hover:text-gray-800"
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
                {localSelectedPost.reviews.map((comment, index) => (
                  <li
                    key={index}
                    className="text-gray-700 flex items-center justify-between"
                  >
                    <span>{comment.comment}</span>
                    {comment.userId == userId && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditComment(index)}
                          className="text-sm text-blue-500 hover:underline"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
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
