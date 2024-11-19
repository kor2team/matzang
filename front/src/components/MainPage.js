import React, { useState, useEffect } from "react";
import MainPageRecipeDescription from "./MainPage_RecipeDescription";

function MainPage() {
  const [isRecipeDescriptionOpen, setIsRecipeDescriptionOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);

  const apiUrl = "https://openapi.foodsafetykorea.go.kr/api";
  const apiKey = "5a4532257f514de99381"; // 실제 키로 변경하세요.

  // API에서 레시피 데이터 가져오기
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/${apiKey}/COOKRCP01/json/1/100`
        );
        const data = await response.json();

        if (data.COOKRCP01 && data.COOKRCP01.row) {
          const fetchedRecipes = data.COOKRCP01.row.map((item) => ({
            id: item.RCP_SEQ,
            title: item.RCP_NM,
            description: item.RCP_PAT2,
            imageUrl: item.ATT_FILE_NO_MAIN,
            instructions: item.MANUAL01, // 조리 방법
          }));
          setRecipes(fetchedRecipes);
        } else {
          console.error("API 데이터 형식이 예상과 다릅니다:", data);
        }
      } catch (error) {
        console.error("레시피 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchRecipes();
  }, []);

  // 모달 열기
  const openRecipeDescriptionModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsRecipeDescriptionOpen(true);
  };

  // 모달 닫기
  const closeRecipeDescriptionModal = () => {
    setIsRecipeDescriptionOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <div className="p-5 bg-gray-100 h-3/4">
      {/* 레시피 카드들 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="p-4 bg-white rounded-lg shadow-md border border-gray-200 relative cursor-pointer"
            onClick={() => openRecipeDescriptionModal(recipe)} // 카드 클릭 시 모달 열기
          >
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-[200px] object-cover rounded-t-lg mb-4"
            />
            <div className="flex flex-col flex-grow gap-2">
              <h3 className="text-lg font-bold text-orange-500 text-center">
                {recipe.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4 h-20">
                {recipe.description}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 버튼 클릭 시 카드의 클릭 이벤트 전파 방지
                  console.log(`유튜브 기능 연결 예정 - ${recipe.title}`);
                }}
                className="bg-orange-500 text-white py-2 px-4 rounded-lg mt-auto"
              >
                youtube
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MainPage_RecipeDescription 모달 */}
      {isRecipeDescriptionOpen && selectedRecipe && (
        <MainPageRecipeDescription
          isOpen={isRecipeDescriptionOpen}
          onClose={closeRecipeDescriptionModal}
          recipe={selectedRecipe}
        />
      )}
    </div>
  );
}

export default MainPage;
