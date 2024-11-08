import useStore from "../store/useStore";
import { useState } from "react";

function PostModal({ userId }) {
  const { isModalOpen, closeModal, selectedPost } = useStore();

  // 댓글, 좋아요, 댓글 표시 여부 등의 상태 관리
  const [comments, setComments] = useState([
    { id: 1, text: "첫 번째 댓글입니다.", userId: 1 },
    { id: 2, text: "좋은 게시물입니다!", userId: 2 },
    { id: 3, text: "궁금한 점이 있습니다.", userId: 1 },
  ]);
  const [newComment, setNewComment] = useState(""); // 새로운 댓글 입력 상태
  const [newLike, setNewLike] = useState(0); // 좋아요 수 상태
  const [likedByUser, setLikedByUser] = useState(false); // 유저가 좋아요를 눌렀는지 여부
  const [showComments, setShowComments] = useState(false); // 댓글 표시 상태

  // 새로운 댓글 추가 핸들러
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return; // 빈 댓글은 추가하지 않음

    // 서버 지연 시간과 유사한 대기 시간 추가 (예시용)
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newCommentObject = {
      id: comments.length + 1,
      text: newComment,
      userId, // 현재 사용자의 ID를 새 댓글에 할당
    };
    setComments([...comments, newCommentObject]); // 새로운 댓글을 댓글 리스트에 추가
    setNewComment(""); // 입력 필드 초기화
  };

  // 좋아요 버튼 클릭 핸들러
  const handleLike = () => {
    if (!likedByUser) {
      setNewLike(newLike + 1); // 좋아요 수 증가
      setLikedByUser(true); // 좋아요 버튼이 눌렸음을 상태로 저장
    }
  };

  // 댓글 수정 핸들러
  const handleEditComment = (commentId) => {
    const editedText = prompt("댓글을 수정하세요:");
    if (editedText) {
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? { ...comment, text: editedText } : comment
        )
      );
    }
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = (commentId) => {
    setComments(comments.filter((comment) => comment.id !== commentId));
  };

  // 모달이 열려 있지 않거나 선택된 게시물이 없으면 null 반환
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

        <div className="flex flex-row">
          {/* 왼쪽: 이미지 */}
          <div className="w-2/3">
            <img
              src={selectedPost.image}
              alt={selectedPost.recipeName}
              className="w-full rounded-md shadow-card"
            />
          </div>

          {/* 오른쪽: 제목, 설명, 좋아요 및 댓글 */}
          <div className="w-1/3 p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800  text-center">
              {selectedPost.recipeName}
            </h2>
            <p className="text-gray-700">{selectedPost.ingredients}</p>
            <p className="text-gray-700">{selectedPost.instructions}</p>

            {/* 좋아요 및 댓글 버튼 */}
            <div className="mt-4 flex items-center space-x-2">
              {/* 좋아요 버튼 */}
              <button
                onClick={handleLike}
                className="mr-2 border bg-orange-500 border-modal shadow-modal text-xl px-4 py-2 text-flex items-center hover:text-gray-800"
              >
                ❤️ <span className="ml-1">{newLike}</span>
              </button>

              {/* 댓글 보기 토글 버튼 */}
              <button
                className="mr-2 border bg-orange-500 border-modal shadow-modal text-xl px-4 py-2 text-flex items-center hover:text-gray-800"
                onClick={() => setShowComments(!showComments)}
              >
                💬 <span className="ml-1">{comments.length}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 댓글 섹션 - showComments가 true일 때만 표시 */}
        {showComments && (
          <div className="mt-6 border-t border-card pt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">댓글</h3>
            {comments.length === 0 ? (
              <p className="text-gray-500">아직 댓글이 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {comments.map((comment) => (
                  <li
                    key={comment.id}
                    className="text-gray-700 flex items-center justify-between"
                  >
                    <span>{comment.text}</span>
                    {comment.userId === 1 && ( //임의 아이디 1로 설정
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
