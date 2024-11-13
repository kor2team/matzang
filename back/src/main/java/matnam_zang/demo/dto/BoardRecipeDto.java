package matnam_zang.demo.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

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
    
    private List<String> reviews;
}
