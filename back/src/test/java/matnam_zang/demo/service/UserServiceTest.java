package matnam_zang.demo.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import jakarta.transaction.Transactional;
import matnam_zang.demo.dto.BoardRecipeDto;
import matnam_zang.demo.dto.BoardRecipesDto;
import matnam_zang.demo.dto.ImageDto;
import matnam_zang.demo.dto.ReviewDto;
import matnam_zang.demo.dto.UserRecipeDto;
import matnam_zang.demo.entity.Category;
import matnam_zang.demo.entity.Favorite;
import matnam_zang.demo.entity.Image;
import matnam_zang.demo.entity.Ingredient;
import matnam_zang.demo.entity.Instruction;
import matnam_zang.demo.entity.Recipe;
import matnam_zang.demo.entity.Review;
import matnam_zang.demo.entity.User;
import matnam_zang.demo.repository.CategoryRepository;
import matnam_zang.demo.repository.FavoriteRepository;
import matnam_zang.demo.repository.ImageRepository;
import matnam_zang.demo.repository.IngredientRepository;
import matnam_zang.demo.repository.InstructionRepository;
import matnam_zang.demo.repository.RecipeRepository;
import matnam_zang.demo.repository.ReviewRepository;
import matnam_zang.demo.repository.UserRepository;
import matnam_zang.demo.security.TokenProvider;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)  // Spring Boot 애플리케이션의 컨텍스트 로드
@AutoConfigureMockMvc  // MockMvc 자동 설정
@TestMethodOrder(OrderAnnotation.class)  // 테스트 순서 지정
@Transactional
public class UserServiceTest {
    
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

    // 회원가입
    @Test
    @Order(1)
    void registerUser() throws Exception {
        String userJson = "{\"username\":\"testuser\", \"password\":\"testpassword\", \"email\":\"test@example.com\"}";
    
        // 회원가입 요청을 보내기
        mockMvc.perform(post("/api/auth/register")
        .contentType("application/json")
        .content(userJson))
        .andExpect(status().isOk());  // 200 상태 코드를 기대
    }

    // 로그인
    @Test
    @Order(2)
    void loginUser() throws Exception {
        String userJson = "{\"username\":\"testuser\", \"password\":\"testpassword\"}";
    
        // 로그인 요청을 보내기
        this.jwtToken = mockMvc.perform(post("/api/auth/login")
                .contentType("application/json")
                .content(userJson))
                .andExpect(status().isOk())  // 200 상태 코드
                .andExpect(jsonPath("$.token").exists())  // token 존재 확인
                .andExpect(jsonPath("$.token").isString())  // token이 문자열인지 확인
                .andReturn()
                .getResponse()
                .getContentAsString()
                .split("\"token\":\"")[1].split("\"")[0];  // 토큰만 추출해서 저장
    }
}
