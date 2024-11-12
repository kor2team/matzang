import useStore from "../store/useStore";
import { useState } from "react";

function PostModal({ post }) {
  const {
    isModalOpen,
    closeModal,
    selectedPost,
    loggedInEmail,
    comments,
    addComment,
    editComment,
    deleteComment,
    setComponent,
    setSelectedPost,
  } = useStore();

  const [newLike, setNewLike] = useState(0); // 좋아요 수 상태
  const [likedByUser, setLikedByUser] = useState(false); // 유저가 좋아요를 눌렀는지 여부
  const [newComment, setNewComment] = useState(""); // 새로운 댓글 입력 상태
  const [showComments, setShowComments] = useState(false); // 댓글 표시 여부 상태

  // 현재 모달에 표시할 게시물의 댓글들 (전역 상태에서 불러옴)
  const postComments = comments[selectedPost?.id] || [];

  // 새로운 댓글 추가 핸들러
  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return; // 빈 댓글은 추가하지 않음

    // 전역 상태의 addComment 호출하여 댓글 추가
    addComment(selectedPost.id, newComment, loggedInEmail);
    setNewComment(""); // 입력 필드 초기화
  };

  // 댓글 수정 핸들러
  const handleEditComment = (commentId) => {
    const editedText = prompt("댓글을 수정하세요:");
    if (editedText) {
      editComment(selectedPost.id, commentId, editedText); // 전역 상태의 editComment 호출하여 댓글 수정
    }
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = (commentId) => {
    deleteComment(selectedPost.id, commentId); // 전역 상태의 deleteComment 호출하여 댓글 삭제
  };

  // 좋아요 버튼 클릭 핸들러
  const handleLike = () => {
    if (!likedByUser) {
      setNewLike(newLike + 1); // 좋아요 수 증가
      setLikedByUser(true); // 좋아요 버튼이 눌렸음을 상태로 저장
    }
  };
  // 모달이 열려 있지 않거나 선택된 게시물이 없으면 null 반환
  if (!isModalOpen || !selectedPost) return null;

  const handleUpdatePost = () => {
    setSelectedPost(selectedPost);
    setTimeout(() => setComponent("updatePost"), 2000); // 게시물 작성 컴포넌트 활성화
    closeModal();
    console.log(selectedPost);
  };

  const handleDeletePost = () => {
    console.log("삭제되었습니다.");
  };

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
                재료 : {selectedPost.ingredients}
              </p>
              <p className="text-gray-700 pb-2">
                요리방법 : {selectedPost.instructions}
              </p>

              {selectedPost.userId === loggedInEmail && (
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
                ❤️ <span>{newLike}</span>
              </button>
              <button
                onClick={() => setShowComments(!showComments)}
                className="border bg-orange-500 border-modal shadow-modal text-xl px-4 py-2 text-flex items-center hover:text-gray-800"
              >
                💬 <span>{postComments.length}</span>
              </button>
            </div>
          </div>
        </div>

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
      </div>
    </div>
  );
}

export default PostModal;
