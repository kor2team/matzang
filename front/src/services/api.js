import useLocalStore from "../store/useLocalStore"; // 상태 관리 파일 가져오기

// API 기본 URL 설정
const Base_URL = "http://3.38.13.94:8080/api/auth"; // 기본 URL 수정

//레시피 전체보기 목록
export const fetchAllRecipes = async () => {
  const token = useLocalStore.getState().getToken();
  if (!token) {
    console.log("로그인이 필요합니다. 토큰이 없습니다.");
  }
  const response = await fetch(
    "http://3.38.13.94:8080/api/all/getRecipePostAfterAccess",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  // console.log(data);
  return data; // 데이터가 { posts: [...] } 형식인지 확인
};

// 나의 레시피 목록 가져오기 API 요청 (Before Access)
export const fetchMyRecipes = async () => {
  const token = useLocalStore.getState().getToken();
  if (!token) {
    console.log("로그인이 필요합니다. 토큰이 없습니다.");
  }
  const response = await fetch(`${Base_URL}/myPostAfterAccess`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const userData = await response.json();
  return userData;
};

// 좋아요 레시피 가져오기
export const fetchFavoriteRecipes = async () => {
  const token = useLocalStore.getState().getToken();
  if (!token) {
    console.log("로그인이 필요합니다. 토큰이 없습니다.");
  }
  const response = await fetch(`${Base_URL}/myFavoriteRecipe`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const favoriteData = await response.json();
  return favoriteData;
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

// 레시피 삭제 API 요청
export const deleteRecipe = async (token, recipeId) => {
  const response = await fetch(`${Base_URL}/delete-recipe/${recipeId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }); // HTTP 상태 코드 확인
  if (response.ok) {
    return { success: true }; // 성공 여부만 반환
  } else {
    const errorText = await response.text();
    console.error("서버 오류 응답:", errorText);
    return { success: false, message: errorText };
  }
};

// 리뷰 생성 API 요청
export const createReview = async (token, recipeId, review) => {
  const response = await fetch(`${Base_URL}/create-review/${recipeId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(review), // review 매개변수를 사용
  });
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

// 리뷰 삭제 API 요청
export const deleteReview = async (token, reviewId) => {
  const response = await fetch(`${Base_URL}/delete-review/${reviewId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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

// 좋아요 추가 API 요청
export const addFavorite = async (token, recipeId) => {
  await fetch(`${Base_URL}/favorite`, {
    method: "POST", // POST로 수정
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // 이 헤더 추가
    },
    body: JSON.stringify({ recipeId }), // 요청 본문에 recipeId 포함
  });
};

// 좋아요 삭제 API 요청
export const removeFavorite = async (token, recipeId) => {
  await fetch(`${Base_URL}/favorite_cancel/${recipeId}`, {
    // URL 수정
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// userId 받아오기
export const fetchSetUserId = async (token) => {
  try {
    const response = await fetch(`${Base_URL}/userIdByJwt`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const userId = await response.text();
    return userId;
  } catch (error) {
    console.error("userId 추출에 실패하였습니다:", error);
    return null;
  }
};
