package matnam_zang.demo.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import matnam_zang.demo.dto.RecipeDto;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecipeService {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${api.recipeKey}")
    private String recipeKey;

    public RecipeService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public List<RecipeDto> getRecipes() {
        String apiUrl = String.format("http://openapi.foodsafetykorea.go.kr/api/%s/COOKRCP01/json/1/5", recipeKey); // API 경로
        String response = restTemplate.getForObject(apiUrl, String.class); // RestTemplate 사용해 API에서 JSON응답을 string 형태로 받음 
        List<RecipeDto> recipeList = new ArrayList<>(); // API를 저장할 리스트 선언 (이때 리스트의 형태는 미리 정해둔 DTO의 list)

        try {
            JsonNode rootNode = objectMapper.readTree(response); // JSON 응답을 JsonNode로 파싱
            JsonNode recipes = rootNode.path("COOKRCP01").path("row"); // JSON 경로 따라 "COOKRCP01" 아래의 "row"배열을 가져옴

            // 들어온 레시피 수만큼 진행
            for (JsonNode recipeNode : recipes) {
                RecipeDto recipe = new RecipeDto();
                recipe.setRecipeName(recipeNode.path("RCP_NM").asText()); // JSON의 'RCP_NM'을 recipeName에 매핑
                recipe.setIngredients(recipeNode.path("RCP_PARTS_DTLS").asText()); // JSON의 'RCP_PARTS_DTLS'를 ingredients에 매핑
                recipe.setCookingMethod(recipeNode.path("RCP_WAY2").asText()); // 조리 방법
                recipe.setRecipeSequence(recipeNode.path("RCP_SEQ").asText()); // 레시피 순서
                recipe.setSodiumInfo(recipeNode.path("INFO_NA").asText()); // 나트륨 정보
                recipe.setWeightInfo(recipeNode.path("INFO_WGT").asText()); // 무게 정보
                recipe.setProteinInfo(recipeNode.path("INFO_PRO").asText()); // 단백질 정보
                recipe.setFatInfo(recipeNode.path("INFO_FAT").asText()); // 지방 정보
                recipe.setCarbohydrateInfo(recipeNode.path("INFO_CAR").asText()); // 탄수화물 정보
                recipe.setCalorieInfo(recipeNode.path("INFO_ENG").asText()); // 칼로리 정보
                recipe.setRecipeTip(recipeNode.path("RCP_NA_TIP").asText()); // 레시피 팁
                recipe.setHashTag(recipeNode.path("HASH_TAG").asText()); // 해시태그
                recipe.setCategory(recipeNode.path("RCP_PAT2").asText()); // 카테고리
                recipe.setManual(recipeNode.path("MANUAL").asText()); // 조리 방법 설명
                recipe.setMainImage(recipeNode.path("ATT_FILE_NO_MAIN").asText()); // 메인 이미지

                // MANUAL_IMG 필드 매핑
                for (int i = 1; i <= 20; i++) {
                    String manualImgField = "MANUAL_IMG" + String.format("%02d", i); // 각 조리 이미지 필드 이름 동적생성 (ex. "MANUAL_IMG01")
                    String manualImgValue = recipeNode.path(manualImgField).asText(); // 해당 필드의 값 가져옴
                    switch (i) {
                        case 1 -> recipe.setManualImg1(manualImgValue);
                        case 2 -> recipe.setManualImg2(manualImgValue);
                        case 3 -> recipe.setManualImg3(manualImgValue);
                        case 4 -> recipe.setManualImg4(manualImgValue);
                        case 5 -> recipe.setManualImg5(manualImgValue);
                        case 6 -> recipe.setManualImg6(manualImgValue);
                        case 7 -> recipe.setManualImg7(manualImgValue);
                        case 8 -> recipe.setManualImg8(manualImgValue);
                        case 9 -> recipe.setManualImg9(manualImgValue);
                        case 10 -> recipe.setManualImg10(manualImgValue);
                        case 11 -> recipe.setManualImg11(manualImgValue);
                        case 12 -> recipe.setManualImg12(manualImgValue);
                        case 13 -> recipe.setManualImg13(manualImgValue);
                        case 14 -> recipe.setManualImg14(manualImgValue);
                        case 15 -> recipe.setManualImg15(manualImgValue);
                        case 16 -> recipe.setManualImg16(manualImgValue);
                        case 17 -> recipe.setManualImg17(manualImgValue);
                        case 18 -> recipe.setManualImg18(manualImgValue);
                        case 19 -> recipe.setManualImg19(manualImgValue);
                        case 20 -> recipe.setManualImg20(manualImgValue);
                    }
                }
                
                recipeList.add(recipe);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return recipeList;
    }

    // RCP_WAY2 값을 파라미터로 받아서 레시피를 검색하는 메서드
    public List<RecipeDto> getRecipesByCookingName(String cookingName) {
        // API URL 정의 (파라미터를 추가하기 위해 String.format을 사용)
        String apiUrl = String.format("http://openapi.foodsafetykorea.go.kr/api/%s/COOKRCP01/json/1/5/RCP_NM=%s", recipeKey, cookingName);

        // RestTemplate을 사용하여 API에서 JSON 응답을 String 형태로 받음
        String response = restTemplate.getForObject(apiUrl, String.class);

        // RecipeDto 객체를 저장할 리스트 생성
        List<RecipeDto> recipeList = new ArrayList<>();

        try {
            // JSON 응답을 JsonNode로 파싱
            JsonNode rootNode = objectMapper.readTree(response);
            // JSON 경로를 따라 "COOKRCP01" 아래의 "row" 배열을 가져옴
            JsonNode recipes = rootNode.path("COOKRCP01").path("row"); // JSON 경로에 맞춰 조정

            // 각 레시피를 반복 처리
            for (JsonNode recipeNode : recipes) {
                // 새로운 RecipeDto 객체 생성
                RecipeDto recipe = new RecipeDto();
                recipe.setRecipeName(recipeNode.path("RCP_NM").asText());
                recipe.setIngredients(recipeNode.path("RCP_PARTS_DTLS").asText());
                recipe.setCookingMethod(recipeNode.path("RCP_WAY2").asText());
                recipe.setRecipeSequence(recipeNode.path("RCP_SEQ").asText());
                recipe.setSodiumInfo(recipeNode.path("INFO_NA").asText());
                recipe.setWeightInfo(recipeNode.path("INFO_WGT").asText());
                recipe.setProteinInfo(recipeNode.path("INFO_PRO").asText());
                recipe.setFatInfo(recipeNode.path("INFO_FAT").asText());
                recipe.setCarbohydrateInfo(recipeNode.path("INFO_CAR").asText());
                recipe.setCalorieInfo(recipeNode.path("INFO_ENG").asText());
                recipe.setRecipeTip(recipeNode.path("RCP_NA_TIP").asText());
                recipe.setHashTag(recipeNode.path("HASH_TAG").asText());
                recipe.setCategory(recipeNode.path("RCP_PAT2").asText());
                recipe.setManual(recipeNode.path("MANUAL").asText());
                recipe.setMainImage(recipeNode.path("ATT_FILE_NO_MAIN").asText());

                // MANUAL_IMG 필드 매핑
                for (int i = 1; i <= 20; i++) {
                    String manualImgField = "MANUAL_IMG" + String.format("%02d", i);
                    String manualImgValue = recipeNode.path(manualImgField).asText();
                    switch (i) {
                        case 1 -> recipe.setManualImg1(manualImgValue);
                        case 2 -> recipe.setManualImg2(manualImgValue);
                        case 3 -> recipe.setManualImg3(manualImgValue);
                        case 4 -> recipe.setManualImg4(manualImgValue);
                        case 5 -> recipe.setManualImg5(manualImgValue);
                        case 6 -> recipe.setManualImg6(manualImgValue);
                        case 7 -> recipe.setManualImg7(manualImgValue);
                        case 8 -> recipe.setManualImg8(manualImgValue);
                        case 9 -> recipe.setManualImg9(manualImgValue);
                        case 10 -> recipe.setManualImg10(manualImgValue);
                        case 11 -> recipe.setManualImg11(manualImgValue);
                        case 12 -> recipe.setManualImg12(manualImgValue);
                        case 13 -> recipe.setManualImg13(manualImgValue);
                        case 14 -> recipe.setManualImg14(manualImgValue);
                        case 15 -> recipe.setManualImg15(manualImgValue);
                        case 16 -> recipe.setManualImg16(manualImgValue);
                        case 17 -> recipe.setManualImg17(manualImgValue);
                        case 18 -> recipe.setManualImg18(manualImgValue);
                        case 19 -> recipe.setManualImg19(manualImgValue);
                        case 20 -> recipe.setManualImg20(manualImgValue);
                    }
                }

                recipeList.add(recipe);
            }
        } catch (Exception e) {
            // 예외 발생 시 스택 트레이스를 출력
            e.printStackTrace();
        }

        return recipeList;
    }
}
