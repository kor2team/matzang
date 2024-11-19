import useStore from "../store/useStore";
import { useState, useEffect } from "react";
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
  const { isModalOpen, closeModal, selectedPost, setComponent, fetchPosts } =
    useStore();
  console.log("Selected Post Data:", selectedPost);
  const userId = useLocalStore.getState().getUserId();
  console.log(useLocalStore.getState().getUserId());
  const [newComment, setNewComment] = useState("");
  const [likedByUser, setLikedByUser] = useState(
    selectedPost?.favorite || false
  );
  const [likesCount, setLikesCount] = useState(
    selectedPost?.favoriteCount || 0
  );
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (selectedPost) {
      setLikesCount(selectedPost.favoriteCount || 0);
      setLikedByUser(selectedPost.favorite || false);
    }
  }, [selectedPost]);

  // 댓글 추가 핸들러
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const newReview = await createReview(selectedPost.id, {
        review: newComment,
        userId,
      });
      selectedPost.reviews.push(newReview);
      setNewComment("");
    } catch (error) {
      console.error("댓글 추가 중 오류 발생:", error);
    }
  };

  // 댓글 수정 핸들러
  const handleEditComment = async (commentId) => {
    const updatedText = prompt("댓글을 수정하세요:");
    if (updatedText) {
      try {
        const updatedReview = await updateReview(commentId, {
          review: updatedText,
        });
        const reviewIndex = selectedPost.reviews.findIndex(
          (r) => r.id === commentId
        );
        if (reviewIndex !== -1) {
          selectedPost.reviews[reviewIndex] = updatedReview;
        }
      } catch (error) {
        console.error("댓글 수정 중 오류 발생:", error);
      }
    }
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteReview(commentId);
      selectedPost.reviews = selectedPost.reviews.filter(
        (r) => r.id !== commentId
      );
    } catch (error) {
      console.error("댓글 삭제 중 오류 발생:", error);
    }
  };

  // 좋아요 핸들러
  const handleLike = async () => {
    try {
      if (likedByUser) {
        await removeFavorite(selectedPost.id);
        setLikesCount((prev) => prev - 1);
        setLikedByUser(false);
      } else {
        await addFavorite(selectedPost.id);
        setLikesCount((prev) => prev + 1);
        setLikedByUser(true);
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류 발생:", error);
    }
  };

  // 게시물 삭제 핸들러
  const handleDeletePost = async () => {
    try {
      await deleteRecipe(selectedPost.id);
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

  if (!isModalOpen || !selectedPost) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-modal relative max-w-4xl w-full flex flex-col border border-card">
        {/* 닫기 버튼 */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-white transition bg-orange-500 
      border-modal shadow-modal text-lg px-2 py-1 text-flex items-center hover:text-gray-800"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex flex-row h-full">
          {/* 왼쪽: 이미지 */}
          <div className="w-3/5 h-full">
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-full object-cover rounded-md shadow-card"
            />
          </div>

          {/* 오른쪽: 제목, 설명, 좋아요 및 댓글 버튼 */}
          <div className="w-2/5 h-maxh p-4 flex flex-col">
            {/* 내용 섹션 */}
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
                {selectedPost.title}
              </h2>
              <p className="text-gray-700 pb-2">
                {selectedPost.recipeDescription}
              </p>
              <p className="text-gray-700 pb-2">
                요리시간 : {selectedPost.cookTime}
              </p>
              <p className="text-gray-700 pb-2">
                재료 : {selectedPost.ingredients}
              </p>
              <p className="text-gray-700 pb-2">
                요리방법 : {selectedPost.instructions}
              </p>

              {/* 수정 및 삭제 버튼 - 작성자에게만 표시 */}
              {selectedPost.userId === userId && (
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

            {/* 좋아요 및 댓글 버튼 - 하단 중앙 고정 */}
            <div className="mt-auto flex justify-center items-center space-x-4">
              <button
                onClick={handleLike}
                className="border bg-orange-500 border-modal shadow-modal text-xl px-4 py-2 text-flex items-center hover:text-gray-800"
              >
                ❤️ <span>{likesCount}</span>
              </button>
              <button
                onClick={() => setShowComments(!showComments)}
                className="border bg-orange-500 border-modal shadow-modal text-xl px-4 py-2 text-flex items-center hover:text-gray-800"
              >
                💬 <span>{selectedPost.reviews.length}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 댓글 섹션 */}
        {showComments && (
          <div className="mt-6 border-t border-card pt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">댓글</h3>
            {selectedPost.reviews.length === 0 ? (
              <p className="text-gray-500">아직 댓글이 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {selectedPost.reviews.map((comment) => (
                  <li
                    key={comment.id}
                    className="text-gray-700 flex items-center justify-between"
                  >
                    <span>{comment.comment}</span>
                    {comment.userId === userId && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditComment(comment.reviews.id)}
                          className="text-sm text-blue-500 hover:underline"
                        >
                          수정
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteComment(comment.reviews.id)
                          }
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
