import React, { useState } from "react";
import useStore from "../store/useStore";
import { createRecipe } from "../services/api";
import useLocalStore from "../store/useLocalStore";

function CreatePost() {
  const { setComponent } = useStore();

  // 게시물 목록으로 돌아가는 함수
  const handlePostList = () => {
    setComponent("postList");
  };

  // 레시피 작성 상태 관리
  const [title, setTitle] = useState(""); // 레시피명 상태
  const [recipeDescription, setRecipeDescription] = useState(""); // 레시피 간략소개
  const [images, setImages] = useState([]); // 이미지 상태
  const [cookTime, setCookTime] = useState("");
  const [ingredients, setIngredients] = useState([]); // 재료 상태
  const [instructions, setInstructions] = useState([]); // 조리 과정 상태

  // 이미지 추가 핸들러
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]);
  };

  // 이미지 삭제 핸들러
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 재료 추가 핸들러
  const addIngredient = () => {
    setIngredients((prev) => [...prev, ""]);
  };

  const updateIngredient = (index, value) => {
    setIngredients((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  const removeIngredient = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  // 조리 과정 추가 핸들러
  const addInstruction = () => {
    setInstructions((prev) => [...prev, ""]);
  };

  const updateInstruction = (index, value) => {
    setInstructions((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  const removeInstruction = (index) => {
    setInstructions((prev) => prev.filter((_, i) => i !== index));
  };

  // 게시물 저장 함수
  const handleSavePost = async () => {
    const recipeData = {
      title: title || "제목 없음",
      recipeDescription: recipeDescription || "간략 소개 없음",
      cookTime: parseInt(cookTime, 10) || 0,
      difficultyLevel: "보통",
      images,
      ingredients: ingredients.filter((item) => item.trim() !== ""),
      instructions: instructions.filter((item) => item.trim() !== ""),
      categories: [], // 빈 배열로 초기화
    };

    const token = useLocalStore.getState().getToken();
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await createRecipe(token, recipeData);
      if (response.success) {
        alert("레시피가 성공적으로 저장되었습니다!");
        setComponent("postList");
      } else {
        alert(`레시피 저장 실패: ${response.message || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("레시피 저장 중 오류 발생:", error);
      alert("레시피 저장 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="p-4 bg-white h-3/4">
      <h2 className="text-2xl text-orange-500 font-bold mb-4">레시피 작성</h2>

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
          placeholder="레시피명을 입력하세요."
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
          placeholder="레시피에 대해 간략하게 소개해 주세요."
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
          multiple
          className="w-full p-2 rounded-sm mt-2 border border-orange-500 bg-white"
        />
        <div className="mt-2 grid grid-cols-3 gap-2">
          {images.map((imgUrl, index) => (
            <div key={index} className="relative">
              <img
                src={imgUrl}
                alt={`레시피 이미지 ${index + 1}`}
                className="w-32 h-32 object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 재료 입력 */}
      <div className="mb-4">
        <label htmlFor="ingredients" className="text-orange-500 font-bold">
          재료
        </label>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={ingredient}
              onChange={(e) => updateIngredient(index, e.target.value)}
              className="w-full p-2 rounded-sm border border-orange-500 bg-white"
              placeholder="재료를 입력하세요"
            />
            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-sm shadow-lg"
            >
              <span class="material-symbols-outlined">delete_forever</span>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addIngredient}
          className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-sm shadow-lg"
        >
          <span class="material-symbols-outlined">add</span>
        </button>
      </div>

      {/* 조리 과정 입력 */}
      <div className="mb-4">
        <label htmlFor="instructions" className="text-orange-500 font-bold">
          조리 과정
        </label>
        {instructions.map((instruction, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <textarea
              value={instruction}
              onChange={(e) => updateInstruction(index, e.target.value)}
              className="w-full p-2 rounded-sm border border-orange-500 bg-white"
              placeholder="조리 과정을 입력하세요"
              rows="2"
            />
            <button
              type="button"
              onClick={() => removeInstruction(index)}
              className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-sm shadow-lg"
            >
              <span class="material-symbols-outlined">delete_forever</span>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addInstruction}
          className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-sm shadow-lg"
        >
          <span class="material-symbols-outlined">add</span>
        </button>
      </div>

      {/* 저장 및 돌아가기 버튼 */}
      <div className="flex flex-wrap justify-start gap-2">
        <button
          type="submit"
          onClick={handleSavePost}
          className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-sm shadow-lg"
        >
          저장하기
        </button>
        <button
          onClick={handlePostList}
          className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-lg fixed bottom-4 right-4"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
