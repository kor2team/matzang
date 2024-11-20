import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const MainPage = () => {
  const [recipes, setRecipes] = useState([]); // 레시피 데이터를 저장하는 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [selectedRecipe, setSelectedRecipe] = useState(null); // 선택된 레시피
  const [isModalOpen, setIsModalOpen] = useState(false); // 레시피 모달 상태
  const [youtubeModalOpen, setYoutubeModalOpen] = useState(false); // 유튜브 영상 모달 상태
  const [youtubeVideo, setYoutubeVideo] = useState(null); // 유튜브 영상 데이터
  const [youtubeVideos, setYoutubeVideos] = useState([]); // 유튜브 영상 리스트

  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // 이미지 모달 상태
  const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지

  // 레시피 데이터 로딩
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/recipes") // API URL을 맞춰주세요
      .then((response) => {
        setRecipes(response.data); // 받아온 레시피 데이터를 상태에 저장
        setLoading(false); // 데이터 로딩 완료 시 로딩 상태를 false로 설정
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
        setLoading(false); // 오류 발생 시에도 로딩 상태를 false로 설정
      });
  }, []);

  // 레시피 카드 클릭 시 모달 열기 및 유튜브 영상 검색
  const handleCardClick = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
    fetchYoutubeVideo(recipe.recipeName); // 레시피 제목을 기준으로 유튜브 영상 검색
  };

  // 모달 닫기
  const handleModalClose = () => {
    setIsModalOpen(false);
    setYoutubeModalOpen(false);
    setSelectedRecipe(null);
    setYoutubeVideo(null);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image); // 클릭한 이미지를 저장
    setIsImageModalOpen(true); // 이미지 모달 열기
  };

  const handleImageModalClose = () => {
    setSelectedImage(null);
    setIsImageModalOpen(false);
  };

  // 유튜브 영상 검색
  const fetchYoutubeVideo = (searchName) => {
    const formattedSearchName = searchName.replace(/\s+/g, ""); // 공백 제거
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
          setYoutubeVideos([]); // 영상이 없으면 빈 배열로 설정
        }
      })
      .catch((error) => {
        console.error("Error fetching YouTube video:", error);
        setYoutubeVideos([]); // 오류 발생 시 영상 리스트 비우기
      });
  };

  // 유튜브 영상 클릭 시 모달 열기
  const handleVideoClick = (videoId) => {
    setYoutubeVideo(videoId);
    setYoutubeModalOpen(true);
  };

  // 레시피 상세 정보 및 유튜브 영상 모달
  const RecipeAndYoutubeModal = ({ isOpen, onClose, recipe, videos }) => {
    if (!isOpen || !recipe) return null;

    const instructions = Array.from({ length: 10 }, (_, i) => {
      const manualKey = `manual${i + 1}`;
      return recipe[manualKey]?.trim()
        ? { step: recipe[manualKey].trim(), stepNumber: i + 1 }
        : null;
    }).filter(Boolean); // null 제거

    const cleanedIngredients = recipe.ingredients
      ? recipe.ingredients.replace(
          new RegExp(`^${recipe.recipeName}\\s*`, "i"),
          ""
        )
      : "";

    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={onClose}
      >
        <div
          className="bg-white p-5 rounded-lg max-w-4xl w-full h-4/5 overflow-hidden flex gap-6 relative"
          onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫기 방지
        >
          {/* 레시피 정보 */}
          <div className="flex-1 overflow-y-auto p-4">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 bg-orange-500 text-white rounded-full shadow-md hover:bg-orange-500 focus:ring-2 focus:ring-red-400"
              aria-label="Close"
            >
              X
            </button>
            <h2 className="text-2xl font-bold text-center mb-4">
              {recipe.recipeName}
            </h2>
            <img
              src={recipe.mainImage}
              alt={recipe.recipeName}
              className="w-full h-56 object-contain rounded mb-4"
            />
            <p className="text-gray-700 mb-4 border-b border-gray-300 pb-2">
              <strong>재료:</strong> {cleanedIngredients}
            </p>
            <p className="text-gray-700 mb-4 border-b border-gray-300 pb-2">
              <strong>칼로리:</strong> {recipe.calorieInfo} kcal
            </p>
            <p className="text-gray-700 mb-4 border-b border-gray-300 pb-2">
              <strong>나트륨:</strong> {recipe.sodiumInfo} mg
            </p>
            <div className="border-b border-gray-300 pb-2">
              <h3 className="text-lg font-semibold mb-2 ">조리 방법</h3>
              <div className="max-h-64 overflow-y-auto">
                {instructions.length > 0 ? (
                  instructions.map((instruction, index) => (
                    <div key={index} className="mb-2">
                      <p className="text-gray-600 font-semibold">
                        {instruction.step}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">
                    조리 방법이 제공되지 않았습니다.
                  </p>
                )}
              </div>
              {/* 모든 이미지 표시 */}
              <div className="recipe-images flex gap-2 mt-4">
                {[
                  recipe.manualImg1,
                  recipe.manualImg2,
                  recipe.manualImg3,
                  recipe.manualImg4,
                  recipe.manualImg5,
                  recipe.manualImg6,
                  recipe.manualImg7,
                  recipe.manualImg8,
                  recipe.manualImg9,
                  recipe.manualImg10,
                ]
                  .filter((img) => img) // 빈 이미지 제거
                  .map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Step ${index + 1}`}
                      className="w-20 h-20 object-cover rounded cursor-pointer"
                      onClick={() => handleImageClick(img)} // 클릭 핸들러 추가
                    />
                  ))}
              </div>
            </div>

            {recipe.recipeTip && (
              <div className="mt-4 border-b border-gray-300 pb-2">
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

          {/* 유튜브 영상 목록 */}
          {videos.length > 0 && (
            <div className="w-1/3 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">관련된 유튜브 영상</h3>
              <div className="flex flex-col gap-4">
                {videos.map((video) => (
                  <div
                    key={video.videoId}
                    className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                    onClick={() => handleVideoClick(video.videoId)}
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
      <h1 className="text-2xl font-bold text-center my-8">레시피 모음집</h1>
      {loading ? (
        // 로딩 중일 때 Spinner 표시
        <div className="flex justify-center items-center h-screen">
          <ClipLoader
            color="#3498db"
            loading={loading}
            size={60}
            thickness={5}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
              onClick={() => handleCardClick(recipe)}
            >
              <img
                src={recipe.mainImage}
                alt={recipe.recipeName}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h3 className="text-xl font-semibold">{recipe.recipeName}</h3>
            </div>
          ))}
        </div>
      )}

      {/* 레시피 및 유튜브 영상 모달 */}
      <RecipeAndYoutubeModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        recipe={selectedRecipe}
        videos={youtubeVideos}
      />

      {isImageModalOpen && selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
          onClick={handleImageModalClose}
        >
          <div
            className="relative bg-white p-4 rounded-lg max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫기 방지
          >
            <button
              onClick={handleImageModalClose}
              className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 bg-orange-500 text-white rounded-full shadow-md hover:bg-orange-500 focus:ring-2 focus:ring-red-400"
              aria-label="Close"
            >
              X
            </button>
            <img
              src={selectedImage}
              alt="Expanded view"
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      )}

      {/* 유튜브 영상 모달 */}
      {youtubeVideo && youtubeModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            {loading ? (
              <div className="absolute inset-0 flex justify-center items-center">
                <ClipLoader
                  color="#e74c3c"
                  loading={loading}
                  size={50}
                  thickness={5}
                />
              </div>
            ) : (
              <>
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${youtubeVideo}?autoplay=1`}
                  title="유튜브 영상"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>

                {/* 닫기 버튼 */}
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 bg-white rounded-full p-2 shadow-md"
                  onClick={() => setYoutubeModalOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
