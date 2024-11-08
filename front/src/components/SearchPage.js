import React, { useRef, useState } from "react";

function SearchPage() {
  const [isIngredientModalOpen, setIngredientModalOpen] = useState(false);
  const [isMethodModalOpen, setMethodModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedMethods, setSelectedMethods] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null); // 입력창을 참조하는 ref

  const handleSearchIconClick = () => {
    inputRef.current.focus(); // 아이콘 클릭 시 입력창에 포커스
  };

  const recipes = [
    {
      id: 1,
      title: "돼지고기 볶음",
      ingredients: ["돼지고기"],
      method: "볶음",
      description: "맛있는 돼지고기 볶음 레시피",
    },
    {
      id: 2,
      title: "소고기 찜",
      ingredients: ["소고기"],
      method: "찜",
      description: "부드러운 소고기 찜 레시피",
    },
    {
      id: 3,
      title: "닭고기 구이",
      ingredients: ["닭고기"],
      method: "구이",
      description: "노릇하게 구운 닭고기 레시피",
    },
  ];

  const handleIngredientToggle = (ingredient) => {
    setSelectedIngredients((prevSelected) =>
      prevSelected.includes(ingredient)
        ? prevSelected.filter((item) => item !== ingredient)
        : [...prevSelected, ingredient]
    );
  };

  const handleMethodToggle = (method) => {
    setSelectedMethods((prevSelected) =>
      prevSelected.includes(method)
        ? prevSelected.filter((item) => item !== method)
        : [...prevSelected, method]
    );
  };

  // 필터링된 레시피
  const filteredRecipes = recipes.filter(
    (recipe) =>
      (selectedIngredients.length === 0 ||
        selectedIngredients.every((ingredient) =>
          recipe.ingredients.includes(ingredient.trim())
        )) &&
      (selectedMethods.length === 0 ||
        selectedMethods.includes(recipe.method)) &&
      recipe.title.replace(/\s+/g, "").includes(searchQuery.replace(/\s+/g, ""))
  );

  return (
    <div className="p-5 text-center">
      {/* 검색 입력 박스 */}
      <div className="flex items-center justify-center">
        <input
          type="text"
          placeholder="레시피를 검색하세요..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          ref={inputRef} // ref를 입력창에 연결
          className="ml-6 mb-5 w-72 h-10 p-2 border-2 border-orange-500 rounded-full"
        />
        <span
          className="material-symbols-outlined cursor-pointer ml-2"
          onClick={handleSearchIconClick} // 아이콘 클릭 시 포커스 함수 호출
        >
          search
        </span>
      </div>

      {/* 재료, 조리방식 button */}
      <div className="mb-5">
        <button
          className="w-28 px-5 py-2 text-white text-lg bg-orange-500 rounded-md mx-2"
          onClick={() => setIngredientModalOpen(true)}
        >
          재료
        </button>
        <button
          className="w-28 px-5 py-2 text-white text-lg bg-orange-500 rounded-md mx-2"
          onClick={() => setMethodModalOpen(true)}
        >
          조리방식
        </button>
      </div>

      {/* 재료별 검색 모달 */}
      {isIngredientModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-72 shadow-lg text-left">
            <h2 className="text-lg font-bold mb-4">재료</h2>
            <label className="flex items-center mb-2 w-80 whitespace-nowrap">
              돼지고기
              <input
                type="checkbox"
                checked={selectedIngredients.includes("돼지고기")}
                onChange={() => handleIngredientToggle("돼지고기")}
                className="mr-2" // 체크박스와 텍스트 간의 간격을 설정합니다.
              />
            </label>
            <label className="flex items-center mb-2 whitespace-nowrap">
              소고기
              <input
                type="checkbox"
                checked={selectedIngredients.includes("소고기")}
                onChange={() => handleIngredientToggle("소고기")}
                className="mr-2"
              />
            </label>
            <label className="flex items-center mb-2 whitespace-nowrap">
              닭고기
              <input
                type="checkbox"
                checked={selectedIngredients.includes("닭고기")}
                onChange={() => handleIngredientToggle("닭고기")}
                className="mr-2"
              />
            </label>
            <button
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md"
              onClick={() => setIngredientModalOpen(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 조리방식별 검색 모달 */}
      {isMethodModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-72 shadow-lg text-left">
            <h2 className="text-lg font-bold mb-4">조리방식</h2>
            <label className="flex items-center mb-2 whitespace-nowrap">
              볶음
              <input
                type="checkbox"
                checked={selectedMethods.includes("볶음")}
                onChange={() => handleMethodToggle("볶음")}
                className="mr-2"
              />
            </label>
            <label className="flex items-center mb-2 whitespace-nowrap">
              찜
              <input
                type="checkbox"
                checked={selectedMethods.includes("찜")}
                onChange={() => handleMethodToggle("찜")}
                className="mr-2"
              />
            </label>
            <label className="flex items-center mb-2 whitespace-nowrap">
              구이
              <input
                type="checkbox"
                checked={selectedMethods.includes("구이")}
                onChange={() => handleMethodToggle("구이")}
                className="mr-2"
              />
            </label>
            <button
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md"
              onClick={() => setMethodModalOpen(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 검색 결과 */}
      <div className="flex flex-col p-5 border-2 border-gray-300 rounded-lg bg-gray-100">
        {/* 레시피 목록 */}
        <div className="flex flex-wrap justify-center gap-5">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="p-5 border border-gray-300 rounded-lg bg-white cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
              </div>
            ))
          ) : (
            <p>선택된 조건에 해당하는 레시피가 없습니다.</p>
          )}
        </div>
      </div>

      {/* 레시피 상세 모달 */}
      {selectedRecipe && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-80 shadow-lg text-left recipe-detail-modal">
            {/* <img
        src={require(`../assets/images/${selectedRecipe.image}`)}
        alt={selectedRecipe.title}
        className="recipe-image mb-4"
      /> */}
            <div className="recipe-info">
              <h2 className="text-lg font-bold mb-2">{selectedRecipe.title}</h2>
              <p>{selectedRecipe.description}</p>
              <div className="recipe-ingredients mt-3">
                <h3 className="font-semibold">재료:</h3>
                <ul className="list-disc pl-5">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md"
              onClick={() => setSelectedRecipe(null)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
