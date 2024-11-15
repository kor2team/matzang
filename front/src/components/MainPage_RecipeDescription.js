import React from "react";

const MainPageRecipeDescription = ({ isOpen, onClose, recipe }) => {
  if (!isOpen || !recipe) return null;

  // 조리 방법을 각 단계별로 나누어 배열로 반환
  const instructions = recipe.cookingMethod
    ? recipe.cookingMethod.split("\n").map((step, index) => ({
        step: step.trim(),
        stepNumber: index + 1,
      }))
    : [];

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
          <strong>재료:</strong> {recipe.ingredients}
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
            {instructions.map((instruction, index) => (
              <div key={index} className="mb-2">
                <p className="text-gray-600 font-semibold">
                  {instruction.stepNumber}. {instruction.step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPageRecipeDescription;
