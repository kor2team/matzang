import React from "react";

const MainPageRecipeDescription = ({ isOpen, onClose, recipe }) => {
  if (!isOpen || !recipe) return null;

  // 조리 방법을 배열로 나누기 (manual1, manual2, ...)

  const instructions = Array.from({ length: 10 }, (_, i) => {
    const manualKey = `manual${i + 1}`;
    return recipe[manualKey]?.trim()
      ? { step: recipe[manualKey].trim(), stepNumber: i + 1 }
      : null;
  }).filter(Boolean); // 필터링: null이 아닌 경우만 반환

  // 레시피 제목을 제외한 재료 처리
  const cleanedIngredients = recipe.ingredients
    ? recipe.ingredients.replace(
        new RegExp(`^${recipe.recipeName}\\s*`, "i"),
        ""
      )
    : "";

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose} // 모달 밖 클릭 시 닫기
    >
      <div
        className="bg-white p-5 rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫기 방지
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          X
        </button>
        <h2 className="text-2xl font-bold text-center mb-4">
          {recipe.recipeName}
        </h2>
        <img
          src={recipe.mainImage}
          alt={recipe.recipeName}
          className="w-full h-40 object-cover rounded mb-4"
        />
        <p className="text-gray-700 mb-4">
          <strong>재료:</strong> {cleanedIngredients}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>칼로리:</strong> {recipe.calorieInfo} kcal
        </p>
        <p className="text-gray-700 mb-4">
          <strong>나트륨:</strong> {recipe.sodiumInfo} mg
        </p>
        <div>
          <h3 className="text-lg font-semibold mb-2">조리 방법</h3>
          <div className="max-h-64 overflow-y-auto">
            {instructions.length > 0 ? (
              instructions.map((instruction, index) => (
                <div key={index} className="mb-2">
                  <p className="text-gray-600 font-semibold">
                    {instruction.stepNumber}. {instruction.step}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">조리 방법이 제공되지 않았습니다.</p>
            )}
          </div>
        </div>
        {recipe.recipeTip && (
          <div className="mt-4">
            <h4 className="font-semibold">레시피 팁</h4>
            <p>{recipe.recipeTip}</p>
          </div>
        )}
        {recipe.hashTag && (
          <div className="mt-2">
            <h4 className="font-semibold">해시태그</h4>
            <p>{recipe.hashTag}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPageRecipeDescription;
