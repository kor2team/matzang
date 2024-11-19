package matnam_zang.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import matnam_zang.demo.dto.BoardRecipeDto;
import matnam_zang.demo.dto.BoardRecipesDto;
import matnam_zang.demo.dto.ReviewDto;
import matnam_zang.demo.dto.UserRecipeDto;
import matnam_zang.demo.entity.Recipe;
import matnam_zang.demo.entity.User;
import matnam_zang.demo.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    @Tag(name = "인증")
    @Operation(summary="회원가입 관리")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    @Tag(name = "인증")
    @Operation(summary="로그인 관리")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        String token = userService.loginUser(username, password);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-recipe")
    @Tag(name = "레시피 관리")
    @Operation(summary="작성 관리")
    public ResponseEntity<?> createRecipe(
            @RequestHeader("Authorization") String token, 
            @RequestBody UserRecipeDto userRecipeDto) {

        try {
            Recipe createRecipe = userService.createRecipe(token, userRecipeDto);
            return ResponseEntity.ok(createRecipe);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error creating recipe: " + e.getMessage());
        }
    }

    @PutMapping("/update-recipe/{recipe_id}")
    @Tag(name = "레시피 관리")
    @Operation(summary="수정 관리")
    public ResponseEntity<?> updateRecipe(
            @RequestHeader("Authorization") String token, 
            @PathVariable("recipe_id") Long recipeId,
            @RequestBody UserRecipeDto updatedRecipeDto) {

        try {
            userService.updateRecipe(token, recipeId, updatedRecipeDto);
            return ResponseEntity.ok("Recipe updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body("Error updating recipe: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-recipe/{recipe_id}")
    @Tag(name = "레시피 관리")
    @Operation(summary="삭제 관리")
    public ResponseEntity<?> deleteRecipe(
            @RequestHeader("Authorization") String token, 
            @PathVariable("recipe_id") Long recipeId) {

        try {
            userService.deleteRecipe(token, recipeId);
            return ResponseEntity.ok("Recipe deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body("Error deleting recipe: " + e.getMessage());
        }
    }


    @GetMapping("/myPostBeforeAccess")
    @Tag(name = "게시물 관리/나의 게시물 관리")
    public ResponseEntity<?> getRecipePostBeforeAccess(@RequestHeader("Authorization") String token) {
        try {
            String bearerToken = token.substring(7);
            List<BoardRecipesDto> findMyRecipes = userService.getRecipePostBeforeAccess(bearerToken);
            return ResponseEntity.ok(findMyRecipes);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error retrieving recipes: " + e.getMessage());
        }
    }
    /** 요리시간 재료 요리방법 */
    @GetMapping("/myPostAfterAccess")
    @Tag(name = "게시물 관리/나의 게시물 관리")
    public ResponseEntity<?> getRecipePostAfterAccess(@RequestHeader("Authorization") String token) {
        try {
            String bearerToken = token.substring(7);
            List<BoardRecipeDto> findUserRecipes = userService.getRecipePostAfterAccess(bearerToken);
            return ResponseEntity.ok(findUserRecipes);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error retrieving recipe details: " + e.getMessage());
        }
    }

    @PostMapping("/create-review/{recipe_id}")
    @Tag(name = "게시물 관리/리뷰 관리")
    @Operation(summary="작성 관리")
    public ResponseEntity<?> createReview(
            @RequestHeader("Authorization") String token,
            @PathVariable("recipe_id") Long recipeId,
            @RequestBody ReviewDto reviewDto) {

        try {
            userService.createReview(token, recipeId, reviewDto);
            return ResponseEntity.status(HttpStatus.CREATED).body("Review success");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error creating review: " + e.getMessage());
        }
    }

    @PutMapping("/update-review/{review_id}")
    @Tag(name = "게시물 관리/리뷰 관리")
    @Operation(summary="수정 관리")
    public ResponseEntity<String> updateReview(
            @RequestHeader("Authorization") String token,
            @PathVariable("review_id") Long reviewId,
            @RequestBody ReviewDto reviewDto) {

        try {
            userService.updateReview(token, reviewId, reviewDto);
            return ResponseEntity.ok("Review updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error updating review: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-review/{review_id}")
    @Tag(name = "게시물 관리/리뷰 관리")
    @Operation(summary="삭제 관리")
    public ResponseEntity<?> deleteReview(
            @RequestHeader("Authorization") String token,
            @PathVariable("review_id") Long reviewId) {
        try {
            userService.deleteReview(token, reviewId);
            return ResponseEntity.ok("Review deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error deleting review: " + e.getMessage());
        }
    }

    @GetMapping("favorite/{recipe_id}")
    @Tag(name = "게시물 관리/좋아요 관리")
    @Operation(summary="좋아요 클릭 상태")
    public ResponseEntity<?> favorite(
        @RequestHeader("Authorization") String token,
        @PathVariable("recipe_id") Long recipeId
    ){
        try{
            String result = userService.favorite(token, recipeId);
            return ResponseEntity.ok(result);
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body("Error creating comment : " + e.getMessage());
        }
    }

    // 좋아요 해제
    @DeleteMapping("favorite_cancel/{recipe_id}")
    @Tag(name = "게시물 관리/좋아요 관리")
    @Operation(summary="좋아요 미클릭 상태")
    public ResponseEntity<?> favorite_cancel(
        @RequestHeader("Authorization") String token,
        @PathVariable("recipe_id") Long recipeId
    ){
        try{
            userService.favorite_cancel(token, recipeId);
            return ResponseEntity.ok("Cancel Success");
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body("Error creating comment : " + e.getMessage());
        }
    }
}
