import React, { useState, useEffect } from "react";
import useStore from "../store/useStore";

function UpdatePost() {
  const { updatePost, setComponent, selectedPost } = useStore();

  const [title, setTitle] = useState("");
  const [recipeDescription, setRecipeDescription] = useState("");
  const [image, setImage] = useState(null);
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    console.log(selectedPost); // selectedPost 확인
    if (selectedPost) {
      setTitle(selectedPost.title || "");
      setRecipeDescription(selectedPost.recipeDescription || "");
      setImage(selectedPost.image || null);
      setIngredients(selectedPost.ingredients || "");
      setInstructions(selectedPost.instructions || "");
    }
  }, [selectedPost]);

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleUpdatePost = () => {
    if (!selectedPost) {
      console.error("선택된 게시물이 없습니다.");
      return;
    }

    const updatedPost = {
      id: selectedPost.id,
      title,
      image,
      recipeDescription,
      ingredients,
      instructions,
    };

    updatePost(updatedPost);
    setComponent("postList");
  };

  // selectedPost가 아직 설정되지 않았을 때 로딩 상태 표시
  if (!selectedPost) {
    return (
      <div className="p-4 bg-white h-3/4">
        <h2 className="text-2xl text-orange-500 font-bold mb-4">
          선택된 게시물이 없습니다.
        </h2>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white h-3/4">
      <h2 className="text-2xl text-orange-500 font-bold mb-4">레시피 수정</h2>

      {/* 레시피명 입력 */}
      <div className="mb-4">
        <label htmlFor="title" className="text-orange-500 font-bold">
          레시피명
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded-sm mt-2 border border-orange-500 bg-white"
        />
      </div>

      {/* 간략 소개 */}
      <div className="mb-4">
        <label
          htmlFor="recipeDescription"
          className="text-orange-500 font-bold"
        >
          레시피 간략소개
        </label>
        <input
          id="recipeDescription"
          type="text"
          value={recipeDescription}
          onChange={(e) => setRecipeDescription(e.target.value)}
          className="w-full p-2 rounded-sm mt-2 border border-orange-500 bg-white"
        />
      </div>

      {/* 이미지 첨부 */}
      <div className="mb-4">
        <label htmlFor="image" className="text-orange-500 font-bold">
          이미지 첨부
        </label>
        <input
          id="image"
          type="file"
          onChange={handleImageChange}
          className="w-full p-2 rounded-sm mt-2 border border-orange-500 bg-white"
        />
        {image && (
          <div className="mt-2">
            <img
              src={image}
              alt="레시피 이미지"
              className="w-32 h-32 object-cover"
            />
          </div>
        )}
      </div>

      {/* 재료 입력 */}
      <div className="mb-4">
        <label htmlFor="ingredients" className="text-orange-500 font-bold">
          재료
        </label>
        <textarea
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full p-2 rounded-sm mt-2 border border-orange-500 bg-white"
          rows="4"
        />
      </div>

      {/* 조리 과정 입력 */}
      <div className="mb-4">
        <label htmlFor="instructions" className="text-orange-500 font-bold">
          조리 과정
        </label>
        <textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="w-full p-2 rounded-sm mt-2 border border-orange-500 bg-white"
          rows="6"
        />
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-start gap-2">
        <button
          type="button"
          onClick={handleUpdatePost}
          className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-sm shadow-lg"
        >
          저장하기
        </button>
        <button
          onClick={() => setComponent("postList")}
          className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-lg fixed bottom-4 right-4 md:p-3 md:bottom-6 md:right-6 lg:p-4 lg:bottom-4 lg:right-4"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
}

export default UpdatePost;
