package matnam_zang.demo.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import matnam_zang.demo.dto.ReviewDto;
import matnam_zang.demo.entity.Recipe;
import matnam_zang.demo.entity.Review;
import matnam_zang.demo.entity.User;
import matnam_zang.demo.repository.RecipeRepository;
import matnam_zang.demo.repository.ReviewRepository;
import matnam_zang.demo.repository.UserRepository;
import matnam_zang.demo.security.TokenProvider;

// 서비스단의 단위테스트 (서비스단에서의 메소드만 확인하기때문에 전체적 로직과는 연관없이 서비스만 의존)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private TokenProvider tokenProvider;

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private RecipeRepository recipeRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // 회원가입 단위테스트
    @Test
    void registerUser() {
        // given
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("encodedPassword");
        user.setEmail("test@example.com");

        when(passwordEncoder.encode("testpassword")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // when
        assertDoesNotThrow(() -> userService.registerUser(user));  // 메서드 호출 시 예외가 발생하지 않는지 확인

        // then
        verify(userRepository, times(1)).save(any(User.class));  // userRepository의 save 메서드가 한 번 호출됐는지 확인
    }


    // 로그인 단위테스트
    @Test
    void loginUser() {
        // given
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("encodedPassword");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("testpassword", "encodedPassword")).thenReturn(true);
        when(tokenProvider.createToken("testuser")).thenReturn("dummyJwtToken");

        // when
        String token = userService.loginUser("testuser", "testpassword");

        // then
        assertNotNull(token);
        assertEquals("dummyJwtToken", token);
        verify(tokenProvider, times(1)).createToken("testuser");
    }

    // 게시물 작성 단위테스트
    // @Test
    // void createRecipe() {

    //     {
    //         "title": "팬케이크2",
    //         "recipeDescription": "간편 아침",
    //         "cookTime": 30,
    //         "difficultyLevel": "상",
    //         "images": ,
    //         "ingredients": [
    //             "밀가루 100g",
    //             "메이플 시럽 20g"
    //         ],
    //         "instructions": [
    //             "반죽을 한다",
    //             "굽는다"
    //         ],
    //         "categories": [
    //             "굽기",
    //             "디저트"
    //         ]
    //     }

    //     // given
    //     Recipe recipe = new Recipe();
    //     recipe.setTitle("팬케이크2");
    //     recipe.setRecipeDescription("간편 아침");
    //     recipe.setCookTime(30);
    //     recipe.setDifficultyLevel("상");
    //     List<Image> images = new ArrayList<>();
    //     String[] imageUrls = {"http://example.com/images/test1.jpg", "http://example.com/images/test2.jpg"};
    //     for (String imageUrl : imageUrls) {
    //         Image image = new Image();
    //         image.setRecipe(recipe);
    //         image.setImageUrl(imageUrl);
    //         images.add(image);
    //     }
    //     List<Image> images = new ArrayList<>();
    //     String[] imageUrls = {"http://example.com/images/test1.jpg", "http://example.com/images/test2.jpg"};
    //     for (String imageUrl : imageUrls) {
    //         Image image = new Image();
    //         image.setRecipe(recipe);
    //         image.setImageUrl(imageUrl);
    //         images.add(image);
    //     }
    //     List<Image> images = new ArrayList<>();
    //     String[] imageUrls = {"http://example.com/images/test1.jpg", "http://example.com/images/test2.jpg"};
    //     for (String imageUrl : imageUrls) {
    //         Image image = new Image();
    //         image.setRecipe(recipe);
    //         image.setImageUrl(imageUrl);
    //         images.add(image);
    //     }
    //     recipe.setImages();

    //     when(passwordEncoder.encode("testpassword")).thenReturn("encodedPassword");
    //     when(userRepository.save(any(User.class))).thenReturn(user);

    //     // when
    //     assertDoesNotThrow(() -> userService.registerUser(user));  // 메서드 호출 시 예외가 발생하지 않는지 확인

    //     // then
    //     verify(userRepository, times(1)).save(any(User.class));  // userRepository의 save 메서드가 한 번 호출됐는지 확인
    // }


    // 게시물 수정 단위테스트
    @Test
    void updateRecipe(){

    }
    
    // 게시물 삭제 단위테스트

    // 댓글 작성
    @Test
    void createReview_Success(){
        String token = "validToken";
        Long recipeId = 1L;
        ReviewDto reviewDto = new ReviewDto("Great recipe!");
        String username = "user1";

        when(tokenProvider.isTokenExpired(anyString())).thenReturn(false);
        when(tokenProvider.getUsernameFromToken(anyString())).thenReturn(username);
        when(recipeRepository.findById(recipeId)).thenReturn(Optional.of(new Recipe()));
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(new User()));

        userService.createReview(token, recipeId, reviewDto);

        verify(reviewRepository, times(1)).save(any(Review.class));
    }

    @Test
    void createReview_JwtExpired(){
        String token = "Bearer notValidToken";
        Long recipeId = 1L;
        ReviewDto reviewDto = new ReviewDto("Great recipe!");

        when(tokenProvider.isTokenExpired(anyString())).thenReturn(true);
        
        assertThrows(ResponseStatusException.class, () -> {
            userService.createReview(token, recipeId, reviewDto);
        });

    }

    @Test
    void createReview_NotExistRecipe(){
        //Given
        String token = "Bearer notValidToken";
        Long recipeId = 1L;
        ReviewDto reviewDto = new ReviewDto("Great recipe!");
        String username = "user1";

        //When
        when(tokenProvider.isTokenExpired(anyString())).thenReturn(false);
        when(tokenProvider.getUsernameFromToken(anyString())).thenReturn(username);
        when(recipeRepository.findById(recipeId)).thenReturn(Optional.empty());

        //Then
        assertThrows(RuntimeException.class, ()->{
            userService.createReview(token, recipeId, reviewDto);
        });
    }

    @Test
    void createReview_NotExistUser(){
        String token = "Bearer notExistUser";
        Long recipeId = 1L;
        ReviewDto reviewDto = new ReviewDto("Great Recipe!");
        String username = "user1";
        when(tokenProvider.isTokenExpired(anyString())).thenReturn(false);
        when(tokenProvider.getUsernameFromToken(anyString())).thenReturn(username);
        when(recipeRepository.findById(recipeId)).thenReturn(Optional.of(new Recipe()));
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.createReview(token, recipeId, reviewDto);
        });
    }

    
    // 댓글 수정
    @Test
    void updateReview_Sucess(){
        // Given
        String token = "Bearer token";
        Review review = new Review();
        
        User user = new User();
        user.setUsername("홍길동");
        Long recipeId = 1L;
        ReviewDto reviewDto = new ReviewDto("Change Recipe");
        String username = "user1";
        review.setUser(user);
        // When
        when(tokenProvider.isTokenExpired(anyString())).thenReturn(false);
        when(tokenProvider.getUsernameFromToken(anyString())).thenReturn(username);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(reviewRepository.findById(recipeId)).thenReturn(Optional.of(review));
        

        userService.updateReview(token, recipeId, reviewDto);
        ArgumentCaptor<Review> reviewCaptor = ArgumentCaptor.forClass(Review.class);
        verify(reviewRepository).save(reviewCaptor.capture());

        // Then
        assertEquals(user, reviewCaptor.getValue().getUser());  // 작성자 검증 테스트를 나중에 하고 일단 리뷰로 save가 되는지 확인함.
       
    }

    @Test
    void updateReview_JwtExpired(){

    }

    @Test
    void updateReview_NotExistUser(){

    }

    @Test
    void updateReview_NotExistReview(){

    }

    @Test
    void updateReview_NotMatchReviewToUser(){

    }
    
    // 댓글 삭제
    @Test
    void deleteReview_Success(){
        //Given
        String token = "Bearer token";
        User user = new User();
        Review review = new Review();
        Long reviewId = 1L;
        String username = "user1";

        user.setUserId(1L); // 유저 ID 설정
        review.setReviewId(reviewId); // 리뷰 ID 설정
        review.setUser(user); // 리뷰 작성자 설정

        //When
        when(tokenProvider.isTokenExpired(anyString())).thenReturn(false);
        when(tokenProvider.getUsernameFromToken(anyString())).thenReturn(username);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(review));
        
        userService.deleteReview(token, reviewId);
        ArgumentCaptor<Review> reviewCaptor = ArgumentCaptor.forClass(Review.class);
        verify(reviewRepository).delete(reviewCaptor.capture());

        // Then
        assertEquals(user, reviewCaptor.getValue().getUser());  // 작성자 검증 테스트를 나중에 하고 일단 리뷰로 save가 되는지 확인함.  
    }

    @Test
    void deleteReview_JwtExpired(){

    }

    @Test
    void deleteReview_NotExistUsername(){

    }

    @Test
    void deleteReview_NotExistReview(){

    }

    // 좋아요 추가
    @Test
    void favorite_Success(){

    }

    @Test
    void favorite_JwtExpired(){
        
    }
    
    // 좋아요 해제

    // 내 게시물 전체 리스트 요약정보 확인
    
    
    // 내 게시물 전체 리스트 상세정보 확인
}
