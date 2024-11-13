import useStore from "../store/useStore";
import { useState } from "react";

function PostModal({ post }) {
  const {
    isModalOpen,
    closeModal,
    deletePost,
    selectedPost,
    loggedInEmail,
    comments,
    addReview,
    editReview,
    deleteReview,
    setComponent,
    setSelectedPost,
  } = useStore();

  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false); // 댓글 표시 여부 상태

  const postComments = comments[selectedPost?.id] || [];

  const toggleComments = () => {
    setShowComments(!showComments); // showComments 값을 토글하여 댓글 표시 여부를 변경
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    await addReview(loggedInEmail, selectedPost.id, newComment, loggedInEmail);
    setNewComment("");
  };

  const handleEditComment = async (commentId) => {
    const editedText = prompt("댓글을 수정하세요:");
    if (editedText) {
      await editReview(loggedInEmail, selectedPost.id, commentId, editedText);
    }
  };

  const handleDeleteComment = async (commentId) => {
    await deleteReview(loggedInEmail, selectedPost.id, commentId);
  };

  if (!isModalOpen || !selectedPost) return null;

  const handleUpdatePost = () => {
    setSelectedPost(selectedPost);
    setTimeout(() => {
      setComponent("updatePost");
      closeModal();
    }, 100);
  };

  const handleDeletePost = () => {
    if (selectedPost) {
      deletePost(selectedPost.recepiId);
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{selectedPost.title}</h2>
          <button
            onClick={closeModal}
            className="text-gray-600 hover:text-gray-900"
          >
            X
          </button>
        </div>

        {/* 모달 본문 */}
        <img
          src={selectedPost.image}
          alt="게시물 이미지"
          className="w-full mb-4"
        />
        <p className="text-gray-700 mb-4">{selectedPost.recipeDescription}</p>

        {/* 댓글 표시 버튼 */}
        <button
          onClick={toggleComments}
          className="text-sm text-blue-500 hover:underline mb-2"
        >
          {showComments ? "댓글 숨기기" : "댓글 보기"}
        </button>

        {/* 댓글 섹션 */}
        {showComments && (
          <div className="mt-6 border-t border-card pt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">댓글</h3>
            {postComments.length === 0 ? (
              <p className="text-gray-500">아직 댓글이 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {postComments.map((comment) => (
                  <li
                    key={comment.id}
                    className="text-gray-700 flex items-center justify-between"
                  >
                    <span>{comment.text}</span>
                    {comment.userId === loggedInEmail && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditComment(comment.id)}
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

        {/* 게시물 수정 및 삭제 버튼 */}
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={handleUpdatePost}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            수정
          </button>
          <button
            onClick={handleDeletePost}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostModal;
