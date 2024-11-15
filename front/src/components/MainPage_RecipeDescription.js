import React from "react";

const MainPageRecipeDescription = ({ isOpen, onClose, recipe }) => {
  if (!isOpen || !recipe) return null;

  // 조리 방법이 한 문자열로 되어 있는 경우, 이를 배열로 분리합니다.
  const instructions = recipe.instructions
    ? recipe.instructions.split("\n").map((step, index) => ({
        step: step.trim(), // 각 단계에서 앞뒤 공백 제거
        stepNumber: index + 1, // 단계 번호
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
        <h2 className="text-xl font-bold text-center mb-4">{recipe.title}</h2>
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-[200px] object-cover rounded mb-4"
        />
        <p className="text-gray-700 mb-4">{recipe.description}</p>
        <div>
          <h3 className="text-lg font-semibold mb-2">조리 방법</h3>
          <div className="max-h-64 overflow-y-auto">
            {/* 단계별로 렌더링 */}
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
