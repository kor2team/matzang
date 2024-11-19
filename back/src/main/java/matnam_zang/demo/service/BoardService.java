package matnam_zang.demo.service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import matnam_zang.demo.dto.BoardRecipeDto;
import matnam_zang.demo.dto.BoardRecipesDto;
import matnam_zang.demo.dto.CheckReviewDto;
import matnam_zang.demo.dto.ImageDto;
import matnam_zang.demo.dto.IngredientDto;
import matnam_zang.demo.dto.InstructionDto;
import matnam_zang.demo.entity.Image;
import matnam_zang.demo.entity.Ingredient;
import matnam_zang.demo.entity.Instruction;
import matnam_zang.demo.entity.Recipe;
import matnam_zang.demo.repository.FavoriteRepository;
import matnam_zang.demo.repository.ImageRepository;
import matnam_zang.demo.repository.IngredientRepository;
import matnam_zang.demo.repository.InstructionRepository;
import matnam_zang.demo.repository.RecipeRepository;
import matnam_zang.demo.repository.ReviewRepository;

@Service
public class BoardService {

        private final RecipeRepository recipeRepository;
        private final ImageRepository imageRepository;
        private final ReviewRepository reviewRepository;
        private final FavoriteRepository favoriteRepository;
        private final IngredientRepository ingredientRepository;
        private final InstructionRepository instructionRepository;

        public BoardService(RecipeRepository recipeRepository,
                        ImageRepository imageRepository,
                        ReviewRepository reviewRepository,
                        FavoriteRepository favoriteRepository,
                        IngredientRepository ingredientRepository,
                        InstructionRepository instructionRepository) {
                this.recipeRepository = recipeRepository;
                this.imageRepository = imageRepository;
                this.reviewRepository = reviewRepository;
                this.favoriteRepository = favoriteRepository;
                this.ingredientRepository = ingredientRepository;
                this.instructionRepository = instructionRepository;
        }

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

        public List<BoardRecipeDto> getRecipePostAfterAccess() {
                List<Recipe> recipes = recipeRepository.findAll();
                // 각 레시피에 대한 이미지를 미리 조회합니다.
                Map<Long, List<Image>> recipeImagesMap = imageRepository.findAll().stream()
                                .collect(Collectors.groupingBy(image -> image.getRecipe().getRecipeId()));
                Map<Long, List<Ingredient>> recipeIngredientsMap = ingredientRepository.findAll().stream()
                                .collect(Collectors.groupingBy(ingredient -> ingredient.getRecipe().getRecipeId()));
                Map<Long, List<Instruction>> recipeInstructionsMap = instructionRepository.findAll().stream()
                                .collect(Collectors.groupingBy(instruction -> instruction.getRecipe().getRecipeId()));

                // 레시피 DTO 리스트를 생성합니다.
                List<BoardRecipeDto> myRecipeDtos = recipes.stream()
                                .map(recipe -> {
                                        // cookTime
                                        int cookTime = recipeRepository.cookingTime(recipe.getRecipeId());

                                        List<Ingredient> ingredients = recipeIngredientsMap.getOrDefault(
                                                        recipe.getRecipeId(),
                                                        Collections.emptyList());
                                        List<IngredientDto> ingredientDtos = ingredients.stream()
                                                        .map(ingredient -> new IngredientDto(
                                                                        ingredient.getIngredientName()))
                                                        .collect(Collectors.toList());

                                        List<Instruction> instructions = recipeInstructionsMap.getOrDefault(
                                                        recipe.getRecipeId(),
                                                        Collections.emptyList());
                                        List<InstructionDto> instructionDtos = instructions.stream()
                                                        .map(instruction -> new InstructionDto(
                                                                        instruction.getStepNumber(),
                                                                        instruction.getInstructionDescription()))
                                                        .collect(Collectors.toList());
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

                                        // 현재 review 상황을 체크합니다.
                                        List<CheckReviewDto> reviews = reviewRepository
                                                        .checkReviewRecipeId(recipe.getRecipeId());

                                        return new BoardRecipeDto(recipe.getRecipeId(), recipe.getTitle(),
                                                        imageDtos,
                                                        recipe.getRecipeDescription(),
                                                        recipe.getUser().getUserId(),
                                                        favoriteCount, reviewCount,
                                                        false, reviews, cookTime, ingredientDtos, instructionDtos);
                                })
                                .collect(Collectors.toList());
                return myRecipeDtos;
        }
}
