package matnam_zang.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import matnam_zang.demo.dto.RecipeDto;
import matnam_zang.demo.service.RecipeService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RecipeController {
    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    // 공용 레시피 전체조회 엔드포인트
    @GetMapping("/recipes")
    public List<RecipeDto> getRecipes() {
        return recipeService.getRecipes();
    }

    // 공용 레시피 이름조회 엔드포인트
    @GetMapping("/recipes/{cookingName}")
    public List<RecipeDto> getRecipesByCookingMethod(@PathVariable("cookingName") String cookingName) {
        return recipeService.getRecipesByCookingName(cookingName);
    }

    // 공용 레시피 상세조회 엔드포인트
    @GetMapping("/recipes/detailRecipe") // ex. http://localhost:8080/api/recipes?searchIngredient=새우&searchIngredient=김치&searchIngredient=양파
    public List<RecipeDto> getMethodName(@RequestParam("searchIngredient") List<String> searchIngredient) {
        // 서비스 메서드를 호출하여 결과 반환
        return recipeService.getRecipesByIngredients(searchIngredient);
    }
}



