package matnam_zang.demo.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
// 요리시간, 재료, 요리방법
@Data
@AllArgsConstructor
public class BoardRecipeDto {
    private Long recipeId;
    private String title;
    private List<ImageDto> img;
    private String recipeDescription;
    private Long userId; // user_id만 포함
    private Long favoriteCount;
    private Long reviewCount;
    private boolean favorite;
    private List<CheckReviewDto> reviews;
    private int cookTime;
    private List<IngredientDto> ingredients;
    private List<InstructionDto> instructions;
}
