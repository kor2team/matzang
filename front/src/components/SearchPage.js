import React, { useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState(""); // 이름 검색어 상태
  const [ingredientQuery, setIngredientQuery] = useState(""); // 재료 검색어 상태
  const [filteredRecipes, setFilteredRecipes] = useState([]); // 필터된 레시피 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기/닫기 상태
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false); // 재료 검색 모달 상태
  const [selectedRecipe, setSelectedRecipe] = useState(null); // 선택된 레시피 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  // 이름 조회 API 호출
  const handleNameSearch = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/recipes/${searchQuery}`
      );
      setFilteredRecipes(response.data);
    } catch (error) {
      console.error("레시피 조회 오류:", error);
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  // 재료 조회 API 호출
  const handleIngredientSearch = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/recipes/detailRecipe?searchIngredient=${ingredientQuery}`
      );
      setFilteredRecipes(response.data);
    } catch (error) {
      console.error("재료 기반 레시피 조회 오류:", error);
    } finally {
      setIsLoading(false);
      setIsIngredientModalOpen(false); // 검색 후 모달 닫기
    }
  };
  // 검색어 입력 처리
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 재료 검색어 입력 처리
  const handleIngredientInputChange = (e) => {
    setIngredientQuery(e.target.value);
  };

  // Enter 키 처리
  const handleKeyDown = (e, searchFunction) => {
    if (e.key === "Enter") {
      searchFunction();
    }
  };

  // 레시피 클릭 시 세부 정보 모달 열기
  const openRecipeModal = (recipe) => {
    setSelectedRecipe(recipe);
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedRecipe(null);
    setIsModalOpen(false);
    setIsIngredientModalOpen(false);
  };

  // 이름 조회 버튼 클릭 시 모달 열기
  const openNameSearchModal = () => {
    setIsModalOpen(true);
  };

  // 재료 조회 버튼 클릭 시 모달 열기
  const openIngredientSearchModal = () => {
    setIsIngredientModalOpen(true);
  };

  return (
    <div className="p-5 text-center">
      {/* 이름 조회 버튼 */}
      <button
        className="bg-orange-500 text-white p-2 rounded mx-2"
        onClick={openNameSearchModal}
      >
        이름조회
      </button>

      {/* 재료 조회 버튼 */}
      <button
        className="bg-orange-500 text-white p-2 rounded mx-2"
        onClick={openIngredientSearchModal}
      >
        재료조회
      </button>

      {/* 이름 조회 모달 */}
      {isModalOpen && (
        <div
          className="modal fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
          onClick={closeModal} // 외부 클릭 시 모달 닫기
        >
          <div
            className="modal-content bg-white p-5 rounded-md w-96 max-w-lg"
            onClick={(e) => e.stopPropagation()} // 모달 내용 클릭 시 이벤트 버블링 막기
          >
            <h2 className="text-2xl mb-4">레시피 검색</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={(e) => handleKeyDown(e, handleNameSearch)}
              placeholder="레시피 제목을 입력하세요"
              className="mb-3 p-2 border-2 w-full"
            />
            <button
              className="bg-orange-500 text-white p-2 rounded mb-4 w-full"
              onClick={handleNameSearch}
            >
              검색
            </button>
            <button
              className="bg-gray-500 text-white p-2 rounded w-full"
              onClick={closeModal}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 재료 조회 모달 */}
      {isIngredientModalOpen && (
        <div
          className="modal fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
          onClick={closeModal} // 외부 클릭 시 모달 닫기
        >
          <div
            className="modal-content bg-white p-5 rounded-md w-96 max-w-lg"
            onClick={(e) => e.stopPropagation()} // 모달 내용 클릭 시 이벤트 버블링 막기
          >
            <h2 className="text-2xl mb-4">재료로 검색</h2>
            <input
              type="text"
              value={ingredientQuery}
              onChange={handleIngredientInputChange}
              onKeyDown={(e) => handleKeyDown(e, handleIngredientSearch)}
              placeholder="사용할 재료를 입력하세요 (쉼표로 구분)"
              className="mb-3 p-2 border-2 w-full"
            />
            <button
              className="bg-orange-500 text-white p-2 rounded mb-4 w-full"
              onClick={handleIngredientSearch}
            >
              검색
            </button>
            <button
              className="bg-gray-500 text-white p-2 rounded w-full"
              onClick={closeModal}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        // 로딩 중일 때 Spinner 표시
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <ClipLoader
            color="#FF5722"
            loading={isLoading}
            size={50}
            thickness={5}
          />
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe, index) => (
              <div
                key={index}
                className="recipe-item bg-white p-4 rounded-lg shadow-md cursor-pointer"
                onClick={() => openRecipeModal(recipe)}
              >
                <img
                  src={recipe.mainImage}
                  alt={recipe.recipeName}
                  className="w-full h-32 object-cover rounded mb-4"
                />
                <h3 className="text-xl font-semibold">{recipe.recipeName}</h3>
              </div>
            ))
          ) : (
            <p>검색된 레시피가 없습니다.</p>
          )}
        </div>
      )}

      {/* 레시피 상세 정보 모달 */}
      {selectedRecipe && (
        <div
          className="modal fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
          onClick={closeModal} // 모달 외부를 클릭하면 모달이 닫히도록
        >
          <div
            className="modal-content bg-white p-4 rounded-md max-w-lg w-full relative max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // 모달 내부를 클릭하면 닫히지 않도록
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 bg-orange-500 text-white rounded-full shadow-md hover:bg-orange-600 focus:ring-2 focus:ring-orange-300"
              aria-label="Close"
            >
              X
            </button>

            {/* 제목 */}
            <h2 className="text-2xl font-bold text-center mb-4">
              {selectedRecipe.recipeName}
            </h2>

            {/* 메인 이미지 */}
            <img
              src={selectedRecipe.mainImage}
              alt={selectedRecipe.recipeName}
              className="w-full h-56 object-contain rounded mb-4"
            />

            {/* 상세 정보 */}
            <p className="text-gray-700 mb-4 border-b border-gray-300 pb-2">
              <strong>재료:</strong> {selectedRecipe.ingredients}
            </p>
            <p className="text-gray-700 mb-4 border-b border-gray-300 pb-2">
              <strong>칼로리:</strong> {selectedRecipe.calorieInfo} kcal
            </p>
            <p className="text-gray-700 mb-4 border-b border-gray-300 pb-2">
              <strong>나트륨:</strong> {selectedRecipe.sodiumInfo} mg
            </p>

            {/* 조리 방법 */}
            <div className="border-b border-gray-300 pb-2">
              <h3 className="text-lg font-semibold mb-2">조리 방법</h3>
              <div className="max-h-64 overflow-y-auto">
                {Array.from(
                  { length: 10 },
                  (_, i) => selectedRecipe[`manual${i + 1}`]
                )
                  .filter(Boolean)
                  .map((instruction, uniqueIndex) => (
                    <div key={uniqueIndex} className="mb-2">
                      <p className="text-gray-600 font-semibold">
                        {instruction}
                      </p>
                    </div>
                  ))}
              </div>

              {/* 조리 과정 이미지 */}
              <div className="recipe-images flex gap-2 mt-4">
                {Array.from(
                  { length: 10 },
                  (_, i) => selectedRecipe[`manualImg${i + 1}`]
                )
                  .filter(Boolean)
                  .map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Step ${index + 1}`}
                      className="w-20 h-20 object-cover rounded cursor-pointer"
                    />
                  ))}
              </div>
            </div>

            {/* 레시피 팁 */}
            {selectedRecipe.recipeTip && (
              <div className="mt-4 border-b border-gray-300 pb-2">
                <h4 className="font-semibold">레시피 팁</h4>
                <p>{selectedRecipe.recipeTip}</p>
              </div>
            )}

            {/* 해시태그 */}
            {selectedRecipe.hashTag && (
              <div className="mt-2">
                <h4 className="font-semibold">해시태그</h4>
                <p>{selectedRecipe.hashTag}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
