package matnam_zang.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
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

    @GetMapping("/recipes")
    public List<RecipeDto> getRecipes() {
        return recipeService.getRecipes();
    }

    @GetMapping("/recipes/{cookingName}")
    public List<RecipeDto> getRecipesByCookingMethod(@PathVariable("cookingName") String cookingName) {
        return recipeService.getRecipesByCookingName(cookingName);
    }
}



