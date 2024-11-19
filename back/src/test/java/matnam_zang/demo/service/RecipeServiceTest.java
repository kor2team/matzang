package matnam_zang.demo.service;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import matnam_zang.demo.dto.RecipeDto;

@ActiveProfiles("test")  // 'test' 프로파일을 활성화
@TestPropertySource(locations = "classpath:application.properties") // 테스트에 사용할 application.properties 파일 지정
public class RecipeServiceTest {

    @Value("${api.recipeKey}")  // application.properties에서 recipeKey를 읽어옴
    private String recipeKey;

    @Mock
    private RestTemplate restTemplate;  // RestTemplate을 mock으로 설정

    @Mock
    private ObjectMapper objectMapper;  // ObjectMapper을 mock으로 설정

    @InjectMocks
    private RecipeService recipeService;  // 실제 RecipeService 객체가 mock된 RestTemplate과 ObjectMapper을 사용하도록 설정

    @BeforeEach
    public void setUp() {
        // Mockito 초기화
        MockitoAnnotations.openMocks(this);  
    }

    @Test
    public void testGetRecipes() throws Exception {
        // API URL 구성
        String apiUrl = String.format("http://openapi.foodsafetykorea.go.kr/api/%s/COOKRCP01/json/1/5", recipeKey);

        // API의 mock 응답을 생성
        String jsonResponse = 
        "{"
        + "\"COOKRCP01\": {"
        + "  \"row\": ["
        + "    {"
        + "      \"RCP_NM\": \"Test Recipe\","
        + "      \"RCP_PARTS_DTLS\": \"Test Ingredients\","
        + "      \"RCP_WAY2\": \"Test Method\","
        + "      \"RCP_SEQ\": \"1\","
        + "      \"INFO_NA\": \"10mg\","
        + "      \"INFO_WGT\": \"200g\","
        + "      \"INFO_PRO\": \"5g\","
        + "      \"INFO_FAT\": \"2g\","
        + "      \"INFO_CAR\": \"30g\","
        + "      \"INFO_ENG\": \"150kcal\","
        + "      \"RCP_NA_TIP\": \"Test Tip\","
        + "      \"HASH_TAG\": \"#test\","
        + "      \"RCP_PAT2\": \"Test Category\","
        + "      \"ATT_FILE_NO_MAIN\": \"mainImage.jpg\","
        + "      \"MANUAL01\": \"Step 1\","
        + "      \"MANUAL_IMG01\": \"img1.jpg\""
        + "    }"
        + "  ]"
        + "}";

        // RestTemplate의 getForObject 호출을 mock하여 위의 jsonResponse를 반환하도록 설정
        when(restTemplate.getForObject(apiUrl, String.class)).thenReturn(jsonResponse);

        List<RecipeDto> recipeList = recipeService.getRecipes(recipeKey);

        // 검증: 첫 번째 레시피의 정보가 예상한 값과 일치하는지 확인
        RecipeDto firstRecipe = recipeList.get(0);

        // 예상한 값 설정 (API 응답에 맞게 설정)
        RecipeDto expectedRecipe = new RecipeDto();
        expectedRecipe.setRecipeName("Test Recipe");
        expectedRecipe.setIngredients("Test Ingredients");
        expectedRecipe.setCookingMethod("Test Method");
        expectedRecipe.setRecipeSequence("1");
        expectedRecipe.setSodiumInfo("10mg");
        expectedRecipe.setWeightInfo("200g");
        expectedRecipe.setProteinInfo("5g");
        expectedRecipe.setFatInfo("2g");
        expectedRecipe.setCarbohydrateInfo("30g");
        expectedRecipe.setCalorieInfo("150kcal");
        expectedRecipe.setRecipeTip("Test Tip");
        expectedRecipe.setHashTag("#test");
        expectedRecipe.setCategory("Test Category");
        expectedRecipe.setMainImage("mainImage.jpg");
        expectedRecipe.setManual1("Step 1");
        expectedRecipe.setManualImg1("img1.jpg");

        // 검증: 첫 번째 레시피의 정보가 예상한 값과 일치하는지 확인
        assertEquals(expectedRecipe.getRecipeName(), firstRecipe.getRecipeName());
        assertEquals(expectedRecipe.getIngredients(), firstRecipe.getIngredients());
        assertEquals(expectedRecipe.getCookingMethod(), firstRecipe.getCookingMethod());
        assertEquals(expectedRecipe.getRecipeSequence(), firstRecipe.getRecipeSequence());
        assertEquals(expectedRecipe.getSodiumInfo(), firstRecipe.getSodiumInfo());
        assertEquals(expectedRecipe.getWeightInfo(), firstRecipe.getWeightInfo());
        assertEquals(expectedRecipe.getProteinInfo(), firstRecipe.getProteinInfo());
        assertEquals(expectedRecipe.getFatInfo(), firstRecipe.getFatInfo());
        assertEquals(expectedRecipe.getCarbohydrateInfo(), firstRecipe.getCarbohydrateInfo());
        assertEquals(expectedRecipe.getCalorieInfo(), firstRecipe.getCalorieInfo());
        assertEquals(expectedRecipe.getRecipeTip(), firstRecipe.getRecipeTip());
        assertEquals(expectedRecipe.getHashTag(), firstRecipe.getHashTag());
        assertEquals(expectedRecipe.getCategory(), firstRecipe.getCategory());
        assertEquals(expectedRecipe.getMainImage(), firstRecipe.getMainImage());
        assertEquals(expectedRecipe.getManual1(), firstRecipe.getManual1());
        assertEquals(expectedRecipe.getManualImg1(), firstRecipe.getManualImg1());
    }

    @Test
    void testGetRecipesByCookingName() {

    }

    @Test
    void testGetRecipesByIngredients() {

    }
}
