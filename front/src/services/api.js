// API 기본 URL 설정
const Base_URL = "http://localhost:8080/api/auth"; // 기본 URL 수정

// 회원가입 API 요청
export const registerUser = async (username, email, password) => {
  const response = await fetch(`${Base_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });
  if (response.ok) {
    return; // 응답 본문을 받지 않고, 상태 코드 200만 확인
  } else {
    const error = await response.json();
    throw new Error(`Registration failed: ${error.message || "Unknown error"}`);
  }
};

// 로그인 API 요청
export const loginUser = async (username, password) => {
  console.log("로그인 시도 - username:", username, "password:", password);
  const response = await fetch(`${Base_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Login failed: ${error.message || "Unknown error"}`);
  }

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
  });
  return response.json();
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

// 나의 레시피 목록 가져오기 API 요청 (Before Access)
export const fetchMyRecipesBeforeAccess = async (token) => {
  const response = await fetch(`${Base_URL}/myPostBeforeAccess`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// 나의 레시피 상세 목록 가져오기 API 요청 (After Access)
export const fetchMyRecipesAfterAccess = async (token) => {
  const response = await fetch(`${Base_URL}/myPostAfterAccess`, {
    method: "GET",
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
