import React, { useEffect, useState } from "react";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url =
      "https://openapi.foodsafetykorea.go.kr/api/api_key/COOKRCP01/json/1/10";

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("네트워크 응답이 좋지 않습니다.");
        }
        return response.json(); // JSON 데이터로 변환
      })
      .then((recipeData) => {
        const reg = /([가-힣]{1,10}[ ][가-힣]{1,10}|[가-힣]{1,10})/g;
        const rcp = recipeData.COOKRCP01.row.map((obj, key) => {
          const hashtag = obj.RCP_PARTS_DTLS.replace(/\[[^\]]*\]/g, "")
            .replace(/●[^:]*:\s*/g, "")
            .replace(/\(.*?\)/g, "")
            .replace(
              /인분|약간|컵|송송 썬|불린 것|줄기부분|삶은것|주재료|주 재료|육수|마른것|양념|다진|부순|뿌리|으깬|데친|두 가지 색|재료|갈은것|다진것|개|적당량|소스|소스소개/g,
              ""
            )
            .replace(/로즈마리/g, "셰프리")
            .replace(/마리/g, "")
            .replace(/셰프리/g, "로즈마리")
            .replace(/낙지 다리/g, "낙지")
            .replace(/두부강된장 참기름/g, "강된장")
            .replace(/파인애플 통조림/g, "파인애플")
            .match(reg);

          const make = [
            obj.MANUAL01.replace(/1./g, "").replace(/\n+/g, " "),
            obj.MANUAL02.replace(/2./g, "").replace(/\n+/g, " "),
            obj.MANUAL03.replace(/3./g, "").replace(/\n+/g, " "),
            obj.MANUAL04.replace(/4./g, "").replace(/\n+/g, " "),
            obj.MANUAL05.replace(/5./g, "").replace(/\n+/g, " "),
            obj.MANUAL06.replace(/6./g, "").replace(/\n+/g, " "),
            obj.MANUAL07.replace(/7./g, "").replace(/\n+/g, " "),
            obj.MANUAL08.replace(/8./g, "").replace(/\n+/g, " "),
          ].filter((step) => step.trim() !== "");

          const combineMake = make.map((step) => step.replace(/\s+/g, " "));

          const itemPartsDTLS = obj.RCP_PARTS_DTLS.replace(
            /\n/g,
            (match, offset) => {
              if (offset > 0 && obj.RCP_PARTS_DTLS[offset - 1] === "●") {
                return " ";
              } else {
                return ":";
              }
            }
          )
            .replace(/\s+/g, " ")
            .replace(/: :/g, ": ");

          return {
            id: key,
            hashtag: [...new Set(hashtag)],
            name: obj.RCP_NM,
            cook: obj.RCP_WAY2,
            mainImg: obj.ATT_FILE_NO_MAIN,
            tan: obj.INFO_CAR + "g",
            dan: obj.INFO_PRO + "g",
            ji: obj.INFO_FAT + "g",
            na: obj.INFO_NA + "mg",
            yul: obj.INFO_ENG,
            item: itemPartsDTLS
              .replace(/\n+/g, " ")
              .replace(/\[[^\]]*\]/g, "")
              .replace(/[{}[\]?;●·|*~`!^_+<>@#$%&\\='"]/gi, " "),
            v: obj.RCP_PAT2,
            make: combineMake,
            makeImg: [
              obj.MANUAL_IMG01,
              obj.MANUAL_IMG02,
              obj.MANUAL_IMG03,
              obj.MANUAL_IMG04,
              obj.MANUAL_IMG05,
              obj.MANUAL_IMG06,
              obj.MANUAL_IMG07,
              obj.MANUAL_IMG08,
            ].filter((step) => step.trim() !== ""),
          };
        });
        setRecipes(rcp); // 상태에 저장
        setLoading(false); // 로딩 완료
      })
      .catch((error) => {
        setError(error.message); // 에러 메시지 설정
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Recipe List</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id} style={{ marginBottom: "20px" }}>
            <h2>{recipe.name}</h2>
            <img
              src={recipe.mainImg}
              alt={recipe.name}
              style={{ width: "100px", height: "100px" }}
            />

            {/* 조리법 박스 */}
            <div
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
              }}
            >
              <h3>조리법: {recipe.cook}</h3>
            </div>

            {/* 재료 박스 */}
            <div
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
              }}
            >
              <h3>재료</h3>
              <p>{recipe.item}</p>
            </div>

            {/* 레시피 박스 */}
            <div
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
              }}
            >
              <h3>레시피</h3>
              {recipe.make.map((step, index) => (
                <p key={index}>{step}</p> // 각 조리법을 개별적으로 출력
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeList;
