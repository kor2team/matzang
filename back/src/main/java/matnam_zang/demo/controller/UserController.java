package matnam_zang.demo.controller;

import matnam_zang.demo.dto.ReviewDto;
import matnam_zang.demo.dto.UserRecipeDto;
import matnam_zang.demo.entity.User;
import matnam_zang.demo.entity.Recipe;
import matnam_zang.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;




@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    // 회원가입 엔드포인트
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

    // 로그인 엔드포인트
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        String token = userService.loginUser(username, password);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);

        return ResponseEntity.ok(response);
    }

    // 레시피 작성 엔드포인트
    @PostMapping("/create-recipe")
    public ResponseEntity<?> createRecipe(
            @RequestHeader("Authorization") String token,  // JWT 토큰은 Authorization 헤더에서 받음
            @RequestBody UserRecipeDto userRecipeDto) {   // 게시물 작성에 필요한 데이터

        try {
            // createRecipe 서비스 메서드 호출
            Recipe createdRecipe = userService.createRecipe(token, userRecipeDto);

            // 성공적인 응답 반환
            return ResponseEntity.ok(createdRecipe);
        } catch (RuntimeException e) {
            // 예외 처리: 예외가 발생하면 400(Bad Request) 상태 코드 반환
            return ResponseEntity.badRequest().body("Error creating recipe: " + e.getMessage());
        }
    }

    // 레시피 수정 엔드포인트
    @PutMapping("/update-recipe/{recipe_id}")
    public ResponseEntity<?> updateRecipe(
            @RequestHeader("Authorization") String token,  // JWT 토큰으로 사용자 인증
            @PathVariable("recipe_id") Long recipeId, 
            @RequestBody UserRecipeDto updatedRecipeDto) {

        try {
            // 레시피 업데이트
            userService.updateRecipe(token, recipeId, updatedRecipeDto);

            return ResponseEntity.ok("Recipe updated successfully"); // 수정 성공 메시지
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body("Error updating recipe: " + e.getMessage());
        }
    }

    // 레시피 삭제 엔드포인트
    @DeleteMapping("/delete-recipe/{recipe_id}")
    public ResponseEntity<?> deleteRecipe(
            @RequestHeader("Authorization") String token,  // JWT 토큰으로 사용자 인증
            @PathVariable("recipe_id") Long recipeId) {

        try {
            userService.deleteRecipe(token, recipeId);
            return ResponseEntity.ok("Recipe deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body("Error deleting recipe: " + e.getMessage());
        }
    }

    // 리뷰 작성 엔드포인트
    @PostMapping("/create-review/{recipe_id}")
    public ResponseEntity<?> createReview(
        @RequestHeader("Authorization") String token,
        @PathVariable("recipe_id") Long recipeId,
        @RequestBody ReviewDto reviewDto) {
        
        try {
            // createRecipe 서비스 메서드 호출
            userService.createReview(token, recipeId, reviewDto);

            // 성공적인 응답 반환
            return ResponseEntity.status(HttpStatus.CREATED).body("Review success");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error creating comment: " + e.getMessage());
        }
    }
    
    // 리뷰 수정 엔드포인트
    @PutMapping("/update-review/{review_id}")
    public ResponseEntity<String> putMethodName(
        @RequestHeader("Authorization") String token,
        @PathVariable("review_id") Long reviewId,
        @RequestBody ReviewDto reviewDto) {

        try {
            // createRecipe 서비스 메서드 호출
            userService.updateReview(token, reviewId, reviewDto);

            // 성공적인 응답 반환
            return ResponseEntity.ok("Review update successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error creating comment: " + e.getMessage());
        }
    }
}
