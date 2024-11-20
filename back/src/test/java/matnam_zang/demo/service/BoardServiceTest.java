package matnam_zang.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import matnam_zang.demo.dto.BoardRecipeDto;
import matnam_zang.demo.dto.BoardRecipesDto;
import matnam_zang.demo.dto.CheckReviewDto;
import matnam_zang.demo.dto.ImageDto;
import matnam_zang.demo.entity.Image;
import matnam_zang.demo.entity.Recipe;
import matnam_zang.demo.entity.User;
import matnam_zang.demo.repository.FavoriteRepository;
import matnam_zang.demo.repository.ImageRepository;
import matnam_zang.demo.repository.RecipeRepository;
import matnam_zang.demo.repository.ReviewRepository;

public class BoardServiceTest {
    @Mock
    private ImageRepository imageRepository;
    
    @Mock
    private ReviewRepository reviewRepository;
    
    @Mock
    private FavoriteRepository favoriteRepository;

    @Mock
    private RecipeRepository recipeRepository;
    
    @InjectMocks
    private BoardService boardService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetRecipePostBeforeAccess() {
        // Mock 데이터 준비
        Recipe mockRecipe = new Recipe();
        mockRecipe.setRecipeId(1L);
        mockRecipe.setTitle("사과 레시피");

        Image mockImage1 = new Image();
        mockImage1.setImageId(1L);
        mockImage1.setImageUrl("https://example.com/image1.jpg");
        mockImage1.setRecipe(mockRecipe);

        Image mockImage2 = new Image();
        mockImage2.setImageId(2L);
        mockImage2.setImageUrl("https://example.com/image2.jpg");
        mockImage2.setRecipe(mockRecipe);

        // Mock 레시피 및 이미지 데이터 설정
        when(recipeRepository.findAll()).thenReturn(List.of(mockRecipe));
        when(imageRepository.findAll()).thenReturn(List.of(mockImage1, mockImage2));

        // 기대되는 결과 생성
        List<ImageDto> expectedImageDtos = List.of(
            new ImageDto(1L, "https://example.com/image1.jpg"),
            new ImageDto(2L, "https://example.com/image2.jpg")
        );
        BoardRecipesDto expectedDto = new BoardRecipesDto(1L, "사과 레시피", expectedImageDtos);

        // 메서드 호출
        List<BoardRecipesDto> actualResult = boardService.getRecipePostBeforeAccess();

        // 검증
        assertEquals(1, actualResult.size());
        assertEquals(expectedDto, actualResult.get(0));
    }

    @Test
    void testGetRecipePostAfterAccess() {
        Recipe mockRecipe = new Recipe();
        mockRecipe.setRecipeId(1L);
        mockRecipe.setTitle("사과");
        mockRecipe.setRecipeDescription("이것은 사과입니다.");

        User mockUser = new User();
        mockUser.setUserId(1L); // userId를 설정
        
        mockRecipe.setUser(mockUser);

        Image mockImage1 = new Image();
        mockImage1.setImageId(1L);
        mockImage1.setImageUrl("https://example.com/image1.jpg");
        mockImage1.setRecipe(mockRecipe);

        Image mockImage2 = new Image();
        mockImage2.setImageId(2L);
        mockImage2.setImageUrl("https://example.com/image2.jpg");
        mockImage2.setRecipe(mockRecipe);

        long favoriteCount = 2l;

        long reviewCount = 2l;

        CheckReviewDto mockReviews1 = new CheckReviewDto();
        mockReviews1.setComment("사과 레시피에 대한 코멘트입니다.");
        mockReviews1.setUserId(1L);
        
        CheckReviewDto mockReviews2 = new CheckReviewDto();
        mockReviews2.setComment("사과 레시피에 대한 두번째 코멘트입니다.");
        mockReviews2.setUserId(2L);

        when(recipeRepository.findAll()).thenReturn(List.of(mockRecipe));
        when(imageRepository.findAll()).thenReturn(List.of(mockImage1, mockImage2));
        when(favoriteRepository.countByRecipeId(mockRecipe.getRecipeId())).thenReturn(favoriteCount);        
        when(reviewRepository.countByRecipeId(mockRecipe.getRecipeId())).thenReturn(reviewCount);
        when(reviewRepository.checkReviewRecipeId(mockRecipe.getRecipeId())).thenReturn(List.of(mockReviews1, mockReviews2));        

        List<ImageDto> expectedImageDtos = List.of(
            new ImageDto(1L, "https://example.com/image1.jpg"),
            new ImageDto(2L, "https://example.com/image2.jpg")
        );

        List<CheckReviewDto> expectedCheckReviewDtos = List.of(
            mockReviews1, mockReviews2
        );

       // BoardRecipeDto expectedDto = new BoardRecipeDto(1L, "사과", expectedImageDtos, "이것은 사과입니다.", 1L, 2L, 2L, false, expectedCheckReviewDtos);

         // 메서드 호출
         List<BoardRecipeDto> actualResult = boardService.getRecipePostAfterAccess();

         // 검증
         assertEquals(1, actualResult.size());
        // assertEquals(expectedDto, actualResult.get(0));


    }
}
