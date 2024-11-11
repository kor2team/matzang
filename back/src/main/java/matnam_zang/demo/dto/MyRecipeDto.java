package matnam_zang.demo.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MyRecipeDto {
    private Long recipeId;
    private String title;
    private List<ImageDto> img;
    private String recipeDescription;
    private Long userId; // user_id만 포함
    private Long favoriteCount;
    private boolean favorite;
    private List<Long> reviewIds;
}
