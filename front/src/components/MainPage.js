import React, { useState, useEffect } from "react";
import axios from "axios";

const MainPage = () => {
  const [recipes, setRecipes] = useState([]); // 레시피 데이터를 저장하는 상태
  const [selectedRecipe, setSelectedRecipe] = useState(null); // 선택된 레시피
  const [isModalOpen, setIsModalOpen] = useState(false); // 레시피 모달 상태
  const [youtubeModalOpen, setYoutubeModalOpen] = useState(false); // 유튜브 영상 모달 상태
  const [youtubeVideo, setYoutubeVideo] = useState(null); // 유튜브 영상 데이터
  const [youtubeVideos, setYoutubeVideos] = useState([]); // 유튜브 영상 리스트

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
    setSelectedRecipe(recipe); // 클릭한 레시피 설정
    setIsModalOpen(true); // 레시피 모달 열기

    fetchYoutubeVideo(recipe.recipeName); // 레시피 제목을 기준으로 유튜브 영상 검색 후 바로 표시
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // 모달 닫기
    setYoutubeModalOpen(false); // 유튜브 모달 닫기
    setSelectedRecipe(null); // 선택된 레시피 초기화
    setYoutubeVideo(null); // 유튜브 영상 초기화
  };

  const fetchYoutubeVideo = (searchName) => {
    // 공백을 제거하여 유튜브 API 요청에 사용할 이름으로 변환
    const formattedSearchName = searchName.replace(/\s+/g, ""); // 공백 제거

    // 유튜브 API에서 영상 검색
    axios
      .get(
        `http://localhost:8080/api/youtube/${encodeURIComponent(
          formattedSearchName
        )}`
      )
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setYoutubeVideos(response.data); // 유튜브 영상 리스트 저장
        } else {
          console.log("No YouTube video found for", searchName);
          setYoutubeVideos([]); // 유튜브 영상 리스트 비우기
        }
      })
      .catch((error) => {
        console.error("Error fetching YouTube video:", error);
        setYoutubeVideos([]); // 오류 발생 시 영상 리스트 비우기
      });
  };

  const handleVideoClick = (videoId) => {
    setYoutubeVideo(videoId); // 선택된 videoId로 영상 설정
    setYoutubeModalOpen(true); // 유튜브 모달 열기
  };

  // 레시피 상세 정보를 보여주는 모달
  const RecipeAndYoutubeModal = ({ isOpen, onClose, recipe, videos }) => {
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
          className="bg-white p-5 rounded-lg max-w-4xl w-full flex gap-6"
          onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫기 방지
        >
          {/* 왼쪽 레시피 정보 */}
          <div className="flex-1">
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
                  <p className="text-gray-600">
                    조리 방법이 제공되지 않았습니다.
                  </p>
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

          {/* 오른쪽 유튜브 영상 목록 */}
          {videos.length > 0 && (
            <div className="w-1/3">
              <h3 className="text-lg font-semibold mb-4">관련된 유튜브 영상</h3>
              <div className="flex flex-col gap-4">
                {videos.map((video) => (
                  <div
                    key={video.videoId}
                    className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                    onClick={() => handleVideoClick(video.videoId)} // 영상 클릭 시 유튜브 영상 모달 열기
                  >
                    <img
                      src={video.thumbnailHigh}
                      alt={video.title}
                      className="w-full h-40 object-cover rounded mb-2"
                    />
                    <h3 className="text-sm font-semibold text-center">
                      {video.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
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

      {/* 레시피와 유튜브 영상을 보여주는 모달 */}
      <RecipeAndYoutubeModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        recipe={selectedRecipe}
        videos={youtubeVideos}
      />

      {/* 유튜브 영상 모달 */}
      {youtubeVideo && youtubeModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${youtubeVideo}?autoplay=1`}
              title="유튜브 영상"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button
              onClick={() => {
                setYoutubeModalOpen(false); // 모달 닫기
                setYoutubeVideo(null); // 선택된 유튜브 비디오 초기화
              }}
              className="mt-4 text-white bg-red-500 p-2 rounded"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
