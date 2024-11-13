package matnam_zang.demo.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BoardRecipesDto {
    private Long recipeId;
    private String title;
    private List<ImageDto> img;
}
