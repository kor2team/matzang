import React from "react";

function MainPage_RecipeDescription({ isOpen, onClose, recipe }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[80%] max-w-3xl h-[80%] bg-white p-5 rounded-lg relative flex flex-row overflow-y-auto space-x-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        {/* 왼쪽 이미지 영역 */}
        <div className="w-1/2 flex justify-center items-start border border-gray-300 rounded-lg p-4 mt-4">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-3/4 h-auto object-cover rounded"
          />
        </div>
        {/* 오른쪽 글 영역 */}
        <div className="w-1/2 pl-5 flex flex-col justify-start mt-4">
          <h2 className="text-2xl font-bold text-gray-700 mb-4 border border-gray-300 rounded-lg p-2">
            {recipe.title}
          </h2>
          <p className="text-gray-500 mb-4">
            재료: {recipe.ingredients || "재료 정보 없음"}
          </p>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-gray-700">조리 방법:</h3>
            <p className="text-gray-500">
              조리 방법을 나중에 여기에 추가할 수 있습니다.
            </p>
            1<br />
            2<br />
            3<br />
            4<br />
            5<br />
            6<br />
            7<br />
            8<br />
            9<br />
            10
            <br />
            11
            <br />
            12
            <br />
            13
            <br />
            14
            <br />
            15
            <br />
            16
            <br />
            17
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage_RecipeDescription;
