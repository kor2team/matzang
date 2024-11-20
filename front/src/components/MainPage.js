import React, { useState, useEffect } from "react";
import axios from "axios";
import MainPageRecipeDescription from "./MainPage_RecipeDescription";

const MainPage = () => {
  const [recipes, setRecipes] = useState([]); // 레시피 데이터를 저장하는 상태
  const [selectedRecipe, setSelectedRecipe] = useState(null); // 선택된 레시피
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

  useEffect(() => {
    // 서버에서 레시피 데이터를 받아오는 함수
    axios
      .get("http://localhost:8080/api/recipes") // API URL을 맞춰주세요
      .then((response) => {
        setRecipes(response.data); // 받아온 레시피 데이터를 상태에 저장
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
      });
  }, []);

  const handleCardClick = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true); // 모달 열기
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // 모달 닫기
    setSelectedRecipe(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-8">레시피 목록</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
            onClick={() => handleCardClick(recipe)} // 카드 클릭 시 상세보기 모달 열기
          >
            <img
              src={recipe.mainImage} // 레시피 이미지
              alt={recipe.recipeName} // 레시피 제목을 alt로 사용
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h3 className="text-xl font-semibold">{recipe.recipeName}</h3>
          </div>
        ))}
      </div>

      {/* 레시피 상세 정보를 보여주는 모달 */}
      <MainPageRecipeDescription
        isOpen={isModalOpen}
        onClose={handleModalClose}
        recipe={selectedRecipe}
      />
    </div>
  );
};

export default MainPage;
