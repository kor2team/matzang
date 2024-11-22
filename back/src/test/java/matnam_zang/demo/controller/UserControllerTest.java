package matnam_zang.demo.controller;

import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.TestMethodOrder;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import jakarta.transaction.Transactional;
import matnam_zang.demo.repository.CategoryRepository;
import matnam_zang.demo.repository.FavoriteRepository;
import matnam_zang.demo.repository.ImageRepository;
import matnam_zang.demo.repository.IngredientRepository;
import matnam_zang.demo.repository.InstructionRepository;
import matnam_zang.demo.repository.RecipeRepository;
import matnam_zang.demo.repository.ReviewRepository;
import matnam_zang.demo.repository.UserRepository;
import matnam_zang.demo.security.TokenProvider;

// 컨트롤러단에서의 통합테스트 (컨트롤러-서비스-레파지토리-db 까지의 api 전체로직을 검증하여 리턴값 검증)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)  // Spring Boot 애플리케이션의 컨텍스트 로드
@AutoConfigureMockMvc  // MockMvc 자동 설정
@TestMethodOrder(OrderAnnotation.class)  // 테스트 순서 지정
@Transactional
public class UserControllerTest {
    
    @Mock
    private RecipeRepository recipeRepository;

    
    @Mock
    private ImageRepository imageRepository;

    
    @Mock
    private IngredientRepository ingredientRepository;

    
    @Mock
    private InstructionRepository instructionRepository;

    
    @Mock
    private CategoryRepository categoryRepository;

    
    @Mock
    private UserRepository userRepository;

    
    @Mock
    private TokenProvider tokenProvider;

    
    @Mock
    private PasswordEncoder passwordEncoder;

    
    @Mock
    private ReviewRepository reviewRepository;

    
    @Mock
    private FavoriteRepository favoriteRepository;

    @Autowired
    private MockMvc mockMvc;  // MockMvc를 사용해 HTTP 요청을 시뮬레이션

    private String jwtToken;  // JWT 토큰을 저장할 변수

    // // 회원가입
    // @Test
    // @Order(1)
    // void registerUser() throws Exception {
    //     String userJson = "{\"username\":\"testuser\", \"password\":\"testpassword\", \"email\":\"test@example.com\"}";
    
    //     // 회원가입 요청을 보내기
    //     mockMvc.perform(post("/api/auth/register")
    //     .contentType("application/json")
    //     .content(userJson))
    //     .andExpect(status().isOk());  // 200 상태 코드를 기대
    // }

    // // 로그인 (트랜잭션은 각 메소드마다 개별적으로 종속되기때문에 롤백 회원가입시의 데이터를 활용할수없어 회원가입 로직 자체를 로그인에 포함시켜 진행)
    // @Test
    // @Order(2)
    // void loginUser() throws Exception {

    //     String userJson = "{\"username\":\"testuser\", \"password\":\"testpassword\", \"email\":\"test@example.com\"}";
    
    //     // 회원가입 요청을 보내기
    //     mockMvc.perform(post("/api/auth/register")
    //     .contentType("application/json")
    //     .content(userJson));

    //     String loginJson = "{\"username\":\"testuser\", \"password\":\"testpassword\"}";
    
    //     // 로그인 요청을 보내기
    //     this.jwtToken = mockMvc.perform(post("/api/auth/login")
    //             .contentType("application/json")
    //             .content(loginJson))
    //             .andExpect(status().isOk())  // 200 상태 코드
    //             .andExpect(jsonPath("$.token").exists())  // token 존재 확인
    //             .andExpect(jsonPath("$.token").isString())  // token이 문자열인지 확인
    //             .andReturn()
    //             .getResponse()
    //             .getContentAsString()
    //             .split("\"token\":\"")[1].split("\"")[0];  // 토큰만 추출해서 저장
    // }
}
