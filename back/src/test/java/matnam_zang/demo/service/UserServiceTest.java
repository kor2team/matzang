package matnam_zang.demo.service;

import matnam_zang.demo.entity.User;
import matnam_zang.demo.repository.UserRepository;
import matnam_zang.demo.security.TokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

// 서비스단의 단위테스트 (서비스단에서의 메소드만 확인하기때문에 전체적 로직과는 연관없이 서비스만 의존)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private TokenProvider tokenProvider;

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
    // 게시물 삭제 단위테스트

    // 댓글 작성
    // 댓글 수정
    // 댓글 삭제

    // 좋아요 추가
    // 좋아요 해제

    // 내 게시물 전체 리스트 요약정보 확인
    // 내 게시물 전체 리스트 상세정보 확인
}
