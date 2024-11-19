import React, { useState } from "react";
import useStore from "../store/useStore";
import { createRecipe } from "../services/api";
import useLocalStore from "../store/useLocalStore";

function CreatePost() {
  const { setComponent } = useStore();
  // Zustand에서 필요한 상태와 함수 가져옴
  // 게시물 목록으로 돌아가는 함수
  const handlePostList = () => {
    setComponent("postList");
  };

  // 레시피 작성 상태 관리
  const [title, setTitle] = useState(""); // 레시피명 상태
  const [recipeDescription, setRecipeDescription] = useState(""); //레시피 간략소개
  const [image, setImage] = useState(null); // 이미지 상태
  const [cookTime, setCookTime] = useState("");
  const [ingredients, setIngredients] = useState(""); // 재료 상태
  const [instructions, setInstructions] = useState(""); // 조리 과정 상태

  // 이미지 파일 선택 시 이미지 URL 설정
  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  // 게시물 저장 함수
  const handleSavePost = async () => {
    const recipeData = {
      title: title || "제목 없음",
      recipeDescription: recipeDescription || "간략 소개 없음",
      cookTime: parseInt(cookTime, 10) || 0,
      difficultyLevel: "보통",
      images: image ? [image] : [],
      ingredients: ingredients
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item !== ""), // 빈 문자열 제거
      instructions: instructions
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item !== ""), // 빈 문자열 제거
      categories: [], // 추가 UI 필요 시 수정
    };
    console.log(recipeData);

    const token = useLocalStore.getState().getToken(); //zustand에서 token값 가져오기
    if (!token) {
      alert("로그인이 필요합니다.");
    }
    console.log(token);
    try {
      // API 호출
      const response = await createRecipe(token, recipeData);

      if (response.success) {
        alert("레시피가 성공적으로 저장되었습니다!");
        setComponent("postList"); // PostList 컴포넌트로 이동
      } else {
        alert(`레시피 저장 실패: ${response.message || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("레시피 저장 중 오류 발생:", error);
      console.error("요청 데이터:", recipeData);
      alert("레시피 저장 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="p-4 bg-white  h-3/4">
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
          placeholder="필요한 재료를 입력하세요"
        />
      </div>

      {/* 재료 입력 */}
      <div className="mb-4">
        <label htmlFor="cookTime" className="text-orange-500 font-bold">
          조리시간
        </label>
        <textarea
          id="cookTime"
          value={cookTime}
          onChange={(e) => setCookTime(e.target.value)}
          className="w-full h-10 p-2 rounded-sm mt-2 border border-orange-500 bg-white"
          rows="4"
          placeholder="조리시간을 입력해주세요.(숫자만 적어주세요)"
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
          placeholder="조리 과정을 입력하세요"
        />
      </div>

      {/* 버튼들 */}
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
          className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-lg fixed bottom-4 right-4 md:p-3 md:bottom-6 md:right-6 lg:p-4 lg:bottom-4 lg:right-4"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
