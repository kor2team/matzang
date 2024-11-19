import useLocalStore from "../store/useLocalStore"; // 상태 관리 파일 가져오기

// API 기본 URL 설정
const Base_URL = "http://localhost:8080/api/auth"; // 기본 URL 수정

//레시피 전체보기 목록
export const fetchAllRecipes = async () => {
  const response = await fetch(
    "http://localhost:8080/api/all/getRecipePostAfterAccess",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data; // 데이터가 { posts: [...] } 형식인지 확인
};

// 나의 레시피 목록 가져오기 API 요청 (Before Access)
export const fetchMyRecipesBeforeAccess = async () => {
  const token = useLocalStore.getState().getToken();

  if (!token) {
    throw new Error("로그인이 필요합니다. 토큰이 없습니다.");
  }
  const response = await fetch(`${Base_URL}/myPostBeforeAccess`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// 나의 레시피 상세 목록 가져오기 API 요청 (After Access)
export const fetchMyRecipesAfterAccess = async () => {
  const token = useLocalStore.getState().getToken();

  if (!token) {
    throw new Error("로그인이 필요합니다. 토큰이 없습니다.");
  }
  const response = await fetch(`${Base_URL}/myPostBeforeAccess`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// 레시피 생성 API 요청
export const createRecipe = async (token, recipeData) => {
  const response = await fetch(`${Base_URL}/create-recipe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(recipeData),
  }); // 응답 본문 확인
  if (!response.ok) {
    const errorText = await response.text();
    console.error("서버 오류 응답:", errorText);
    throw new Error("서버 오류: " + errorText);
  }

  // HTTP 상태 코드 확인
  if (response.ok) {
    return { success: true }; // 성공 여부만 반환
  } else {
    const errorText = await response.text();
    console.error("서버 오류 응답:", errorText);
    return { success: false, message: errorText };
  }
};

// 레시피 수정 API 요청
export const updateRecipe = async (token, recipeId, updatedData) => {
  const response = await fetch(`${Base_URL}/update-recipe/${recipeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });
  return response.json();
};

// 레시피 삭제 API 요청
export const deleteRecipe = async (token, recipeId) => {
  const response = await fetch(`${Base_URL}/delete-recipe/${recipeId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// 리뷰 생성 API 요청
export const createReview = async (token, recipeId, reviewData) => {
  const response = await fetch(`${Base_URL}/create-review/${recipeId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });
  return response.json();
};

// 리뷰 수정 API 요청
export const updateReview = async (token, reviewId, reviewData) => {
  const response = await fetch(`${Base_URL}/update-review/${reviewId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });
  return response.json();
};

// 리뷰 삭제 API 요청
export const deleteReview = async (token, reviewId) => {
  const response = await fetch(`${Base_URL}/delete-review/${reviewId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// 좋아요 추가 API 요청
export const addFavorite = async (token, recipeId) => {
  const response = await fetch(`${Base_URL}/favorite/${recipeId}`, {
    method: "POST", // POST로 수정
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// 좋아요 삭제 API 요청
export const removeFavorite = async (token, recipeId) => {
  const response = await fetch(`${Base_URL}/favorite_cancel/${recipeId}`, {
    // URL 수정
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};
