package matnam_zang.demo.service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import matnam_zang.demo.dto.BoardRecipeDto;
import matnam_zang.demo.dto.BoardRecipesDto;
import matnam_zang.demo.dto.ImageDto;
import matnam_zang.demo.entity.Image;
import matnam_zang.demo.entity.Recipe;
import matnam_zang.demo.entity.User;
import matnam_zang.demo.repository.FavoriteRepository;
import matnam_zang.demo.repository.ImageRepository;
import matnam_zang.demo.repository.RecipeRepository;
import matnam_zang.demo.repository.ReviewRepository;
import matnam_zang.demo.repository.UserRepository;
import matnam_zang.demo.security.TokenProvider;

@Service
public class BoardService {
    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;

    public List<BoardRecipesDto> getRecipePostBeforeAccess() {
        List<Recipe> recipes = recipeRepository.findAll();
        // 각 레시피에 대한 이미지를 미리 조회합니다.
        Map<Long, List<Image>> recipeImagesMap = imageRepository.findAll().stream()
                .collect(Collectors.groupingBy(image -> image.getRecipe().getRecipeId()));

        List<BoardRecipesDto> userRecipesDtos = recipes.stream()
                .map(recipe -> {
                    List<Image> images = recipeImagesMap.getOrDefault(recipe.getRecipeId(),
                            Collections.emptyList());
                    List<ImageDto> imageDtos = images.stream()
                            .map(image -> new ImageDto(image.getImageId(),
                                    image.getImageUrl()))
                            .collect(Collectors.toList());

                    return new BoardRecipesDto(recipe.getRecipeId(), recipe.getTitle(), imageDtos);
                }).collect(Collectors.toList());

        return userRecipesDtos;
    }

    public List<BoardRecipeDto> getRecipePostAfterAccess(String token) {
        String username = tokenProvider.getUsernameFromToken(token);
        if (username == null) {
            throw new RuntimeException("Invaild token or user not authenticated");
        }
        Optional<User> optionalUser = userRepository.findByUsername(username); // User 정보 조회
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            List<Recipe> recipes = recipeRepository.findAll();
            // 각 레시피에 대한 이미지를 미리 조회합니다.
            Map<Long, List<Image>> recipeImagesMap = imageRepository.findAll().stream()
                    .collect(Collectors.groupingBy(image -> image.getRecipe().getRecipeId()));

            // 레시피 DTO 리스트를 생성합니다.
            List<BoardRecipeDto> myRecipeDtos = recipes.stream()
                    .map(recipe -> {
                        List<Image> images = recipeImagesMap.getOrDefault(recipe.getRecipeId(),
                                Collections.emptyList());
                        List<ImageDto> imageDtos = images.stream()
                                .map(image -> new ImageDto(image.getImageId(),
                                        image.getImageUrl()))
                                .collect(Collectors.toList());

                        // 좋아요 수를 계산합니다.
                        long favoriteCount = favoriteRepository
                                .countByRecipeId(recipe.getRecipeId());

                        // 댓글 수를 계산합니다.
                        long reviewCount = reviewRepository
                                .countByRecipeId(recipe.getRecipeId());

                        // 현재 user가 좋아요를 하였는지의 여부를 확인합니다.
                        boolean userFavorite = favoriteRepository.checkUserFavorite(
                                user.getUserId(), recipe.getRecipeId());

                        // 현재 review 상황을 체크합니다.
                        List<String> reviews = reviewRepository
                                .checkReviewRecipeId(recipe.getRecipeId());

                        return new BoardRecipeDto(recipe.getRecipeId(), recipe.getTitle(),
                                imageDtos,
                                recipe.getRecipeDescription(),
                                recipe.getUser().getUserId(),
                                favoriteCount, reviewCount,
                                userFavorite, reviews);
                    })
                    .collect(Collectors.toList());
            return myRecipeDtos;

        } else {
            throw new RuntimeException("User not found");
        }

    }

}
