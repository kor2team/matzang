package matnam_zang.demo.dto;

import java.util.List;

import lombok.Data;

@Data
public class UserRecipeDto {
    private String title;
    private String recipeDescription;
    private int cookTime;
    private String difficultyLevel;
    private List<String> images; // 이미지 URL 리스트
    private List<String> ingredients; // 재료 이름 리스트
    private List<String> instructions; // 조리과정 리스트
    private List<String> categories; // 카테고리 리스트
}


